-- Fix RLS policies for green_essays table to allow admin users to create essays

-- Drop existing policies to recreate them properly
DROP POLICY IF EXISTS "Only admins can modify essays" ON public.green_essays;
DROP POLICY IF EXISTS "Anyone can view published essays" ON public.green_essays;

-- Create separate policies for different operations
CREATE POLICY "Anyone can view published essays or admins can view all" 
ON public.green_essays 
FOR SELECT 
USING (
  status = 'published' OR 
  (auth.uid() IS NOT NULL AND (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
  ))
);

CREATE POLICY "Only admins can create essays" 
ON public.green_essays 
FOR INSERT 
WITH CHECK (
  auth.uid() IS NOT NULL AND (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
  )
);

CREATE POLICY "Only admins can update essays" 
ON public.green_essays 
FOR UPDATE 
USING (
  auth.uid() IS NOT NULL AND (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
  )
);

CREATE POLICY "Only admins can delete essays" 
ON public.green_essays 
FOR DELETE 
USING (
  auth.uid() IS NOT NULL AND (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin' OR
    EXISTS (SELECT 1 FROM public.user_roles ur WHERE ur.user_id = auth.uid() AND ur.role = 'admin')
  )
);

-- Insert default templates for each section
INSERT INTO public.green_essays_templates (section, title_template, content_html, content_json) 
VALUES 
(
  'where-we-are-now',
  'New Essay: Where We Are Now',
  '<h1>New Essay Title</h1><p>Start writing your analysis of the current state...</p><h2>Current Situation</h2><ol><li>First key point</li><li>Second key point</li><li>Third key point</li></ol><blockquote>Key insight or quote</blockquote><hr><h2>Conclusion</h2><p>Summary and next steps...</p>',
  '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"New Essay Title"}]},{"type":"paragraph","content":[{"type":"text","text":"Start writing your analysis of the current state..."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Current Situation"}]},{"type":"orderedList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"First key point"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Second key point"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Third key point"}]}]}]},{"type":"blockquote","content":[{"type":"paragraph","content":[{"type":"text","text":"Key insight or quote"}]}]},{"type":"horizontalRule"},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Conclusion"}]},{"type":"paragraph","content":[{"type":"text","text":"Summary and next steps..."}]}]}'
),
(
  'challenges-ahead',
  'New Essay: Challenges Ahead',
  '<h1>New Essay Title</h1><p>Identify and analyze the upcoming challenges...</p><h2>Major Challenges</h2><ol><li>Challenge one</li><li>Challenge two</li><li>Challenge three</li></ol><blockquote>Critical insight about these challenges</blockquote><hr><h2>Way Forward</h2><p>Strategic recommendations...</p>',
  '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"New Essay Title"}]},{"type":"paragraph","content":[{"type":"text","text":"Identify and analyze the upcoming challenges..."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Major Challenges"}]},{"type":"orderedList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Challenge one"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Challenge two"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Challenge three"}]}]}]},{"type":"blockquote","content":[{"type":"paragraph","content":[{"type":"text","text":"Critical insight about these challenges"}]}]},{"type":"horizontalRule"},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Way Forward"}]},{"type":"paragraph","content":[{"type":"text","text":"Strategic recommendations..."}]}]}'
),
(
  'pathway-forward',
  'New Essay: Pathway Forward',
  '<h1>New Essay Title</h1><p>Outline solutions and pathways to progress...</p><h2>Strategic Actions</h2><ol><li>Action one</li><li>Action two</li><li>Action three</li></ol><blockquote>Vision for the future</blockquote><hr><h2>Implementation</h2><p>Concrete next steps...</p>',
  '{"type":"doc","content":[{"type":"heading","attrs":{"level":1},"content":[{"type":"text","text":"New Essay Title"}]},{"type":"paragraph","content":[{"type":"text","text":"Outline solutions and pathways to progress..."}]},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Strategic Actions"}]},{"type":"orderedList","content":[{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Action one"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Action two"}]}]},{"type":"listItem","content":[{"type":"paragraph","content":[{"type":"text","text":"Action three"}]}]}]},{"type":"blockquote","content":[{"type":"paragraph","content":[{"type":"text","text":"Vision for the future"}]}]},{"type":"horizontalRule"},{"type":"heading","attrs":{"level":2},"content":[{"type":"text","text":"Implementation"}]},{"type":"paragraph","content":[{"type":"text","text":"Concrete next steps..."}]}]}'
)
ON CONFLICT (section) DO UPDATE SET
  title_template = EXCLUDED.title_template,
  content_html = EXCLUDED.content_html,
  content_json = EXCLUDED.content_json;