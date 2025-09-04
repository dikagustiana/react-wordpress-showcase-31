import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlayCircle, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';
import { createEssayAPI } from '@/pages/api/essays';
import { supabase } from '@/integrations/supabase/client';
import { logDiagnostic, showSuccess, showError } from '@/utils/diagnostics';
import { useToast } from '@/hooks/use-toast';

interface TestResult {
  name: string;
  status: 'pending' | 'success' | 'error';
  message: string;
}

export const SystemTestButton: React.FC = () => {
  const { isAdmin, user } = useAuthRole();
  const { toast } = useToast();
  const [testing, setTesting] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);

  const runEndToEndTest = async () => {
    if (!user?.email) {
      showError('Authentication required', 'Please log in to run system tests');
      return;
    }

    setTesting(true);
    const testResults: TestResult[] = [];
    
    logDiagnostic('system_test:start', { userEmail: user.email });

    // Test 1: Database Connection
    testResults.push({ name: 'Database Connection', status: 'pending', message: 'Testing...' });
    setResults([...testResults]);

    try {
      const { data, error } = await supabase.from('green_essays').select('id').limit(1);
      if (error) throw error;
      
      testResults[0] = { 
        name: 'Database Connection', 
        status: 'success', 
        message: 'Database accessible' 
      };
    } catch (error) {
      testResults[0] = { 
        name: 'Database Connection', 
        status: 'error', 
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...testResults]);

    // Test 2: Template Access
    testResults.push({ name: 'Template Access', status: 'pending', message: 'Testing...' });
    setResults([...testResults]);

    try {
      const { data, error } = await supabase
        .from('green_essays_templates')
        .select('*')
        .eq('section', 'where-we-are-now')
        .single();
        
      if (error) throw error;
      
      testResults[1] = { 
        name: 'Template Access', 
        status: 'success', 
        message: `Template found: ${data.title_template}` 
      };
    } catch (error) {
      testResults[1] = { 
        name: 'Template Access', 
        status: 'error', 
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...testResults]);

    // Test 3: Role Function Test
    testResults.push({ name: 'Role Function Test', status: 'pending', message: 'Testing...' });
    setResults([...testResults]);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) throw new Error('User not authenticated');
      
      const { data: isAdminEditor, error: roleError } = await supabase.rpc('is_admin_or_editor', {
        uid: user.id
      });

      if (roleError) throw roleError;
      
      testResults[2] = { 
        name: 'Role Function Test', 
        status: 'success', 
        message: `Role function working. User is ${isAdminEditor ? 'Admin/Editor' : 'Viewer'}` 
      };
    } catch (error) {
      testResults[2] = { 
        name: 'Role Function Test', 
        status: 'error', 
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...testResults]);

    // Test 4: Essay Creation API
    testResults.push({ name: 'Essay Creation API', status: 'pending', message: 'Testing...' });
    setResults([...testResults]);

    try {
      const response = await createEssayAPI({
        section: 'where-we-are-now',
        title: 'System Test Essay',
        author: user.email?.split('@')[0] || 'System',
        created_by: user.email
      });

      if (response.success && response.id) {
        testResults[3] = { 
          name: 'Essay Creation API', 
          status: 'success', 
          message: `Essay created: ${response.slug}` 
        };
        
        // Clean up test essay
        await supabase.from('green_essays').delete().eq('id', response.id);
      } else {
        testResults[3] = { 
          name: 'Essay Creation API', 
          status: 'error', 
          message: response.error || 'Unknown error' 
        };
      }
    } catch (error) {
      testResults[3] = { 
        name: 'Essay Creation API', 
        status: 'error', 
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...testResults]);

    // Test 5: Storage Access
    testResults.push({ name: 'Storage Access', status: 'pending', message: 'Testing...' });
    setResults([...testResults]);

    try {
      const { data, error } = await supabase.storage.listBuckets();
      if (error) throw error;
      
      const bucketNames = data.map(b => b.name);
      const hasRequired = ['assets', 'green-transition-content'].every(name => 
        bucketNames.includes(name)
      );
      
      if (hasRequired) {
        testResults[4] = { 
          name: 'Storage Access', 
          status: 'success', 
          message: `All buckets available: ${bucketNames.join(', ')}` 
        };
      } else {
        testResults[4] = { 
          name: 'Storage Access', 
          status: 'error', 
          message: `Missing required buckets` 
        };
      }
    } catch (error) {
      testResults[4] = { 
        name: 'Storage Access', 
        status: 'error', 
        message: `Failed: ${error instanceof Error ? error.message : 'Unknown error'}` 
      };
    }
    setResults([...testResults]);

    // Test Summary
    const successCount = testResults.filter(r => r.status === 'success').length;
    const totalTests = testResults.length;
    
    logDiagnostic('system_test:complete', { 
      successCount, 
      totalTests,
      results: testResults 
    });

    if (successCount === totalTests) {
      showSuccess(
        'All Tests Passed!', 
        `System is ready. ${successCount}/${totalTests} tests successful.`
      );
    } else {
      toast({
        title: 'Some Tests Failed',
        description: `${successCount}/${totalTests} tests passed. Check results below.`,
        variant: 'destructive'
      });
    }

    setTesting(false);
  };

  if (!isAdmin) {
    return null;
  }

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-yellow-600 animate-pulse" />;
    }
  };

  return (
    <div className="space-y-4">
      <Button 
        onClick={runEndToEndTest} 
        disabled={testing}
        className="flex items-center gap-2"
      >
        <PlayCircle className={`h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
        {testing ? 'Running Tests...' : 'Run System Test'}
      </Button>

      {results.length > 0 && (
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Test Results:</h4>
          {results.map((result, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              {getStatusIcon(result.status)}
              <span className="font-medium">{result.name}:</span>
              <span className="text-muted-foreground">{result.message}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};