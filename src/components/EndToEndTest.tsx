import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { useAuthRole } from '@/hooks/useAuthRole';
import { createEssayAPI } from '@/pages/api/essays';
import { supabase } from '@/integrations/supabase/client';
import { logDiagnostic, showSuccess, showError } from '@/utils/diagnostics';

interface TestStep {
  name: string;
  status: 'pending' | 'running' | 'success' | 'error';
  message: string;
  details?: any;
}

export const EndToEndTest: React.FC = () => {
  const { isAdmin, user } = useAuthRole();
  const [testing, setTesting] = useState(false);
  const [steps, setSteps] = useState<TestStep[]>([]);

  const runEndToEndTest = async () => {
    if (!user?.email) {
      showError('Authentication required', 'Please log in to run end-to-end test');
      return;
    }

    setTesting(true);
    const testSteps: TestStep[] = [
      { name: 'Verify User Role', status: 'pending', message: 'Checking user permissions...' },
      { name: 'Test RLS Helper Function', status: 'pending', message: 'Testing is_admin_or_editor function...' },
      { name: 'Create Test Essay', status: 'pending', message: 'Creating new essay...' },
      { name: 'Verify Essay Creation', status: 'pending', message: 'Checking if essay was created...' },
      { name: 'Clean Up', status: 'pending', message: 'Removing test essay...' }
    ];
    
    setSteps([...testSteps]);
    logDiagnostic('end_to_end_test:start', { userEmail: user.email });

    try {
      // Step 1: Verify User Role
      testSteps[0].status = 'running';
      setSteps([...testSteps]);
      
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) throw new Error('Not authenticated');
      
      testSteps[0] = {
        name: 'Verify User Role',
        status: 'success',
        message: `User authenticated: ${currentUser.email}`,
        details: { userId: currentUser.id, email: currentUser.email }
      };
      setSteps([...testSteps]);

      // Step 2: Test RLS Helper Function
      testSteps[1].status = 'running';
      setSteps([...testSteps]);
      
      const { data: isAdminEditor, error: roleError } = await supabase.rpc('is_admin_or_editor', {
        uid: currentUser.id
      });

      if (roleError) throw roleError;
      
      testSteps[1] = {
        name: 'Test RLS Helper Function',
        status: isAdminEditor ? 'success' : 'error',
        message: isAdminEditor 
          ? 'User has Admin/Editor permissions' 
          : 'User does not have Admin/Editor permissions - cannot continue',
        details: { isAdminEditor, userId: currentUser.id }
      };
      setSteps([...testSteps]);

      if (!isAdminEditor) {
        throw new Error('User does not have Admin or Editor role - cannot test essay creation');
      }

      // Step 3: Create Test Essay
      testSteps[2].status = 'running';
      setSteps([...testSteps]);
      
      const testEssayResponse = await createEssayAPI({
        section: 'where-we-are-now',
        title: 'End-to-End Test Essay',
        author: user.email?.split('@')[0] || 'Test User',
        created_by: user.email
      });

      if (!testEssayResponse.success || !testEssayResponse.id) {
        throw new Error(testEssayResponse.error || 'Failed to create essay');
      }

      testSteps[2] = {
        name: 'Create Test Essay',
        status: 'success',
        message: `Essay created successfully: ${testEssayResponse.slug}`,
        details: { 
          essayId: testEssayResponse.id, 
          slug: testEssayResponse.slug,
          path: testEssayResponse.path
        }
      };
      setSteps([...testSteps]);

      // Step 4: Verify Essay Creation
      testSteps[3].status = 'running';
      setSteps([...testSteps]);
      
      const { data: createdEssay, error: verifyError } = await supabase
        .from('green_essays')
        .select('*')
        .eq('id', testEssayResponse.id)
        .single();

      if (verifyError) throw verifyError;
      
      testSteps[3] = {
        name: 'Verify Essay Creation',
        status: 'success',
        message: `Essay verified in database: ${createdEssay.title}`,
        details: { 
          title: createdEssay.title,
          status: createdEssay.status,
          section: createdEssay.section,
          createdAt: createdEssay.created_at
        }
      };
      setSteps([...testSteps]);

      // Step 5: Clean Up
      testSteps[4].status = 'running';
      setSteps([...testSteps]);
      
      const { error: deleteError } = await supabase
        .from('green_essays')
        .delete()
        .eq('id', testEssayResponse.id);

      if (deleteError) throw deleteError;
      
      testSteps[4] = {
        name: 'Clean Up',
        status: 'success',
        message: 'Test essay removed successfully',
        details: { cleanedUpEssayId: testEssayResponse.id }
      };
      setSteps([...testSteps]);

      logDiagnostic('end_to_end_test:success', { 
        userEmail: user.email,
        testEssayId: testEssayResponse.id 
      });

      showSuccess(
        'End-to-End Test Passed!',
        'All essay creation functionality is working correctly.'
      );

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      // Mark current running step as failed
      const runningStepIndex = testSteps.findIndex(step => step.status === 'running');
      if (runningStepIndex !== -1) {
        testSteps[runningStepIndex] = {
          ...testSteps[runningStepIndex],
          status: 'error',
          message: `Failed: ${errorMessage}`,
          details: error
        };
        setSteps([...testSteps]);
      }

      logDiagnostic('end_to_end_test:error', { 
        userEmail: user.email,
        error: errorMessage,
        failedStep: runningStepIndex
      }, 'error');

      showError('End-to-End Test Failed', errorMessage);
    } finally {
      setTesting(false);
    }
  };

  const getStatusIcon = (status: TestStep['status']) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'running':
        return <AlertCircle className="h-4 w-4 text-blue-600 animate-pulse" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: TestStep['status']) => {
    const variants = {
      success: 'default' as const,
      error: 'destructive' as const,
      running: 'secondary' as const,
      pending: 'outline' as const
    };

    const labels = {
      success: 'SUCCESS',
      error: 'ERROR',
      running: 'RUNNING',
      pending: 'PENDING'
    };

    return (
      <Badge variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  };

  if (!isAdmin) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Access Denied</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            End-to-end testing requires Admin privileges.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>End-to-End Test: Essay Creation Workflow</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            This test verifies the complete essay creation workflow including authentication, 
            RLS policies, and database operations.
          </p>
          
          <Button 
            onClick={runEndToEndTest} 
            disabled={testing}
            className="flex items-center gap-2"
          >
            <PlayCircle className={`h-4 w-4 ${testing ? 'animate-pulse' : ''}`} />
            {testing ? 'Running Test...' : 'Start End-to-End Test'}
          </Button>
        </CardContent>
      </Card>

      {steps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(step.status)}
                    <div>
                      <h4 className="font-medium">{step.name}</h4>
                      <p className="text-sm text-muted-foreground">{step.message}</p>
                    </div>
                  </div>
                  {getStatusBadge(step.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EndToEndTest;