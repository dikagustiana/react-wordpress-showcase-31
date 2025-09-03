import { supabase } from '@/integrations/supabase/client';
import { logDiagnostic, handleSupabaseError, showError, showSuccess } from '@/utils/diagnostics';

export interface CreateEssayRequest {
  section: string;
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
 * POST /api/essays - Create new essay endpoint (using service role for security)
 * Body: { section: string, created_by: string }
 */
export async function createEssayAPI(request: CreateEssayRequest): Promise<CreateEssayResponse> {
  logDiagnostic('api_essays:create_start', { 
    section: request.section,
    created_by: request.created_by 
  });

  try {
    // Validate input
    if (!request.section || !request.created_by) {
      const error = 'Missing required fields: section and created_by are required';
      logDiagnostic('api_essays:validation_failed', { request }, 'error');
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

    // Generate unique slug
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 7);
    const slug = `untitled-essay-${randomStr}`;

    // Prepare essay data with fallbacks
    const essayData = {
      slug,
      section: request.section,
      title: template?.title_template || 'Untitled Essay',
      subtitle: '', // Default empty subtitle
      author_name: request.created_by.split('@')[0] || 'Editor',
      cover_image_url: '/assets/placeholders/cover_default.webp', // Default placeholder
      content_html: template?.content_html || '<h1>New Essay</h1><p>Start writing your essay...</p>',
      content_json: template?.content_json || {
        type: 'doc',
        content: [
          { type: 'heading', attrs: { level: 1 }, content: [{ type: 'text', text: 'New Essay' }] },
          { type: 'paragraph', content: [{ type: 'text', text: 'Start writing your essay...' }] }
        ]
      },
      status: 'draft' as const,
      version: 1,
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