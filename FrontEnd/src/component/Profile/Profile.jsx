import styles from './Profile.module.css';
import profile_pic from '../../assets/Images/profile_photo.jpeg'
import linkedin_logo from '../../assets/Images/linkedin.png'
import github_logo from '../../assets/Images/github.png'
import {Archievement} from '../components'
import { useNavigate } from 'react-router-dom';

function Profile() {

  const navigate = useNavigate();

  return (
    <>
      <div className="main_container bg-white">

        <div className={styles.page_container}>

          <div className={styles.profile_header}>
            <div className={styles.flex}>
              <div className={styles.img_container}>
                <img src={profile_pic} alt="" />
              </div>
              <div className={styles.width_auto}>
                <p className={styles.name}>Trupal Godhat</p>
                <p className={styles.username}>@trupal1211</p>
                <p className={styles.tags}>
                  <p className={styles.tag}>IT-2026</p>
                  <p className={styles.tag}># Technical</p>
                  <p className={styles.tag}># Sports</p>
                  <p className={styles.tag}># Hostel</p>
                </p>
              </div>
            </div>
            {/* <div className={styles.follow_btn}>
              follow
            </div> */}

            <div className={`${styles.follow_btn} ${styles.edit}`} onClick={()=>navigate('/edit-profile')}>
              edit  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="14" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/></svg>
            </div>

          </div>

          <div className={styles.bio_container}>
            <div className={styles.bio}>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Soluta, delectus placeat. Repellat.</div>

            <div className={styles.wraper}>
              <div className={styles.linkedin}>
                <div className={styles.logo_container}>
                  <img src={linkedin_logo} alt="" />
                </div>
                <div className={styles.details_container}>
                  <p className={styles.id_name}>Trupal godhat</p>
                  <p className={styles.small}>509 Connections</p>
                </div>

              </div>
              <div className={styles.github}>
                <div className={styles.logo_container}>
                  <img src={github_logo} alt="" />
                </div>
                <div  className={styles.details_container}>
                  <p className={styles.id_name}>Trupal godhat</p>
                  <p className={styles.small}>19 public repositories</p>
                </div>
              </div>


            </div>



          </div>

          <div className={styles.card_container}>
         <div className={styles.card}>
                <p className={styles.card_header}>Questions</p>
                <p className={styles.card_body}>7</p>
              </div>

              <div className={styles.card}>
                <p className={styles.card_header}>Answers</p>
                <p className={styles.card_body}>21</p>
              </div>
            
              <div className={styles.card}>
                <p className={styles.card_header}>Avg. Rating</p>
                <p className={styles.card_body}>4.48</p>
              </div>
              <div className={styles.card}>
                <p className={styles.card_header}>Total Points</p>
                <p className={styles.card_body}>158.05</p>
              </div>
          </div>

          <div className={styles.last_card_container}>

            <div className={styles.followerscard_container}>
              <div className={styles.card}>
                <div className={styles.title}>followers</div>
                <div className={styles.number}>34</div>
                <div className={styles.oneline}>
                <span className={styles.oneline_number}>34 </span> 
                followers</div>
              </div>
              <div className={styles.card}>
                <div className={styles.title}>following</div>
                <div className={styles.number}>34</div>
                <div className={styles.oneline}>
                  <span className={styles.oneline_number}>34 </span> 
                  following</div>
              </div>
            </div>
            <div className={styles.archivements_container}>
              <div className={styles.card_header}>Archivments</div>
              <div className={styles.archivements}>
                <Archievement/>
                <Archievement/>
                <Archievement/>
                <Archievement/>
                <Archievement/>
                <Archievement/>
                <Archievement/>
                <Archievement/>
              </div>
            </div>
          </div>
          <div className={styles.btn_container}>
          <div className={styles.logout_btn} onClick={()=>navigate('/login')}>log out</div>         
          </div>

      
        </div>
        
      </div>
    </>
  )
}

export default Profile
