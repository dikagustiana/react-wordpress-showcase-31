import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface InlineSection {
  id: string;
  page_key: string;
  section_key: string;
  content_html: string;
  updated_by?: string;
  updated_at: string;
  version: number;
}

interface InlineEmbed {
  id: string;
  page_key: string;
  section_key: string;
  embed_type: 'excel_live' | 'excel_static' | 'image';
  provider?: string;
  embed_url?: string;
  storage_path?: string;
  range_ref?: string;
  height_px: number;
  meta: any;
  updated_at: string;
}

interface InlineAsset {
  id: string;
  page_key: string;
  file_name: string;
  storage_path: string;
  mime_type: string;
  size_bytes: number;
  alt_text?: string;
  caption?: string;
  uploaded_by?: string;
  uploaded_at: string;
}

export const useInlineContent = (pageKey: string) => {
  const [sections, setSections] = useState<InlineSection[]>([]);
  const [embeds, setEmbeds] = useState<InlineEmbed[]>([]);
  const [assets, setAssets] = useState<InlineAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  // Load initial content
  useEffect(() => {
    const loadContent = async () => {
      setLoading(true);
      try {
        const [sectionsRes, embedsRes, assetsRes] = await Promise.all([
          supabase.from('fsli_inline_sections').select('*').eq('page_key', pageKey).order('section_key'),
          supabase.from('fsli_inline_embeds').select('*').eq('page_key', pageKey).order('section_key'),
          supabase.from('fsli_inline_assets').select('*').eq('page_key', pageKey).order('uploaded_at', { ascending: false })
        ]);

        if (sectionsRes.data) setSections(sectionsRes.data);
        if (embedsRes.data) setEmbeds(embedsRes.data as InlineEmbed[]);
        if (assetsRes.data) setAssets(assetsRes.data);
      } catch (error) {
        console.error('Error loading inline content:', error);
        toast({
          title: "Error loading content",
          description: "Failed to load page content",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (pageKey) {
      loadContent();
    }
  }, [pageKey]); // Removed toast from dependency array

  // Get section content
  const getSectionContent = useCallback((sectionKey: string): string => {
    const section = sections.find(s => s.section_key === sectionKey);
    return section?.content_html || '';
  }, [sections]);

  // Save section content
  const saveSectionContent = useCallback(async (sectionKey: string, content: string): Promise<boolean> => {
    setSaving(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      const updatedBy = user?.user?.email || 'unknown';

      const existingSection = sections.find(s => s.section_key === sectionKey);
      
      if (existingSection) {
        // Update existing section
        const { error } = await supabase
          .from('fsli_inline_sections')
          .update({
            content_html: content,
            updated_by: updatedBy,
            version: existingSection.version + 1
          })
          .eq('id', existingSection.id);

        if (error) throw error;

        setSections(prev => prev.map(s => 
          s.id === existingSection.id 
            ? { ...s, content_html: content, updated_by: updatedBy, version: s.version + 1 }
            : s
        ));
      } else {
        // Create new section
        const { data, error } = await supabase
          .from('fsli_inline_sections')
          .insert({
            page_key: pageKey,
            section_key: sectionKey,
            content_html: content,
            updated_by: updatedBy,
            version: 1
          })
          .select()
          .single();

        if (error) throw error;

        setSections(prev => [...prev, data]);
      }

      return true;
    } catch (error) {
      console.error('Error saving section:', error);
      toast({
        title: "Save failed",
        description: "Failed to save section content",
        variant: "destructive",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [pageKey, sections, toast]);

  // Upload file
  const uploadFile = useCallback(async (file: File, altText: string = '', caption: string = ''): Promise<string | null> => {
    try {
      const { data: user } = await supabase.auth.getUser();
      const uploadedBy = user?.user?.email || 'unknown';

      // Generate file path
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `fsli/${pageKey}/${year}/${month}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('fsli-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('fsli-assets')
        .getPublicUrl(filePath);

      // Save asset metadata
      const { error: insertError } = await supabase
        .from('fsli_inline_assets')
        .insert({
          page_key: pageKey,
          file_name: fileName,
          storage_path: filePath,
          mime_type: file.type,
          size_bytes: file.size,
          alt_text: altText,
          caption: caption,
          uploaded_by: uploadedBy
        });

      if (insertError) throw insertError;

      // Refresh assets list
      const { data: updatedAssets } = await supabase
        .from('fsli_inline_assets')
        .select('*')
        .eq('page_key', pageKey)
        .order('uploaded_at', { ascending: false });

      if (updatedAssets) setAssets(updatedAssets);

      return publicUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload file",
        variant: "destructive",
      });
      return null;
    }
  }, [pageKey, toast]);

  // Create embed
  const createEmbed = useCallback(async (
    sectionKey: string, 
    embedType: 'excel_live' | 'excel_static' | 'image',
    data: Partial<InlineEmbed>
  ): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('fsli_inline_embeds')
        .insert({
          page_key: pageKey,
          section_key: sectionKey,
          embed_type: embedType,
          ...data
        });

      if (error) throw error;

      // Refresh embeds list
      const { data: updatedEmbeds } = await supabase
        .from('fsli_inline_embeds')
        .select('*')
        .eq('page_key', pageKey)
        .order('section_key');

      if (updatedEmbeds) setEmbeds(updatedEmbeds as InlineEmbed[]);

      return true;
    } catch (error) {
      console.error('Error creating embed:', error);
      toast({
        title: "Failed to create embed",
        description: "Could not save embed data",
        variant: "destructive",
      });
      return false;
    }
  }, [pageKey, toast]);

  return {
    sections,
    embeds,
    assets,
    loading,
    saving,
    getSectionContent,
    saveSectionContent,
    uploadFile,
    createEmbed
  };
};