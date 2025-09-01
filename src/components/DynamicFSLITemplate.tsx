import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/Breadcrumb';
import FSLISidebar from '@/components/FSLISidebar';
import { EnhancedAdminToolbar } from '@/components/admin/EnhancedAdminToolbar';
import { EditButton } from '@/components/admin/EditButton';
import { MediumStyleEditor } from '@/components/admin/MediumStyleEditor';
import { MetricEditor } from '@/components/admin/MetricEditor';
import { EmbedManager } from '@/components/admin/EmbedManager';
import { EssayAutoResize } from '@/components/admin/EssayAutoResize';
import { RevisionHistory } from '@/components/admin/RevisionHistory';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useContent, FSLISection, FSLIMetric } from '@/hooks/useContent';
import { useAuthRole } from '@/hooks/useAuthRole';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface DynamicFSLITemplateProps {
  slug: string;
}

export const DynamicFSLITemplate: React.FC<DynamicFSLITemplateProps> = ({ slug }) => {
  const { isAdmin } = useAuthRole();
  const { page, sections, metrics, embeds, loading, updatePage, updateSection, updateMetric } = useContent(slug);
  const { toast } = useToast();
  
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<FSLISection | null>(null);
  const [editingMetric, setEditingMetric] = useState<FSLIMetric | null>(null);
  const [editingPageHeader, setEditingPageHeader] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const [pageHeaderData, setPageHeaderData] = useState({
    title: '',
    subtitle: '',
    notes_ref: ''
  });

  // Format numbers for display
  const formatValue = (value: number | undefined, unit: string | undefined) => {
    if (value === undefined) return '';
    
    if (unit === 'Percent') {
      return `${value}%`;
    }
    
    if (unit === 'Thousands USD' || unit === 'USD') {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: value >= 1000000 ? 'compact' : 'standard',
        maximumFractionDigits: 0,
      }).format(value);
    }
    
    return new Intl.NumberFormat('en-US').format(value);
  };

  // Get section content as HTML
  const getSectionContent = (key: string) => {
    const section = sections.find(s => s.key === key);
    if (!section) return '';
    
    try {
      const parsed = JSON.parse(section.content);
      return parsed.content || '';
    } catch {
      return section.content || '';
    }
  };

  // Get section by key
  const getSection = (key: string) => {
    return sections.find(s => s.key === key);
  };

  // Create revision when saving content
  const createRevision = async (pageId: string, sectionId?: string, content?: any) => {
    if (!isAdmin || !page) return;
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.from('fsli_revisions').insert({
        page_id: pageId,
        section_id: sectionId,
        content: content || page,
        editor_id: user.id
      });
    } catch (error) {
      console.error('Error creating revision:', error);
    }
  };

  // Handle page header edit
  const handlePageHeaderEdit = () => {
    if (page) {
      setPageHeaderData({
        title: page.title,
        subtitle: page.subtitle || '',
        notes_ref: page.notes_ref || ''
      });
      setEditingPageHeader(true);
    }
  };

  const handleSavePageHeader = async () => {
    if (page) {
      await createRevision(page.id, undefined, { ...page, ...pageHeaderData });
      updatePage(pageHeaderData);
      setEditingPageHeader(false);
      toast({
        title: "Page header updated",
        description: "Changes saved successfully.",
      });
    }
  };

  // Handle section edit
  const handleSectionEdit = (key: string) => {
    const section = getSection(key);
    if (section) {
      setEditingSection(section);
    }
  };

  const handleSectionSave = async (content: string) => {
    if (editingSection && page) {
      const formattedContent = JSON.stringify({
        type: 'html',
        content: content
      });
      
      await createRevision(page.id, editingSection.id, { content });
      updateSection(editingSection.id, formattedContent);
      setEditingSection(null);
      
      toast({
        title: "Content updated",
        description: "Section saved successfully.",
      });
    }
  };

  const handleSectionAutoSave = async (content: string) => {
    if (editingSection && page) {
      const formattedContent = JSON.stringify({
        type: 'html',
        content: content
      });
      updateSection(editingSection.id, formattedContent);
    }
  };

  // Handle metric edit
  const handleMetricEdit = (metric: FSLIMetric) => {
    setEditingMetric(metric);
  };

  const handleMetricSave = async (updates: Partial<FSLIMetric>) => {
    if (editingMetric && page) {
      await createRevision(page.id, undefined, { metric: { ...editingMetric, ...updates } });
      updateMetric(editingMetric.id, updates);
      setEditingMetric(null);
      
      toast({
        title: "Metric updated",
        description: "Changes saved successfully.",
      });
    }
  };

  // Handle revision revert
  const handleRevisionRevert = (content: any) => {
    if (content.content && editingSection) {
      // Revert section content
      handleSectionSave(content.content);
    } else if (content.title && page) {
      // Revert page content
      updatePage(content);
      toast({
        title: "Reverted successfully",
        description: "Content has been reverted to the selected version.",
      });
    }
  };

  // Handle save all
  const handleSaveAll = () => {
    toast({
      title: "All changes saved",
      description: "Your changes have been synchronized.",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex">
          <FSLISidebar />
          <div className="flex-1 p-8">
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="grid grid-cols-3 gap-4 mt-8">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-32 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!page) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <main className="flex-1 flex">
          <FSLISidebar />
          <div className="flex-1 p-8">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-muted-foreground">Page not found</h1>
              <p className="text-muted-foreground mt-2">The requested FSLI page could not be found.</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <EnhancedAdminToolbar 
        editMode={editMode}
        onToggleEditMode={() => setEditMode(!editMode)}
        onOpenHistory={() => setShowRevisionHistory(true)}
        onSaveAll={handleSaveAll}
      />
      
      <main className="flex-1 flex">
        <FSLISidebar />
        
        <div className="flex-1">
          <div className="p-8">
            {/* Breadcrumb */}
            <Breadcrumb 
              items={[
                { label: "Home", path: "/" },
                { label: "FSLI", path: "/fsli" },
                { label: page.title }
              ]} 
            />

            {/* Page Header */}
            <div className={`group mb-8 ${editMode ? 'edit-mode' : ''}`}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    {page.title}
                  </h1>
                  {page.subtitle && (
                    <p className="text-lg text-muted-foreground mb-2">
                      {page.subtitle}
                    </p>
                  )}
                  {page.notes_ref && (
                    <p className="text-sm text-muted-foreground">
                      Notes: {page.notes_ref}
                    </p>
                  )}
                </div>
                {editMode && <EditButton onClick={handlePageHeaderEdit} />}
              </div>
            </div>

            {/* Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {metrics.map((metric) => (
                <div key={metric.id} className={`group bg-card rounded-lg p-6 border hover:shadow-md transition-shadow ${editMode ? 'edit-mode' : ''}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-muted-foreground mb-1">
                        {metric.label}
                      </h3>
                      <p className="text-2xl font-bold text-foreground">
                        {formatValue(metric.value, metric.unit)}
                      </p>
                    </div>
                    {editMode && <EditButton onClick={() => handleMetricEdit(metric)} />}
                  </div>
                </div>
              ))}
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Quick Facts */}
              <section className={`group ${editMode ? 'edit-mode' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Quick Facts</h2>
                  {editMode && <EditButton onClick={() => handleSectionEdit('quick_facts')} />}
                </div>
                <div className="bg-card rounded-lg p-6 border">
                  <EssayAutoResize 
                    content={getSectionContent('quick_facts')}
                    isEditing={editingSection?.key === 'quick_facts'}
                  />
                </div>
              </section>

              {/* Definition */}
              <section className={`group ${editMode ? 'edit-mode' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Definition</h2>
                  {editMode && <EditButton onClick={() => handleSectionEdit('definition')} />}
                </div>
                <div className="bg-card rounded-lg p-6 border">
                  <EssayAutoResize 
                    content={getSectionContent('definition')}
                    isEditing={editingSection?.key === 'definition'}
                  />
                </div>
              </section>

              {/* Recognition */}
              <section className={`group ${editMode ? 'edit-mode' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Recognition</h2>
                  {editMode && <EditButton onClick={() => handleSectionEdit('recognition')} />}
                </div>
                <div className="bg-card rounded-lg p-6 border">
                  <EssayAutoResize 
                    content={getSectionContent('recognition')}
                    isEditing={editingSection?.key === 'recognition'}
                  />
                </div>
              </section>

              {/* Measurement */}
              <section className={`group ${editMode ? 'edit-mode' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Measurement</h2>
                  {editMode && <EditButton onClick={() => handleSectionEdit('measurement')} />}
                </div>
                <div className="bg-card rounded-lg p-6 border">
                  <EssayAutoResize 
                    content={getSectionContent('measurement')}
                    isEditing={editingSection?.key === 'measurement'}
                  />
                </div>
              </section>

              {/* Disclosure */}
              <section className={`group ${editMode ? 'edit-mode' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Disclosure</h2>
                  {editMode && <EditButton onClick={() => handleSectionEdit('disclosure')} />}
                </div>
                <div className="bg-card rounded-lg p-6 border">
                  <EssayAutoResize 
                    content={getSectionContent('disclosure')}
                    isEditing={editingSection?.key === 'disclosure'}
                  />
                </div>
              </section>

              {/* Embeds Section */}
              <section className="group">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-foreground">Resources</h2>
                </div>
                <EmbedManager pageSlug={slug} />
              </section>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Modals */}
      {editingSection && (
        <MediumStyleEditor
          isOpen={true}
          onClose={() => setEditingSection(null)}
          content={getSectionContent(editingSection.key)}
          onSave={handleSectionSave}
          onAutoSave={handleSectionAutoSave}
          title={`Edit ${editingSection.key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}`}
        />
      )}

      {editingMetric && (
        <MetricEditor
          isOpen={true}
          onClose={() => setEditingMetric(null)}
          metric={editingMetric}
          onSave={handleMetricSave}
        />
      )}

      {/* Page Header Editor */}
      <Dialog open={editingPageHeader} onOpenChange={setEditingPageHeader}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Page Header</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="page-title">Title</Label>
              <Input
                id="page-title"
                value={pageHeaderData.title}
                onChange={(e) => setPageHeaderData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="page-subtitle">Subtitle</Label>
              <Input
                id="page-subtitle"
                value={pageHeaderData.subtitle}
                onChange={(e) => setPageHeaderData(prev => ({ ...prev, subtitle: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="page-notes">Notes Reference</Label>
              <Input
                id="page-notes"
                value={pageHeaderData.notes_ref}
                onChange={(e) => setPageHeaderData(prev => ({ ...prev, notes_ref: e.target.value }))}
                placeholder="e.g., 3i.6"
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingPageHeader(false)}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleSavePageHeader}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Revision History */}
      <RevisionHistory
        isOpen={showRevisionHistory}
        onClose={() => setShowRevisionHistory(false)}
        pageId={page.id}
        sectionId={editingSection?.id}
        onRevert={handleRevisionRevert}
      />
    </div>
  );
};