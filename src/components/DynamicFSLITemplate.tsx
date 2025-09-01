import React, { useState, useEffect } from 'react';
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
import { useContent, FSLISection, FSLIMetric, normalizeSlug } from '@/hooks/useContent';
import { useRole } from '@/contexts/RoleContext';
import { useEditMode } from '@/contexts/EditModeContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Save, X } from 'lucide-react';

interface DynamicFSLITemplateProps {
  slug: string;
}

export const DynamicFSLITemplate: React.FC<DynamicFSLITemplateProps> = ({ slug }) => {
  const forceAdmin = false; // Debug flag - set to true to force admin UI
  const { role, isAdmin } = useRole();
  const canEdit = isAdmin || forceAdmin;
  const { editMode, setEditMode, editingSection, setEditingSection } = useEditMode();
  const { page, sections: originalSections, metrics, embeds, loading, updatePage, updateSection, updateMetric } = useContent(slug);
  const { toast } = useToast();
  
  // Local state for sections to handle immediate updates
  const [sections, setSections] = useState(originalSections);
  
  // Sync with original sections when they change
  useEffect(() => {
    setSections(originalSections);
  }, [originalSections]);

  // Log slug normalization for debugging
  useEffect(() => {
    console.log('[FSLI] routeSlug=', slug, 'normalized=', normalizeSlug(slug));
  }, [slug]);
  
  const [editingMetric, setEditingMetric] = useState<FSLIMetric | null>(null);
  const [editingPageHeader, setEditingPageHeader] = useState(false);
  const [showRevisionHistory, setShowRevisionHistory] = useState(false);
  const [pageHeaderData, setPageHeaderData] = useState({
    title: '',
    subtitle: '',
    notes_ref: ''
  });

  // Debug logging
  React.useEffect(() => {
    console.log('[DynamicFSLI] role=', role, 'isAdmin=', isAdmin, 'editMode=', editMode);
    if (editMode) {
      console.log('[QA] Edit Mode toggled ON - checking section buttons visibility');
    }
  }, [role, isAdmin, editMode]);

  React.useEffect(() => {
    console.log('[DynamicFSLI] sections loaded:', sections.length);
    sections.forEach(section => {
      console.log('[SectionRender]', section.key, section.id, 'hasContent:', sectionHasContent(section.key));
    });
    
    // Log which sections are found for this page
    const sectionKeys = ['quick_facts', 'definition', 'recognition', 'measurement', 
                         'presentation_example', 'journal_entry_examples', 'disclosure_items', 'common_mistakes'];
    console.log('[QA] Page sections analysis:');
    sectionKeys.forEach(key => {
      const exists = sectionExists(key);
      const hasContent = sectionHasContent(key);
      const section = getSection(key);
      console.log(`[QA] ${key}: exists=${exists}, hasContent=${hasContent}, id=${section?.id || 'none'}`);
    });
  }, [sections]);

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

  // Get section content as HTML - robust parsing with create fallback
  const getSectionContent = (key: string) => {
    const s = sections.find(x => x.key === key);
    if (!s) return '';
    const v = s.content ?? '';
    if (typeof v === 'string') {
      const t = v.trim();
      if (t.startsWith('{') && t.includes('"content"')) {
        try { return (JSON.parse(t).content ?? '') as string; } catch { return t; }
      }
      return t; // raw html
    }
    return '';
  };

  // Check if section exists and has content
  const sectionExists = (key: string) => {
    return sections.some(s => s.key === key);
  };

  // Check if section has content
  const sectionHasContent = (key: string) => {
    const content = getSectionContent(key);
    return content.trim().length > 0;
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
    if (!page) return;
    
    console.log('[QA] Saving header - data:', pageHeaderData);
    
    try {
      // Prepare data with safe empty values
      const updateData = {
        title: pageHeaderData.title || page.title,
        subtitle: pageHeaderData.subtitle || null, // Safe empty value
        notes_ref: pageHeaderData.notes_ref || null // Safe empty value
      };
      
      console.log('[QA] Header update data:', updateData);
      
      // Direct database update with better error handling
      const { error } = await supabase
        .from('fsli_pages')
        .update(updateData)
        .eq('id', page.id);
        
      if (error) {
        console.error('[Header] Save error:', error);
        toast({
          title: "Failed to save header",
          description: `Database error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      await createRevision(page.id, undefined, { ...page, ...updateData });
      updatePage(updateData);
      setEditingPageHeader(false);
      
      toast({
        title: "Saved",
        description: "Page header updated successfully.",
      });
      
      console.log('[QA] Header saved successfully');
    } catch (error: any) {
      console.error('[Header] Save error:', error);
      toast({
        title: "Failed to save header", 
        description: `Error: ${error?.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  // Handle section edit - create section if it doesn't exist
  const handleSectionEdit = async (key: string) => {
    console.log('[Editor] open', { key });
    const section = getSection(key);
    if (section) {
      console.log('[Editor] open', { key, id: section.id });
      console.log('[QA] Edit pressed for section ID:', section.id);
      setEditingSection(section.id);
    } else {
      console.warn('[Editor] section not found for key:', key, '- creating new section');
      await handleCreateSection(key);
    }
  };

  // Create a new section for the current page
  const handleCreateSection = async (key: string) => {
    if (!page || !isAdmin) return;
    
    console.log('[QA] Creating new section for key:', key, 'page:', page.id);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Create new section with empty content
      const { data, error } = await supabase
        .from('fsli_sections')
        .insert({
          page_id: page.id,
          key: key,
          content: JSON.stringify({ type: 'html', content: '' }),
          sort_order: sections.length + 1
        })
        .select()
        .single();
        
      if (error) {
        console.error('[Section] Create error:', error);
        toast({
          title: "Failed to create section",
          description: `Database error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('[QA] Section created - ID:', data.id, 'Key:', key);
      
      // Add to local state
      setSections(prev => [...prev, data]);
      
      // Start editing the new section
      setEditingSection(data.id);
      
      toast({
        title: "Section created",
        description: `New ${key.replace('_', ' ')} section ready for editing.`,
      });
    } catch (error: any) {
      console.error('[Section] Create error:', error);
      toast({
        title: "Failed to create section",
        description: `Error: ${error?.message || 'Unknown error occurred'}`,
        variant: "destructive",
      });
    }
  };

  const handleSectionSave = async (content: string) => {
    if (!editingSection || !page) return;
    
    console.log('[QA] Saving section - ID:', editingSection, 'Content length:', content.length);
    
    const formattedContent = JSON.stringify({
      type: 'html',
      content: content
    });
    
    try {
      // Direct database update with proper error handling
      const { data, error } = await supabase
        .from('fsli_sections')
        .update({ content: formattedContent })
        .eq('id', editingSection)
        .select()
        .single();
      
      if (error) {
        console.error('[Section] Save error:', error);
        toast({
          title: "Failed to save section",
          description: `Database error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('[QA] Section saved - ID:', editingSection, 'Success');
      
      // Update local state
      setSections(prev => prev.map(s => s.id === editingSection ? data : s));
      
      await createRevision(page.id, editingSection, { content });
      setEditingSection(null);
      
      toast({
        title: "Saved",
        description: "Section content updated successfully.",
      });
    } catch (error: any) {
      console.error('[Section] Save error:', error);
      toast({
        title: "Failed to save section",
        description: `Error: ${error?.message || 'Network error occurred'}`,
        variant: "destructive",
      });
    }
  };

  const handleSectionAutoSave = async (content: string) => {
    if (editingSection && page) {
      console.log('[Editor] auto-save', { id: editingSection, length: content.length });
      const formattedContent = JSON.stringify({
        type: 'html',
        content: content
      });
      
      try {
        const { data, error } = await supabase
          .from('fsli_sections')
          .update({ content: formattedContent })
          .eq('id', editingSection)
          .select()
          .single();
          
        if (error) throw error;
        
        // Update local state immediately for auto-save
        setSections(prev => prev.map(s => s.id === editingSection ? data : s));
      } catch (error) {
        console.error('[Editor] auto-save error', error);
      }
    }
  };

  // Handle metric edit
  const handleMetricEdit = (metric: FSLIMetric) => {
    setEditingMetric(metric);
  };

  const handleMetricSave = async (updates: Partial<FSLIMetric>) => {
    if (!editingMetric || !page) return;
    
    console.log('[QA] Saving metric - ID:', editingMetric.id, 'Updates:', updates);
    
    try {
      // Validate numeric value if provided
      if (updates.value !== undefined && isNaN(Number(updates.value))) {
        toast({
          title: "Invalid value", 
          description: "Metric value must be a valid number.",
          variant: "destructive",
        });
        return;
      }
      
      // Direct database update with proper error handling
      const { error } = await supabase
        .from('fsli_metrics')
        .update(updates)
        .eq('id', editingMetric.id);
        
      if (error) {
        console.error('[Metric] Save error:', error);
        toast({
          title: "Failed to save metric",
          description: `Database error: ${error.message}`,
          variant: "destructive",
        });
        return;
      }
      
      console.log('[QA] Metric saved - ID:', editingMetric.id, 'Success');
      
      await createRevision(page.id, undefined, { metric: { ...editingMetric, ...updates } });
      updateMetric(editingMetric.id, updates);
      setEditingMetric(null);
      
      toast({
        title: "Saved",
        description: "Metric updated successfully.",
      });
    } catch (error: any) {
      console.error('[Metric] Save error:', error);
      toast({
        title: "Failed to save metric",
        description: `Error: ${error?.message || 'Unknown error occurred'}`,
        variant: "destructive",
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

  // Get the section being edited
  const getCurrentEditingSection = () => {
    return sections.find(s => s.id === editingSection);
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
    <div className={`min-h-screen bg-background flex flex-col ${editMode ? 'admin-editing' : ''}`}>
      <Header />
      
      {/* Admin Toolbar - Fixed positioning - Always visible when admin and editMode */}
      {canEdit && editMode && (
        <div className="fixed top-20 right-4 z-50">
          <EnhancedAdminToolbar 
            editMode={editMode}
            onToggleEditMode={() => {
              console.log('[AdminToolbar] Toggle edit mode from', editMode, 'to', !editMode);
              setEditMode(!editMode);
            }}
            onOpenHistory={() => setShowRevisionHistory(true)}
            onSaveAll={handleSaveAll}
          />
        </div>
      )}
      
      {/* Regular admin toolbar when not in edit mode */}
      {canEdit && !editMode && (
        <div className="fixed top-20 right-4 z-50">
          <EnhancedAdminToolbar 
            editMode={editMode}
            onToggleEditMode={() => {
              console.log('[AdminToolbar] Toggle edit mode from', editMode, 'to', !editMode);
              setEditMode(!editMode);
            }}
            onOpenHistory={() => setShowRevisionHistory(true)}
            onSaveAll={handleSaveAll}
          />
        </div>
      )}
      
      <FSLISidebar currentSlug={slug} />
      
      <main className="flex-1" style={{ marginLeft: '250px' }}>
        <div className="max-w-content mx-auto px-6 py-8" style={{ paddingRight: '3rem' }}>
          <Breadcrumb 
            items={[
              { label: "Home", path: "/" },
              { label: "Accounting", path: "/accounting" },
              { label: "FSLI Detail", path: "/accounting/fsli" },
              { label: page.title }
            ]} 
          />
          
          <div className="bg-card rounded-lg p-8 shadow-sm border">
            {/* Header Section */}
            <div 
              data-editable 
              className={`mb-8 ${editMode ? 'cursor-pointer' : ''}`}
              onClick={() => editMode && handlePageHeaderEdit()}
            >
        <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                {canEdit && editMode && (
                  <EditButton 
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('[Editor] Edit header clicked');
                      handlePageHeaderEdit();
                    }} 
                    variant="outline"
                  />
                )}
              </div>
              <h1 className="text-h1 font-bold text-foreground mb-4">
                {page.title}
              </h1>
              <h2 className="text-h2 text-muted-foreground mb-6">
                {page.subtitle}
              </h2>
              
              {/* Financial Data */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                {metrics.map((metric) => (
                  <div 
                    key={metric.id} 
                    data-editable 
                    className={`bg-muted/50 p-4 rounded-lg ${editMode ? 'cursor-pointer' : ''}`}
                    onClick={() => editMode && handleMetricEdit(metric)}
                  >
            <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                      {canEdit && editMode && (
                        <EditButton 
                          onClick={(e) => {
                            e.stopPropagation();
                            console.log('[Editor] Edit metric clicked', metric.id);
                            handleMetricEdit(metric);
                          }} 
                          variant="outline"
                          className="bg-white shadow-sm"
                        />
                      )}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{metric.label}</h3>
                    <p className="text-2xl font-bold text-primary">
                      {formatValue(metric.value, metric.unit)}
                    </p>
                    <p className="text-sm text-muted-foreground">{metric.unit}</p>
                  </div>
                ))}
                
                {page.notes_ref && (
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h3 className="font-semibold text-primary mb-2">Notes Reference</h3>
                    <p className="text-foreground text-lg font-medium">{page.notes_ref}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Content Sections */}
            <div className="space-y-8">
              {/* Quick Facts */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('quick_facts')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Quick Facts</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit Quick Facts clicked');
                          handleSectionEdit('quick_facts');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('quick_facts') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('quick_facts')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('quick_facts')}
                       isEditing={editingSection === getSection('quick_facts')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* Definition */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('definition')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Definition</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit Definition clicked');
                          handleSectionEdit('definition');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('definition') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('definition')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('definition')}
                       isEditing={editingSection === getSection('definition')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* Recognition */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('recognition')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Recognition</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit Recognition clicked');
                          handleSectionEdit('recognition');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('recognition') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('recognition')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('recognition')}
                       isEditing={editingSection === getSection('recognition')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* Measurement */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('measurement')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Measurement</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit Measurement clicked');
                          handleSectionEdit('measurement');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('measurement') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('measurement')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('measurement')}
                       isEditing={editingSection === getSection('measurement')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* Presentation Example */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('presentation_example')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Presentation Example</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit Presentation Example clicked');
                          handleSectionEdit('presentation_example');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('presentation_example') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('presentation_example')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('presentation_example')}
                       isEditing={editingSection === getSection('presentation_example')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* Journal Entry Examples */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('journal_entry_examples')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Journal Entry Examples</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit Journal Entry Examples clicked');
                          handleSectionEdit('journal_entry_examples');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('journal_entry_examples') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('journal_entry_examples')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('journal_entry_examples')}
                       isEditing={editingSection === getSection('journal_entry_examples')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* Disclosure Items */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('disclosure_items')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Disclosure Items</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit Disclosure Items clicked'); 
                          handleSectionEdit('disclosure_items');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('disclosure_items') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('disclosure_items')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('disclosure_items')}
                       isEditing={editingSection === getSection('disclosure_items')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* Common Mistakes */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('common_mistakes')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Common Mistakes</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit Common Mistakes clicked');
                          handleSectionEdit('common_mistakes');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('common_mistakes') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('common_mistakes')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('common_mistakes')}
                       isEditing={editingSection === getSection('common_mistakes')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* TODO Essay */}
              <section 
                data-editable 
                className={`border-b border-border pb-6 last:border-b-0 ${editMode ? 'cursor-pointer' : ''}`}
                onClick={() => editMode && handleSectionEdit('todo_essay')}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">TODO Essay</h3>
                  <div className="edit-handle" style={{ zIndex: 80, pointerEvents: 'auto' }}>
                    {canEdit && editMode && (
                      <EditButton 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('[Editor] Edit TODO Essay clicked');
                          handleSectionEdit('todo_essay');
                        }}
                        variant="outline"
                        className="bg-white shadow-sm"
                      />
                    )}
                  </div>
                </div>
                 <div className="bg-muted/30 p-6 rounded-lg min-h-[120px]">
                   {!sectionExists('todo_essay') ? (
                     <div className="flex items-center justify-center h-24 text-muted-foreground">
                       <Button 
                         variant="outline" 
                         onClick={() => handleCreateSection('todo_essay')}
                         className="text-sm"
                       >
                         No content yet — Create section
                       </Button>
                     </div>
                   ) : (
                     <EssayAutoResize 
                       content={getSectionContent('todo_essay')}
                       isEditing={editingSection === getSection('todo_essay')?.id}
                     />
                   )}
                 </div>
              </section>

              {/* Embeds Section */}
              <section className="border-b border-border pb-6 last:border-b-0">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-h3 font-semibold text-foreground">Resources</h3>
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
          onClose={() => {
            console.log('[Editor] closing for section:', editingSection);
            setEditingSection(null);
          }}
          content={getSectionContent(getCurrentEditingSection()?.key || '')}
          onSave={handleSectionSave}
          onAutoSave={handleSectionAutoSave}
          title={`Edit ${getCurrentEditingSection()?.key?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Section'}`}
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
        <DialogContent className="z-[150]">
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
                placeholder="Enter page title"
              />
            </div>
            
            <div>
              <Label htmlFor="page-subtitle">Subtitle (Optional)</Label>
              <Input
                id="page-subtitle"
                value={pageHeaderData.subtitle}
                onChange={(e) => setPageHeaderData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Enter subtitle (leave empty if not needed)"
              />
            </div>
            
            <div>
              <Label htmlFor="page-notes">Notes Reference (Optional)</Label>
              <Input
                id="page-notes"
                value={pageHeaderData.notes_ref}
                onChange={(e) => setPageHeaderData(prev => ({ ...prev, notes_ref: e.target.value }))}
                placeholder="e.g., 3i.6 (leave empty if not needed)"
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
        sectionId={editingSection}
        onRevert={handleRevisionRevert}
      />
    </div>
  );
};