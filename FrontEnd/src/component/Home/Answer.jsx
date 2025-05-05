import styles from "./QueryDetails.module.css"
import { useNavigate } from "react-router-dom"
import star from "../../assets/Images/star.png"
import like_img from "../../assets/Images/like.png"
import nonLike_img from "../../assets/Images/nonLike.png"
import { useState, useEffect,useContext } from "react"
import Cookies from "js-cookie"
import AuthUserContext from "../../context/AuthUserContext"

function Answer({ answer_id, imgUrl, name, username, answer, time, isLiked, xlikes, xrate = null, isAbleToRate }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(xlikes)
  const [likes, setLikes] = useState(isLiked)
  const [rateInput, setRateInput] = useState()
  const [rate, setRate] = useState(xrate)
  const { authUser } = useContext(AuthUserContext);
  const [isAbleToRateAnswer,setIsAbleToRateAnswer]=useState(isAbleToRate && (authUser?.authId != answer_id) )

  useEffect(() => {
    setLiked(isLiked) // Ensure component updates when `isLiked` changes from parent
  }, [isLiked])

  const handleLike = async (e) => {
    e.preventDefault()

    const likeSubmitData = {
      answerId: answer_id,
      action: liked ? "unlike" : "like", // Toggle action
    }

    console.log("Sending Like Request:", likeSubmitData)

    const token = Cookies.get("authToken")

    try {
      const response = await fetch("https://querynest-4tdw.onrender.com/api/Answer/ToggleLikeAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(likeSubmitData),
      })

      const result = await response.json()
      console.log("API Response:", result)

      if (response.ok) {
        setLiked(!liked) // Toggle liked state
        setLikes(liked ? likes - 1 : likes + 1) // Adjust like count
      } else {
        console.log(result.error || result.message || "Like action failed!")
      }
    } catch (error) {
      console.log(error.message || "Something went wrong. Please try again.")
    }
  }


  async function ratingHandler(e) {
    e.preventDefault()

    const rateSubmitData = {
      answerId: answer_id,
      rating: Number(rateInput),
    }

    console.log("Sending rate Request:", rateInput)
    console.log(rateSubmitData)

    const token = Cookies.get("authToken")

    try {
      const response = await fetch("https://querynest-4tdw.onrender.com/api/Answer/rateAnswer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(rateSubmitData),
      })

      // CHANGED: Check if response is ok before trying to parse JSON
      if (response.ok) {
        try {
          // CHANGED: Properly handle JSON parsing with error handling
          const result = await response.json()
          console.log("API Response of rating:", result)
          setRate(rateInput)
        } catch (parseError) {
          // CHANGED: Handle case where response isn't JSON
          console.log("Response wasn't JSON:", await response.text())
          // Still update the UI if the request was successful
          setRate(rateInput)
        }
      } else {
        // CHANGED: Handle non-200 responses better
        console.log(`Rating action failed with status: ${response.status}`)
        try {
          const errorText = await response.text()
          console.log("Error response:", errorText)
        } catch (error) {
          console.log("Couldn't read error response")
        }
      }
    } catch (error) {
      console.log(error.message || "Something went wrong. Please try again.")
    }
  }

  return (
    <>
      <div className={styles.answerWraper}>
        <div className={styles.answer}>
          <div className={styles.header}>
            <div className={styles.profile_information}>
              <div className={styles.image_container}>
                <img src={imgUrl || "https://static0.howtogeekimages.com/wordpress/wp-content/uploads/2023/08/tiktok-no-profile-picture.png"} alt="" />
              </div>
              <div>
                <p className={styles.name}>{name}</p>
                <p className={styles.username}>@{username}</p>
              </div>
            </div>
            <div className={styles.timestamp}>
              <p>{time}</p>
            </div>
          </div>

          <div className={styles.content}>
            <p>{answer}</p>
          </div>

          <div className={styles.footer}>
            <div className={styles.like}>
              <button className={`${styles.like_button} ${liked ? styles.liked : ""}`} onClick={handleLike}>
                <div className={styles.like_img}>
                  {isLiked ? (
                    <img src={like_img || "/placeholder.svg"} />
                  ) : (
                    <img src={nonLike_img || "/placeholder.svg"} />
                  )}
                </div>
                <span>{xlikes} likes</span>
              </button>
            </div>

            {!!rate && (
              <div className={styles.starContainer}>
              <p style={{marginTop:'3px',marginRight:'4px',fontSize: "16px" }}> {xrate} / 5.0 </p>
              <div className={styles.star}>
                 <img src={star} />
              </div>
            </div>
            )}

            {!rate && !isAbleToRateAnswer && (
              <div className={styles.starContainer}>
                <p style={{marginTop:'3px',marginRight:'4px',fontSize: "16px" }}> − / 5.0 </p>
                <div className={styles.star}>
                   <img src={star} />
                </div>
              </div>
            )}

            {!rate && isAbleToRateAnswer && (
              <div className={styles.rateBtnContainer}>
                <input
                  className={styles.rateInput}
                  type="number"
                  onChange={(e) => setRateInput(e.target.value)}
                  min={0}
                  max={5}
                />
                <button className={styles.rateBtn} onClick={ratingHandler}>
                  rate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Answer

