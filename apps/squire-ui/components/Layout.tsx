import { Navbar } from './Navbar'

const Layout = ({ children }:any) => (
  <>
    <Navbar />
    <main>{children}</main>
  </>
)

export default Layout