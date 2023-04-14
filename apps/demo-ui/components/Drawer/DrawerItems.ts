import { Prompt } from '../Prompt'
import AnotherRandomComponent from './AnotherRandomComponent'
import SomerandomComponent from './SomerandomComponent'

export const drawerItems = [
    { name: 'prompt', content: Prompt, visible: true },
    { name: 'Another Thing', content: SomerandomComponent, visible: false },
    { name: 'And Another', content: AnotherRandomComponent, visible: false },
]