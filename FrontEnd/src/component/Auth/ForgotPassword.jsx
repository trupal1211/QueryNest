import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'
import { use } from 'react'

function ForgotPassword() {

  const navigate = useNavigate();
  const [email,setEmail] = useState("")

  async function submitHandler(e) {
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
        <form className={styles.form}>
          <h2>Forgot Password ?</h2>
          <p style={{ lineHeight: '1.5', color: 'gray' , marginLeft:'10px',marginRight:'10px' }}>Enter your registered email to receive a one-time password (OTP).</p>

          <div className={styles.form_group}>
            <input type="text" id="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder=" " required />
            <label htmlFor="email">Registered email</label>
          </div>


          <button className={styles.btn} style={{ marginBottom:'35px'}} onClick={submitHandler}>Send OTP</button>

        </form>

      </div>
    </>
  )
}

export default ForgotPassword
