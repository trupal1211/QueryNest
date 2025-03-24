import { Navigate } from "react-router-dom";
import Cookies from 'js-cookie';

const AuthGuard = ({ children }) => {

    // Check authentication
    const token = Cookies.get("authToken");

    // If User is authenticated than Can't go on this Components(like login,signup)
    // Redirect to Home Page
    return token ? <Navigate to="/" replace /> : children;

};

export default AuthGuard;
