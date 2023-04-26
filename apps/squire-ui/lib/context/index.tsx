import { createContext } from 'react';
import { Generation } from '../models';
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
  tabs: [{ key: 'initial', name: 'Untitled search', prompt_type: 'chat' }],
  activeTab: 'initial',
  handleAddTab: () => {},
  handleRemoveTab: () => {},
  setActiveTab: () => {},
  updateCurrentTabName: () => {},
});

type GenerationsContextType = {
  generations: Generation[]
  activeGeneration: Generation | null
}

export const GenerationsContext = createContext<GenerationsContextType>({
  generations: [],
  activeGeneration: null
})

