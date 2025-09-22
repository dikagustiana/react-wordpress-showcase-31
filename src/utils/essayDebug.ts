// Utility functions for debugging essay data
// This file can be used to inspect stored essays in localStorage

export const getStoredEssays = () => {
  try {
    const stored = localStorage.getItem('customEssays');
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error reading stored essays:', error);
    return {};
  }
};

export const logStoredEssays = () => {
  const stored = getStoredEssays();
  console.log('Stored Custom Essays:', stored);
  return stored;
};

export const clearStoredEssays = () => {
  localStorage.removeItem('customEssays');
  console.log('Cleared all stored essays');
};

export const clearStoredEssaysForPhase = (phase: string) => {
  try {
    const stored = localStorage.getItem('customEssays');
    if (stored) {
      const customEssays = JSON.parse(stored);
      delete customEssays[phase];
      localStorage.setItem('customEssays', JSON.stringify(customEssays));
      console.log(`Cleared all custom essays for phase: ${phase}`);
    }
  } catch (error) {
    console.error('Error clearing essays for phase:', error);
  }
};

export const exportStoredEssays = () => {
  const stored = getStoredEssays();
  const dataStr = JSON.stringify(stored, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

  const exportFileDefaultName = 'custom-essays.json';

  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Add to window for easy debugging in browser console
if (typeof window !== 'undefined') {
  (window as Record<string, any>).essayDebug = {
    getStoredEssays,
    logStoredEssays,
    clearStoredEssays,
    clearStoredEssaysForPhase,
    exportStoredEssays,
  };
}
