import { Outlet , useLocation } from 'react-router-dom'
import {Navbar} from './component/components'

function App() {

  const location = useLocation()
  const noNavbarRoutes = ['/login', '/signup']; 

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && location.pathname !== '*' && <Navbar />}
      <Outlet/>
    </>
  )
}

export default App
