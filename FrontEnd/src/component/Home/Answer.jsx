import styles from  './QueryDetails.module.css'
import { useNavigate } from 'react-router-dom'
import profileImg from "../../assets/Images/profile_photo.jpeg"
import star from '../../assets/Images/star.png'
import like_img from '../../assets/Images/like.png'
import nonLike_img from '../../assets/Images/nonLike.png'
import { useState } from 'react'

function Answer() {

    let navigate = useNavigate()
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(10); // 
    const [comments, setComments] = useState(5);

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    function showQueryDetails() {
        navigate('/query-details')
    }

    return (
        <>
            <div className={styles.answer}>
                <div className={styles.header}>
                    <div className={styles.profile_information}>
                        <div className={styles.image_container}>
                            <img src={profileImg} alt="" />
                        </div>
                        <div>
                            <p className={styles.name}>trupal godhat</p>
                            <p className={styles.username}>@trupal1211</p>
                        </div>
                    </div>
                    <div className={styles.timestamp}>
                        <p>7 jun 25</p>
                    </div>
                </div>

                <div className={styles.content}>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veritatis laudantium ratione qui impedit neque optio voluptates architecto accusantium assumenda.</p>
                </div>

                <div className={styles.footer}>
                    <div className={styles.like}>
                        <button className={`${styles.like_button} ${liked ? styles.liked : ""}`} onClick={handleLike}>
                            <div className={styles.like_img}>
                                {liked ? <img src={like_img} />
                                    : <img src={nonLike_img} />}
                            </div>
                            <span>{likes} likes</span>
                        </button>
                    </div>
                    <div className={styles.starContainer}>
                    <div className={styles.star}>
                       <p style={{marginTop:'1px'}}>4.5</p> <img src={star} />
                    </div>
                    </div>
                   
                    
                </div>
            </div>
        </>
    )
}

export default Answer