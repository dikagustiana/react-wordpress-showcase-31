import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { RefreshCw, CheckCircle, AlertCircle, Settings as SettingsIcon } from 'lucide-react';
import { revalidatePage } from '@/utils/wordpress';
import { useToast } from '@/hooks/use-toast';

export default function Settings() {
  const [revalidateSlug, setRevalidateSlug] = useState('');
  const [revalidateSecret, setRevalidateSecret] = useState('');
  const [isRevalidating, setIsRevalidating] = useState(false);
  const { toast } = useToast();

  const handleRevalidate = async () => {
    if (!revalidateSlug || !revalidateSecret) {
      toast({
        title: "Error",
        description: "Please fill in both slug and secret",
        variant: "destructive"
      });
      return;
    }

    setIsRevalidating(true);
    try {
      const success = await revalidatePage(revalidateSlug, revalidateSecret);
      
      if (success) {
        toast({
          title: "Success",
          description: `Page "${revalidateSlug}" has been refreshed`,
        });
        setRevalidateSlug('');
      } else {
        toast({
          title: "Error",
          description: "Failed to refresh page. Check your secret key.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error", 
        description: "Network error occurred",
        variant: "destructive"
      });
    } finally {
      setIsRevalidating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <SettingsIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground">
          Manage your universal embed configuration and refresh content
        </p>
      </div>

      <div className="grid gap-8">
        {/* Refresh Page Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Refresh Page Content
            </CardTitle>
            <CardDescription>
              Force refresh a specific page to load the latest content from WordPress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="slug">Page Slug</Label>
                <Input
                  id="slug"
                  placeholder="e.g. segment-information"
                  value={revalidateSlug}
                  onChange={(e) => setRevalidateSlug(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secret">Revalidation Secret</Label>
                <Input
                  id="secret"
                  type="password"
                  placeholder="Enter secret key"
                  value={revalidateSecret}
                  onChange={(e) => setRevalidateSecret(e.target.value)}
                />
              </div>
            </div>
            <Button 
              onClick={handleRevalidate} 
              disabled={isRevalidating}
              className="w-full sm:w-auto"
            >
              {isRevalidating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Refreshing...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* WordPress Setup Guide */}
        <Card>
          <CardHeader>
            <CardTitle>WordPress Configuration Guide</CardTitle>
            <CardDescription>
              Follow these steps to set up universal embed in your WordPress admin
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                These steps need to be completed in your WordPress admin panel at{' '}
                <strong>admin.dikagustiana.com</strong>
              </AlertDescription>
            </Alert>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">1</span>
                  Add Custom Fields to WordPress
                </h3>
                <div className="ml-8 space-y-2">
                  <p className="text-sm text-muted-foreground mb-3">
                    Add these custom fields to your WordPress pages (using ACF or similar):
                  </p>
                  <div className="bg-muted/50 p-4 rounded-lg space-y-2 font-mono text-sm">
                    <div><strong>data_source_type</strong> (select): media, onedrive, gsheet, api_json</div>
                    <div><strong>data_source_url</strong> (text): File or API URL</div>
                    <div><strong>embed_type</strong> (select): iframe, sheetjs, json_table</div>
                    <div><strong>excel_sheet</strong> (text): Sheet name (default: Sheet1)</div>
                    <div><strong>excel_range</strong> (text): Cell range (e.g., A1:F100)</div>
                    <div><strong>table_page_size</strong> (number): Rows per page (default: 10)</div>
                  </div>
                  <Alert className="mt-3">
                    <CheckCircle className="h-4 w-4" />
                    <AlertDescription>
                      Make sure all fields have <strong>show_in_rest</strong> enabled to appear in the REST API
                    </AlertDescription>
                  </Alert>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">2</span>
                  Configure Your Content
                </h3>
                <div className="ml-8 space-y-4">
                  <div className="space-y-3">
                    <h4 className="font-medium">For Excel Files from Media Library:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>data_source_type: <code>media</code></li>
                      <li>embed_type: <code>sheetjs</code></li>
                      <li>data_source_url: Direct file URL from media library</li>
                      <li>excel_sheet: Sheet name (e.g., "Sheet1")</li>
                      <li>excel_range: Optional (e.g., "A1:F100")</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">For OneDrive/Google Drive Embedding:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>data_source_type: <code>onedrive</code> or <code>gsheet</code></li>
                      <li>embed_type: <code>iframe</code></li>
                      <li>data_source_url: Embed/share URL from the service</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-medium">For JSON API Data:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                      <li>data_source_type: <code>api_json</code></li>
                      <li>embed_type: <code>json_table</code></li>
                      <li>data_source_url: JSON API endpoint</li>
                      <li>table_page_size: Number of rows per page</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm font-medium">3</span>
                  Test Your Setup
                </h3>
                <div className="ml-8">
                  <p className="text-sm text-muted-foreground mb-3">
                    After configuring the fields, use the refresh tool above to update your page content.
                    The page slug should match your WordPress page slug (found in the URL).
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}