-- Create storage bucket for books
INSERT INTO storage.buckets (id, name, public) 
VALUES ('books', 'books', false);

-- Create books_uploads table
CREATE TABLE public.books_uploads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  filename TEXT NOT NULL,
  filepath TEXT NOT NULL,
  size_bytes BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  version INTEGER NOT NULL DEFAULT 1
);

-- Enable RLS
ALTER TABLE public.books_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Anyone can view non-deleted books" 
ON public.books_uploads 
FOR SELECT 
USING (deleted_at IS NULL);

CREATE POLICY "Admins can view all books including deleted" 
ON public.books_uploads 
FOR SELECT 
USING (is_admin());

CREATE POLICY "Admins can insert books" 
ON public.books_uploads 
FOR INSERT 
WITH CHECK (is_admin());

CREATE POLICY "Admins can update books" 
ON public.books_uploads 
FOR UPDATE 
USING (is_admin());

-- Storage policies for books bucket
CREATE POLICY "Admins can upload books" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'books' AND is_admin());

CREATE POLICY "Admins can delete books" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'books' AND is_admin());

CREATE POLICY "Anyone can view books" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'books');

-- Add index for better performance
CREATE INDEX idx_books_uploads_category_deleted ON public.books_uploads(category, deleted_at);
CREATE INDEX idx_books_uploads_uploaded_at ON public.books_uploads(uploaded_at DESC);