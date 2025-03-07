import React, { useState, useEffect, useRef } from 'react';
import styles from './Leaderboard.module.css'
import { UserRow } from '../components'
import tags from '../../assets/tags';

function Leaderbord() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('General Query');
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

  return (
    <>
      <div className='main_container bg-white'>
        <div className={styles.container} ref={dropdownRef}>
          <div className={styles.title}> 
            <p>Leaderboard</p><p className={`${styles.tag} ${styles.max_tag} `}># {selectedOption} </p><p className={styles.ltime}>jun 2024</p>
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
           <p className={styles.tag}># {selectedOption} </p>
           <p className={styles.mtime}>jun 2024</p>
        </div>

        {/* {selectedOption} */}

        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />
        <UserRow />

      </div>
    </>
  )
}

export default Leaderbord