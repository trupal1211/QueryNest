import styles from './EditProfile.module.css'
import profile_pic from '../../assets/Images/profile_photo.jpeg'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import tags from '../../assets/tags'

function EditProfile() {

    const navigate = useNavigate()

    const [image, setImage] = useState(profile_pic);
    
    const [name,setName] = useState("")
    const [username,setUsername] = useState("")
    const [backupEmail,setBackupEmail] = useState("");
    const [linkedinUrl,setLinkedinUrl] = useState("");
    const [githubUsername,setGithubUsername] = useState("");
    const [bio, setBio] = useState('');
    const [graduation,setGraduation]=useState();
    const [selected, setSelected] = useState([]);
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

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    }


    const handleSelect = (option) => {
        if(selected.includes(option)){
            setSelected(selected.filter(item => item !== option)); // Remove if already selected
        }else if (selected.length < 3) {
            setSelected([...selected, option]); // Add if under limit
        }
        console.log(selected)
    };

    async function submitHandler(e){

        e.preventDefault();
        const clgemail=localStorage.getItem("email") ;
        const formData = {
            imgUrl:image||"hello",
            clgemail:clgemail ,
            username:username,
            backupemail: backupEmail,
            LinkedInusername: linkedinUrl,
            Githubusername: githubUsername,
            bio: bio,
            Graduation: graduation,
            tags: selected
        }

        setLoaderStatus(true)

        try {
            const token = localStorage.getItem("authToken"); // Retrieve token from localStorage

            const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/createuserprofile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}` // Include token in Authorization header
              },
              body: JSON.stringify(formData),
            });
            
          const result = await response.json();
          console.log("result:"+result);
        //   console.log("clgemailll:"+clgemail)
    
          setLoaderStatus(false)
    
          if (response.ok) {
            console.log("result after success:"+result);
            showSuccess("Profile Updated successful");
            localStorage.setItem("backupEmail", formData.backupemail);
    
            setTimeout(() => navigate("/profile"), 2000); // Navigate after showing success message
          } else {
            console.log("result after failuer:"+result.error);
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
                                    <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                                </svg> </span>
                                <span className={styles.editprofile}> Edit Profile</span>
                            </div>
                        </div>
                        <div> </div>
                    </div>

                    <div className={styles.main_flex}>
                        <div className={styles.flex} style={{ justifyContent: 'center' }}>
                            <div className={styles.img_container}>
                                <img src={image} alt="" />
                            </div>

                            <div>
                                <div className={styles.img_input}>
                                    <input type="file" accept="image/*" onChange={handleImageChange} />
                                </div>
                                or <br />
                                <p className={styles.import_btn}>import from Github</p>

                            </div>
                        </div>

                        <div>
                            <div className={styles.form_group}>
                                <input type="name" id="name" onChange={(e)=>setName(e.target.value)} placeholder=" " required />
                                <label htmlFor="name">Name</label>
                            </div>
                            <div className={styles.form_group}>
                                <input type="username" id="username" onChange={(e)=>setUsername(e.target.value)} placeholder=" " required />
                                <label htmlFor="username">Username</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.main_flex}>
                        <div>
                            <div className={styles.form_group}>
                                <input type="email" id="email" placeholder=" " value={"22ituos041@ddu.ac.in"} required readOnly />
                                <label htmlFor="email">DDU Email</label>
                            </div>
                        </div>
                        <div>
                            <div className={styles.form_group}>
                                <input type="email" id="email" onChange={(e)=>{setBackupEmail(e.target.value)}} placeholder=" " required />
                                <label htmlFor="email">Personal Email</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.main_flex}>
                        <div>
                            <div className={styles.form_group}>
                                <input type="linkedin" id="linkedin" onChange={(e)=>setLinkedinUrl(e.target.value)} placeholder=" " required />
                                <label htmlFor="linkedin">LinkedIn Profile Url</label>
                            </div>
                        </div>
                        <div>
                            <div className={styles.form_group}>
                                <input type="github" id="github" onChange={(e)=>{setGithubUsername(e.target.value)}} placeholder=" " required />
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
                                            className={`${styles.option_btn} ${selected.includes(option) && styles.selected}`} onClick={() => handleSelect(option)}>
                                            # {option}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <p>Selected: {selected.join(", ")}</p>
                        </div>

                        <div>
                            <div className={styles.form_group} style={{ position: 'relative' }}>
                                <textarea id="bio" maxLength="75" onChange={(e) => setBio(e.target.value)} placeholder=" " required />
                                <label className={styles.textarea_label} htmlFor="bio">Bio</label>
                                <div className={styles.length}>{bio.length} / 75</div>
                            </div>

                            <div className={styles.form_group}>
                                <input type="github" id="github" onChange={(e)=>setGraduation(e.target.value)} placeholder=" " required />
                                <label htmlFor="github">Graduation Details (i.e. IT-2026)</label>
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
