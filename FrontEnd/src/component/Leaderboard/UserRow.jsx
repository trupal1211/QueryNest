import styles from './UserRow.module.css'
import img from '../../assets/images/profile_photo.jpeg'

function UserRow() {
    return (
        <>
            <div className={styles.user}>
                <div className={styles.flex}>
                    <div className={styles.number}>1</div>
                    <div className={styles.profile_pic}>
                        <img src={img} alt="profile_pic" />
                    </div>
                    <div>
                        <p className={styles.name}>Rahul Godhat</p>
                        <p className={styles.rate}>4.5 / 5</p>
                    </div>
                </div>
                <div className={styles.points}>
                    103
                </div>
            </div>
        </>
    )
}

export default UserRow