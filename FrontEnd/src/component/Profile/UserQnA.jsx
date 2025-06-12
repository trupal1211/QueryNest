import styles from '../Home/Home.module.css'
import stylex from '../Home/QueryDetails.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { Query, Answer } from '../../component/components';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';

function UserQnA({ type }) {
  let navigate = useNavigate()

  const [userData, setUserData] = useState()
  const { username } = useParams()

  useEffect(() => {
    if (type === "queries") {
      fetchUserQuestions();
    }
    else if (type === "answers") {
      fetchUserAnswers();
    }
  }, [type, username,userData]);

  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }


  function isLikedByCurrentUser(query) {
    return query.likes?.includes(Cookies.get("currentUserId"));
  }

  function isAnswerLikedByCurrentUser(ans) {
    return ans.likes?.includes(Cookies.get("currentUserId"));
  }


  function fetchUserQuestions() {

    fetch(`https://querynest-4tdw.onrender.com/api/Question/userQuestion/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('authToken')}`
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched:", data); // Log after state update
        setUserData(data.questions || [])
        console.log(userData)
      })
      .catch((err) => {
        console.error("Failed to fetch user profile data:", err);
        console.log(err.message);
      })
  }


  function fetchUserAnswers() {

    fetch(`https://querynest-4tdw.onrender.com/api/Answer/userAnswer/${username}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('authToken')}`
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched:", data); // Log after state update
        setUserData(data.answers || [])
      })
      .catch((err) => {
        console.error("Failed to fetch user profile data:", err);
        console.log(err.message);
      })
  }


  return (
    <>
      <div className="main_container bg-white">

        {type === "queries" && (
          <>
            <div className={stylex.page_header}>
              <p onClick={() => navigate(-1)} className={stylex.backbtn}>⇦ back</p>
            </div>

            <div className={styles.queryContainer}>
              {userData ? userData?.map((query) => (
                <Query
                  key={query._id}
                  query_id={query._id}
                  imgUrl={query.userId?.imageUrl}
                  name={query.userId?.name}
                  query={query.question}
                  time={formatDate(query.createdAt)}
                  username={query.userId?.username}
                  isLiked={isLikedByCurrentUser(query)}
                  xlikes={query?.noOfLikes || 0}
                  xcomments={query?.answerIds?.length || 0}
                />
              )) : <div className="mainloaderContainer">
                <div className="mainloader"></div>
              </div>}
            </div>
          </>
        )}



        {type === "answers" && (
          <>
            <div className={stylex.page_header}>
              <p onClick={() => navigate(-1)} className={stylex.backbtn}>⇦ back</p>            
            </div>

            <div className={styles.queryContainer}>
              {userData ? userData?.map((ans) => (
                     <Answer key={ans._id} answer_id={ans._id} imgUrl={ans.userId.imageUrl} name={ans.userId.name} username={ans.userId.username} answer={ans.answer} time={formatDate(ans.createdAt)} isLiked={isAnswerLikedByCurrentUser(ans)} xlikes={ans.noOfLikes} xrate={ans.rating} />
              )) : <div className="mainloaderContainer">
                <div className="mainloader"></div>
              </div>}
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default UserQnA