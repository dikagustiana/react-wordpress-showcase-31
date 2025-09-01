-- Create profiles table for user roles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('admin', 'viewer')) DEFAULT 'viewer',
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create FSLI pages table
CREATE TABLE public.fsli_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  notes_ref TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on fsli_pages
ALTER TABLE public.fsli_pages ENABLE ROW LEVEL SECURITY;

-- Create FSLI sections table for content blocks
CREATE TABLE public.fsli_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES fsli_pages(id) ON DELETE CASCADE,
  key TEXT NOT NULL,
  content JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on fsli_sections
ALTER TABLE public.fsli_sections ENABLE ROW LEVEL SECURITY;

-- Create FSLI metrics table for KPI cards
CREATE TABLE public.fsli_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES fsli_pages(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  value NUMERIC,
  unit TEXT,
  sort_order INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on fsli_metrics
ALTER TABLE public.fsli_metrics ENABLE ROW LEVEL SECURITY;

-- Create revisions table for version history
CREATE TABLE public.fsli_revisions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES fsli_pages(id) ON DELETE CASCADE,
  section_id UUID REFERENCES fsli_sections(id),
  editor_id UUID NOT NULL REFERENCES auth.users(id),
  content JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on fsli_revisions
ALTER TABLE public.fsli_revisions ENABLE ROW LEVEL SECURITY;

-- Create embeds table for file uploads and iframes
CREATE TABLE public.embeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES fsli_pages(id) ON DELETE CASCADE,
  title TEXT,
  type TEXT NOT NULL CHECK (type IN ('file', 'iframe', 'link')),
  src TEXT NOT NULL,
  width INTEGER DEFAULT 1200,
  height INTEGER DEFAULT 600,
  scrollable BOOLEAN DEFAULT true,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on embeds
ALTER TABLE public.embeds ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for embeds
INSERT INTO storage.buckets (id, name, public) VALUES ('embeds', 'embeds', true);

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles p
    WHERE p.id = auth.uid() AND p.role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- Helper function to get current user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT role FROM public.profiles 
    WHERE id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE SET search_path = public;

-- RLS Policies for profiles
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.profiles  
  FOR SELECT USING (public.is_admin());

CREATE POLICY "Users can update their own display_name" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id AND (OLD.role = NEW.role OR public.is_admin()));

CREATE POLICY "Only admins can insert profiles" ON public.profiles
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete profiles" ON public.profiles
  FOR DELETE USING (public.is_admin());

-- RLS Policies for fsli_pages (public read, admin write)
CREATE POLICY "Anyone can view pages" ON public.fsli_pages
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify pages" ON public.fsli_pages
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update pages" ON public.fsli_pages
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete pages" ON public.fsli_pages
  FOR DELETE USING (public.is_admin());

-- RLS Policies for fsli_sections (public read, admin write)
CREATE POLICY "Anyone can view sections" ON public.fsli_sections
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify sections" ON public.fsli_sections
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update sections" ON public.fsli_sections
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete sections" ON public.fsli_sections
  FOR DELETE USING (public.is_admin());

-- RLS Policies for fsli_metrics (public read, admin write)
CREATE POLICY "Anyone can view metrics" ON public.fsli_metrics
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify metrics" ON public.fsli_metrics
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update metrics" ON public.fsli_metrics
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete metrics" ON public.fsli_metrics
  FOR DELETE USING (public.is_admin());

-- RLS Policies for fsli_revisions (public read, admin write)
CREATE POLICY "Anyone can view revisions" ON public.fsli_revisions
  FOR SELECT USING (true);

CREATE POLICY "Only admins can create revisions" ON public.fsli_revisions
  FOR INSERT WITH CHECK (public.is_admin());

-- RLS Policies for embeds (public read, admin write)
CREATE POLICY "Anyone can view embeds" ON public.embeds
  FOR SELECT USING (true);

CREATE POLICY "Only admins can modify embeds" ON public.embeds
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update embeds" ON public.embeds
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "Only admins can delete embeds" ON public.embeds
  FOR DELETE USING (public.is_admin());

-- Storage policies for embeds bucket
CREATE POLICY "Anyone can view embed files" ON storage.objects
  FOR SELECT USING (bucket_id = 'embeds');

CREATE POLICY "Only admins can upload embed files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'embeds' AND public.is_admin());

CREATE POLICY "Only admins can update embed files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'embeds' AND public.is_admin());

CREATE POLICY "Only admins can delete embed files" ON storage.objects
  FOR DELETE USING (bucket_id = 'embeds' AND public.is_admin());

-- Update trigger for timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fsli_pages_updated_at
  BEFORE UPDATE ON public.fsli_pages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fsli_sections_updated_at
  BEFORE UPDATE ON public.fsli_sections
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_fsli_metrics_updated_at
  BEFORE UPDATE ON public.fsli_metrics
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Update the existing handle_new_user function to create profile instead of user_role
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, role)
  VALUES (NEW.id, NEW.email, 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Recreate the trigger for new users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Seed data: Create sample "cash-and-cash-equivalents" page
INSERT INTO public.fsli_pages (slug, title, subtitle, notes_ref) VALUES
('cash-and-cash-equivalents', 'Cash and cash equivalents', 'Kas dan setara kas', '3i.6');

-- Get the page ID for seeding sections and metrics
WITH page AS (SELECT id FROM public.fsli_pages WHERE slug = 'cash-and-cash-equivalents')
INSERT INTO public.fsli_sections (page_id, key, content, sort_order) VALUES
((SELECT id FROM page), 'quick_facts', '{"type": "html", "content": "<p>Cash and cash equivalents represent the most liquid assets on a company''s balance sheet, including cash on hand, bank deposits, and short-term investments that can be readily converted to cash within 90 days.</p>"}', 1),
((SELECT id FROM page), 'definition', '{"type": "html", "content": "<p><strong>Cash</strong> includes currency, coins, checks, money orders, and funds on deposit in banks or financial institutions.</p><p><strong>Cash equivalents</strong> are short-term, highly liquid investments that are readily convertible to known amounts of cash and have original maturities of three months or less.</p>"}', 2),
((SELECT id FROM page), 'recognition', '{"type": "html", "content": "<p>Cash and cash equivalents are recognized when:</p><ul><li>The entity has control over the asset</li><li>Future economic benefits are expected to flow to the entity</li><li>The amount can be measured reliably</li></ul>"}', 3),
((SELECT id FROM page), 'measurement', '{"type": "html", "content": "<p>Cash and cash equivalents are measured at fair value. Foreign currency cash and cash equivalents are translated using the exchange rate at the reporting date.</p>"}', 4),
((SELECT id FROM page), 'disclosure', '{"type": "html", "content": "<p>Entities must disclose:</p><ul><li>Components of cash and cash equivalents</li><li>Reconciliation of cash flows</li><li>Restricted cash amounts</li><li>Credit risk concentrations</li></ul>"}', 5);

-- Add sample metrics for the page
WITH page AS (SELECT id FROM public.fsli_pages WHERE slug = 'cash-and-cash-equivalents')
INSERT INTO public.fsli_metrics (page_id, label, value, unit, sort_order) VALUES
((SELECT id FROM page), 'December 31, 2024', 2614318, 'Thousands USD', 1),
((SELECT id FROM page), 'December 31, 2023', 2156789, 'Thousands USD', 2),
((SELECT id FROM page), 'Year-over-year change', 21.1, 'Percent', 3);