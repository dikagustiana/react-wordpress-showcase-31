import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { X, AlertTriangle } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onDismiss: () => void;
}

const ErrorBanner = ({ message, onDismiss }: ErrorBannerProps) => {
  return (
    <Alert variant="destructive" className="mx-6 mt-4">
      <AlertTriangle className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <span>{message}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDismiss}
          className="h-auto p-1 hover:bg-destructive/20"
        >
          <X className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default ErrorBanner;