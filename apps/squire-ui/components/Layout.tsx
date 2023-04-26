import { Navbar } from './Navbar'
import { TabWrapper } from './TabWrapper'

const Layout = ({ children }:any) => (
  <>
    <Navbar />
    <TabWrapper>
      <main className='relative'>{children}</main>
    </TabWrapper>
  </>
)

export default Layout