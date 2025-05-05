import styles from './SearchedUser.module.css'
import { useNavigate } from 'react-router-dom'

function SearchedUser({id,name,username,imgUrl,totalPoints}){

    const navigate = useNavigate()

    return (
        <>
         <div className={styles.user} onClick={()=>navigate(`/profile/${username}`)}>
                        <div className={styles.flex}>
                            <div className={styles.profile_pic} onClick={()=>navigate(`/profile/${username}`)} style={{cursor:'pointer'}}>
                                <img src={imgUrl} alt="profile_pic" />
                            </div>
                            <div onClick={()=>navigate(`/profile/${username}`)} style={{cursor:'pointer'}}>
                                <p className={styles.name}>{name}</p>
                                <p className={styles.rate}>{username}</p>
                            </div>
                        </div>
                        <div className={styles.points}>
                            {totalPoints}
                        </div>
                    </div>
        </>
    )
}

export default SearchedUser