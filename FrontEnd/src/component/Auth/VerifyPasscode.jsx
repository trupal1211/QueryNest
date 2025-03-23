import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Auth.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'

function VerifyPasscode() {

    const navigate = useNavigate()
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [error, setError] = useState(""); // Floating error message

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

        // Call function when all inputs are filled
        if (newOtp.every((digit) => digit !== "")) {
            handleComplete(newOtp.join(""));
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            document.getElementById(`otp-${index - 1}`).focus();
        }
    };

    const handleComplete = (otpValue) => {
        alert(`OTP Submitted: ${otpValue}`);
    };

    async function submitHandler(e){
        e.preventDefault()
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
                <form className={styles.form}>
                    <h2>Enter Passcode</h2>
                    <p style={{ lineHeight: '1.5', color: 'gray' , marginLeft:'10px',marginRight:'10px' }}>We have sent a 6-digit OTP to your registered E-mail. Please enter it below for verification.</p>

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

                    <button className={`${styles.btn} ${styles.submitBtn}`} onClick={submitHandler}>Submit</button>

                    <p className={styles.rednotes}>Passcode will expires in 20 minutes</p>

                </form>
            </div>
        </>
    )
}

export default VerifyPasscode
