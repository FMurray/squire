import { Prompt } from '../Prompt'

export type DrawerItem = {
    name: string, 
    content: React.FC,
    visible: boolean
}

export const drawerItems: DrawerItem[] = [
    { name: 'prompt', content: Prompt, visible: true },
    { name: 'Another Thing', content: SomerandomComponent, visible: false },
    { name: 'And Another', content: AnotherRandomComponent, visible: false },
]