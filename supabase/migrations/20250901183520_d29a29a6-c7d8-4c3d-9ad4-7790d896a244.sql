-- Create missing sections for cash-and-cash-equivalents page if they don't exist (with proper jsonb casting)
DO $$
DECLARE
    page_uuid uuid;
BEGIN
    -- Get the page ID for cash-and-cash-equivalents
    SELECT id INTO page_uuid FROM fsli_pages WHERE slug = 'cash-and-cash-equivalents';
    
    IF page_uuid IS NOT NULL THEN
        -- Insert default sections if they don't exist
        INSERT INTO fsli_sections (page_id, key, content, sort_order)
        SELECT page_uuid, key, content::jsonb, sort_order
        FROM (VALUES
            ('quick_facts', '{"type": "html", "content": "<p>No content yet</p>"}', 1),
            ('definition', '{"type": "html", "content": "<p>No content yet</p>"}', 2),
            ('recognition', '{"type": "html", "content": "<p>No content yet</p>"}', 3),
            ('measurement', '{"type": "html", "content": "<p>No content yet</p>"}', 4),
            ('presentation_example', '{"type": "html", "content": "<p>No content yet</p>"}', 5),
            ('journal_entry_examples', '{"type": "html", "content": "<p>No content yet</p>"}', 6),
            ('disclosure_items', '{"type": "html", "content": "<p>No content yet</p>"}', 7),
            ('common_mistakes', '{"type": "html", "content": "<p>No content yet</p>"}', 8),
            ('todo_essay', '{"type": "html", "content": "<p>No content yet</p>"}', 9)
        ) AS v(key, content, sort_order)
        WHERE NOT EXISTS (
            SELECT 1 FROM fsli_sections 
            WHERE page_id = page_uuid AND key = v.key
        );
        
        -- Also create basic metrics if they don't exist
        INSERT INTO fsli_metrics (page_id, label, value, unit, sort_order)
        SELECT page_uuid, label, value, unit, sort_order
        FROM (VALUES
            ('December 31, 2024', 125000, 'Thousands USD', 1),
            ('December 31, 2023', 98000, 'Thousands USD', 2),
            ('Change %', 27.6, 'Percent', 3)
        ) AS v(label, value, unit, sort_order)
        WHERE NOT EXISTS (
            SELECT 1 FROM fsli_metrics 
            WHERE page_id = page_uuid AND label = v.label
        );
    END IF;
END $$;