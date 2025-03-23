import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route , RouterProvider } from 'react-router-dom'
import { SignUp,LogIn,VerifyOtp,VerifyPasscode,ForgotPassword,ResetPassword,Home,Leaderboard,Profile,QueryDetails,EditProfile,UserQnA} from './component/components.js'
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(
    
    <Route path="/" element={<App />}>

      <Route index element={<Home />} />
      <Route path="query/:id" element={<QueryDetails />} />

      <Route path="leaderboard" element={<Leaderboard />} />

      <Route path="profile" element={<Profile />} />
      <Route path="profile/:id" element={<Profile />} />
      <Route path="profile/edit" element={<EditProfile />} />
      <Route path="profile/:id/queries" element={<UserQnA type="queries" />} />
      <Route path="profile/:id/answers" element={<UserQnA type="answers" />} />

      <Route path="login" element={<LogIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="verify-otp" element={<VerifyOtp />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="verify-passcode" element={<VerifyPasscode />} />
      <Route path="reset-password" element={<ResetPassword />} />

      <Route path="*" element={<div><h1>404! Page Not Found</h1></div>} />
    </Route>
  )
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)
