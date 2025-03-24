import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Auth.module.css";
import "@fontsource/kadwa";
import "@fontsource/jua";

function SignUp() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loaderStatus, setLoaderStatus] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function showError(message) {
    setError(message);
    setSuccess("");   // clear previous success msg
    setTimeout(() => setError(""), 4000);  // show success msg for 4 sec
  }

  function showSuccess(message) {
    setSuccess(message);
    setError("");
    setTimeout(() => setSuccess(""), 4000);
  }

  // alphabet,space and length 2 to 20
  function validateName() {
    const nameRegex = /^[A-Za-z ]{2,20}$/;
    if (!nameRegex.test(name)) {
      showError("Name should contain only letters.");
      return false;
    }
    return true;
  }

  // alphabet,digit,underscore,dot and length 6 to 15 
  function validateUsername() {
    const usernameRegex = /^[a-zA-Z0-9._]{6,15}$/;
    if (!usernameRegex.test(username)) {
      showError("Username should be of 6 to 15 characters and only contain letters, numbers, and underscores");
      return false;
    }
    return true;
  }

  // e.g. 23itubs023@ddu.ac.in
  function validateEmail() {
    const emailRegex = /^[0-9]{2}[a-zA-Z]{5}[0-9]{3}@ddu\.ac\.in$/;
    if (!emailRegex.test(email)) {
      showError("Enter Valid DDU email");
      return false;
    }
    return true;
  }

  function validatePassword() {
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/;
    if (!passwordRegex.test(password)) {
      showError("Password must be of 8 to 12 characters and contain uppercase , lowercase , digit and special character.");
      return false;
    }
    return true;
  }

  // password and confirmPassword must be match
  function validateConfirmPassword() {
    if (password !== confirmPassword) {
      showError("Passwords dose not match!");
      return false;
    }
    return true;
  }

  async function submitHandler(e) {
    e.preventDefault();

    // validate all Input Data 
    if (
      !validateName() ||
      !validateUsername() ||
      !validateEmail() ||
      !validatePassword() ||
      !validateConfirmPassword()
    ) {
      return;
    }

    const userData = {
      name: name.trim(),
      username: username.toLowerCase().trim(),
      clgemail: email.toLowerCase().trim(),
      password: password.trim()
    };

    setLoaderStatus(true)

    try {
      const response = await fetch("https://querynest-4tdw.onrender.com/api/User/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const result = await response.json();
      // console.log(result);

      setLoaderStatus(false)

      if (response.ok) {
        showSuccess("OTP sent! Verify your email.");
        localStorage.setItem("clgEmail", userData.clgemail);

        setTimeout(() => navigate("/verify-otp"), 2000); // Navigate after showing success message
      } else {
        showError(result.error || result.message || "Signup failed!");
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
            <p className={styles.slogan}>- Ask, Answer, Grow</p>
          </div>
        </div>
        <form className={styles.form} onSubmit={submitHandler}>
          <h2>Create a New Account</h2>

          <div className={styles.form_group}>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder=" " required />
            <label>Name</label>
          </div>

          <div className={styles.form_group}>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder=" " required />
            <label>Username</label>
          </div>

          <div className={styles.form_group}>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder=" " required />
            <label>Email</label>
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

          <div className={`${styles.form_group} ${styles.password_field}`}>
            <input type={showConfirmPassword ? "text" : "password"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder=" " required />
            <label>Confirm Password</label>

            {confirmPassword && (
              showConfirmPassword ? (
                // Svg of Close Eye 
                <svg onClick={() => setShowConfirmPassword(false)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="bi bi-eye-slash" viewBox="0 0 16 16">
                  <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z" />
                  <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829" />
                  <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z" />
                </svg>
              ) : (
                // Svg of Open Eye
                <svg onClick={() => setShowConfirmPassword(true)} xmlns="http://www.w3.org/2000/svg" width="22" height="22" className="bi bi-eye" viewBox="0 0 16 16">
                  <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                  <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                </svg>
              )
            )}

          </div>

          {/* when the user clicks on the submit button, the form data is sent to the server for validation */}
          <button className={styles.btn} type={loaderStatus ? "button" : "submit"} disabled={loaderStatus}>
            {!loaderStatus ? 'Sign Up' : <div className={styles.loader}></div>}
          </button>

          {/* when the user clicks on the submit button, the user can't go to login page */}
          <p>Already have an Account? <b onClick={() => { !loaderStatus && navigate("/login") }} className={styles.navigateLink}>Log in</b></p>
        </form>
      </div>

      {/* Floating Error Message */}
      {error && <div className={styles.errorMsg}>{error}</div>}

      {/* Floating Success Message */}
      {success && <div className={styles.successMsg}>{success}</div>}
    </>
  );
}

export default SignUp;