import React, { createContext, useContext, useState, ReactNode } from 'react';

interface GreenTransitionEditContextType {
  editingEssayId: string | null;
  setEditingEssayId: (id: string | null) => void;
  isEditing: (essayId: string) => boolean;
}

const GreenTransitionEditContext = createContext<GreenTransitionEditContextType | undefined>(undefined);

export const GreenTransitionEditProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editingEssayId, setEditingEssayId] = useState<string | null>(null);

  const isEditing = (essayId: string) => editingEssayId === essayId;

  return (
    <GreenTransitionEditContext.Provider value={{
      editingEssayId,
      setEditingEssayId,
      isEditing,
    }}>
      {children}
    </GreenTransitionEditContext.Provider>
  );
};

export const useGreenTransitionEdit = (): GreenTransitionEditContextType => {
  const context = useContext(GreenTransitionEditContext);
  if (context === undefined) {
    throw new Error('useGreenTransitionEdit must be used within a GreenTransitionEditProvider');
  }
  return context;
};