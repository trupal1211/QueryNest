import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'

function VerifyPasscode() {

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

        e.preventDefault()

        // convert array to String
        let otpString = otp.join("")

        const verifyPasscodeData = {
            email: localStorage.getItem("Passcode_Email"),
            passcode: otpString
        };

        console.log(verifyPasscodeData)

        setLoaderStatus(true)

        try {
            const response = await fetch("https://querynest-4tdw.onrender.com/api/User/verifypasscode", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(verifyPasscodeData),
            });


            const result = await response.json();
            console.log(result)

            setLoaderStatus(false)

            if (response.ok) {
                showSuccess("passcode verified");
                setTimeout(() => navigate("/reset-password"), 2000)
            } else {
                showError(result.message);
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
                    <h2>Enter Passcode</h2>

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

                    <button className={`${styles.btn} ${styles.submitBtn}`} 
                        type={loaderStatus ? "button" : "submit"} disabled={loaderStatus}>
                        {!loaderStatus ? 'Submit' : <div className={styles.loader}></div>}
                    </button>

                    <p style={{color:'#ff4545',marginBottom:'20px'}}>Passcode will expires in 20 minutes</p>

                </form>
            </div>

            {/* Floating Error Message */}
            {error && <div className={styles.errorMsg}>{error}</div>}

            {/* Floating Success Message */}
            {success && <div className={styles.successMsg}>{success}</div>}
        </>
    )
}

export default VerifyPasscode
