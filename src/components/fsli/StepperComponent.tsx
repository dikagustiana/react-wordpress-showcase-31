import React, { useState } from 'react';
import { useRole } from '@/contexts/RoleContext';
import { InlineEditor } from '@/components/inline/InlineEditor';
import { Button } from '@/components/ui/button';
import { Check, Circle, Plus, Trash2, ExternalLink } from 'lucide-react';

interface StepItem {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'active' | 'upcoming';
  exampleLink?: string;
}

interface StepperComponentProps {
  id: string;
  pageKey: string;
  steps?: StepItem[];
  onStepsChange?: (steps: StepItem[]) => void;
  className?: string;
}

export const StepperComponent: React.FC<StepperComponentProps> = ({
  id,
  pageKey,
  steps = [],
  onStepsChange,
  className = ""
}) => {
  const { isAdmin } = useRole();
  const [stepItems, setStepItems] = useState<StepItem[]>(steps);

  const addStep = () => {
    const newStep: StepItem = {
      id: `step_${Date.now()}`,
      title: '',
      description: '',
      status: 'upcoming',
      exampleLink: ''
    };
    const updatedSteps = [...stepItems, newStep];
    setStepItems(updatedSteps);
    onStepsChange?.(updatedSteps);
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = stepItems.filter(step => step.id !== stepId);
    setStepItems(updatedSteps);
    onStepsChange?.(updatedSteps);
  };

  const updateStepStatus = (stepId: string, status: StepItem['status']) => {
    const updatedSteps = stepItems.map(step =>
      step.id === stepId ? { ...step, status } : step
    );
    setStepItems(updatedSteps);
    onStepsChange?.(updatedSteps);
  };

  const getStepIcon = (status: StepItem['status'], stepNumber: number) => {
    switch (status) {
      case 'completed':
        return (
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
            <Check className="h-4 w-4" />
          </div>
        );
      case 'active':
        return (
          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold">
            {stepNumber}
          </div>
        );
      case 'upcoming':
        return (
          <div className="w-8 h-8 border-2 border-muted-foreground rounded-full flex items-center justify-center">
            <Circle className="h-4 w-4 text-muted-foreground" />
          </div>
        );
    }
  };

  const getConnectorColor = (currentStatus: StepItem['status'], nextStatus?: StepItem['status']) => {
    if (currentStatus === 'completed') return 'bg-primary';
    if (currentStatus === 'active' && nextStatus) return 'bg-muted';
    return 'bg-muted';
  };

  return (
    <div className={`${className}`}>
      <div className="relative">
        {stepItems.map((step, index) => (
          <div key={step.id} className="relative flex items-start pb-8 last:pb-0">
            {/* Connector Line */}
            {index < stepItems.length - 1 && (
              <div className="absolute left-4 top-8 w-0.5 h-8 -ml-px">
                <div className={`w-full h-full ${getConnectorColor(step.status, stepItems[index + 1]?.status)}`} />
              </div>
            )}

            {/* Step Icon */}
            <div className="relative flex-shrink-0 mr-4">
              {getStepIcon(step.status, index + 1)}
            </div>

            {/* Step Content */}
            <div className="flex-1 min-w-0 pb-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  {/* Step Title */}
                  <h4 className="text-base font-semibold mb-1">
                    <InlineEditor
                      pageKey={pageKey}
                      sectionKey={`${id}_step_${step.id}_title`}
                      placeholder="Step title..."
                      className="outline-none"
                    />
                  </h4>

                  {/* Step Description */}
                  <div className="text-sm text-muted-foreground mb-2">
                    <InlineEditor
                      pageKey={pageKey}
                      sectionKey={`${id}_step_${step.id}_description`}
                      placeholder="Step description..."
                      className="outline-none"
                    />
                  </div>

                  {/* Example Link */}
                  <div className="flex items-center gap-2">
                    <InlineEditor
                      pageKey={pageKey}
                      sectionKey={`${id}_step_${step.id}_link`}
                      placeholder="Link to example..."
                      className="text-sm text-primary"
                    />
                    {step.exampleLink && (
                      <Button
                        variant="ghost"
                        size="sm"
                        asChild
                        className="p-1 h-auto"
                      >
                        <a href={step.exampleLink} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Admin Controls */}
                {isAdmin && (
                  <div className="flex items-center gap-1 ml-4">
                    {/* Status Toggle */}
                    <select
                      value={step.status}
                      onChange={(e) => updateStepStatus(step.id, e.target.value as StepItem['status'])}
                      className="text-xs border border-border rounded px-2 py-1 bg-background"
                    >
                      <option value="upcoming">Upcoming</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>

                    {/* Remove Step */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeStep(step.id)}
                      className="text-destructive hover:text-destructive p-1 h-auto"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Step Button */}
      {isAdmin && (
        <Button
          variant="outline"
          onClick={addStep}
          className="w-full border-dashed mt-4"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Step
        </Button>
      )}
    </div>
  );
};