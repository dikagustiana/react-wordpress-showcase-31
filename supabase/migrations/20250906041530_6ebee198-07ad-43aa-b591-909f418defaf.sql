-- Create tables for FSLI inline editing system

-- Table for storing section content with new structure
CREATE TABLE IF NOT EXISTS public.fsli_inline_sections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  content_html TEXT NOT NULL DEFAULT '',
  updated_by TEXT,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  version INTEGER NOT NULL DEFAULT 1,
  UNIQUE(page_key, section_key)
);

-- Table for embeds (Excel, images, etc.)
CREATE TABLE IF NOT EXISTS public.fsli_inline_embeds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  section_key TEXT NOT NULL,
  embed_type TEXT NOT NULL, -- 'excel_live', 'excel_static', 'image'
  provider TEXT, -- 'onedrive', 'excel_online', 'supabase'
  embed_url TEXT,
  storage_path TEXT,
  range_ref TEXT, -- for Excel: "A1:D50"
  height_px INTEGER DEFAULT 400,
  meta JSONB DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Table for uploaded assets
CREATE TABLE IF NOT EXISTS public.fsli_inline_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  page_key TEXT NOT NULL,
  file_name TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  alt_text TEXT,
  caption TEXT,
  uploaded_by TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.fsli_inline_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fsli_inline_embeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fsli_inline_assets ENABLE ROW LEVEL SECURITY;

-- RLS Policies for fsli_inline_sections
CREATE POLICY "Anyone can read fsli_inline_sections" ON public.fsli_inline_sections FOR SELECT USING (true);
CREATE POLICY "Only admins can insert fsli_inline_sections" ON public.fsli_inline_sections FOR INSERT WITH CHECK (is_admin_user());
CREATE POLICY "Only admins can update fsli_inline_sections" ON public.fsli_inline_sections FOR UPDATE USING (is_admin_user());
CREATE POLICY "Only admins can delete fsli_inline_sections" ON public.fsli_inline_sections FOR DELETE USING (is_admin_user());

-- RLS Policies for fsli_inline_embeds
CREATE POLICY "Anyone can read fsli_inline_embeds" ON public.fsli_inline_embeds FOR SELECT USING (true);
CREATE POLICY "Only admins can insert fsli_inline_embeds" ON public.fsli_inline_embeds FOR INSERT WITH CHECK (is_admin_user());
CREATE POLICY "Only admins can update fsli_inline_embeds" ON public.fsli_inline_embeds FOR UPDATE USING (is_admin_user());
CREATE POLICY "Only admins can delete fsli_inline_embeds" ON public.fsli_inline_embeds FOR DELETE USING (is_admin_user());

-- RLS Policies for fsli_inline_assets
CREATE POLICY "Anyone can read fsli_inline_assets" ON public.fsli_inline_assets FOR SELECT USING (true);
CREATE POLICY "Only admins can insert fsli_inline_assets" ON public.fsli_inline_assets FOR INSERT WITH CHECK (is_admin_user());
CREATE POLICY "Only admins can update fsli_inline_assets" ON public.fsli_inline_assets FOR UPDATE USING (is_admin_user());
CREATE POLICY "Only admins can delete fsli_inline_assets" ON public.fsli_inline_assets FOR DELETE USING (is_admin_user());

-- Create storage bucket for FSLI assets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('fsli-assets', 'fsli-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for fsli-assets bucket
CREATE POLICY "Anyone can view FSLI assets" ON storage.objects 
FOR SELECT USING (bucket_id = 'fsli-assets');

CREATE POLICY "Only admins can upload FSLI assets" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'fsli-assets' AND is_admin_user());

CREATE POLICY "Only admins can update FSLI assets" ON storage.objects 
FOR UPDATE USING (bucket_id = 'fsli-assets' AND is_admin_user());

CREATE POLICY "Only admins can delete FSLI assets" ON storage.objects 
FOR DELETE USING (bucket_id = 'fsli-assets' AND is_admin_user());