import styles from './UserRow.module.css'
import { useNavigate } from 'react-router-dom'

function UserRow({imgUrl,id,name,username,points,rank}) {
    const navigate = useNavigate()
    return (
        <>
            <div className={styles.user}>
                <div className={styles.flex}>
                    <div className={styles.number}>{rank}</div>
                    <div className={styles.profile_pic} onClick={()=>navigate(`/profile/${username}`)} style={{cursor:'pointer'}}>
                        <img src={imgUrl} alt="profile_pic" />
                    </div>
                    <div onClick={()=>navigate(`/profile/${username}`)} style={{cursor:'pointer'}}>
                        <p className={styles.name}>{name}</p>
                        <p className={styles.rate}>{username}</p>
                    </div>
                </div>
                <div className={styles.points}>
                    {points}
                </div>
            </div>
        </>
    )
}

export default UserRow