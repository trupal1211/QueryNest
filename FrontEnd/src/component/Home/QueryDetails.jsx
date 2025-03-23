import styles from './QueryDetails.module.css'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from "lucide-react";
import profileImg from "../../assets/Images/profile_photo.jpeg"
import like_img from '../../assets/Images/like.png'
import nonLike_img from '../../assets/Images/nonLike.png'
import { useState } from 'react'
import { Answer } from '../../component/components';

function QueryDetails() {

    let navigate = useNavigate()
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(10); // 
    const [comments, setComments] = useState(5);
    const [answer, setAnswer] = useState("")

    const handleLike = () => {
        setLiked(!liked);
        setLikes(liked ? likes - 1 : likes + 1);
    };

    function showQueryDetails() {
        navigate('/query-details')
    }

    return (
        <>
            <div className="main_container bg-white p-bottom">
                <div className={styles.page_header}>
                    <p onClick={() => { navigate('/') }} className={styles.backbtn}> ⇦ back</p>

                    <div className={styles.tagContainer}>
                        <div className={styles.tag}># Teachnical</div>
                    </div>
                </div>

                <div className={styles.query}>
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
                        <div className={styles.comment}>
                            <button className={styles.comment_button}>
                                <MessageCircle className={styles.icon} />
                                <span>{comments} answers</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={styles.line}></div>

                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>

                <div className={styles.answerpost_box}>
                    <div class={styles.form_group} style={{ position: 'relative' }}>
                        <textarea id="ans" onChange={(e) => setAnswer(e.target.value)} placeholder=" " required />
                        <label className={styles.textarea_label} for="ans">Answer</label>
                    </div>
                    <div className={styles.post_btn}>Post</div>
                </div>

            </div>
        </>
    )
}

export default QueryDetails



