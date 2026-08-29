import React, { createContext, useContext, useState, useEffect } from 'react';

interface LaymanModeContextType {
  isLaymanMode: boolean;
  toggleLaymanMode: () => void;
  setLaymanMode: (val: boolean) => void;
}

const LaymanModeContext = createContext<LaymanModeContextType>({
  isLaymanMode: false,
  toggleLaymanMode: () => {},
  setLaymanMode: () => {},
});

export function LaymanModeProvider({ children }: { children: React.ReactNode }) {
  const [isLaymanMode, setIsLaymanModeState] = useState<boolean>(() => {
    try {
      const stored = localStorage.getItem('infinite_horizons_layman_mode');
      return stored === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('infinite_horizons_layman_mode', String(isLaymanMode));
    } catch {
      // ignore
    }

    if (isLaymanMode) {
      document.body.classList.add('mode-layman');
    } else {
      document.body.classList.remove('mode-layman');
    }
  }, [isLaymanMode]);

  const toggleLaymanMode = () => {
    setIsLaymanModeState(prev => !prev);
  };

  const setLaymanMode = (val: boolean) => {
    setIsLaymanModeState(val);
  };

  return (
    <LaymanModeContext.Provider value={{ isLaymanMode, toggleLaymanMode, setLaymanMode }}>
      {children}
    </LaymanModeContext.Provider>
  );
}

export function useLaymanMode() {
  return useContext(LaymanModeContext);
}
