import React, { useState } from 'react';
import { InlineEditor } from '@/components/inline/InlineEditor';
import { useRole } from '@/contexts/RoleContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, ExternalLink } from 'lucide-react';

interface IssueItem {
  id: string;
  title: string;
  standardRef: string;
  exampleLink: string;
}

interface IssueCardProps {
  id: string;
  pageKey: string;
  items?: IssueItem[];
  onItemsChange?: (items: IssueItem[]) => void;
  className?: string;
}

export const IssueCard: React.FC<IssueCardProps> = ({
  id,
  pageKey,
  items = [],
  onItemsChange,
  className = ""
}) => {
  const { isAdmin } = useRole();
  const [issueItems, setIssueItems] = useState<IssueItem[]>(items);

  const addItem = () => {
    const newItem: IssueItem = {
      id: `issue_${Date.now()}`,
      title: '',
      standardRef: '',
      exampleLink: ''
    };
    const updatedItems = [...issueItems, newItem];
    setIssueItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = issueItems.filter(item => item.id !== itemId);
    setIssueItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  const updateItem = (itemId: string, field: keyof IssueItem, value: string) => {
    const updatedItems = issueItems.map(item =>
      item.id === itemId ? { ...item, [field]: value } : item
    );
    setIssueItems(updatedItems);
    onItemsChange?.(updatedItems);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {issueItems.map((item, index) => (
        <Card key={item.id} className="relative">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
              {/* Title */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Issue Title
                </label>
                <InlineEditor
                  pageKey={pageKey}
                  sectionKey={`${id}_item_${item.id}_title`}
                  placeholder="Short issue description..."
                  className="text-sm font-medium"
                />
              </div>

              {/* Standard Reference */}
              <div>
                <label className="text-xs font-medium text-muted-foreground mb-1 block">
                  Standard Reference
                </label>
                <InlineEditor
                  pageKey={pageKey}
                  sectionKey={`${id}_item_${item.id}_ref`}
                  placeholder="IAS 7, paragraph X"
                  className="text-sm text-muted-foreground"
                />
              </div>

              {/* Example Link */}
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    Example Link
                  </label>
                  <InlineEditor
                    pageKey={pageKey}
                    sectionKey={`${id}_item_${item.id}_link`}
                    placeholder="Link to example..."
                    className="text-sm"
                  />
                </div>
                {item.exampleLink && (
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    className="flex-shrink-0"
                  >
                    <a href={item.exampleLink} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                )}
              </div>
            </div>

            {/* Admin Controls */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeItem(item.id)}
                className="absolute top-2 right-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Add Item Button */}
      {isAdmin && (
        <Button
          variant="outline"
          onClick={addItem}
          className="w-full border-dashed"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Issue Card
        </Button>
      )}
    </div>
  );
};