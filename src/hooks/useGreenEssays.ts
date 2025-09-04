import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthRole } from '@/hooks/useAuthRole';
import { useToast } from '@/hooks/use-toast';
import { dummyGreenEssays } from '@/data/dummyGreenEssays';
import { handleSupabaseError, logDiagnostic, showSuccess, showError } from '@/utils/diagnostics';
import { SECTION_KEYS, isValidSectionKey, type SectionKey } from '@/constants/sections';

export interface GreenEssay {
  id: string;
  slug: string;
  section: string;
  title: string;
  subtitle?: string;
  author_name: string;
  cover_image_url?: string;
  content_html?: string;
  content_json?: any;
  status: 'draft' | 'published';
  version: number;
  reading_time: number;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface EssayVersion {
  id: string;
  essay_id: string;
  version: number;
  title: string;
  subtitle?: string;
  content_html?: string;
  content_json?: any;
  version_note?: string;
  created_by?: string;
  created_at: string;
}

export const useGreenEssays = (section?: SectionKey) => {
  const [essays, setEssays] = useState<GreenEssay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isAdmin, user } = useAuthRole();
  const { toast } = useToast();

  const fetchEssays = async () => {
    logDiagnostic('fetchEssays:start', { section, isAdmin });
    
    try {
      setLoading(true);
      let query = supabase.from('green_essays').select('*').order('updated_at', { ascending: false });
      
      if (section) {
        query = query.eq('section', section);
      }
      
      // Only show published essays for non-admins
      if (!isAdmin) {
        query = query.eq('status', 'published');
      }

      const { data, error } = await query;
      
      if (error) {
        handleSupabaseError(error, 'Fetch Essays', { section, isAdmin });
        throw error;
      }
      
      const realEssays = (data || []) as GreenEssay[];
      logDiagnostic('fetchEssays:database_result', { 
        realEssaysCount: realEssays.length,
        section,
        isAdmin 
      });
      
      // If no real essays exist for this section, use dummy data
      if (realEssays.length === 0 && section && dummyGreenEssays[section]) {
        const dummyData = dummyGreenEssays[section].map(dummy => ({
          ...dummy,
          // Ensure all required fields are present
          id: dummy.id!,
          slug: dummy.slug!,
          section: dummy.section!,
          title: dummy.title!,
          author_name: dummy.author_name!,
          status: dummy.status!,
          version: 1,
          reading_time: dummy.reading_time!,
          created_at: dummy.created_at!,
          updated_at: dummy.updated_at!,
          subtitle: dummy.subtitle,
          cover_image_url: dummy.cover_image_url,
          content_html: dummy.content_html,
          content_json: null,
          updated_by: null
        })) as GreenEssay[];
        
        logDiagnostic('fetchEssays:using_dummy_data', { 
          dummyCount: dummyData.length,
          section 
        });
        setEssays(dummyData);
      } else {
        logDiagnostic('fetchEssays:using_real_data', { 
          realEssaysCount: realEssays.length,
          section 
        });
        setEssays(realEssays);
      }
    } catch (error) {
      logDiagnostic('fetchEssays:error', { error, section, isAdmin }, 'error');
      // Error already handled by handleSupabaseError above
    } finally {
      setLoading(false);
      logDiagnostic('fetchEssays:complete', { section });
    }
  };

  const createEssay = async (sectionName: SectionKey) => {
    if (!isAdmin || !user) return null;

    logDiagnostic('createEssay:start', { sectionName, userEmail: user.email });

    try {
      setSaving(true);
      
      // Get template for section
      logDiagnostic('createEssay:fetching_template', { sectionName });
      const { data: template, error: templateError } = await supabase
        .from('green_essays_templates')
        .select('*')
        .eq('section', sectionName)
        .single();

      if (templateError) {
        logDiagnostic('createEssay:template_fetch_failed', { 
          templateError,
          sectionName 
        }, 'warn');
      }

      // Generate unique slug
      const timestamp = Date.now();
      const slug = `untitled-essay-${timestamp}`;

      const essayData = {
        slug,
        section: sectionName,
        title: template?.title_template || 'New Essay',
        subtitle: '',
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
        author_name: user.email?.split('@')[0] || 'Editor',
        cover_image_url: '',
        reading_time: 1,
        updated_by: user.email,
        status: 'draft' as const
      };

      logDiagnostic('createEssay:inserting_essay', { essayData });

      const { data, error } = await supabase
        .from('green_essays')
        .insert(essayData)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, 'Create Essay', { sectionName, essayData });
        throw error;
      }

      logDiagnostic('createEssay:essay_created', { essayId: data.id, slug: data.slug });

      // Log the action
      await supabase.from('ops_edit_log').insert({
        essay_id: data.id,
        user_email: user.email || '',
        action: 'essay_created'
      });

      showSuccess("Essay created", "New essay created successfully. You can now edit it inline.");

      await fetchEssays();
      logDiagnostic('createEssay:complete', { essayId: data.id });
      return data;
    } catch (error) {
      logDiagnostic('createEssay:error', { error, sectionName }, 'error');
      // Error already handled by handleSupabaseError above
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateEssay = async (id: string, updates: Partial<GreenEssay>) => {
    if (!isAdmin || !user) return false;

    logDiagnostic('updateEssay:start', { 
      essayId: id, 
      updateFields: Object.keys(updates),
      userEmail: user.email,
      contentLength: updates.content_html?.length || 0
    });

    try {
      setSaving(true);

      // Calculate reading time if content is being updated
      if (updates.content_html) {
        const textContent = updates.content_html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const wordCount = textContent.split(' ').length;
        updates.reading_time = Math.max(1, Math.ceil(wordCount / 200));
        
        logDiagnostic('updateEssay:reading_time_calculated', { 
          essayId: id,
          wordCount, 
          readingTime: updates.reading_time 
        });
      }

      const { data, error } = await supabase
        .from('green_essays')
        .update({ ...updates, updated_by: user.email })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, 'Update Essay', { essayId: id, updates });
        throw error;
      }

      logDiagnostic('updateEssay:essay_updated', { 
        essayId: id,
        newVersion: data.version,
        title: data.title
      });

      // Create version snapshot
      const { error: versionError } = await supabase.from('green_essays_versions').insert({
        essay_id: id,
        version: data.version,
        title: data.title,
        subtitle: data.subtitle,
        content_html: data.content_html,
        content_json: data.content_json,
        created_by: user.email
      });

      if (versionError) {
        logDiagnostic('updateEssay:version_snapshot_failed', { 
          versionError,
          essayId: id 
        }, 'warn');
      }

      // Log the action
      await supabase.from('ops_edit_log').insert({
        essay_id: id,
        user_email: user.email || '',
        action: 'essay_updated'
      });

      logDiagnostic('updateEssay:complete', { 
        essayId: id,
        contentLength: updates.content_html?.length || 0
      });
      
      showSuccess("Essay saved", "Your changes have been saved successfully.");

      await fetchEssays();
      return true;
    } catch (error) {
      logDiagnostic('updateEssay:error', { error, essayId: id }, 'error');
      // Error already handled by handleSupabaseError above
      return false;
    } finally {
      setSaving(false);
    }
  };

  const publishEssay = async (id: string) => {
    if (!isAdmin) return false;

    // Log telemetry event
    console.log('[Telemetry] publish_clicked', { 
      essayId: id, 
      timestamp: new Date().toISOString() 
    });

    logDiagnostic('publishEssay:start', { essayId: id, userEmail: user?.email });

    try {
      const { data, error } = await supabase
        .from('green_essays')
        .update({ status: 'published' })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        handleSupabaseError(error, 'Publish Essay', { essayId: id });
        throw error;
      }

      logDiagnostic('publishEssay:essay_published', { 
        essayId: id,
        title: data.title,
        status: data.status
      });

      // Log telemetry event
      console.log('[Telemetry] publish_success', { 
        essayId: id, 
        title: data.title,
        timestamp: new Date().toISOString() 
      });

      // Log the action
      await supabase.from('ops_edit_log').insert({
        essay_id: id,
        user_email: user?.email || '',
        action: 'essay_published'
      });

      showSuccess("Essay published", "Essay is now live and visible to all users.");

      await fetchEssays();
      logDiagnostic('publishEssay:complete', { essayId: id });
      return true;
    } catch (error) {
      logDiagnostic('publishEssay:error', { error, essayId: id }, 'error');
      // Error already handled by handleSupabaseError above
      return false;
    }
  };

  const unpublishEssay = async (id: string) => {
    if (!isAdmin) return false;

    logDiagnostic('unpublishEssay:start', { essayId: id, userEmail: user?.email });

    try {
      const { error } = await supabase
        .from('green_essays')
        .update({ status: 'draft' })
        .eq('id', id);

      if (error) {
        handleSupabaseError(error, 'Unpublish Essay', { essayId: id });
        throw error;
      }

      logDiagnostic('unpublishEssay:essay_unpublished', { essayId: id });

      // Log the action
      await supabase.from('ops_edit_log').insert({
        essay_id: id,
        user_email: user?.email || '',
        action: 'essay_unpublished'
      });

      showSuccess("Essay unpublished", "Essay is now in draft mode.");

      await fetchEssays();
      logDiagnostic('unpublishEssay:complete', { essayId: id });
      return true;
    } catch (error) {
      logDiagnostic('unpublishEssay:error', { error, essayId: id }, 'error');
      // Error already handled by handleSupabaseError above
      return false;
    }
  };

  const getEssayVersions = async (essayId: string): Promise<EssayVersion[]> => {
    logDiagnostic('getEssayVersions:start', { essayId });
    
    try {
      const { data, error } = await supabase
        .from('green_essays_versions')
        .select('*')
        .eq('essay_id', essayId)
        .order('version', { ascending: false });

      if (error) {
        handleSupabaseError(error, 'Get Essay Versions', { essayId });
        throw error;
      }
      
      logDiagnostic('getEssayVersions:complete', { 
        essayId,
        versionsFound: data?.length || 0
      });
      
      return data || [];
    } catch (error) {
      logDiagnostic('getEssayVersions:error', { error, essayId }, 'error');
      return [];
    }
  };

  useEffect(() => {
    fetchEssays();
  }, [section, isAdmin]);

  return {
    essays,
    loading,
    saving,
    createEssay,
    updateEssay,
    publishEssay,
    unpublishEssay,
    getEssayVersions,
    refreshEssays: fetchEssays
  };
};