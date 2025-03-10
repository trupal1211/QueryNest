import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'

function NewPassword(){

  const navigate = useNavigate();

  function submitHandler(){
    navigate('/login')
  }

  return(
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
            <h2>Set New Password</h2>
            <div class={styles.form_group}>
              <input type="text" id="password" placeholder=" " required />
              <label for="password">New Password</label>              
            </div>

            <div class={styles.form_group}>
              <input type='password' id="cpassword" placeholder=" " required />
              <label for="cpassword">Confirm Password</label>
            </div>

            <button className={styles.btn} style={{marginBottom:'35px'}} onClick={submitHandler}>Set Password</button>

          </form>
        
      </div> 
    </>
  )
}

export default NewPassword

