import styles from './EditProfile.module.css'
import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from "js-cookie";
import LoadingPicture from '../../assets/svgs/spinning.svg'
import AuthUserContext from '../../context/AuthUserContext';

function EditProfile() {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        imageUrl: "",
        name: "",
        username: "",
        bio: "",
        clgemail: localStorage.getItem("email") || "",
        backupEmail: "",
        selectedTags: [],
        linkedinUrl: "",
        githubUsername: "",
        graduation: "",
    })

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loaderStatus, setLoaderStatus] = useState(false);
    const [userStatusData, setUserStatusData] = useState({});
    const [userProfileData, setUserProfileData] = useState({});
    const [profileTagsList, setProfileTagsList] = useState([]);
    const [isBackupEmailVerified, setBackupEmailVerified] = useState()
    const { fetchAuthUser } = useContext(AuthUserContext)

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Returns true if token exists, false otherwise
    function isAuthTokenValid() {
        return !!Cookies.get('authToken');
    }

    const handleSelect = (option) => {
        setFormData(prevData => {
            const currentTags = [...prevData.selectedTags];

            if (currentTags.includes(option)) {
                // Remove if already selected
                return {
                    ...prevData,
                    selectedTags: currentTags.filter(item => item !== option)
                };
            } else if (currentTags.length < 3) {
                // Add if under limit
                return {
                    ...prevData,
                    selectedTags: [...currentTags, option]
                };
            }

            return prevData; // Return unchanged if at limit
        });
    };


    //retrive all Tags that user can add in their profile 
    useEffect(() => {
        fetch("https://querynest-4tdw.onrender.com/api/TagDetails/ProfileTag", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched Data:", data); // Log after Data Fetched update
                setProfileTagsList(data)
                console.log(data)
            })
            .catch((err) => {
                console.error("Failed to fetch user data:", err);
                setError(err.message);
            })
    }, [])


    // fetch User Data to check if user is userProfile is already created or not ( isProfileCompleted)
    useEffect(() => {
        const fetchUserStatusData = () => {

            if (!isAuthTokenValid()) {
                setError("Authentication token missing. Please log In.");
                return;
            }

            fetch("https://querynest-4tdw.onrender.com/api/User/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("authToken")}`
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Fetched User Status Data:", data);
                    setUserStatusData(data)
                    setBackupEmailVerified(data?.verified)
                    
                })
                .catch((err) => {
                    console.error("Failed to fetch user data:", err);
                    setError(err.message);
                })
        };
        fetchUserStatusData();
    }, []);


    // execute when userStatusData fetched and Profile is NOT Completed
    useEffect(() => {
        if (userStatusData && (!userStatusData.isProfileCompleted)) {

            // set the data of userStatus to be displayed in the form
            setFormData((prev) => ({
                ...prev,
                name: userStatusData.name || "",
                username: userStatusData.username || "",
                clgemail: userStatusData.clgemail || "",
                imageUrl: userStatusData.imageUrl
            }));
        }
        else if (userStatusData && userStatusData.isProfileCompleted) {

            const fetchUserProfileData = () => {

                if (!isAuthTokenValid()) {
                    setError("Authentication token missing. Please log in.");
                    return;
                }

                fetch("https://querynest-4tdw.onrender.com/api/UserProfile/me", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("authToken")}`
                    },
                })
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error(`Error: ${response.status} - ${response.statusText}`);
                        }
                        return response.json();
                    })
                    .then((data) => {
                        console.log("Fetched userProfileData:", data); // Log after state update
                        setUserProfileData(data)
                    })
                    .catch((err) => {
                        console.error("Failed to fetch user profile data:", err);
                        setError(err.message || "Failed to fetch user profile data");
                    })
            };

            fetchUserProfileData();
        }
    }, [userStatusData]);


    // set the data of userProfile to be displayed in the form
    useEffect(() => {
        fillTheLatestData();
    }, [userProfileData])

    function fillTheLatestData() {
        if (Object.keys(userProfileData).length > 0) {  // Ensure data is available before setting state
            setFormData({
                name: userProfileData.name || "",
                username: userProfileData.username || "",
                imageUrl: userProfileData.imageUrl || "",
                bio: userProfileData.bio || "",
                clgemail: userProfileData.clgemail || "",
                backupEmail: userProfileData.backupemail || "",
                selectedTags: userProfileData.tags || [],
                linkedinUrl: userProfileData.LinkedInUrl || "",
                githubUsername: userProfileData.githubUsername || "",
                graduation: userProfileData.Graduation || "",
            });
        }
    }




    // alphabet,space and length 2 to 20
    function validateName() {
        const nameRegex = /^[A-Za-z ]{2,20}$/;
        if (!nameRegex.test(formData.name)) {
            showError("Name should contain only letters.");
            return false;
        }
        return true;
    }

    // alphabet,digit,underscore,dot and length 6 to 15 
    function validateUsername() {
        const usernameRegex = /^[a-zA-Z0-9._]{6,15}$/;
        if (!usernameRegex.test(formData.username)) {
            showError("Username should be of 6 to 15 characters and only contain letters, numbers, and underscores");
            return false;
        }
        return true;
    }


    function verifiedBackupEmail() {
        if (!formData.backupEmail) {
            if (!isBackupEmailVerified) {
                showError("verify Backup Email!")
                return false;
            }
            else true
        }
    }

    function validateBio() {
        if (formData.bio.length == 0) {
            showError("profile Bio is required");
            return false;
        }
        return true;
    }

    function validateGraduation() {
        const graduationRegex = /^[A-Za-z]{2}-\d{4}$/;
        if (!graduationRegex.test(formData.graduation)) {
            showError("Enter Valid Graduation Detail");
            return false;
        }
        return true;
    }



    async function submitHandler(e) {

        e.preventDefault();

        // validate some Input Data 
        if (
            !validateName() ||
            !validateUsername() ||
            // !verifiedBackupEmail() ||
            !validateBio() ||
            !validateGraduation()
        ) {
            return;
        }

        const submitData = {
            name: formData.name.trim(),
            imageUrl: formData.imageUrl,
            clgemail: formData.clgemail.toLowerCase().trim(),
            username: formData.username.toLowerCase().trim(),
            backupemail: formData.backupEmail.toLowerCase().trim(),
            LinkedInUrl: formData.linkedinUrl,
            githubUsername: formData.githubUsername,
            bio: formData.bio.trim(),
            Graduation: formData.graduation.toUpperCase().trim(),
            tags: formData.selectedTags,
        }

        console.log(" before api call submitData : " + submitData)

        setLoaderStatus(true)

        try {
            if (!isAuthTokenValid()) {
                setError("Authentication token missing. Please log in.");
                return;
            }

            console.log("submitted data:" + submitData)

            // if Profile is Completes than update it
            if (userStatusData.isProfileCompleted) {

                const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/updateuserprofile", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("authToken")}`
                    },
                    body: JSON.stringify(submitData),
                });

                const result = await response.json();
                console.log("result:" + result);

                setLoaderStatus(false)

                if (response.ok) {
                    console.log("result after success:" + result);
                    showSuccess("Profile Updated successful");
                    fetchAuthUser()
                    setTimeout(() => navigate("/profile"), 1000);
                } else {
                    console.log(result.error);
                    showError(result.error || result.message || "failed to Update profile");
                }
            }
            else {
                // if Profile is not created means(isProfileCompleted is False) than create it
                const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/createuserprofile", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${Cookies.get("authToken")}`
                    },
                    body: JSON.stringify(submitData),
                });

                const result = await response.json();
                console.log("result:" + result);

                setLoaderStatus(false)

                if (response.ok) {
                    console.log("result after success:" + result);
                    showSuccess("Profile Updated successful");
                    setTimeout(() => navigate("/profile"), 2000);
                } else {
                    console.log("result after failuer:" + result.error);
                    showError(result.error || result.message || "failed to Update profile");
                }
            }
        } catch (error) {
            showError(error.message || "Something went wrong. Please try again.");
            setLoaderStatus(false)
        }
    }


    function useDefaultPic() {
        const submitData = {
            useGithubAvatar: false,
            githubUsername: formData.githubUsername
        }
        setProfilePicture(submitData)
    }

    function useGithubAvatar() {

        // check if github username is empty than return
        if (!formData.githubUsername.trim()) {
            showError("enter valid github username")
            return
        }

        const submitData = {
            useGithubAvatar: true,
            githubUsername: formData.githubUsername
        }
        setProfilePicture(submitData)
    }

    async function setProfilePicture(submitData) {

        setFormData(prev => ({
            ...prev,
            imageUrl: LoadingPicture || ""
        }));

        if (!isAuthTokenValid()) {
            setError("Authentication token missing. Please log in.");
            return;
        }

        try {
            const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/updateUserprofile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("authToken")}`
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();
            console.log("result:", result);

            if (response.ok) {
                console.log("result after success:", result);
                showSuccess("Profile Updated successful");
                fetchAuthUser();

                // Fetch the updated profile data to refresh the UI
                if (userStatusData && userStatusData.isProfileCompleted) {
                    const profileResponse = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/me", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${Cookies.get("authToken")}`
                        },
                    });

                    if (profileResponse.ok) {
                        const updatedProfile = await profileResponse.json();

                        // Update the image URL in the form data directly
                        setFormData(prev => ({
                            ...prev,
                            imageUrl: updatedProfile.imageUrl || ""
                        }));
                    }
                }
            } else {
                console.log("result after failure:", result.error);
                showError(result.error || result.message || "failed to Update profile");
            }
        } catch (error) {
            showError(error.message || "Something went wrong. Please try again.");
        }
    }


    function validateBackupEmail() {
        const backupemailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!backupemailRegex.test(formData.backupEmail)) {
            showError("Enter Valid Email");
            return false;
        }
        return true;
    }

    async function sendVerificationMail(e) {
        e.preventDefault();

        if (!validateBackupEmail()) {
            return
        }

        const verifyBackEmailData = {
            backupemail: formData.backupEmail.toLowerCase().trim(),
        };

        try {
            const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/request-backup-verification", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${Cookies.get("authToken")}`
                },
                body: JSON.stringify(verifyBackEmailData),
            });

            const result = await response.json();
            console.log(result)


            if (response.ok) {
                showSuccess("Email Send successfully!");
            } else {
                showError(result.message || "Failed To send Email!");
            }
        } catch (error) {
            showError(error.message || "Something went wrong. Please try again.");
            setLoaderStatus(false)
        }
    }

    useEffect(() => {
        console.log(isBackupEmailVerified)
    }, [isBackupEmailVerified])

    useEffect(() => {
        console.log("loaderStatus" + loaderStatus)
    }, [loaderStatus])


    return (
        <>
            <div className="main_container bg-white">

                {(userStatusData?.isProfileCompleted == false || (Object.keys(userStatusData).length != 0 && Object.keys(userProfileData).length != 0)
                    ?
                    <form className={styles.form} onSubmit={submitHandler}>
                        <div className={styles.main_flex}>
                            <div>
                                <div className={styles.form_group} onClick={() => navigate(-1)}>
                                    {/* <span><svg className={styles.back_btn} xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                 <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                             </svg> </span> */}
                                    <span> ⇦ </span>
                                    <span className={styles.editprofile}> Edit Profile</span>
                                </div>
                            </div>
                            <div> </div>
                        </div>

                        <div className={styles.main_flex}>
                            <div className={styles.flex} style={{ justifyContent: 'center' }}>
                                <div className={styles.img_container}>
                                    <img src={formData.imageUrl} alt="" />
                                </div> 
                                {
                                    !!userStatusData?.isProfileCompleted && <div>
                                        <p className={styles.import_btn} onClick={useDefaultPic}>use Default Picture</p>
                                        or<br />
                                        <p className={styles.import_btn} onClick={useGithubAvatar}>import from Github</p>
                                    </div>
                                }

                            </div>

                            <div>
                                <div className={styles.form_group}>
                                    <input name="name" value={formData.name} onChange={handleChange} placeholder=" " required />
                                    <label htmlFor="name">Name</label>
                                </div>
                                <div className={styles.form_group}>
                                    <input name="username" value={formData.username} onChange={handleChange} placeholder=" " required />
                                    <label htmlFor="username">Username</label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.main_flex}>
                            <div>
                                <div className={styles.form_group}>
                                    <input name="clgemail" value={formData.clgemail} onChange={handleChange} placeholder=" " required readOnly />
                                    <label htmlFor="email">DDU Email</label>
                                </div>
                            </div>
                            <div>
                                <div className={`${styles.form_group} ${styles.backupEmail}`}>
                                    <input name="backupEmail" value={formData.backupEmail} onChange={handleChange} placeholder=" "
                                        readOnly={isBackupEmailVerified} />
                                    <label>Personal Email</label>
                                    {/* <button disabled={isBackupEmailVerified}
                                        onClick={isBackupEmailVerified ? undefined : sendVerificationMail}
                                        className={isBackupEmailVerified ? styles.verified : styles.unverified}>
                                        {isBackupEmailVerified ? "Verified" : "unVerified"}
                                    </button> */}
                                </div>
                            </div>
                        </div>

                        <div className={styles.main_flex}>
                            <div>
                                <div className={styles.form_group}>
                                    <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder=" " />
                                    <label htmlFor="linkedin">LinkedIn Profile Url</label>
                                </div>
                            </div>
                            <div>
                                <div className={styles.form_group}>
                                    <input name="githubUsername" value={formData.githubUsername} onChange={handleChange} placeholder=" " />
                                    <label htmlFor="github">GitHub Username</label>
                                </div>
                            </div>
                        </div>

                        <div className={styles.main_flex} >
                            <div>
                                <div className={styles.tag_container}>
                                    <p className={styles.tag_header}>Select up to 3 tags that is relevant to your skill set</p>
                                    <p className={styles.tag_notice}>once you select a tag than you can change only on the first day of every month </p>
                                    <div className={styles.options_list}>
                                        {profileTagsList.map((option) => (
                                            <button
                                                type='button'
                                                key={option}
                                                className={`${styles.option_btn} ${formData.selectedTags.includes(option) && styles.selected}`}
                                                onClick={() => { ((!userStatusData.isProfileCompleted || (new Date().getDate() === 1)) ? handleSelect(option) : showError("you can't change tags")) }}>
                                                # {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                {/* <p>Selected: {formData.selectedTags.join(", ")}</p> */}
                            </div>

                            <div>
                                <div className={styles.form_group} style={{ position: 'relative' }}>
                                    <textarea name="bio" className={styles.textareafont} value={formData.bio} maxLength="75" onChange={handleChange} placeholder=" " required />
                                    <label className={styles.textarea_label} htmlFor="bio">Bio</label>
                                    <div className={styles.length}>{(formData.bio).length} / 75</div>
                                </div>

                                <div className={styles.form_group}>
                                    <input name='graduation' value={formData.graduation} onChange={handleChange} placeholder=" " required />
                                    <label>Graduation Details (i.e. IT-2026)</label>
                                </div>
                            </div>
                        </div>
                        <div className={styles.main_flex}>
                            <div></div>
                            <div>
                                <div className={`${styles.form_group} ${styles.btn_container}`}>
                                    <button
                                        className={styles.btn}
                                        type="submit"
                                    >
                                        {!loaderStatus ? "Save" : <div className={styles.loader}></div>}
                                    </button>
                                </div>

                            </div>
                        </div>
                    </form>
                    :
                    <div className={styles.mainloaderContainer}>
                        <div className={styles.mainloader}></div>
                    </div>
                )

                }

                {/* Floating Error Message */}
                {error && <div className="errorMsg">{error}</div>}

                {/* Floating Success Message */}
                {success && <div className="successMsg">{success}</div>}

            </div>
        </>
    )
}

export default EditProfile


// "use client"

// import styles from "./EditProfile.module.css"
// import { useState, useEffect } from "react"
// import { useNavigate } from "react-router-dom"
// import Cookies from "js-cookie"
// import LoadingPicture from "../../assets/svgs/spinning.svg"

// function EditProfile() {
//   const navigate = useNavigate()

//   const [formData, setFormData] = useState({
//     imageUrl: "",
//     name: "",
//     username: "",
//     bio: "",
//     clgemail: localStorage.getItem("email") || "",
//     backupEmail: "",
//     selectedTags: [],
//     linkedinUrl: "",
//     githubUsername: "",
//     graduation: "",
//   })

//   const [error, setError] = useState("")
//   const [success, setSuccess] = useState("")
//   const [loaderStatus, setLoaderStatus] = useState(false)
//   const [userStatusData, setUserStatusData] = useState({})
//   const [userProfileData, setUserProfileData] = useState({})
//   const [profileTagsList, setProfileTagsList] = useState([])
//   const [isBackupEmailVerified, setBackupEmailVerified] = useState(false)

//   function showError(message) {
//     setError(message)
//     setSuccess("")
//     setTimeout(() => setError(""), 4000)
//   }

//   function showSuccess(message) {
//     setSuccess(message)
//     setError("")
//     setTimeout(() => setSuccess(""), 4000)
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }))
//   }

//   // Returns true if token exists, false otherwise
//   function isAuthTokenValid() {
//     return !!Cookies.get("authToken")
//   }

//   const handleSelect = (option) => {
//     setFormData((prevData) => {
//       const currentTags = [...prevData.selectedTags]

//       if (currentTags.includes(option)) {
//         // Remove if already selected
//         return {
//           ...prevData,
//           selectedTags: currentTags.filter((item) => item !== option),
//         }
//       } else if (currentTags.length < 3) {
//         // Add if under limit
//         return {
//           ...prevData,
//           selectedTags: [...currentTags, option],
//         }
//       }

//       return prevData // Return unchanged if at limit
//     })
//   }

//   //retrive all Tags that user can add in their profile
//   useEffect(() => {
//     fetch("https://querynest-4tdw.onrender.com/api/TagDetails/ProfileTag", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//       },
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`Error: ${response.status} - ${response.statusText}`)
//         }
//         return response.json()
//       })
//       .then((data) => {
//         console.log("Fetched Data:", data) // Log after Data Fetched update
//         setProfileTagsList(data)
//         console.log(data)
//       })
//       .catch((err) => {
//         console.error("Failed to fetch user data:", err)
//         setError(err.message)
//       })
//   }, [])

//   // fetch User Data to check if user is userProfile is already created or not ( isProfileCompleted)
//   useEffect(() => {
//     const fetchUserStatusData = () => {
//       if (!isAuthTokenValid()) {
//         setError("Authentication token missing. Please log In.")
//         return
//       }

//       fetch("https://querynest-4tdw.onrender.com/api/User/me", {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("authToken")}`,
//         },
//       })
//         .then((response) => {
//           if (!response.ok) {
//             throw new Error(`Error: ${response.status} - ${response.statusText}`)
//           }
//           return response.json()
//         })
//         .then((data) => {
//           console.log("Fetched User Status Data:", data)
//           setUserStatusData(data)
//           // Check if backupemail exists and is verified
//           setBackupEmailVerified(data.backupEmailVerified || false)
//           console.log("=========================")
//           console.log("Backup Email Verified:", data.backupEmailVerified)
//         })
//         .catch((err) => {
//           console.error("Failed to fetch user data:", err)
//           setError(err.message)
//         })
//     }
//     fetchUserStatusData()
//   }, [])

//   // execute when userStatusData fetched and Profile is NOT Completed
//   useEffect(() => {
//     if (userStatusData && !userStatusData.isProfileCompleted) {
//       // set the data of userStatus to be displayed in the form
//       setFormData((prev) => ({
//         ...prev,
//         name: userStatusData.name || "",
//         username: userStatusData.username || "",
//         clgemail: userStatusData.clgemail || "",
//         imageUrl: userStatusData.imageUrl,
//       }))
//     } else if (userStatusData && userStatusData.isProfileCompleted) {
//       const fetchUserProfileData = () => {
//         if (!isAuthTokenValid()) {
//           setError("Authentication token missing. Please log in.")
//           return
//         }

//         fetch("https://querynest-4tdw.onrender.com/api/UserProfile/me", {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${Cookies.get("authToken")}`,
//           },
//         })
//           .then((response) => {
//             if (!response.ok) {
//               throw new Error(`Error: ${response.status} - ${response.statusText}`)
//             }
//             return response.json()
//           })
//           .then((data) => {
//             console.log("Fetched userProfileData:", data) // Log after state update
//             setUserProfileData(data)
//           })
//           .catch((err) => {
//             console.error("Failed to fetch user profile data:", err)
//             setError(err.message || "Failed to fetch user profile data")
//           })
//       }

//       fetchUserProfileData()
//     }
//   }, [userStatusData])

//   // set the data of userProfile to be displayed in the form
//   useEffect(() => {
//     fillTheLatestData()
//   }, [userProfileData])

//   function fillTheLatestData() {
//     if (Object.keys(userProfileData).length > 0) {
//       // Ensure data is available before setting state
//       setFormData({
//         name: userProfileData.name || "",
//         username: userProfileData.username || "",
//         imageUrl: userProfileData.imageUrl || "",
//         bio: userProfileData.bio || "",
//         clgemail: userProfileData.clgemail || "",
//         backupEmail: userProfileData.backupemail || "",
//         selectedTags: userProfileData.tags || [],
//         linkedinUrl: userProfileData.LinkedInUrl || "",
//         githubUsername: userProfileData.githubUsername || "",
//         graduation: userProfileData.Graduation || "",
//       })
//     }
//   }

//   // alphabet,space and length 2 to 20
//   function validateName() {
//     const nameRegex = /^[A-Za-z ]{2,20}$/
//     if (!nameRegex.test(formData.name)) {
//       showError("Name should contain only letters.")
//       return false
//     }
//     return true
//   }

//   // alphabet,digit,underscore,dot and length 6 to 15
//   function validateUsername() {
//     const usernameRegex = /^[a-zA-Z0-9._]{6,15}$/
//     if (!usernameRegex.test(formData.username)) {
//       showError("Username should be of 6 to 15 characters and only contain letters, numbers, and underscores")
//       return false
//     }
//     return true
//   }

//   function validateBio() {
//     if (formData.bio.length == 0) {
//       showError("profile Bio is required")
//       return false
//     }
//     return true
//   }

//   function validateGraduation() {
//     const graduationRegex = /^[A-Za-z]{2}-\d{4}$/
//     if (!graduationRegex.test(formData.graduation)) {
//       showError("Enter Valid Graduation Detail")
//       return false
//     }
//     return true
//   }

//   // Fix the verifiedBackupEmail function to properly handle the verification logic
//   function verifiedBackupEmail() {
//     if (formData.backupEmail) {
//       if (!isBackupEmailVerified) {
//         showError("Please verify your backup email!")
//         return false
//       }
//       return true
//     }
//     return true // If no backup email is provided, no verification needed
//   }

//   async function submitHandler(e) {
//     e.preventDefault()

//     // validate some Input Data
//     if (!validateName() || !validateUsername() || !verifiedBackupEmail() || !validateBio() || !validateGraduation()) {
//       return
//     }

//     const submitData = {
//       name: formData.name.trim(),
//       imageUrl: formData.imageUrl,
//       clgemail: formData.clgemail.toLowerCase().trim(),
//       username: formData.username.toLowerCase().trim(),
//       backupemail: formData.backupEmail.toLowerCase().trim(),
//       LinkedInUrl: formData.linkedinUrl,
//       githubUsername: formData.githubUsername,
//       bio: formData.bio.trim(),
//       Graduation: formData.graduation.toUpperCase().trim(),
//       tags: formData.selectedTags,
//     }

//     console.log(" before api call submitData : " + submitData)

//     setLoaderStatus(true)

//     try {
//       if (!isAuthTokenValid()) {
//         setError("Authentication token missing. Please log in.")
//         return
//       }

//       console.log("submitted data:" + submitData)

//       // if Profile is Completes than update it
//       if (userStatusData.isProfileCompleted) {
//         const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/updateuserprofile", {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${Cookies.get("authToken")}`,
//           },
//           body: JSON.stringify(submitData),
//         })

//         const result = await response.json()
//         console.log("result:" + result)

//         setLoaderStatus(false)

//         if (response.ok) {
//           console.log("result after success:" + result)
//           showSuccess("Profile Updated successful")
//           setTimeout(() => navigate("/profile"), 2000)
//         } else {
//           console.log(result.error)
//           showError(result.error || result.message || "failed to Update profile")
//         }
//       } else {
//         // if Profile is not created means(isProfileCompleted is False) than create it
//         const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/createuserprofile", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${Cookies.get("authToken")}`,
//           },
//           body: JSON.stringify(submitData),
//         })

//         const result = await response.json()
//         console.log("result:" + result)

//         setLoaderStatus(false)

//         if (response.ok) {
//           console.log("result after success:" + result)
//           showSuccess("Profile Updated successful")
//           setTimeout(() => navigate("/profile"), 2000)
//         } else {
//           console.log("result after failuer:" + result.error)
//           showError(result.error || result.message || "failed to Update profile")
//         }
//       }
//     } catch (error) {
//       showError(error.message || "Something went wrong. Please try again.")
//       setLoaderStatus(false)
//     }
//   }

//   function useDefaultPic() {
//     const submitData = {
//       useGithubAvatar: false,
//       githubUsername: formData.githubUsername,
//     }
//     setProfilePicture(submitData)
//   }

//   function useGithubAvatar() {
//     // check if github username is empty than return
//     if (!formData.githubUsername.trim()) {
//       showError("enter valid github username")
//       return
//     }

//     const submitData = {
//       useGithubAvatar: true,
//       githubUsername: formData.githubUsername,
//     }
//     setProfilePicture(submitData)
//   }

//   async function setProfilePicture(submitData) {
//     setFormData((prev) => ({
//       ...prev,
//       imageUrl: LoadingPicture || "",
//     }))

//     if (!isAuthTokenValid()) {
//       setError("Authentication token missing. Please log in.")
//       return
//     }

//     try {
//       setLoaderStatus(true)
//       const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/updateUserprofile", {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("authToken")}`,
//         },
//         body: JSON.stringify(submitData),
//       })

//       const result = await response.json()
//       console.log("result:", result)

//       if (response.ok) {
//         console.log("result after success:", result)
//         showSuccess("Profile Updated successful")

//         // Fetch the updated profile data to refresh the UI
//         if (userStatusData && userStatusData.isProfileCompleted) {
//           const profileResponse = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/me", {
//             method: "GET",
//             headers: {
//               "Content-Type": "application/json",
//               Authorization: `Bearer ${Cookies.get("authToken")}`,
//             },
//           })

//           if (profileResponse.ok) {
//             const updatedProfile = await profileResponse.json()
//             setUserProfileData(updatedProfile)
//             // Update the image URL in the form data directly
//             setFormData((prev) => ({
//               ...prev,
//               imageUrl: updatedProfile.imageUrl || "",
//             }))
//           }
//         }
//       } else {
//         console.log("result after failure:", result.error)
//         showError(result.error || result.message || "failed to Update profile")
//       }
//     } catch (error) {
//       showError(error.message || "Something went wrong. Please try again.")
//     } finally {
//       setLoaderStatus(false)
//     }
//   }

//   function validateBackupEmail() {
//     const backupemailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
//     if (!backupemailRegex.test(formData.backupEmail)) {
//       showError("Enter Valid Email")
//       return false
//     }
//     return true
//   }

//   async function sendVerificationMail(e) {
//     e.preventDefault()

//     if (!validateBackupEmail()) {
//       return
//     }

//     const verifyBackEmailData = {
//       backupemail: formData.backupEmail.toLowerCase().trim(),
//     }

//     try {
//       const response = await fetch("https://querynest-4tdw.onrender.com/api/User/verifybackupemail", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${Cookies.get("authToken")}`,
//         },
//         body: JSON.stringify(verifyBackEmailData),
//       })

//       const result = await response.json()
//       console.log(result)

//       if (response.ok) {
//         showSuccess("Email Send successfully!")
//       } else {
//         showError(result.message || "Failed To send Email!")
//       }
//     } catch (error) {
//       showError(error.message || "Something went wrong. Please try again.")
//       setLoaderStatus(false)
//     }
//   }

//   return (
//     <>
//       <div className="main_container bg-white">
//         {userStatusData?.isProfileCompleted == false ||
//         (Object.keys(userStatusData).length != 0 && Object.keys(userProfileData).length != 0) ? (
//           <div className={styles.form} onSubmit={submitHandler}>
//             <div className={styles.main_flex}>
//               <div>
//                 <div className={styles.form_group} onClick={() => navigate(-1)}>
//                   {/* <span><svg className={styles.back_btn} xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
//                                  <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
//                              </svg> </span> */}
//                   <span> ⇦ </span>
//                   <span className={styles.editprofile}> Edit Profile</span>
//                 </div>
//               </div>
//               <div> </div>
//             </div>

//             <div className={styles.main_flex}>
//               <div className={styles.flex} style={{ justifyContent: "center" }}>
//                 <div className={styles.img_container}>
//                   <img src={formData.imageUrl || "/placeholder.svg"} alt="" />
//                 </div>

//                 <div>
//                   <p className={styles.import_btn} onClick={useDefaultPic}>
//                     use Default Picture
//                   </p>
//                   or
//                   <br />
//                   <p className={styles.import_btn} onClick={useGithubAvatar}>
//                     import from Github
//                   </p>
//                 </div>
//               </div>

//               <div>
//                 <div className={styles.form_group}>
//                   <input name="name" value={formData.name} onChange={handleChange} placeholder=" " required />
//                   <label htmlFor="name">Name</label>
//                 </div>
//                 <div className={styles.form_group}>
//                   <input name="username" value={formData.username} onChange={handleChange} placeholder=" " required />
//                   <label htmlFor="username">Username</label>
//                 </div>
//               </div>
//             </div>

//             <div className={styles.main_flex}>
//               <div>
//                 <div className={styles.form_group}>
//                   <input
//                     name="clgemail"
//                     value={formData.clgemail}
//                     onChange={handleChange}
//                     placeholder=" "
//                     required
//                     readOnly
//                   />
//                   <label htmlFor="email">DDU Email</label>
//                 </div>
//               </div>
//               <div>
//                 <div className={`${styles.form_group} ${styles.backupEmail}`}>
//                   <input
//                     name="backupEmail"
//                     value={formData.backupEmail}
//                     onChange={handleChange}
//                     placeholder=" "
//                     readOnly={isBackupEmailVerified}
//                   />
//                   <label htmlFor="email">Personal Email</label>
//                   {formData.backupEmail && (
//                     <button
//                       type="button"
//                       onClick={isBackupEmailVerified ? undefined : sendVerificationMail}
//                       className={isBackupEmailVerified ? styles.verified : styles.unverified}
//                       disabled={isBackupEmailVerified}
//                     >
//                       {isBackupEmailVerified ? "Verified" : "Verify"}
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>

//             <div className={styles.main_flex}>
//               <div>
//                 <div className={styles.form_group}>
//                   <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder=" " />
//                   <label htmlFor="linkedin">LinkedIn Profile Url</label>
//                 </div>
//               </div>
//               <div>
//                 <div className={styles.form_group}>
//                   <input
//                     name="githubUsername"
//                     value={formData.githubUsername}
//                     onChange={handleChange}
//                     placeholder=" "
//                   />
//                   <label htmlFor="github">GitHub Username</label>
//                 </div>
//               </div>
//             </div>

//             <div className={styles.main_flex}>
//               <div>
//                 <div className={styles.tag_container}>
//                   <p className={styles.tag_header}>Select up to 3 tags that is relevant to your skill set</p>
//                   <div className={styles.options_list}>
//                     {profileTagsList.map((option) => (
//                       <button
//                         key={option}
//                         className={`${styles.option_btn} ${formData.selectedTags.includes(option) && styles.selected}`}
//                         onClick={() => {
//                           !userStatusData.isProfileCompleted ? handleSelect(option) : alert("you cant slect tags")
//                         }}
//                       >
//                         # {option}
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 {/* <p>Selected: {formData.selectedTags.join(", ")}</p> */}
//               </div>

//               <div>
//                 <div className={styles.form_group} style={{ position: "relative" }}>
//                   <textarea
//                     name="bio"
//                     className={styles.textareafont}
//                     value={formData.bio}
//                     maxLength="75"
//                     onChange={handleChange}
//                     placeholder=" "
//                     required
//                   />
//                   <label className={styles.textarea_label} htmlFor="bio">
//                     Bio
//                   </label>
//                   <div className={styles.length}>{formData.bio.length} / 75</div>
//                 </div>

//                 <div className={styles.form_group}>
//                   <input
//                     name="graduation"
//                     value={formData.graduation}
//                     onChange={handleChange}
//                     placeholder=" "
//                     required
//                   />
//                   <label>Graduation Details (i.e. IT-2026)</label>
//                 </div>
//               </div>
//             </div>
//             <div className={styles.main_flex}>
//               <div></div>
//               <div>
//                 <div className={`${styles.form_group} ${styles.btn_container}`}>
//                   <button type="submit" className={styles.btn} onClick={submitHandler}>
//                     Save
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ) : (
//           <div className={styles.mainloaderContainer}>
//             <div className={styles.mainloader}></div>
//           </div>
//         )}

//         {/* Floating Error Message */}
//         {error && <div className="errorMsg">{error}</div>}

//         {/* Floating Success Message */}
//         {success && <div className="successMsg">{success}</div>}
//       </div>
//     </>
//   )
// }

// export default EditProfile

