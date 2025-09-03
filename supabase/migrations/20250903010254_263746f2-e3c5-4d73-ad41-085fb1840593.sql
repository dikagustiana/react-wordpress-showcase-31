-- Create essays table
CREATE TABLE public.green_essays (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  section TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT 'Untitled Essay',
  subtitle TEXT,
  author_name TEXT NOT NULL DEFAULT 'Editor',
  cover_image_url TEXT,
  content_html TEXT,
  content_json JSONB,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
  version INTEGER NOT NULL DEFAULT 1,
  reading_time INTEGER DEFAULT 0,
  updated_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create essays versions table for history
CREATE TABLE public.green_essays_versions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  essay_id UUID NOT NULL REFERENCES public.green_essays(id) ON DELETE CASCADE,
  version INTEGER NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  content_html TEXT,
  content_json JSONB,
  version_note TEXT,
  created_by TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create templates table
CREATE TABLE public.green_essays_templates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  section TEXT NOT NULL UNIQUE,
  title_template TEXT NOT NULL DEFAULT 'New Essay',
  content_html TEXT,
  content_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create edit log table
CREATE TABLE public.ops_edit_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  essay_id UUID NOT NULL REFERENCES public.green_essays(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  action TEXT NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.green_essays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_essays_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.green_essays_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_edit_log ENABLE ROW LEVEL SECURITY;

-- RLS Policies for green_essays
CREATE POLICY "Anyone can view published essays" 
ON public.green_essays 
FOR SELECT 
USING (status = 'published' OR is_admin());

CREATE POLICY "Only admins can modify essays" 
ON public.green_essays 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for versions
CREATE POLICY "Only admins can view versions" 
ON public.green_essays_versions 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can create versions" 
ON public.green_essays_versions 
FOR INSERT 
WITH CHECK (is_admin());

-- RLS Policies for templates
CREATE POLICY "Anyone can view templates" 
ON public.green_essays_templates 
FOR SELECT 
USING (true);

CREATE POLICY "Only admins can modify templates" 
ON public.green_essays_templates 
FOR ALL 
USING (is_admin())
WITH CHECK (is_admin());

-- RLS Policies for edit log
CREATE POLICY "Only admins can view edit log" 
ON public.ops_edit_log 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Only admins can create edit log" 
ON public.ops_edit_log 
FOR INSERT 
WITH CHECK (is_admin());

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_green_essays_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for timestamp updates
CREATE TRIGGER update_green_essays_updated_at
BEFORE UPDATE ON public.green_essays
FOR EACH ROW
EXECUTE FUNCTION public.update_green_essays_updated_at();

-- Create function to calculate reading time
CREATE OR REPLACE FUNCTION public.calculate_reading_time(content_text TEXT)
RETURNS INTEGER AS $$
BEGIN
  -- Approximate reading time: 200 words per minute
  RETURN GREATEST(1, CEIL(array_length(string_to_array(content_text, ' '), 1) / 200.0));
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Insert default templates
INSERT INTO public.green_essays_templates (section, title_template, content_html, content_json) VALUES
('where-we-are-now', 'Current State Analysis', '<h2>Current Situation</h2><p>Describe the current state of this aspect of green transition...</p>', '{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Current Situation"}]},{"type":"paragraph","content":[{"type":"text","text":"Describe the current state of this aspect of green transition..."}]}]}'),
('challenges-ahead', 'Challenge Analysis', '<h2>Key Challenges</h2><p>Identify and analyze the main obstacles...</p>', '{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Key Challenges"}]},{"type":"paragraph","content":[{"type":"text","text":"Identify and analyze the main obstacles..."}]}]}'),
('pathways-forward', 'Solution Framework', '<h2>Proposed Solutions</h2><p>Outline actionable pathways and recommendations...</p>', '{"type":"doc","content":[{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Proposed Solutions"}]},{"type":"paragraph","content":[{"type":"text","text":"Outline actionable pathways and recommendations..."}]}]}');

-- Create storage bucket for green transition content
INSERT INTO storage.buckets (id, name, public) VALUES ('green-transition-content', 'green-transition-content', true);

-- Create storage policies
CREATE POLICY "Green transition images are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'green-transition-content');

CREATE POLICY "Only admins can upload green transition content" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'green-transition-content' AND is_admin());

CREATE POLICY "Only admins can update green transition content" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'green-transition-content' AND is_admin());

CREATE POLICY "Only admins can delete green transition content" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'green-transition-content' AND is_admin());