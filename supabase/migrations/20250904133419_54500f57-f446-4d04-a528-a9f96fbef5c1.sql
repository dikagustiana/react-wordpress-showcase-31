-- Security Fix Phase 2: Remove remaining overly permissive policies

-- 1. Fix ops_edit_log - remove the policy that allows public access to user emails
DROP POLICY IF EXISTS "oel_select_all" ON public.ops_edit_log;

-- 2. Fix green_essays - remove the overly broad ge_select_all policy
-- Keep only the restrictive policy that checks publication status
DROP POLICY IF EXISTS "ge_select_all" ON public.green_essays;