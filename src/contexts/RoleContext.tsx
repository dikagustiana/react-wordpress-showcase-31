import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthRole } from '@/hooks/useAuthRole';

interface RoleContextType {
  role: 'admin' | 'editor' | 'viewer' | null;
  isAdmin: boolean;
  loading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { role, isAdmin, loading } = useAuthRole();
  
  // Debug logging
  React.useEffect(() => {
    console.log('[RoleContext] role=', role, 'isAdmin=', isAdmin, 'loading=', loading);
    console.log('[QA] App started - User role:', role || 'Not authenticated');
  }, [role, isAdmin, loading]);

  return (
    <RoleContext.Provider value={{ role, isAdmin, loading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};