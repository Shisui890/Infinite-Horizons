import { createContext, useContext } from 'react';

export interface LaymanModeContextType {
  isLaymanMode: boolean;
  toggleLaymanMode: () => void;
  setLaymanMode: (val: boolean) => void;
}

export const LaymanModeContext = createContext<LaymanModeContextType>({
  isLaymanMode: false,
  toggleLaymanMode: () => {},
  setLaymanMode: () => {},
});

export function useLaymanMode() {
  return useContext(LaymanModeContext);
}
