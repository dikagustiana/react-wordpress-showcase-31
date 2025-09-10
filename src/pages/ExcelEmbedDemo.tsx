import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ExcelEmbed } from '@/components/inline/ExcelEmbed';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const ExcelEmbedDemo: React.FC = () => {
  const [testUrl, setTestUrl] = useState('');
  const [embedHeight, setEmbedHeight] = useState(600);
  
  // Sample OneDrive URLs for testing
  const sampleUrls = [
    {
      name: 'Financial Planning Template',
      url: 'https://onedrive.live.com/embed?resid=ABC123&authkey=DEF456&em=2&wdAllowInteractivity=True&wdHideGridlines=True&wdHideHeaders=True&wdDownloadButton=True&wdInConfigurator=True'
    },
    {
      name: 'Budget Analysis',
      url: 'https://contoso-my.sharepoint.com/:x:/g/personal/user/EwAaBbCc?e=xyz123&embed=1&wdAllowInteractivity=True'
    }
  ];

  return (
    <div className="min-h-screen bg-fsli-surface-1 flex flex-col font-plus-jakarta">
      <Header />
      
      <div className="mx-auto max-w-[1200px] px-6 lg:px-20 py-20 lg:py-[80px] flex-1">
        <div className="max-w-[860px]">
          {/* Header */}
          <header className="mb-12">
            <h1 className="text-[32px] leading-tight font-bold text-fsli-text mb-4">
              Excel Embed Demo
            </h1>
            <p className="text-lg text-fsli-secondary mb-6">
              Test Excel embedding functionality with OneDrive and SharePoint links
            </p>
          </header>

          {/* Instructions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-fsli-text">
                How to Use Excel Embed
              </CardTitle>
              <CardDescription className="text-fsli-secondary">
                Follow these steps to embed Excel files from OneDrive
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="list-decimal list-inside space-y-2 text-fsli-text">
                <li>Open your Excel file in OneDrive</li>
                <li>Click "Share" → "Embed"</li>
                <li>Copy the embed URL (not the iframe code)</li>
                <li>Paste the URL in the field below</li>
                <li>The system will normalize it for interactive viewing</li>
              </ol>
              
              <div className="mt-4 p-4 bg-primary-light rounded-lg border-l-4 border-primary">
                <p className="text-small text-fsli-text">
                  <strong>Supported formats:</strong> OneDrive embed URLs, OneDrive view URLs, SharePoint Online URLs
                </p>
              </div>
            </CardContent>
          </Card>

          {/* URL Input */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-fsli-text">
                Test Excel URL
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Input
                  type="url"
                  placeholder="Paste OneDrive or SharePoint Excel URL here..."
                  value={testUrl}
                  onChange={(e) => setTestUrl(e.target.value)}
                  className="mb-2"
                />
                <div className="flex gap-2 mb-4">
                  <Input
                    type="number"
                    placeholder="Height (px)"
                    value={embedHeight}
                    onChange={(e) => setEmbedHeight(parseInt(e.target.value) || 600)}
                    className="w-32"
                    min={400}
                    max={1200}
                  />
                </div>
              </div>
              
              {/* Sample URLs */}
              <div>
                <p className="text-small font-medium text-fsli-text mb-2">Sample URLs (for testing only):</p>
                <div className="space-y-2">
                  {sampleUrls.map((sample, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setTestUrl(sample.url)}
                      className="mr-2 mb-2"
                    >
                      Use "{sample.name}"
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Excel Embed Display */}
          {testUrl && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-fsli-text">
                  Excel Embed Result
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ExcelEmbed
                  url={testUrl}
                  height={embedHeight}
                  title="Demo Excel Document"
                  fullscreen={true}
                />
              </CardContent>
            </Card>
          )}

          {/* Features List */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-fsli-text">
                Features Included
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-fsli-text mb-2">📊 Interactive Sheets</h4>
                  <p className="text-small text-fsli-secondary">
                    Navigate between worksheets using sheet tabs
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-fsli-text mb-2">📱 Responsive Design</h4>
                  <p className="text-small text-fsli-secondary">
                    Adaptive heights: 420px mobile, 540px tablet, custom desktop
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-fsli-text mb-2">🔗 URL Normalization</h4>
                  <p className="text-small text-fsli-secondary">
                    Automatic conversion of view URLs to embed format
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-fsli-text mb-2">⚠️ Error Handling</h4>
                  <p className="text-small text-fsli-secondary">
                    Clear instructions when URLs can't be embedded
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ExcelEmbedDemo;