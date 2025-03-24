import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'

function VerifyOtp() {

    const navigate = useNavigate()
    const [otp, setOtp] = useState(new Array(6).fill(""));

    const [loaderStatus, setLoaderStatus] = useState(false);
    const [error, setError] = useState(""); 
    const [success, setSuccess] = useState(""); 

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

    const handleChange = (index, e) => {
        const value = e.target.value;
        if (isNaN(value)) return;

        let newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            document.getElementById(`otp-${index + 1}`).focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };


    async function submitHandler(e) {

        e.preventDefault();

        // convert array into String 
        let otpString = otp.join("")    

        const otpData = {
            clgemail: localStorage.getItem("clgEmail"),
            otp: otpString
        };

        console.log(otpData)

        setLoaderStatus(true)

        try {
            const response = await fetch("https://querynest-4tdw.onrender.com/api/User/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(otpData),
            });

            const result = await response.json();
            // console.log(result)

            setLoaderStatus(false)

            if(response.ok) {
                showSuccess("Registration successful!");
                setTimeout(() => navigate("/login"), 2000);
            }
            else{
                showError(result.message || "Verification failed!");
            }
        } catch (error) {
            showError(error.message || "Something went wrong. Please try again.");
            setLoaderStatus(false)
        }
    }


    async function resendOtpHander() {

        const resendOtpData = {
            clgemail: localStorage.getItem("clgEmail")
        };

        try {
            const response = await fetch("https://querynest-1-g4vt.onrender.com/api/User/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(resendOtpData),
            });

            const result = await response.json();
            // console.log(result)

            if (response.ok) {
                showSuccess("OTP resent successfully");
            } else {
                showError(result.message || "Failed to Resend OTP!");
            }
        } catch (error) {
            showError(error.message || "Something went wrong. Please try again.");
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
                    <h2>Enter OTP</h2>
                    <p style={{ lineHeight: '1.5', color: 'gray', marginLeft: '10px', marginRight: '10px' }}>We have sent a 6-digit OTP to your registered E-mail. Please enter it below for verification.</p>

                    <div className={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                id={`otp-${index}`}
                                type="text"
                                className={styles.otpBox}
                                value={digit}
                                maxLength="1"
                                onChange={(e) => handleChange(index, e)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                            />
                        ))}
                    </div>
 
                    {/* when user clicks on submit , untill response is received , can't submit again and show loading animation */}
                    <button className={`${styles.btn} ${styles.submitBtn}`} type={loaderStatus ? "button" : "submit"} disabled={loaderStatus}>
                        {loaderStatus ? <div className={styles.loader} ></div> : 'Submit'}
                    </button>

                    <p className={styles.rednotes}>OTP will expires in 5 minutes</p>

                    <p>Didn't get OTP ? <b onClick={resendOtpHander} style={{ marginBottom: '30px' }} className={styles.navigateLink}>resend OTP</b></p>
                </form>
            </div>

            {/* Floating Error Message */}
            {error && <div className={styles.errorMsg}>{error}</div>}

            {/* Floating Success Message */}
            {success && <div className={styles.successMsg}>{success}</div>}
        </>
    )
}

export default VerifyOtp