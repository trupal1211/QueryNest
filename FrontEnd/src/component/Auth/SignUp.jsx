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



// import React, { useState, useEffect } from 'react';

// const SignUp = () => {
//   const [formData, setFormData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//   });
//   const [errors, setErrors] = useState([]);

//   useEffect(() => {
//     if (errors.length > 0) {
//       const timer = setTimeout(() => {
//         setErrors([]);
//       }, 3000);
//       return () => clearTimeout(timer);
//     }
//   }, [errors]);

//   const validate = () => {
//     const newErrors = [];

//     // Name validation
//     if (!formData.name.trim()) {
//       newErrors.push('Name is required');
//     }

//     // Email validation
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!formData.email) {
//       newErrors.push('Email is required');
//     } else if (!emailRegex.test(formData.email)) {
//       newErrors.push('Enter a valid email');
//     }

//     // Password validation
//     if (!formData.password) {
//       newErrors.push('Password is required');
//     } else if (formData.password.length < 6) {
//       newErrors.push('Password must be at least 6 characters');
//     }

//     // Confirm Password validation
//     if (!formData.confirmPassword) {
//       newErrors.push('Confirm password is required');
//     } else if (formData.password !== formData.confirmPassword) {
//       newErrors.push('Passwords do not match');
//     }

//     setErrors(newErrors);

//     return newErrors.length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (validate()) {
//       console.log('Form submitted', formData);
//       alert('Sign Up Successful!');
//       setFormData({ name: '', email: '', password: '', confirmPassword: '' });
//       setErrors([]);
//     }
//   };

//   const removeError = (index) => {
//     setErrors((prevErrors) => prevErrors.filter((_, i) => i !== index));
//   };

//   return (
//     <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
//       <h2>Sign Up</h2>
//       {errors.length > 0 && (
//         <div style={{ position: 'fixed', top: '10px', right: '10px' }}>
//           {errors.map((error, index) => (
//             <div
//               key={index}
//               style={{
//                 background: 'red',
//                 color: 'white',
//                 padding: '10px',
//                 marginBottom: '5px',
//                 borderRadius: '5px',
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 alignItems: 'center',
//                 position: 'relative',
//                 overflow: 'hidden',
//               }}
//             >
//               <span>{error}</span>
//               <button
//                 onClick={() => removeError(index)}
//                 style={{
//                   background: 'transparent',
//                   color: 'white',
//                   border: 'none',
//                   marginLeft: '10px',
//                   cursor: 'pointer',
//                   fontSize: '16px',
//                 }}
//               >
//                 ×
//               </button>
//               <div
//                 style={{
//                   position: 'absolute',
//                   bottom: 0,
//                   left: 0,
//                   height: '4px',
//                   width: '100%',
//                   background: 'darkred',
//                   animation: 'shrink 3s linear forwards',
//                 }}
//               ></div>
//             </div>
//           ))}
//         </div>
//       )}
//       <form onSubmit={handleSubmit}>
//         <div style={{ marginBottom: '15px' }}>
//           <label htmlFor="name">Name</label>
//           <input
//             type="text"
//             id="name"
//             name="name"
//             value={formData.name}
//             onChange={handleChange}
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label htmlFor="email">Email</label>
//           <input
//             type="email"
//             id="email"
//             name="email"
//             value={formData.email}
//             onChange={handleChange}
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label htmlFor="password">Password</label>
//           <input
//             type="password"
//             id="password"
//             name="password"
//             value={formData.password}
//             onChange={handleChange}
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>

//         <div style={{ marginBottom: '15px' }}>
//           <label htmlFor="confirmPassword">Confirm Password</label>
//           <input
//             type="password"
//             id="confirmPassword"
//             name="confirmPassword"
//             value={formData.confirmPassword}
//             onChange={handleChange}
//             style={{ width: '100%', padding: '8px', marginTop: '5px' }}
//           />
//         </div>

//         <button type="submit" style={{ width: '100%', padding: '10px', background: 'blue', color: 'white', border: 'none', borderRadius: '5px' }}>
//           Sign Up
//         </button>
//       </form>
//       <style>
//         {`
//           @keyframes shrink {
//             from {
//               width: 100%;
//             }
//             to {
//               width: 0;
//             }
//           }
//         `}
//       </style>
//     </div>
//   );
// };

// export default SignUp;
