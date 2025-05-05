import { useState , useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'
import Cookies from "js-cookie";
import AuthUserContext from '../../context/AuthUserContext'

function LogIn() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false);

  const [loaderStatus, setLoaderStatus] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // fetchAuthUser function fetch the data of loggedIn user and Store in Centralized Storage(AuthUser) 
  const { fetchAuthUser } = useContext(AuthUserContext);

  function showError(message) {
    setError(message);
    setSuccess("");
    setTimeout(() => setError(""), 4000);
  }

  function showSuccess(message) {
    setSuccess(message);
    setError("");
    setTimeout(() => setSuccess(""), 4000);
  }

  let navigate = useNavigate()


  async function submitHandler(e) {
    e.preventDefault();

    const loginData = {
      email: email.toLowerCase().trim(),
      password: password.trim(),
    };

    setLoaderStatus(true)

    try {
      const response = await fetch("https://querynest-4tdw.onrender.com/api/User/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();
      console.log(result)

      setLoaderStatus(false)

      if (response.ok) {
        showSuccess("Login successful!");
        
        console.log("authToken:" + result.token)
        // localStorage.setItem("email", result.email)
        Cookies.set("authToken", result.token, { expires: 7 }); // Expires in 7 days
        Cookies.set("currentUserId", result.userId, { expires: 7 })
        
        fetchAuthUser();// Fetch user data after login

        setTimeout(() => navigate("/"), 2000)
      } else {
        showError(result.message || "Login failed!");
      }
    } catch (error) {
      showError(error.message || "Something went wrong. Please try again.");
      setLoaderStatus(false)
    }
  }

  return (
    <>
      <div className={styles.main_page}>
        <div className={styles.name_container}>
          <div className={styles.welcome_content}>
            <p className={styles.welcome}>Welcome to</p>
            <p className={styles.querynest}>QueryNest</p>
            <p className={styles.slogan}>- Ask,Answer,Grow</p>
          </div>
        </div>
        <form className={styles.form} onSubmit={submitHandler}>

          <h2>Log In to Your Account</h2>

          <div className={styles.form_group}>
            <input type="email" id="email" value={email} onChange={(e) => { setEmail(e.target.value) }} placeholder=" " required />
            <label htmlFor="email">Email</label>
          </div>

          <div className={`${styles.form_group} ${styles.password_field}`}>
            <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder=" " required />
            <label>Password</label>
            {password && (
              showPassword ? (
                // Svg of Close Eye
                <svg onClick={() => setShowPassword(false)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="bi bi-eye-slash" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                  <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                </svg>
              ) : (
                // Svg of Open Eye
                <svg onClick={() => setShowPassword(true)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="bi bi-eye" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                </svg>
              )
            )}
          </div>

          <button className={styles.btn}
            type={loaderStatus ? "button" : "submit"} disabled={loaderStatus}>
            {!loaderStatus ? 'Log In' : <div className={styles.loader}></div>}
          </button>

          <p style={{ marginBottom: '5px' }}>
            <b onClick={() => { navigate('/forgot-password') }} className={styles.navigateLink}> Forgot password ? </b>
          </p>

          <p>Don't have an account ?
            <b onClick={() => { navigate('/signup') }} className={styles.navigateLink}> Sign Up </b>
            here</p>
        </form>
      </div>

      {/* Floating Error Message */}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {/* Floating Success Message */}
      {success && <div className={styles.successMsg}>{success}</div>}
    </>
  )
}

export default LogIn