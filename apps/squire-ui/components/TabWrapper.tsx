import { GenerationsContext, TabsContext } from '@squire-ui/lib/context';
import { UITabType } from '@squire-ui/lib/types';
import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '@squire-ui/lib/supabaseClient';
import { generateUniqueId } from '@squire-ui/lib/utils';
import { Generation } from '@squire-ui/lib/models';

export const TabWrapper = ({ children }) => {

    const client = supabase;

    const [tabs, setTabs] = useState<Generation[]>([
      {
        id: 'initial',
        generation_name: 'Untitled',
        prompt_type: 'chat'
      },
    ]);
    const [activeTab, setActiveTab] = useState('initial');

    const [generations, setGenerations] = useState<Generation[]>([])
    const [activeGeneration, setActiveGeneration] = useState<string | null>(null)

    useEffect(() => {
      const getGenerations = async () => {
        const { data, error } = await client.from('generations').select('*'); 
        console.log(data)
        if (!error) {
            setGenerations(data)
            setActiveGeneration(data[0])
        }
      }
      
      getGenerations();
    }, [client])

    const handleTabSelect = (id: string) => {
      let gen = generations.find((g) => g.id === id)
      console.log(gen)
      setActiveGeneration(gen);
    }

    const handleAddTab = () => {
      const newTab = {
        key: generateUniqueId(),
        generation_name: 'Untitled',
      };
      setGenerations((prev) => [...prev, newTab]);
      setActiveGeneration(newTab);
    }

    // const handleKeyEvent = useCallback((e: KeyboardEvent) => {
    //   if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
    //     e.stopPropagation();
    //     e.preventDefault();
    //     handleAddTab();
    //   }
    // }, []);
    // useKeyboardNavigation(handleKeyEvent);

    // const updateCurrentTabName = useCallback(
    //   (newName: string) => {
    //     setTabs((prev) => {
    //       const newTabs = [...prev];
    //       const tabToUpdate = newTabs.findIndex((t) => t.key === activeTab);
    //       newTabs[tabToUpdate] = { ...newTabs[tabToUpdate], name: newName };
    //       return newTabs;
    //     });
    //   },
    //   [activeTab],
    // );

    // const handleRemoveTab = useCallback(
    //   (tabKey: string) => {
    //     setActiveTab((prev) => {
    //       const prevIndex = tabs.findIndex((t) => t.key === prev);
    //       if (tabKey === prev) {
    //         return prevIndex > 0
    //           ? tabs[prevIndex - 1].key
    //           : tabs[prevIndex + 1].key;
    //       }
    //       return prev;
    //     });
    //     setTabs((prev) => prev.filter((t) => t.key !== tabKey));
    //   },
    //   [tabs],
    // );

    // const contextValue = useMemo(
    //   () => ({
    //     tabs,
    //     activeTab,
    //     handleAddTab,
    //     handleRemoveTab,
    //     setActiveTab,
    //     updateCurrentTabName,
    //   }),
    //   [tabs, activeTab, handleAddTab, handleRemoveTab, updateCurrentTabName],
    // );

    const contextValue = useMemo(
      () => ({
        activeGeneration
      }), 
      [activeGeneration]
    )

    return (
      <GenerationsContext.Provider value={contextValue}>
        <div className='tabs bg-base-100'>
          {generations.map((t) => (
            <a key={t.key} onClick={() => setActiveGeneration(t)} className={`tab tab-lifted tab-bordered ${t.id == activeTab ? 'active' : ''}`}> {t.generation_name} </a>
          ))}
          <a className='tab tab-lifted tab-bordered fill-slate-200' onClick={handleAddTab}> + </a>
        </div>
        {children}
      </GenerationsContext.Provider>
    );

    }