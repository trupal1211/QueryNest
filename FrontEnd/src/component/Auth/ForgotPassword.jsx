import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'

function ForgotPassword() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("")

  const [loaderStatus, setLoaderStatus] = useState(false);
  const [error, setError] = useState(""); // Floating error message
  const [success, setSuccess] = useState(""); // Floating success message


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

  async function submitHandler(e) {
    e.preventDefault();

    const forgotPasswordData = {
      email: email
    };

    console.log(forgotPasswordData)

    setLoaderStatus(true)

    try {
      const response = await fetch("https://querynest-4tdw.onrender.com/api/User/reset-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(forgotPasswordData),
      });

      const result = await response.json();
      // console.log(result)
      // console.log(response)

      setLoaderStatus(false)


      if (response.ok) {
        showSuccess("Passcode Send successful!");
        localStorage.setItem("Passcode_Email", forgotPasswordData.email)

        setTimeout(()=>navigate("/verify-passcode"),2000)  
      } else {
        showError(result.message || "failed to send Passcode!");
      }
    } catch (error) {
      showError(error.message || "Something went wrong. Please try again.");
      setLoaderStatus(false)

    }
  }

  return (
    <>
      <div className={styles.main_page}>
        <div className={`${styles.name_container} ${styles.signup}`}>
          <div className={styles.welcome_content}>
            <p className={styles.welcome}>Welcome to</p>
            <p className={styles.querynest}>QueryNest</p>
            <p className={styles.slogan}>- Ask,Answer,Grow</p>
          </div>
        </div>
        <form className={styles.form} onSubmit={submitHandler}>
          <h2>Forgot Password ?</h2>
          <p style={{ lineHeight: '1.5', color: 'gray', marginLeft: '10px', marginRight: '10px' }}>Enter your registered email to receive a one-time password (OTP).</p>

          <div className={styles.form_group}>
            <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
            <label htmlFor="email">Registered email</label>
          </div>

          <button className={styles.btn} style={{marginBottom:'40px'}} type={loaderStatus ? "button" : "submit"} disabled={loaderStatus}>
            {!loaderStatus ? 'Send Otp' : <div className={styles.loader}></div>}
          </button>

        </form>

      </div>

      {/* Floating Error Message */}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {/* Floating Success Message */}
      {success && <div className={styles.successMsg}>{success}</div>}
    </>
  )
}

export default ForgotPassword
