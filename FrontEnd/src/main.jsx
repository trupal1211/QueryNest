import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom'
import { SignUp, LogIn, VerifyOtp, VerifyPasscode, ForgotPassword, ResetPassword, Home, Leaderboard, Profile, QueryDetails, EditProfile, UserQnA, PrivateRoute, AuthGuard } from './component/components.js'
import { AuthUserProvider } from './context/AuthUserProvider.jsx'
import './index.css'
import App from './App.jsx'

const router = createBrowserRouter(
  createRoutesFromElements(

    <Route path="/" element={<App />}>

      {/* Public Routes */}
      <Route path="profile/:username" element={<Profile />} />
      <Route path="leaderboard" element={<Leaderboard />} />

      {/* Protected Routes (Only for logged-in users) */}
      <Route element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="query/:query_id" element={<QueryDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/edit" element={<EditProfile />} />
        <Route path="profile/:username/queries" element={<UserQnA type="queries" />} />
        <Route path="profile/:username/answers" element={<UserQnA type="answers" />} />
      </Route>

      {/* Hide login/signup if user is already authenticated */}
      <Route path="login" element={<AuthGuard><LogIn /></AuthGuard>} />
      <Route path="signup" element={<AuthGuard><SignUp /></AuthGuard>} />
      <Route path="verify-otp" element={<AuthGuard><VerifyOtp /></AuthGuard>} />
      <Route path="forgot-password" element={<AuthGuard><ForgotPassword /></AuthGuard>} />
      <Route path="verify-passcode" element={<AuthGuard><VerifyPasscode /></AuthGuard>} />
      <Route path="reset-password" element={<AuthGuard><ResetPassword /></AuthGuard>} />

      <Route path="*" element={<div><h1>404! Page Not Found</h1></div>} />
    </Route>

  )
);


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthUserProvider>
      <RouterProvider router={router} />
    </AuthUserProvider>
  </StrictMode>,
)
