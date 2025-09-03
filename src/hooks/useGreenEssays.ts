import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthRole } from '@/hooks/useAuthRole';
import { useToast } from '@/hooks/use-toast';
import { dummyGreenEssays } from '@/data/dummyGreenEssays';

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

export const useGreenEssays = (section?: string) => {
  const [essays, setEssays] = useState<GreenEssay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isAdmin, user } = useAuthRole();
  const { toast } = useToast();

  const fetchEssays = async () => {
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
      
      if (error) throw error;
      
      const realEssays = (data || []) as GreenEssay[];
      
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
        
        setEssays(dummyData);
      } else {
        setEssays(realEssays);
      }
    } catch (error) {
      console.error('Error fetching essays:', error);
      toast({
        title: "Error loading essays",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const createEssay = async (sectionName: string) => {
    if (!isAdmin || !user) return null;

    try {
      setSaving(true);
      
      // Get template for section
      const { data: template } = await supabase
        .from('green_essays_templates')
        .select('*')
        .eq('section', sectionName)
        .single();

      // Generate unique slug
      const timestamp = Date.now();
      const slug = `untitled-essay-${timestamp}`;

      const essayData = {
        slug,
        section: sectionName,
        title: template?.title_template || 'Untitled Essay',
        content_html: template?.content_html || '<p>Start writing your essay...</p>',
        content_json: template?.content_json || { type: 'doc', content: [{ type: 'paragraph', content: [{ type: 'text', text: 'Start writing your essay...' }] }] },
        author_name: user.email?.split('@')[0] || 'Editor',
        updated_by: user.email,
        status: 'draft' as const
      };

      const { data, error } = await supabase
        .from('green_essays')
        .insert(essayData)
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await supabase.from('ops_edit_log').insert({
        essay_id: data.id,
        user_email: user.email || '',
        action: 'essay_created'
      });

      toast({
        title: "Essay created",
        description: "New essay created successfully. You can now edit it inline."
      });

      await fetchEssays();
      return data;
    } catch (error) {
      console.error('Error creating essay:', error);
      toast({
        title: "Failed to create essay",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return null;
    } finally {
      setSaving(false);
    }
  };

  const updateEssay = async (id: string, updates: Partial<GreenEssay>) => {
    if (!isAdmin || !user) return false;

    try {
      setSaving(true);

      // Calculate reading time if content is being updated
      if (updates.content_html) {
        const textContent = updates.content_html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const wordCount = textContent.split(' ').length;
        updates.reading_time = Math.max(1, Math.ceil(wordCount / 200));
      }

      const { data, error } = await supabase
        .from('green_essays')
        .update({ ...updates, updated_by: user.email })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Create version snapshot
      await supabase.from('green_essays_versions').insert({
        essay_id: id,
        version: data.version,
        title: data.title,
        subtitle: data.subtitle,
        content_html: data.content_html,
        content_json: data.content_json,
        created_by: user.email
      });

      // Log the action
      await supabase.from('ops_edit_log').insert({
        essay_id: id,
        user_email: user.email || '',
        action: 'essay_updated'
      });

      console.log('[Green Essays] Essay saved:', id, 'Content length:', updates.content_html?.length || 0);
      
      toast({
        title: "Essay saved",
        description: "Your changes have been saved successfully."
      });

      await fetchEssays();
      return true;
    } catch (error) {
      console.error('Error updating essay:', error);
      toast({
        title: "Failed to save essay",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const publishEssay = async (id: string) => {
    if (!isAdmin) return false;

    try {
      const { data, error } = await supabase
        .from('green_essays')
        .update({ status: 'published' })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      // Log the action
      await supabase.from('ops_edit_log').insert({
        essay_id: id,
        user_email: user?.email || '',
        action: 'essay_published'
      });

      toast({
        title: "Essay published",
        description: "Essay is now live and visible to all users."
      });

      await fetchEssays();
      return true;
    } catch (error) {
      console.error('Error publishing essay:', error);
      toast({
        title: "Failed to publish essay",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const unpublishEssay = async (id: string) => {
    if (!isAdmin) return false;

    try {
      const { error } = await supabase
        .from('green_essays')
        .update({ status: 'draft' })
        .eq('id', id);

      if (error) throw error;

      // Log the action
      await supabase.from('ops_edit_log').insert({
        essay_id: id,
        user_email: user?.email || '',
        action: 'essay_unpublished'
      });

      toast({
        title: "Essay unpublished",
        description: "Essay is now in draft mode."
      });

      await fetchEssays();
      return true;
    } catch (error) {
      console.error('Error unpublishing essay:', error);
      toast({
        title: "Failed to unpublish essay",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
      return false;
    }
  };

  const getEssayVersions = async (essayId: string): Promise<EssayVersion[]> => {
    try {
      const { data, error } = await supabase
        .from('green_essays_versions')
        .select('*')
        .eq('essay_id', essayId)
        .order('version', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching essay versions:', error);
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