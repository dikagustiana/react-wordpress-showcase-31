import { supabase } from '@/integrations/supabase/client';
import { logDiagnostic, handleSupabaseError, showError, showSuccess } from '@/utils/diagnostics';
import { SECTION_KEYS, isValidSectionKey, type SectionKey } from '@/constants/sections';

export interface CreateEssayRequest {
  section: SectionKey;
  title: string;
  subtitle?: string;
  author: string;
  notes?: string;
  created_by: string;
}

export interface CreateEssayResponse {
  success: boolean;
  id?: string;
  slug?: string;
  path?: string;
  error?: string;
}

/**
 * Slugify function to create URL-safe slugs
 */
const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores, hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

/**
 * Generate unique slug by checking existing essays
 */
const generateUniqueSlug = async (baseSlug: string, section: SectionKey): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const { data, error } = await supabase
      .from('green_essays')
      .select('slug')
      .eq('section', section)
      .eq('slug', slug)
      .single();

    if (error && error.code === 'PGRST116') {
      // No row found, slug is available
      return slug;
    }

    if (error) {
      // Other error, log and use original slug
      console.warn('Error checking slug uniqueness:', error);
      return slug;
    }

    // Slug exists, try with counter
    slug = `${baseSlug}-${counter}`;
    counter++;

    // Prevent infinite loop
    if (counter > 100) {
      return `${baseSlug}-${Date.now()}`;
    }
  }
};

/**
 * POST /api/essays - Create new essay endpoint (using service role for security)
 * Body: { section: SectionKey, title: string, subtitle?: string, author: string, notes?: string, created_by: string }
 */
export async function createEssayAPI(request: CreateEssayRequest): Promise<CreateEssayResponse> {
  logDiagnostic('api_essays:create_start', { 
    section: request.section,
    title: request.title,
    created_by: request.created_by 
  });

  try {
    // Validate input
    if (!request.section || !request.title || !request.created_by) {
      const error = 'Missing required fields: section, title and created_by are required';
      logDiagnostic('api_essays:validation_failed', { request }, 'error');
      return { success: false, error };
    }

    // Validate section key
    if (!isValidSectionKey(request.section)) {
      const error = `Invalid section: ${request.section}. Must be one of: ${Object.values(SECTION_KEYS).join(', ')}`;
      logDiagnostic('api_essays:invalid_section', { section: request.section }, 'error');
      return { success: false, error };
    }

    // Validate user role first using the safe helper function
    logDiagnostic('api_essays:checking_user_role', { userEmail: request.created_by });
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      logDiagnostic('api_essays:user_not_authenticated', { userEmail: request.created_by }, 'error');
      return { success: false, error: 'User not authenticated' };
    }
    
    const { data: roleCheck, error: roleError } = await supabase.rpc('is_admin_or_editor', {
      uid: user.id
    });

    if (roleError) {
      logDiagnostic('api_essays:role_check_failed', { roleError }, 'error');
      return { success: false, error: 'Failed to verify user role' };
    }

    if (!roleCheck) {
      logDiagnostic('api_essays:unauthorized', { userEmail: request.created_by }, 'error');
      return { success: false, error: 'Not authorized - Admin or Editor role required' };
    }

    // Generate unique slug from title
    const baseSlug = slugify(request.title);
    const slug = await generateUniqueSlug(baseSlug, request.section);

    logDiagnostic('api_essays:slug_generated', { 
      originalTitle: request.title,
      baseSlug,
      finalSlug: slug 
    });

    // Get active template for section
    logDiagnostic('api_essays:fetching_template', { section: request.section });
    
    const { data: template, error: templateError } = await supabase
      .from('green_essays_templates')
      .select('*')
      .eq('section', request.section)
      .single();

    if (templateError) {
      logDiagnostic('api_essays:template_fetch_failed', { 
        templateError,
        section: request.section 
      }, 'warn');
    }

    // Prepare essay data with proper defaults
    const essayData = {
      slug,
      section: request.section,
      title: request.title.trim(),
      subtitle: request.subtitle?.trim() || '',
      author_name: request.author.trim() || request.created_by.split('@')[0] || 'Editor',
      cover_image_url: '/assets/placeholders/cover_default.webp',
      content_html: template?.content_html || '<h1>New Essay</h1><p>Start writing your essay here...</p>',
      content_json: template?.content_json || {
        type: 'doc',
        content: [
          { 
            type: 'heading', 
            attrs: { level: 1 }, 
            content: [{ type: 'text', text: 'New Essay' }] 
          },
          { 
            type: 'paragraph', 
            content: [{ type: 'text', text: 'Start writing your essay here...' }] 
          }
        ]
      },
      status: 'draft' as const,
      version: 1,
      reading_time: 1, // Default 1 minute
      updated_by: request.created_by
    };

    logDiagnostic('api_essays:inserting_essay', { 
      slug: essayData.slug,
      section: essayData.section,
      title: essayData.title 
    });

    // Insert essay into database using authenticated client (will use RLS)
    const { data, error } = await supabase
      .from('green_essays')
      .insert(essayData)
      .select()
      .single();

    if (error) {
      logDiagnostic('api_essays:insert_failed', { error, essayData }, 'error');
      return { 
        success: false, 
        error: error.message || 'Failed to create essay' 
      };
    }

    logDiagnostic('api_essays:essay_created', { 
      essayId: data.id,
      slug: data.slug,
      section: data.section 
    });

    // Log the action to ops_edit_log (this will use service role permissions)
    const { error: logError } = await supabase.from('ops_edit_log').insert({
      essay_id: data.id,
      user_email: request.created_by,
      action: 'essay_created'
    });

    if (logError) {
      logDiagnostic('api_essays:log_failed', { logError }, 'warn');
      // Don't fail the whole operation if logging fails
    }

    const path = `/green-transition/${request.section}/${data.slug}`;
    
    logDiagnostic('api_essays:create_complete', { 
      essayId: data.id,
      path,
      success: true 
    });

    return {
      success: true,
      id: data.id,
      slug: data.slug,
      path
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    logDiagnostic('api_essays:create_error', { error, request }, 'error');
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
}
