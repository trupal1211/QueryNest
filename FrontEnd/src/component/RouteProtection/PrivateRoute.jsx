import Cookies from 'js-cookie';
import { Navigate , Outlet} from 'react-router-dom';

const PrivateRoute = () => {

  // Check authentication
  const token = Cookies.get("authToken"); 

  // If User is unAuthenticated, redirect to Login page.
  // O.W. render the component
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
