import { Outlet , useLocation , Navigate } from 'react-router-dom'
import {Navbar} from './component/components'
import Cookies from 'js-cookie';

function App() {

  const location = useLocation()
  const noNavbarRoutes = ['/login', '/signup','/verify-otp','/verify-passcode','/forgot-password','/reset-password']; 

  return (
    <>
      {!noNavbarRoutes.includes(location.pathname) && location.pathname !== '*' && <Navbar />}
        {/* {Cookies.get("authToken")?<Outlet /> : <><Navigate to="/login"/> <Outlet/></>}  */}
        <Outlet/>
    </>
  )
}

export default App
