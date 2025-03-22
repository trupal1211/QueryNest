import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'

function LogIn(){

  let [name,setName] = useState("")
  let [showPassword,setShowPassword] = useState()
  let navigate = useNavigate()

  function submitHandler(){
    console.log(name)
    navigate('/')
  }
 
  return(
    <>
       <div className={styles.main_page}>
        <div className={styles.name_container}>
          <div className={styles.welcome_content}>
            <p className={styles.welcome}>Welcome to</p>
            <p className={styles.querynest}>QueryNest</p>
            <p className={styles.slogan}>- Ask,Answer,Grow</p>
          </div>
        </div>
          <form className={styles.form}>
            <h2>Log In to Your Account</h2>
            <div class={styles.form_group}>
              <input type="email" id="email" onChange={(e)=>{setName(e.target.value)}} placeholder=" " required />
              <label for="email">Email</label>             
            </div>
            <div class={styles.form_group}>
              <input  type={showPassword ? "text" : "password"} id="password" placeholder=" " required />
              <label for="password">Password</label>
            </div>
           
            <button className={styles.btn} onClick={submitHandler}>Log In</button>

            <p>Don't have an account ? <b onClick={()=>{navigate('/signup')}}  style={{cursor:'pointer',color:'#DEC498'}}>Sign Up</b> here</p>

          </form>
        </div>
    </>
  )
}

export default LogIn