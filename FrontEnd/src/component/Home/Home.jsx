import styles from './Home.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'
import { useState, useEffect, useRef, useContext } from 'react'
import { Query } from '../components'
import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom'
import AuthUserContext from '../../context/AuthUserContext'

function Home() {

  const [showBox, setShowBox] = useState(false);
  const [tag, setTag] = useState("General Query");
  const [query, setQuery] = useState("")
  const [alltags, setAllTags] = useState("")
  const [queryFeed, setQueryFeed] = useState([])
  const [reload, setLoad] = useState(false)
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loaderStatus, setLoaderStatus] = useState(false)

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

  const { authUser } = useContext(AuthUserContext)
  const navigate = useNavigate()



  // to get all tag list
  useEffect(() => {
    fetch("https://querynest-4tdw.onrender.com/api/TagDetails", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
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
        setAllTags(data)
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        console.log(err.message);
      })

  }, [])


  const latestQueryFeed = useRef({});

  useEffect(() => {
    fetchNewQueryFeed() // Initial fetch
    const interval = setInterval(() => {
      fetchNewQueryFeed(); // Fetch new data every 1 second
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);


  function fetchNewQueryFeed() {

    // for get queryfeed
    fetch("https://querynest-4tdw.onrender.com/api/Question/TagmatchQuestion", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get('authToken')}`
      },
    })
      .then((response) => {
        // console.log("response(tag Question):" + response.message)
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        if (JSON.stringify(latestQueryFeed.current) !== JSON.stringify(data.questions)) {
          latestQueryFeed.current = data.questions;
          setQueryFeed(data.questions); // ✅ Update only if new data is available
          console.log(data)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        console.log(err.message);
        navigate("/profile/edit", { replace: true });
      })


  }


  async function submitHandler(e) {
    e.preventDefault();

    const querySubmitData = {
      question: query,
      tagName: tag
    };

    console.log(querySubmitData)

    const token = Cookies.get("authToken");

    setLoaderStatus(true)

    try {
      const response = await fetch("https://querynest-4tdw.onrender.com/api/Question/Create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`

        },
        body: JSON.stringify(querySubmitData),
      });

      const result = await response.json();
      console.log(result);
      
      setLoaderStatus(false)

      if (response.ok) {
        setSuccess("Query post succesful.");
        setShowBox(false)
      } else {
        showError(result.error || result.message || "query post failed!");
      }
    } catch (error) {
      showError(error.message || "Something went wrong. Please try again.");
      setLoaderStatus(false)
      
    }
  }


  function formatDate(isoString) {
    const date = new Date(isoString);
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('en-GB', options).replace(',', '');
  }

  function isLikedByCurrentUser(query) {
    return query.likes.includes(Cookies.get("currentUserId"));
  }

  return (
    <>
      <div className='main_container'>

        {
          useEffect(() => {
            console.log(authUser)
            if (authUser && !authUser.isAuthProfileCompleted) {
              navigate("/profile/edit", { replace: true });
            }
          }, [authUser, navigate])
        }

        {/* <div className={styles.loader}> </div> */}

        {queryFeed && queryFeed.length > 0 ?
          queryFeed?.map((query) => {
            return <Query key={query._id}
              imgUrl={query?.userId?.imageUrl}
              query_id={query._id}
              name={query?.userId?.name}
              query={query.question}
              time={formatDate(query.createdAt)}
              username={query?.userId?.username}
              isLiked={isLikedByCurrentUser(query)}
              xlikes={query.noOfLikes}
              xcomments={query.answerIds?.length} />
          })

          :
          <div className={styles.mainloaderContainer}>
            <div className={styles.mainloader}> </div>
          </div>
        }

          {/* Floating Error Message */}
          {error && <div className="errorMsg">{error}</div>}

{/* Floating Success Message */}
{success && <div className="successMsg">{success}</div>}

      </div>

      {showBox && (
        <div className={`${styles.overlay} ${styles.active}`}>
          <div className={styles.querypostBox}>
            <h2 style={{ textAlign: 'center' }}>Post Your Query</h2>
            <form action="" onSubmit={submitHandler}>
              <div className={styles.formGroup}>
                <textarea type='text' onChange={(e) => { setQuery(e.target.value) }} placeholder=" " required />
                <label>Query</label>
              </div>

              <p>select one tag that is approperiate to the query</p>

              <div className={styles.tagContainer}>

                {alltags?.map((option) => (
                  <div
                    key={option}
                    className={tag == option && styles.selected}
                    onClick={() => { setTag(option) }}>
                    # {option}
                  </div>
                ))}

              </div>

              <div className={styles.flex}>
                <div className={`${styles.btn} ${styles.cancel}`} onClick={() => setShowBox(false)}>Cancel</div>
                <div className={`${styles.btn} ${styles.post}`} onClick={submitHandler} disabled={loaderStatus}>
                  {loaderStatus?<div className="loader"></div>:"Post"}</div>
              </div>

            </form>

          </div>
        </div>
      )}

      <div className={showBox == false ? styles.addBtn : styles.dNone} onClick={() => setShowBox(true)}>
        <p>+</p>
      </div>



    </>
  )
}


export default Home