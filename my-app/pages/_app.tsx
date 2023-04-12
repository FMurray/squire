import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { MainContainer } from '@/components/MainContainer'

export default function App({ Component, pageProps }: AppProps) {
  return (<>
    <div className="drawer absolute top-0">
        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content">
            <label htmlFor="my-drawer" className="btn btn-primary drawer-button">Code Assistant</label>
            <Component {...pageProps} />
        </div> 
        <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <MainContainer /> 
        </div>
    </div>
  </>)
}
