/**
 * Diagnostic utilities for error handling and API debugging
 */

import { toast } from '@/hooks/use-toast';

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: any;
}

/**
 * Enhanced fetch wrapper with comprehensive error handling and logging
 */
export async function diagnosticFetch(
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> {
  const startTime = Date.now();
  
  // Log request start
  console.log(`[API:${endpoint}] Starting request`, {
    method: options.method || 'GET',
    body: options.body,
    timestamp: new Date().toISOString()
  });

  try {
    const response = await fetch(endpoint, options);
    const duration = Date.now() - startTime;
    
    // Log response
    console.log(`[API:${endpoint}] Response received`, {
      status: response.status,
      ok: response.ok,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    if (!response.ok) {
      let errorData: any = {};
      try {
        errorData = await response.clone().json();
      } catch {
        errorData = { message: 'Failed to parse error response' };
      }

      const apiError: ApiError = {
        message: errorData.message || errorData.error || `HTTP ${response.status}`,
        code: errorData.code,
        status: response.status,
        details: errorData
      };

      console.error(`[API:${endpoint}] Request failed`, apiError);
      throw new Error(apiError.message);
    }

    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error(`[API:${endpoint}] Request error`, {
      error: error instanceof Error ? error.message : 'Unknown error',
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });

    throw error;
  }
}

/**
 * Enhanced Supabase error handler with detailed logging and user-friendly messages
 */
export function handleSupabaseError(
  error: any,
  operation: string,
  context?: Record<string, any>
): void {
  console.error(`[Supabase:${operation}] Operation failed`, {
    error: error,
    message: error?.message,
    code: error?.code,
    details: error?.details,
    hint: error?.hint,
    context,
    timestamp: new Date().toISOString()
  });

  // Map common Supabase errors to user-friendly messages
  let userMessage = 'An unexpected error occurred';
  
  if (error?.code === '42501') {
    userMessage = 'Permission denied - insufficient privileges';
  } else if (error?.code === '23505') {
    userMessage = 'Data already exists';
  } else if (error?.code === '23503') {
    userMessage = 'Referenced data not found';
  } else if (error?.message?.includes('JWT')) {
    userMessage = 'Authentication expired - please log in again';
  } else if (error?.message?.includes('row-level security')) {
    userMessage = 'Access denied - you do not have permission for this action';
  } else if (error?.message) {
    userMessage = error.message;
  }

  toast({
    title: `Error: ${operation}`,
    description: userMessage,
    variant: "destructive"
  });
}

/**
 * Log diagnostic information for debugging
 */
export function logDiagnostic(
  operation: string,
  data?: any,
  level: 'info' | 'warn' | 'error' = 'info'
): void {
  const logEntry = {
    operation,
    data,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    url: window.location.href
  };

  switch (level) {
    case 'error':
      console.error(`[DIAGNOSTIC:${operation}]`, logEntry);
      break;
    case 'warn':
      console.warn(`[DIAGNOSTIC:${operation}]`, logEntry);
      break;
    default:
      console.log(`[DIAGNOSTIC:${operation}]`, logEntry);
  }
}

/**
 * Check if Supabase environment variables are properly configured
 */
export function checkSupabaseEnv(): { isValid: boolean; missing: string[] } {
  const requiredEnvs = [
    'VITE_SUPABASE_URL',
    'VITE_SUPABASE_PUBLISHABLE_KEY'
  ];

  const missing: string[] = [];
  
  requiredEnvs.forEach(env => {
    const value = import.meta.env[env];
    if (!value || value === '' || value === 'undefined') {
      missing.push(env);
    }
  });

  return {
    isValid: missing.length === 0,
    missing
  };
}

/**
 * Show success message with consistent styling
 */
export function showSuccess(title: string, description?: string): void {
  toast({
    title,
    description,
    variant: "default"
  });
}

/**
 * Show error message with enhanced details
 */
export function showError(title: string, error: any, context?: string): void {
  let description = 'An unexpected error occurred';
  
  if (error instanceof Error) {
    description = error.message;
  } else if (typeof error === 'string') {
    description = error;
  } else if (error?.message) {
    description = error.message;
  }

  if (context) {
    description = `${context}: ${description}`;
  }

  toast({
    title: `Error: ${title}`,
    description,
    variant: "destructive"
  });
}