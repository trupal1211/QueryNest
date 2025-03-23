import React, { useState } from "react";
import "@fontsource/kadwa";
import "@fontsource/jua";
import styles from './Navbar.module.css'
import { FiSearch } from "react-icons/fi"; // Search icon
import {NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import img from '../../assets/Images/profile_photo.jpeg'

function Navbar() {

    let navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <>

            <div className={`${styles.overlay} ${menuOpen ? styles.active : ""}`} onClick={closeMenu}></div>
            <div className={styles.nav}>
                <div className={styles.logo} onClick={() => navigate('./')}>
                    <p>QueryNest</p>
                </div>
                <div className={styles.search}>
                    <FiSearch className={styles.searchIcon} />
                    <input type="text" placeholder="Search" />
                </div>
                <div className={`${styles.links} ${menuOpen ? styles.show : ""}`}>
                    <p>
                        <NavLink 
                            to='./' 
                            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} 
                            onClick={() => { if (menuOpen) setMenuOpen(false); }}
                        > 
                            <p>Home</p>
                        </NavLink>
                    </p>
                    <p>
                        <NavLink 
                            to='./leaderboard' 
                            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} 
                            onClick={() => { if (menuOpen) setMenuOpen(false); }}
                        > 
                            <p>Leaderboard</p>
                        </NavLink>
                    </p>
                    <p>
                        <NavLink 
                            to='./profile' 
                            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)} 
                            onClick={() => { if (menuOpen) setMenuOpen(false); }}
                        >
                            {!menuOpen ? (
                                <p className={styles.profilePic}>
                                    <img src={img} alt="Profile" />
                                </p>
                            ) : (
                                <p>Profile</p>
                            )}
                        </NavLink>
                    </p>
                </div>
                <button className={styles.menuToggle} onClick={toggleMenu}>
                    {menuOpen ? '✖' : '☰'}
                </button>
            </div>
        </>
    );
}

export default Navbar;
