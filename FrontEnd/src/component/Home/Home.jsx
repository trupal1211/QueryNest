import styles from './Home.module.css'
import '@fontsource/kadwa'
import '@fontsource/jua'
import { useState } from 'react'
import { Query } from '../components'
import tags from '../../assets/tags'

function Home() {

  const [showBox, setShowBox] = useState(false);
  const [tag, setTag] = useState(1);
  return (
    <>
      <div className='main_container'>
        <Query />
        <Query />
        <Query />
        <Query />
        <Query />
        <Query />
        <Query />
        <Query />
        <Query />
        <Query />
        <Query />
      </div>

      {showBox && (
        <div className={`${styles.overlay} ${styles.active}`}>
          <div className={styles.querypostBox}>
            <h2 style={{ textAlign: 'center' }}>Post Your Query</h2>
            <form action="">
              <div className={styles.formGroup}>
                <textarea type='text' id="quert" placeholder=" " required />
                <label for="query">Query</label>
              </div>

              <p>select one tag that is approperiate to the query</p>

              <div className={styles.tagContainer}>
                {tags.map((tagName, index) => (
                  <div
                    key={index}
                    onClick={() => setTag(index + 1)}
                    className={tag === index + 1 ? styles.selected : ""}                  >
                    # {tagName}
                  </div>
                ))}
              </div>

              <div className={styles.flex}>
                <div className={`${styles.btn} ${styles.cancel}`} onClick={() => setShowBox(false)}>cancel</div>
                <div className={`${styles.btn} ${styles.post}`}>Post</div>
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