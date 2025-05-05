import styles from './Profile.module.css';
import linkedin_logo from '../../assets/Images/linkedin.png'
import github_logo from '../../assets/Images/github.png'
import { Archievement } from '../components'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Cookies from 'js-cookie';
import AuthUserContext from '../../context/AuthUserContext';

function Profile() {

  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const { username } = useParams()

  const token = Cookies.get("authToken")

  const { authUser, loading, fetchAuthUser } = useContext(AuthUserContext);


  function logoutHandler() {
    Cookies.remove('authToken');
    Cookies.remove('currentUserId');
    localStorage.clear();
    navigate('/login');
  }

  const ownProfile = !username || (authUser?.authUsername === username);
  const otherProfile = username && (authUser?.authUsername !== username);

  {
    ownProfile && useEffect(() => {
      setUserData("")
      fetch("https://querynest-4tdw.onrender.com/api/UserProfile/me", {
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
          setUserData(data)
          console.log(userData)
        })
        .catch((err) => {
          console.error("Failed to fetch user profile data:", err);
          console.log(err.message);
        })
        .finally();
    }, [username])
  }


  {
    otherProfile && useEffect(() => {
      setUserData("")
      fetch(`https://querynest-4tdw.onrender.com/api/UserProfile/username/${username}`, {
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
          setUserData(data)
        })
        .catch((err) => {
          console.error("Failed to fetch user profile data:", err);
          console.log(err.message);
        })
        .finally();
    }, [username])
  }



  useEffect(() => {
    console.log(userData?.followers)
    console.log("is Followed" + userData?.followers?.includes(authUser?.authid))
  }, [userData.followers])


  function isFollowed() {
    return userData?.followers?.includes(authUser?.authId)
  }

  async function followSubmitHandler(e) {
    e.preventDefault();

    const token = Cookies.get("authToken");

    try {
      const response = await fetch(`https://querynest-4tdw.onrender.com/api/UserProfile/follow/${userData?.userid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

        },
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        console.log("Followed succesful.");
        setUserData((prevData) => ({
          ...prevData,
          followers: [...(prevData.followers || []), authUser?.authId],  // Ensure array exists
          noOfFollowers: (prevData.noOfFollowers || 0) + 1 // Ensure numeric value
        }));
      } else {
        console.log(result.error || result.message || "try again");
      }
    } catch (error) {
      console.log(error.message || "Something went wrong. Please try again.");
    }
  }


  async function unfollowSubmitHandler(e) {
    e.preventDefault();

    const token = Cookies.get("authToken");

    try {
      const response = await fetch(`https://querynest-4tdw.onrender.com/api/UserProfile/unfollow/${userData?.userid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

        },
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
        console.log("UnFollowed succesful.");
        setUserData((prevData) => ({
          ...prevData,
          followers: prevData.followers?.filter(id => id !== authUser?.authId), // Remove the user ID from followers
          noOfFollowers: prevData.noOfFollowers - 1  // Decrease followers count
        }));
      } else {
        console.log(result.error || result.message || "try again");
      }
    } catch (error) {
      console.log(error.message || "Something went wrong. Please try again.");
    }
  }


  return (
    <>
      <div className="main_container bg-white">

        {
          Object.keys(userData).length != 0 ?
            <div className={styles.page_container}>
              <div className={styles.profile_header}>
                <div className={styles.flex}>
                  <div className={styles.img_container}>
                    <img src={userData.imageUrl} alt="" />
                  </div>
                  <div className={styles.width_auto}>
                    <p className={styles.name}>{userData.name || "No Name"}</p>
                    <p className={styles.username}>@{userData.username}</p>
                    <div className={styles.tags}>
                      <p className={styles.tag}>{userData.Graduation}</p>

                      {userData.tags?.map((tag, index) => (
                        <p key={index} className={styles.tag}># {tag}</p>
                      ))}

                    </div>
                  </div>
                </div>

                {userData &&
                  otherProfile ? (isFollowed() ?
                    <div className={`${styles.follow_btn} ${styles.unfollow}`} onClick={unfollowSubmitHandler}>unfollow</div> :
                    <div className={`${styles.follow_btn} ${styles.follow}`} onClick={followSubmitHandler}>follow</div>)
                  :
                  <div className={`${styles.follow_btn} ${styles.edit}`} onClick={() => navigate('/profile/edit')}>
                    edit  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                      <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" /></svg>
                  </div>
                }

              </div>

              <div className={styles.bio_container}>
                <div className={styles.bio}>{userData.bio}</div>

                <div className={styles.wraper}>
                  <div className={styles.linkedin}>
                    <div className={styles.logo_container}>
                      <img src={linkedin_logo} alt="" />
                    </div>
                    <div className={styles.details_container}>
                      {
                        userData.LinkedInUrl ?
                        <>
                          <p className={styles.id_name}>{userData.name || "---"}</p>
                          <a className={styles.small} style={{color:'#0e34a7'}} href={userData?.LinkedInUrl}>connect</a>
                        </> : <p className={styles.id_name}>User Not Found</p> 
                      }
                    </div>
                  </div>
                  <div className={styles.github}>
                    <div className={styles.logo_container}>
                      <img src={github_logo} alt="" />
                    </div>
                    <div className={styles.details_container}>
                      <p className={styles.id_name}>{userData.githubUsername}</p>
                      {!userData.githubUsername && <p className={styles.id_name}>User Not Found</p>}
                      {userData.githubUsername && <p className={`${styles.githubfull} ${styles.small}`}>{userData.githubPublicRepos} public repositories</p>}
                      {userData.githubUsername && <p className={`${styles.githubsort} ${styles.small}`}>{userData.githubPublicRepos} public repos</p>}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.card_container}>
                <div className={styles.card} onClick={() => navigate(`/profile/${userData.username}/queries`)}>
                  <p className={styles.card_header}>Questions</p>
                  <p className={styles.card_body}>{userData.noOfQuestions}</p>
                </div>

                <div className={styles.card} onClick={() => navigate(`/profile/${userData.username}/answers`)} >
                  <p className={styles.card_header}>Answers</p>
                  <p className={styles.card_body}>{userData.noOfAnswers}</p>
                </div>

                <div className={styles.card}>
                  <p className={styles.card_header}>Avg. Rating</p>
                  <p className={styles.card_body}>{ userData.avgRating.toFixed(2) || 0}</p>
                </div>
                <div className={styles.card}>
                  <p className={styles.card_header}>Total Points</p>
                  <p className={styles.card_body}>{userData.totalPoints}</p>
                </div>
              </div>

              <div className={styles.last_card_container}>

                <div className={styles.followerscard_container}>
                  <div className={styles.card}>
                    <div className={styles.title}>followers</div>
                    <div className={styles.number}>{userData.noOfFollowers}</div>
                    <div className={styles.oneline}>
                      <span className={styles.oneline_number}>{userData.noOfFollowers} </span>
                      followers</div>
                  </div>
                  <div className={styles.card}>
                    <div className={styles.title}>following</div>
                    <div className={styles.number}>{userData.noOfFollowing}</div>
                    <div className={styles.oneline}>
                      <span className={styles.oneline_number}>{userData.noOfFollowing} </span>
                      following</div>
                  </div>
                </div>
                <div className={styles.archivements_container}>
                  <div className={styles.card_header}>Archivments</div>
                  <div className={styles.archivements}>
                    <Archievement />
                    <Archievement />
                  </div>
                </div>
              </div>
              {userData &&
                ownProfile && <div className={styles.btn_container}>
                  <div className={styles.logout_btn} onClick={logoutHandler}>log out</div>
                </div>
              }

            </div>
            :
            <div className={styles.mainloaderContainer}>
              <div className={styles.mainloader}></div>
            </div>
        }

      </div>
    </>
  )
}

export default Profile
