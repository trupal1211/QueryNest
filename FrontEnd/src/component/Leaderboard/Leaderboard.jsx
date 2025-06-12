import React, { useState, useEffect, useRef } from 'react';
import styles from './Leaderboard.module.css'
import '../../index.css'
import { UserRow } from '../components'
import tags from '../../assets/tags';
import Cookies from 'js-cookie';

function Leaderbord() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [dropDirection, setDropDirection] = useState('down'); // 'down' or 'up'
  const dropdownRef = useRef(null);

  // Handle option selection
  const handleSelect = (option) => {
    setSelectedOption(option);
    setIsOpen(false); // Close the dropdown
  };

  // Toggle dropdown and calculate direction (above or below)
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);

    if (dropdownRef.current) {
      const { bottom, height } = dropdownRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      setDropDirection(bottom + height > windowHeight ? 'up' : 'down');
    }
  };

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const [rankList, setRankList] = useState([])

  useEffect(() => {

    fetch("https://querynest-4tdw.onrender.com/api/leaderboard/gettopusers", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${Cookies.get("authToken")}`
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log("Fetched User RankList Data:", data);
        setRankList(data.users)
      })
      .catch((err) => {
        console.error("Failed to fetch user data:", err);
        setError(err.message);
      })
  }, []);

  return (
    <>
      <div className='main_container bg-white'>
        <div className={styles.container} ref={dropdownRef}>
          <div className={styles.title}>
            <p>Leaderboard</p>
         {selectedOption &&<p className={`${styles.tag} ${styles.max_tag} `}># {selectedOption} </p> }   
          {selectedOption &&   <p className={styles.ltime}>Feb 2024</p>}
          </div>

          <button className={styles.button} onClick={toggleDropdown}>
            Select Tag &#9662;
          </button>

          {isOpen && (
            <ul className={`${styles.list} ${dropDirection === 'up' ? styles.listUp : styles.listDown}`}>
              {tags.map((option, index) => (
                <li
                  key={index}
                  className={`${styles.item} ${option === selectedOption ? styles.selected : ''}`}
                  onClick={() => handleSelect(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className={styles.tag_container}>
        {selectedOption && <p className={styles.tag}># {selectedOption} </p>}
          <p className={styles.mtime}>Feb 2024</p>
        </div>

        {/* {selectedOption} */}

        {rankList?
          rankList?.map((user,index)=>{
           return <UserRow key={user._id} rank={index+1} name={user.name} id={user._id} username={user.username} imgUrl={user.imageUrl} points={user.totalPoints}/>
         })
        : <div className="mainloaderContainer">
          <div className="mainloader"></div>
        </div> }


        

      </div>
    </>
  )
}

export default Leaderbord