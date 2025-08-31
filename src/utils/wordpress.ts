interface PageConfig {
  data_source_type: 'media' | 'onedrive' | 'gsheet' | 'api_json';
  data_source_url: string;
  embed_type: 'iframe' | 'sheetjs' | 'json_table';
  excel_sheet?: string;
  excel_range?: string;
  table_page_size?: number;
}

const WP_API_BASE = 'https://admin.dikagustiana.com/wp-json/wp/v2';
const ALLOWED_IFRAME_DOMAINS = [
  'drive.google.com',
  'onedrive.live.com', 
  'admin.dikagustiana.com'
];

export async function getPageConfig(slug: string): Promise<PageConfig | null> {
  try {
    const response = await fetch(`${WP_API_BASE}/pages?slug=${slug}&_embed=true&acf_format=standard`);
    const pages = await response.json();
    
    if (!pages || pages.length === 0) {
      return null;
    }

    const page = pages[0];
    const acf = page.acf || {};

    return {
      data_source_type: acf.data_source_type || 'media',
      data_source_url: acf.data_source_url || '',
      embed_type: acf.embed_type || 'iframe',
      excel_sheet: acf.excel_sheet || 'Sheet1',
      excel_range: acf.excel_range || '',
      table_page_size: parseInt(acf.table_page_size) || 10
    };
  } catch (error) {
    console.error('Error fetching page config:', error);
    return null;
  }
}

export function validateIframeUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);
    return ALLOWED_IFRAME_DOMAINS.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
}

export async function revalidatePage(slug: string, secret: string): Promise<boolean> {
  try {
    const response = await fetch('/api/revalidate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slug, secret }),
    });
    return response.ok;
  } catch {
    return false;
  }
}