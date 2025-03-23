import { useState} from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'

function SignUp(){

  let [name,setName] = useState("")
  const navigate = useNavigate();

  function submitHandler(){
    console.log(name)
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
            <h2>Create a New Account</h2>
            <div class={styles.form_group}>
              <input type="text" id="name" onChange={(e)=>{setName(e.target.value)}} placeholder=" " required />
              <label for="name">Your Name</label>              
            </div>
            <div class={styles.form_group}>
              <input type="email" id="email" placeholder=" " required />
              <label for="email">Email</label>
              <p style={{ color: "red" }}></p>

            </div>
            <div class={styles.form_group}>
              <input type="password" id="password" placeholder=" " required />
              <label for="password">Password</label>
            </div>
            <div class={styles.form_group}>
              <input type='password' id="cpassword" placeholder=" " required />
              <label for="cpassword">Confirm Password</label>
            </div>

            <button className={styles.btn} onClick={submitHandler}>Sign Up</button>

            <p>Already have an Account ? <b onClick={()=>{navigate('/login')}} style={{cursor:'pointer',color:'#DEC498'}}>Log in</b> here</p>
          </form>
        
      </div> 
    </>
  )
}

export default SignUp

