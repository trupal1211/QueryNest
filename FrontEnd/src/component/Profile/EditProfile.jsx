import styles from './EditProfile.module.css'
import profile_pic from '../../assets/Images/profile_photo.jpeg'
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import tags from '../../assets/tags'
import Cookies from "js-cookie";

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
    const [userProfileData,setUserProfileData] = useState({});

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
        const { name, value, type, files } = e.target;

        if (type === "file") {
            // Handle file input (profile picture)
            const file = files[0];
            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prevData => ({
                        ...prevData,
                        imageUrl: reader.result
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else {
            // Handle all other inputs
            setFormData(prevData => ({
                ...prevData,
                [name]: value
            }));
        }
    };

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


    useEffect(() => {

        const fetchUserStatusData = () => {

            const token = Cookies.get("authToken");

            if (!token) {
                console.error("No auth token found!");
                setError("Authentication token missing. Please log in.");
                return;
            }

            fetch("https://querynest-4tdw.onrender.com/api/User/me", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }
                    return response.json();
                })
                .then((data) => {
                    console.log("Fetched Data:", data); // Log after state update
                    setUserStatusData(data)
                })
                .catch((err) => {
                    console.error("Failed to fetch user data:", err);
                    setError(err.message);
                })
                .finally();
        };

        fetchUserStatusData();
    }, []);


    useEffect(() => {
        if (userStatusData && (!userStatusData.isProfileCompleted) ) {
            setFormData((prev) => ({
                ...prev,
                name: userStatusData.name || "",
                username: userStatusData.username || "",
                clgemail: userStatusData.clgemail || "",
                imageUrl: userStatusData.imgUrl
            }));
        }
        else if(userStatusData && userStatusData.isProfileCompleted){

            const fetchUserProfileData = () => {

                const token = Cookies.get("authToken");
    
                if (!token) {
                    console.error("No auth token found!");
                    setError("Authentication token missing. Please log in.");
                    return;
                }
    
                fetch("https://querynest-4tdw.onrender.com/api/UserProfile", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
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
                        // setFormData({
                        //     name:userStatusData.name,
                        //     username:userProfileData.username ,
                        //     imageUrl: userProfileData.imgUrl,
                        //     bio: userProfileData.bio,
                        //     clgemail: userProfileData.clgemail,
                        //     backupEmail: userProfileData.backupemail,
                        //     selectedTags: userProfileData.tags || [],
                        //     linkedinUrl: userProfileData.LinkedInUrl,
                        //     githubUsername: userProfileData.Githubusername,
                        //     graduation: userProfileData.Graduation,
                        // })
                        // console.log(userProfileData)
                    })
                    .catch((err) => {
                        console.error("Failed to fetch user profile data:", err);
                        setError(err.message);
                    })
                    .finally();
            };

            fetchUserProfileData();

        }
    }, [userStatusData]);


    useEffect(()=>{

            if (Object.keys(userProfileData).length > 0) {  // Ensure data is available before setting state
                setFormData({
                    name: userProfileData.name || "",
                    username: userProfileData.username || "",
                    imageUrl: userProfileData.imgUrl || "",
                    bio: userProfileData.bio || "",
                    clgemail: userProfileData.clgemail || "",
                    backupEmail: userProfileData.backupemail || "",
                    selectedTags: userProfileData.tags || [],
                    linkedinUrl: userProfileData.LinkedInUrl || "",
                    githubUsername: userProfileData.Githubusername || "",
                    graduation: userProfileData.Graduation || "",
                });
            }

    },[userProfileData])

    


    async function submitHandler(e) {

        e.preventDefault();
        
        const submitData = {
            name: formData.name,
            imgUrl: formData.imageUrl || "hello",
            clgemail: formData.clgemail || localStorage.getItem("clgEmail") || "",
            username: formData.username,
            backupemail: formData.backupEmail,
            LinkedInUrl: formData.linkedinUrl,
            Githubusername: formData.githubUsername,
            bio: formData.bio,
            Graduation: formData.graduation,
            tags: formData.selectedTags,
        }

        console.log(submitData)


        setLoaderStatus(true)

        try {
            const token = Cookies.get("authToken");

            console.log(" submitData.clgemail = "+ submitData.clgemail)
            console.log("submitted data:"+submitData)
            console.log("submitted linkedin:"+submitData.LinkedInUrl)

            const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/createuserprofile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(submitData),
            });

            const result = await response.json();
            console.log("result:" + result);

            setLoaderStatus(false)

            if (response.ok) {
                console.log("result after success:" + result);
                showSuccess("Profile Updated successful");
                localStorage.setItem("backupEmail", submitData.backupemail);

                setTimeout(() => navigate("/profile"), 2000);
            } else {
                console.log("result after failuer:" + result.error);
                showError(result.error || result.message || "failed to Update profile");
            }
        } catch (error) {
            showError(error.message || "Something went wrong. Please try again.");
            setLoaderStatus(false)
        }
    }

    return (
        <>
            <div className="main_container bg-white">
                <div className={styles.form} onSubmit={submitHandler}>
                    <div className={styles.main_flex}>
                        <div>
                            <div className={styles.form_group}>
                                <span><svg className={styles.back_btn} xmlns="http://www.w3.org/2000/svg" width="20" height="18" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                                </svg> </span>
                                <span className={styles.editprofile}> Edit Profile</span>
                            </div>
                        </div>
                        <div> </div>
                    </div>

                    <div className={styles.main_flex}>
                        <div className={styles.flex} style={{ justifyContent: 'center' }}>
                            <div className={styles.img_container}>
                                <img src={formData.imageUrl || "/placeholder.svg"} alt="" />
                            </div>

                            <div>
                                <div className={styles.img_input}>
                                    <input name='imageUrl' type="file" accept="image/*" onChange={handleChange} />
                                </div>
                                or <br />
                                <p className={styles.import_btn}>import from Github</p>
                            </div>
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
                            <div className={styles.form_group}>
                                <input name="backupEmail" value={formData.backupEmail} onChange={handleChange} placeholder=" " required />
                                <label htmlFor="email">Personal Email</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.main_flex}>
                        <div>
                            <div className={styles.form_group}>
                                <input name="linkedinUrl" value={formData.linkedinUrl} onChange={handleChange} placeholder=" " required />
                                <label htmlFor="linkedin">LinkedIn Profile Url</label>
                            </div>
                        </div>
                        <div>
                            <div className={styles.form_group}>
                                <input name="githubUsername" value={formData.githubUsername} onChange={handleChange} placeholder=" " required />
                                <label htmlFor="github">GitHub Username</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.main_flex} >
                        <div>
                            <div className={styles.tag_container}>
                                <p className={styles.tag_header}>Select up to 3 tags that is relevant to your skill set</p>
                                <div className={styles.options_list}>
                                    {tags.map((option) => (
                                        <button
                                            key={option}
                                            className={`${styles.option_btn} ${formData.selectedTags.includes(option) && styles.selected}`}
                                            onClick={() => handleSelect(option)}>
                                            # {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p>Selected: {formData.selectedTags.join(", ")}</p>
                        </div>

                        <div>
                            <div className={styles.form_group} style={{ position: 'relative' }}>
                                <textarea name="bio" value={formData.bio} maxLength="75" onChange={handleChange} placeholder=" " required />
                                <label className={styles.textarea_label} htmlFor="bio">Bio</label>
                                <div className={styles.length}>{(formData.bio || "").length} / 75</div>
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
                                <div className={styles.btn} onClick={submitHandler}>Save</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditProfile











