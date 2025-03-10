import styles from '../Home/Home.module.css'
import stylex from '../Home/QueryDetails.module.css'
import { useNavigate } from 'react-router-dom'
import { Query , Answer } from '../../component/components';

function UserQnA() {
    let navigate = useNavigate()

    return (
        <>
            <div className="main_container bg-white">
                <div className={stylex.page_header}>
                    <p onClick={() => { navigate(-1) }} className={stylex.backbtn}> ⇦ back</p>
                </div>

                <div className={styles.queryContainer}>
                <Query></Query>
                <Query></Query>
                <Query></Query>
                <Query></Query>
                <Query></Query>
                <Query></Query>
                </div>       

                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>
                <Answer></Answer>

            </div>
        </>
    )
}

export default UserQnA