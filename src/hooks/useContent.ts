import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const normalizeSlug = (s: string) =>
  decodeURIComponent(s || '').trim().toLowerCase().replace(/-/g, '_');

export interface FSLIPage {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  notes_ref?: string;
  created_at: string;
  updated_at: string;
}

export interface FSLISection {
  id: string;
  page_id: string;
  key: string;
  content: any;
  sort_order: number;
  updated_at: string;
}

export interface FSLIMetric {
  id: string;
  page_id: string;
  label: string;
  value?: number;
  unit?: string;
  sort_order: number;
  updated_at: string;
}

export interface Embed {
  id: string;
  page_id: string;
  title?: string;
  type: 'file' | 'iframe' | 'link';
  src: string;
  width: number;
  height: number;
  scrollable: boolean;
  created_by: string;
  created_at: string;
}

export const useContent = (slug: string) => {
  const [page, setPage] = useState<FSLIPage | null>(null);
  const [sections, setSections] = useState<FSLISection[]>([]);
  const [metrics, setMetrics] = useState<FSLIMetric[]>([]);
  const [embeds, setEmbeds] = useState<Embed[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch page data
  const fetchPage = async () => {
    try {
      const normalizedSlug = normalizeSlug(slug);
      console.log('[useContent] fetchPage - originalSlug:', slug, 'normalizedSlug:', normalizedSlug);
      
      const { data, error } = await supabase
        .from('fsli_pages')
        .select('*')
        .eq('slug', normalizedSlug)
        .maybeSingle();

      if (error) throw error;
      setPage(data);
      return data;
    } catch (error) {
      console.error('Error fetching page:', error);
      toast({
        title: "Error",
        description: "Failed to load page data",
        variant: "destructive",
      });
      return null;
    }
  };

  // Fetch sections for page
  const fetchSections = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('fsli_sections')
        .select('*')
        .eq('page_id', pageId)
        .order('sort_order');

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
    }
  };

  // Fetch metrics for page
  const fetchMetrics = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('fsli_metrics')
        .select('*')
        .eq('page_id', pageId)
        .order('sort_order');

      if (error) throw error;
      setMetrics(data || []);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  // Fetch embeds for page
  const fetchEmbeds = async (pageId: string) => {
    try {
      const { data, error } = await supabase
        .from('embeds')
        .select('*')
        .eq('page_id', pageId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEmbeds(data?.map(item => ({
        ...item,
        type: item.type as 'file' | 'iframe' | 'link'
      })) || []);
    } catch (error) {
      console.error('Error fetching embeds:', error);
    }
  };

  // Update page
  const updatePage = async (updates: Partial<FSLIPage>) => {
    if (!page) return;

    try {
      const { data, error } = await supabase
        .from('fsli_pages')
        .update(updates)
        .eq('id', page.id)
        .select()
        .single();

      if (error) throw error;
      setPage(data);
      toast({
        title: "Success",
        description: "Page updated successfully",
      });
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: "Error",
        description: "Failed to update page",
        variant: "destructive",
      });
    }
  };

  // Update section
  const updateSection = async (sectionId: string, content: any) => {
    try {
      const { data, error } = await supabase
        .from('fsli_sections')
        .update({ content })
        .eq('id', sectionId)
        .select()
        .single();

      if (error) throw error;
      
      setSections(prev => prev.map(s => s.id === sectionId ? data : s));
      
      toast({
        title: "Success",
        description: "Section updated successfully",
      });
    } catch (error) {
      console.error('Error updating section:', error);
      toast({
        title: "Error",
        description: "Failed to update section",
        variant: "destructive",
      });
    }
  };

  // Update metric
  const updateMetric = async (metricId: string, updates: Partial<FSLIMetric>) => {
    try {
      const { data, error } = await supabase
        .from('fsli_metrics')
        .update(updates)
        .eq('id', metricId)
        .select()
        .single();

      if (error) throw error;
      
      setMetrics(prev => prev.map(m => m.id === metricId ? data : m));
      
      toast({
        title: "Success",
        description: "Metric updated successfully",
      });
    } catch (error) {
      console.error('Error updating metric:', error);
      toast({
        title: "Error",
        description: "Failed to update metric",
        variant: "destructive",
      });
    }
  };

  // Upload file to storage
  const uploadFile = async (file: File): Promise<string | null> => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${slug}/${new Date().toISOString().split('T')[0]}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('embeds')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('embeds')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return null;
    }
  };

  // Create embed
  const createEmbed = async (embedData: Omit<Embed, 'id' | 'created_at' | 'created_by' | 'page_id'>) => {
    if (!page) return;

    try {
      const { data, error } = await supabase
        .from('embeds')
        .insert({ 
          ...embedData, 
          page_id: page.id,
          created_by: (await supabase.auth.getUser()).data.user?.id || ''
        })
        .select()
        .single();

      if (error) throw error;
      
      setEmbeds(prev => [data as Embed, ...prev]);
      
      toast({
        title: "Success",
        description: "Embed created successfully",
      });
    } catch (error) {
      console.error('Error creating embed:', error);
      toast({
        title: "Error",
        description: "Failed to create embed",
        variant: "destructive",
      });
    }
  };

  // Delete embed
  const deleteEmbed = async (embedId: string) => {
    try {
      const { error } = await supabase
        .from('embeds')
        .delete()
        .eq('id', embedId);

      if (error) throw error;
      
      setEmbeds(prev => prev.filter(e => e.id !== embedId));
      
      toast({
        title: "Success",
        description: "Embed deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting embed:', error);
      toast({
        title: "Error",
        description: "Failed to delete embed",
        variant: "destructive",
      });
    }
  };

  // Initialize data
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      const pageData = await fetchPage();
      
      if (pageData) {
        await Promise.all([
          fetchSections(pageData.id),
          fetchMetrics(pageData.id),
          fetchEmbeds(pageData.id)
        ]);
      }
      
      setLoading(false);
    };

    loadContent();
  }, [slug]);

  return {
    page,
    sections,
    metrics,
    embeds,
    loading,
    updatePage,
    updateSection,
    updateMetric,
    uploadFile,
    createEmbed,
    deleteEmbed,
  };
};