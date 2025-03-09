import styles from './Home.module.css'
import img from '../../assets/Images/profile_photo.jpeg'
import { ThumbsUp, Heart, MessageCircle } from "lucide-react";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import like_img from '../../assets/Images/like.png'
import nonLike_img from '../../assets/Images/nonLike.png'

function Query() {

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
            <div className={styles.query}>
                <div className={styles.header}>
                    <div className={styles.profileInformation}>
                        <div className={styles.imageContainer}>
                            <img src={img} alt="" />
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

                <div className={styles.queryFooter}>
                    <div className={`${styles.like} ${styles.flex}`}>
                        <button className={`${styles.likeButton} ${liked ? styles.liked : ""}`} onClick={handleLike}>
                            <div className={styles.likeImg}>
                                {liked ? <img src={like_img} />
                                    : <img src={nonLike_img} />}
                            </div>
                            <span>{likes} likes</span>
                        </button>

                    </div>
                    <div className={styles.comment} onClick={() => { navigate('./query-details') }}>
                        <button className={styles.commentButton}>
                            <MessageCircle className={styles.icon} />
                            <span>{comments} answers</span>
                        </button>
                    </div>
                </div>

            </div>

        </>
    )
}

export default Query