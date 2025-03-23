import styles from './EditProfile.module.css'
import profile_pic from '../../assets/Images/profile_photo.jpeg'
import { useState } from 'react';
import tags from '../../assets/tags'

function EditProfile() {

    const [image, setImage] = useState(profile_pic);
    const [bio, setBio] = useState('');

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

    const [selected, setSelected] = useState([]);

    const handleSelect = (option) => {
        if (selected.includes(option)) {
            setSelected(selected.filter(item => item !== option)); // Remove if already selected
        } else if (selected.length < 3) {
            setSelected([...selected, option]); // Add if under limit
        }
    };

    return (
        <>
            <div className="main_container bg-white">

                <div className={styles.form}>

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
                            <div class={styles.form_group}>
                                <input type="name" id="name" placeholder=" " required />
                                <label for="name">Name</label>
                            </div>
                            <div class={styles.form_group}>
                                <input type="username" id="username" placeholder=" " required />
                                <label for="username">Username</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.main_flex}>
                        <div>
                            <div class={styles.form_group}>
                                <input type="email" id="email" placeholder=" " required />
                                <label for="email">DDU Email</label>
                            </div>
                        </div>
                        <div>
                            <div class={styles.form_group}>
                                <input type="email" id="email" placeholder=" " required />
                                <label for="email">Personal Email</label>
                            </div>
                        </div>
                    </div>

                    <div className={styles.main_flex}>
                        <div>
                            <div class={styles.form_group}>
                                <input type="linkedin" id="linkedin" placeholder=" " required />
                                <label for="linkedin">LinkedIn Username</label>
                            </div>
                        </div>
                        <div>
                            <div class={styles.form_group}>
                                <input type="github" id="github" placeholder=" " required />
                                <label for="github">GitHub Username</label>
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
                            {/* <p>Selected: {selected.join(", ")}</p> */}
                        </div>

                        <div>
                            <div class={styles.form_group} style={{ position: 'relative' }}>
                                <textarea id="bio" maxLength="75" onChange={(e) => setBio(e.target.value)} placeholder=" " required />
                                <label className={styles.textarea_label} for="bio">Bio</label>
                                <div className={styles.length}>{bio.length} / 75</div>
                            </div>

                            <div class={styles.form_group}>
                                <input type="github" id="github" placeholder=" " required />
                                <label for="github">Graduation Details (i.e. IT-2026)</label>
                            </div>


                        </div>
                    </div>
                    <div className={styles.main_flex}>
                        <div></div>
                        <div>
                            <div className={`${styles.form_group} ${styles.btn_container}`}>
                                <div className={styles.btn} onClick={() => navigate('/login')}>Save</div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
        </>
    )
}

export default EditProfile
