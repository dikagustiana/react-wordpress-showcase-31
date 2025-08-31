import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UniversalEmbed } from '@/components/UniversalEmbed';
import { usePageConfig } from '@/hooks/usePageConfig';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

export default function EmbedExample() {
  const [testSlug, setTestSlug] = useState('segment-information');
  const [manualConfig, setManualConfig] = useState({
    dataSourceType: 'media' as 'media' | 'onedrive' | 'gsheet' | 'api_json',
    dataSourceUrl: '',
    embedType: 'iframe' as 'iframe' | 'sheetjs' | 'json_table',
    excelSheet: 'Sheet1',
    excelRange: '',
    tablePageSize: 10
  });
  const [useManual, setUseManual] = useState(false);

  const { data: config, isLoading, error } = usePageConfig(testSlug);

  // Normalize config data
  const normalizeConfig = (config: any) => {
    if (!config) return null;
    
    return {
      dataSourceType: config.data_source_type || config.dataSourceType,
      dataSourceUrl: config.data_source_url || config.dataSourceUrl,
      embedType: config.embed_type || config.embedType,
      excelSheet: config.excel_sheet || config.excelSheet,
      excelRange: config.excel_range || config.excelRange,
      tablePageSize: config.table_page_size || config.tablePageSize
    };
  };

  const currentConfig = useManual ? normalizeConfig(manualConfig) : normalizeConfig(config);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Universal Embed Demo</h1>
        <p className="text-muted-foreground">
          Test the universal embed functionality with WordPress data or manual configuration
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Configuration Panel */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Configuration</CardTitle>
              <CardDescription>
                Configure embed settings or fetch from WordPress
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Button
                  variant={!useManual ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseManual(false)}
                >
                  WordPress
                </Button>
                <Button
                  variant={useManual ? "default" : "outline"}
                  size="sm"
                  onClick={() => setUseManual(true)}
                >
                  Manual
                </Button>
              </div>

              {!useManual ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="slug">Page Slug</Label>
                    <Input
                      id="slug"
                      value={testSlug}
                      onChange={(e) => setTestSlug(e.target.value)}
                      placeholder="segment-information"
                    />
                  </div>

                  {isLoading && (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  )}

                  {error && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-destructive" />
                      <p className="text-sm text-destructive">Failed to load config</p>
                    </div>
                  )}

                  {config && (
                    <div className="space-y-2 text-sm">
                      <p><strong>Type:</strong> {config.data_source_type}</p>
                      <p><strong>URL:</strong> {config.data_source_url?.slice(0, 50)}...</p>
                      <p><strong>Embed:</strong> {config.embed_type}</p>
                      {config.excel_sheet && <p><strong>Sheet:</strong> {config.excel_sheet}</p>}
                      {config.excel_range && <p><strong>Range:</strong> {config.excel_range}</p>}
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Data Source Type</Label>
                    <Select
                      value={manualConfig.dataSourceType}
                      onValueChange={(value) => 
                        setManualConfig(prev => ({ ...prev, dataSourceType: value as any }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="media">Media Library</SelectItem>
                        <SelectItem value="onedrive">OneDrive</SelectItem>
                        <SelectItem value="gsheet">Google Sheets</SelectItem>
                        <SelectItem value="api_json">JSON API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url">Data Source URL</Label>
                    <Input
                      id="url"
                      value={manualConfig.dataSourceUrl}
                      onChange={(e) => 
                        setManualConfig(prev => ({ ...prev, dataSourceUrl: e.target.value }))
                      }
                      placeholder="https://..."
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Embed Type</Label>
                    <Select
                      value={manualConfig.embedType}
                      onValueChange={(value) => 
                        setManualConfig(prev => ({ ...prev, embedType: value as any }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="iframe">Iframe</SelectItem>
                        <SelectItem value="sheetjs">Excel Table</SelectItem>
                        <SelectItem value="json_table">JSON Table</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {manualConfig.embedType === 'sheetjs' && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="sheet">Excel Sheet</Label>
                        <Input
                          id="sheet"
                          value={manualConfig.excelSheet}
                          onChange={(e) => 
                            setManualConfig(prev => ({ ...prev, excelSheet: e.target.value }))
                          }
                          placeholder="Sheet1"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="range">Excel Range</Label>
                        <Input
                          id="range"
                          value={manualConfig.excelRange}
                          onChange={(e) => 
                            setManualConfig(prev => ({ ...prev, excelRange: e.target.value }))
                          }
                          placeholder="A1:F100"
                        />
                      </div>
                    </>
                  )}

                  {(manualConfig.embedType === 'json_table' || manualConfig.embedType === 'sheetjs') && (
                    <div className="space-y-2">
                      <Label htmlFor="pageSize">Page Size</Label>
                      <Input
                        id="pageSize"
                        type="number"
                        value={manualConfig.tablePageSize}
                        onChange={(e) => 
                          setManualConfig(prev => ({ ...prev, tablePageSize: parseInt(e.target.value) || 10 }))
                        }
                        min="5"
                        max="100"
                      />
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Embed Preview */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Embed Preview</CardTitle>
              <CardDescription>
                Live preview of the configured embed
              </CardDescription>
            </CardHeader>
            <CardContent>
            {currentConfig && currentConfig.dataSourceUrl ? (
                <UniversalEmbed
                  dataSourceType={currentConfig.dataSourceType}
                  dataSourceUrl={currentConfig.dataSourceUrl}
                  embedType={currentConfig.embedType}
                  excelSheet={currentConfig.excelSheet}
                  excelRange={currentConfig.excelRange}
                  tablePageSize={currentConfig.tablePageSize}
                />
              ) : (
                <div className="flex items-center justify-center p-8 bg-muted/30 border border-dashed border-muted-foreground/25 rounded-lg">
                  <p className="text-muted-foreground">
                    {!useManual && isLoading 
                      ? 'Loading configuration...' 
                      : 'Configure embed settings to see preview'
                    }
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}