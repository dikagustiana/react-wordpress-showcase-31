import React, { createContext, useContext, useState, ReactNode } from 'react';

interface EditModeContextType {
  editMode: boolean;
  setEditMode: (mode: boolean) => void;
  editingSection: string | null;
  setEditingSection: (sectionId: string | null) => void;
}

const EditModeContext = createContext<EditModeContextType | undefined>(undefined);

export const EditModeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [editMode, setEditMode] = useState(false);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  // Debug logging for edit mode changes
  React.useEffect(() => {
    console.log('[EditModeContext] editMode=', editMode);
  }, [editMode]);

  React.useEffect(() => {
    console.log('[EditModeContext] editingSection=', editingSection);
  }, [editingSection]);

  // Keyboard shortcut for edit mode toggle
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'e' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        setEditMode(prev => !prev);
        console.log('[EditModeContext] Toggle via keyboard shortcut');
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <EditModeContext.Provider value={{ 
      editMode, 
      setEditMode, 
      editingSection, 
      setEditingSection 
    }}>
      {children}
    </EditModeContext.Provider>
  );
};

export const useEditMode = (): EditModeContextType => {
  const context = useContext(EditModeContext);
  if (context === undefined) {
    throw new Error('useEditMode must be used within an EditModeProvider');
  }
  return context;
};