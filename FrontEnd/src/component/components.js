import AuthGuard from "./RouteProtection/AuthGuard";
import PrivateRoute from "./RouteProtection/PrivateRoute";

import SignUp from "./Auth/SignUp";
import LogIn from "./Auth/LogIn";
import VerifyOtp from "./Auth/VerifyOtp";
import ForgotPassword from "./Auth/ForgotPassword";
import VerifyPasscode from "./Auth/VerifyPasscode";
import ResetPassword from "./Auth/ResetPassword";

import Navbar from "./Navbar/Navbar";
import SearchedUser from "./Navbar/SearchedUser";

import Home from './Home/Home';
import QueryDetails from "./Home/QueryDetails";
import Query from "./Home/Query";
import Answer from "./Home/Answer";

import Leaderboard from './Leaderboard/Leaderboard';
import UserRow from "./Leaderboard/UserRow";

import Profile from './Profile/Profile';
import Archievement from "./Profile/Archievement";
import EditProfile from "./Profile/EditProfile";
import UserQnA from "./Profile/UserQnA";

export{
    AuthGuard,PrivateRoute,
    SignUp,LogIn,VerifyOtp,ForgotPassword,VerifyPasscode,ResetPassword,
    Navbar,SearchedUser,
    Home,Query,Answer,
    Leaderboard,UserRow,
    Profile,Archievement,
    QueryDetails,EditProfile,UserQnA
}
