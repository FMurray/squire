import { createContext } from 'react';
import { UITabType } from '../types';

type TabContextType = {
  tabs: UITabType[];
  activeTab: string;
  handleAddTab: () => void;
  handleRemoveTab: (t: string) => void;
  setActiveTab: (t: string) => void;
  updateCurrentTabName: (n: string) => void;
};

export const TabsContext = createContext<TabContextType>({
  tabs: [{ key: 'initial', name: 'Untitled search' }],
  activeTab: 'initial',
  handleAddTab: () => {},
  handleRemoveTab: () => {},
  setActiveTab: () => {},
  updateCurrentTabName: () => {},
});

