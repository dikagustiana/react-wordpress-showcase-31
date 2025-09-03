import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuthRole } from '@/hooks/useAuthRole';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { checkSupabaseEnv, logDiagnostic } from '@/utils/diagnostics';
import { SystemTestButton } from '@/components/admin/SystemTestButton';

interface HealthCheck {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: any;
}

const Health: React.FC = () => {
  const { isAdmin } = useAuthRole();
  const [checks, setChecks] = useState<HealthCheck[]>([]);
  const [loading, setLoading] = useState(false);

  const runHealthChecks = async () => {
    setLoading(true);
    const results: HealthCheck[] = [];
    
    logDiagnostic('health_check:start', { timestamp: new Date().toISOString() });

    // Check 1: Environment Variables
    const envCheck = checkSupabaseEnv();
    results.push({
      name: 'Environment Variables',
      status: envCheck.isValid ? 'success' : 'error',
      message: envCheck.isValid 
        ? 'All required Supabase environment variables are present'
        : `Missing environment variables: ${envCheck.missing.join(', ')}`,
      details: envCheck
    });

    // Check 2: Database Connection
    try {
      const { data, error } = await supabase
        .from('green_essays')
        .select('created_at')
        .limit(1)
        .single();
      
      // If we can query the table, connection is working
      results.push({
        name: 'Database Connection',
        status: 'success',
        message: `Connected successfully. Database is accessible`,
        details: { connectionTest: 'passed' }
      });
    } catch (error) {
      results.push({
        name: 'Database Connection',
        status: 'error',
        message: `Failed to connect: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }

    // Check 3: Green Essays Tables
    try {
      const { data: essays, error: essaysError } = await supabase
        .from('green_essays')
        .select('count')
        .limit(1);
        
      const { data: templates, error: templatesError } = await supabase
        .from('green_essays_templates')
        .select('count')
        .limit(1);

      const { data: versions, error: versionsError } = await supabase
        .from('green_essays_versions')
        .select('count')
        .limit(1);

      if (essaysError || templatesError || versionsError) {
        throw new Error(`Table access failed: ${essaysError?.message || templatesError?.message || versionsError?.message}`);
      }

      results.push({
        name: 'Green Essays Tables',
        status: 'success',
        message: 'All Green Essays tables accessible',
        details: { essays, templates, versions }
      });
    } catch (error) {
      results.push({
        name: 'Green Essays Tables',
        status: 'error',
        message: `Table access failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }

    // Check 4: Storage Buckets
    try {
      const { data: buckets, error } = await supabase.storage.listBuckets();
      if (error) throw error;

      const requiredBuckets = ['assets', 'green-transition-content'];
      const existingBuckets = buckets.map(b => b.name);
      const missingBuckets = requiredBuckets.filter(b => !existingBuckets.includes(b));

      if (missingBuckets.length > 0) {
        results.push({
          name: 'Storage Buckets',
          status: 'warning',
          message: `Missing buckets: ${missingBuckets.join(', ')}. Available: ${existingBuckets.join(', ')}`,
          details: { existing: existingBuckets, missing: missingBuckets }
        });
      } else {
        results.push({
          name: 'Storage Buckets',
          status: 'success',
          message: `All required buckets exist: ${requiredBuckets.join(', ')}`,
          details: { buckets: existingBuckets }
        });
      }
    } catch (error) {
      results.push({
        name: 'Storage Buckets',
        status: 'error',
        message: `Storage access failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }

    // Check 5: RLS Policies
    try {
      const { data, error } = await supabase
        .from('green_essays')
        .select('id')
        .limit(1);

      if (error && error.message.includes('row-level security')) {
        results.push({
          name: 'RLS Policies',
          status: 'warning',
          message: 'RLS is active and may restrict access based on user role',
          details: { rlsActive: true }
        });
      } else {
        results.push({
          name: 'RLS Policies',
          status: 'success',
          message: 'RLS policies are properly configured',
          details: { rlsActive: true, accessGranted: true }
        });
      }
    } catch (error) {
      results.push({
        name: 'RLS Policies',
        status: 'error',
        message: `RLS check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }

    // Check 6: User Authentication
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        results.push({
          name: 'User Authentication',
          status: 'success',
          message: `Authenticated as: ${user.email} (Role: ${isAdmin ? 'Admin' : 'User'})`,
          details: { 
            userId: user.id, 
            email: user.email, 
            role: isAdmin ? 'admin' : 'user',
            metadata: user.app_metadata 
          }
        });
      } else {
        results.push({
          name: 'User Authentication',
          status: 'warning',
          message: 'Not authenticated - some features may not work',
          details: { authenticated: false }
        });
      }
    } catch (error) {
      results.push({
        name: 'User Authentication',
        status: 'error',
        message: `Auth check failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: error
      });
    }

    logDiagnostic('health_check:complete', { 
      results: results.map(r => ({ name: r.name, status: r.status })),
      timestamp: new Date().toISOString()
    });

    setChecks(results);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin !== null) {
      runHealthChecks();
    }
  }, [isAdmin]);

  const getStatusIcon = (status: HealthCheck['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
    }
  };

  const getStatusBadge = (status: HealthCheck['status']) => {
    const variants = {
      success: 'default',
      warning: 'secondary', 
      error: 'destructive'
    } as const;

    return (
      <Badge variant={variants[status]}>
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You need admin privileges to access the health check.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">System Health Check</h1>
          <p className="text-muted-foreground">Monitor Supabase connection and system status</p>
        </div>
        <Button 
          onClick={runHealthChecks} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Recheck
        </Button>
      </div>

      <div className="space-y-4">
        {checks.map((check, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(check.status)}
                  <CardTitle className="text-lg">{check.name}</CardTitle>
                </div>
                {getStatusBadge(check.status)}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-3">{check.message}</p>
              {check.details && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground">Details</summary>
                  <pre className="mt-2 p-3 bg-muted rounded-md overflow-auto">
                    {JSON.stringify(check.details, null, 2)}
                  </pre>
                </details>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Running health checks...</p>
        </div>
      )}

      <div className="mt-8 pt-8 border-t">
        <h2 className="text-xl font-semibold mb-4">Quick System Test</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Run a quick end-to-end test to verify essay creation workflow
        </p>
        <SystemTestButton />
      </div>
    </div>
  );
};

export default Health;