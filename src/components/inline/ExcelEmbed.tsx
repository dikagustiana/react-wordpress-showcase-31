import React, { useState, useEffect } from 'react';
import { AlertTriangle, ExternalLink } from 'lucide-react';

interface ExcelEmbedProps {
  url: string;
  width?: string;
  height?: number;
  fullscreen?: boolean;
  title?: string;
  className?: string;
}

export const ExcelEmbed: React.FC<ExcelEmbedProps> = ({
  url,
  width = "100%",
  height = 600,
  fullscreen = true,
  title,
  className = ""
}) => {
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Normalize OneDrive/SharePoint URLs to embed format
  const normalizeUrl = (inputUrl: string): string => {
    try {
      const cleanUrl = inputUrl.trim();
      
      // Already an embed URL
      if (cleanUrl.includes('embed?') && cleanUrl.includes('wdAllowInteractivity=True')) {
        return cleanUrl;
      }
      
      // OneDrive view URL -> embed URL
      if (cleanUrl.includes('view.aspx?resid=')) {
        const baseUrl = cleanUrl.split('view.aspx?')[0];
        const params = new URL(cleanUrl).searchParams;
        const resid = params.get('resid');
        if (resid) {
          return `${baseUrl}embed?resid=${resid}&authkey=${params.get('authkey') || ''}&wdAllowInteractivity=True`;
        }
      }
      
      // SharePoint Online URL -> add embed parameter
      if (cleanUrl.includes('sharepoint.com') && cleanUrl.includes('.xlsx')) {
        const separator = cleanUrl.includes('?') ? '&' : '?';
        return `${cleanUrl}${separator}embed=1&wdAllowInteractivity=True`;
      }
      
      // OneDrive short link (1drv.ms) - needs expansion (simplified approach)
      if (cleanUrl.includes('1drv.ms')) {
        throw new Error('Short links need to be expanded. Please use the full OneDrive share link.');
      }
      
      // If URL contains embed parameters but missing wdAllowInteractivity
      if (cleanUrl.includes('embed?') && !cleanUrl.includes('wdAllowInteractivity')) {
        const separator = cleanUrl.includes('&') ? '&' : '&';
        return `${cleanUrl}${separator}wdAllowInteractivity=True`;
      }
      
      throw new Error('Unsupported URL format');
      
    } catch (err) {
      throw new Error('Unable to create embed URL. Please use OneDrive Share > Embed option.');
    }
  };

  // Validate if URL is from supported hosts
  const validateHost = (url: string): boolean => {
    const supportedHosts = [
      'onedrive.live.com',
      'sharepoint.com',
      '1drv.ms'
    ];
    
    try {
      const urlObj = new URL(url);
      return supportedHosts.some(host => urlObj.hostname.includes(host));
    } catch {
      return false;
    }
  };

  useEffect(() => {
    const processUrl = async () => {
      setLoading(true);
      setError('');
      
      try {
        if (!url) {
          throw new Error('URL is required');
        }
        
        if (!validateHost(url)) {
          throw new Error('Only OneDrive and SharePoint URLs are supported');
        }
        
        const normalized = normalizeUrl(url);
        setEmbedUrl(normalized);
        
      } catch (err) {
        console.error('Excel embed error:', err);
        setError(err instanceof Error ? err.message : 'Failed to process URL');
      } finally {
        setLoading(false);
      }
    };

    processUrl();
  }, [url]);

  // Get responsive height based on screen size
  const getResponsiveHeight = () => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth;
      if (width < 768) return Math.max(420, height * 0.7); // Mobile min 420px
      if (width < 1024) return Math.max(540, height * 0.9); // Tablet min 540px
      return height; // Desktop
    }
    return height;
  };

  const responsiveHeight = getResponsiveHeight();

  if (loading) {
    return (
      <div className={`my-6 ${className}`}>
        {title && <h4 className="text-lg font-semibold mb-3 text-fsli-text">{title}</h4>}
        <div 
          className="border border-fsli-border rounded-lg flex items-center justify-center bg-fsli-surface-2"
          style={{ height: `${responsiveHeight}px`, width }}
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-fsli-secondary">Loading Excel document...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`my-6 ${className}`}>
        {title && <h4 className="text-lg font-semibold mb-3 text-fsli-text">{title}</h4>}
        <div 
          className="border border-destructive/50 rounded-lg p-6 bg-destructive/5"
          style={{ width }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-destructive font-medium mb-2">Excel Embed Error</p>
              <p className="text-fsli-secondary text-small mb-4">{error}</p>
              <div className="space-y-2 text-fsli-secondary text-small">
                <p><strong>To fix this:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-4">
                  <li>Open your Excel file in OneDrive</li>
                  <li>Click "Share" → "Embed"</li>
                  <li>Copy the embed code URL</li>
                  <li>Paste that URL here</li>
                </ol>
              </div>
              <a 
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-4 text-primary hover:underline font-medium"
              >
                <ExternalLink className="h-4 w-4" />
                Open in OneDrive
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!embedUrl) {
    return null;
  }

  return (
    <div className={`my-6 ${className}`}>
      {title && <h4 className="text-lg font-semibold mb-3 text-fsli-text">{title}</h4>}
      <div className="border border-fsli-border rounded-lg overflow-hidden shadow-sm">
        <iframe
          src={embedUrl}
          width={width}
          height={responsiveHeight}
          frameBorder="0"
          loading="lazy"
          sandbox="allow-scripts allow-same-origin"
          allowFullScreen={fullscreen}
          title={title || 'Excel Document'}
          className="w-full"
          style={{ 
            overflow: 'auto',
            minHeight: `${responsiveHeight}px`
          }}
        />
      </div>
      <div className="mt-2 flex items-center justify-between">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-small text-fsli-secondary hover:text-primary transition-colors"
        >
          <ExternalLink className="h-3 w-3" />
          Open in OneDrive
        </a>
        <p className="text-micro text-fsli-muted">
          Use sheet tabs to navigate between worksheets
        </p>
      </div>
    </div>
  );
};