import React, { useState, useContext, useEffect } from "react";
import "@fontsource/kadwa";
import "@fontsource/jua";
import styles from './Navbar.module.css';
import { FiSearch } from "react-icons/fi"; // Search icon
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { SearchedUser } from '../components'
import AuthUserContext from "../../context/AuthUserContext";
import Cookie from "js-cookie";

function Navbar() {
    let navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [searchFocused, setSearchFocused] = useState(false);
    const { authUser } = useContext(AuthUserContext);
    const [searchedUserList, setSearchedUserList] = useState({})
    const [inputValue, setInputValue] = useState("")

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    useEffect(() => {
        if (inputValue.trim() === "") {
            setSearchedUserList(null);
            return;
        }

        fetchData();
    }, [inputValue]);

    const fetchData = async () => {
        fetch(`https://querynest-4tdw.onrender.com/api/UserProfile/SearchUser/search?query=${inputValue}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${Cookie.get("authToken")}`
            },
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status} - ${response.statusText}`);
                }
                return response.json();
            })
            .then((data) => {
                console.log("Fetched userProfileData:", data); // Log after state update
                setSearchedUserList(data.results)
                console.log(data.results)
            })
            .catch((err) => {
                console.error("Failed to fetch user profile data:", err);
                console.log(err.message);
            })
    };

    return (
        <>
            {/* Background Overlay (Dulls background but does not block interaction) */}
            {searchFocused && (searchedUserList != null) && (
                <div className={styles.dimBackground} onClick={() => setSearchFocused(false)}></div>
            )}

            {/* Navbar */}
            <div className={styles.nav}>
                <div className={styles.logo} onClick={() => navigate('./home')}>
                    <p>QueryNest</p>
                </div>

                {/* Search Box */}
                <div className={styles.search}>
                    <FiSearch className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onFocus={() => setSearchFocused(true)}
                        // timeout is important for navigate
                        onBlur={() => setTimeout(() => setSearchFocused(false), 200)} // Delay to allow clicking on dropdown
                    />

                    {/* Dropdown Box */}
                    {searchFocused  && (searchedUserList != null) &&

                        <div className={styles.searchDropdown}>
                            {searchedUserList?.map((user) => {
                                return <SearchedUser key={user._id} name={user.name} username={user.username} imgUrl={user?.imageUrl} totalPoints={user?.totalPoints} />
                            })}
                        </div>              
                }
                   


                </div>

                {/* Navbar Links */}
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
                                <p className={styles.profilePic} >
                                    <img src={authUser?.authImgUrl || "https://static0.howtogeekimages.com/wordpress/wp-content/uploads/2023/08/tiktok-no-profile-picture.png"} alt={""} />
                                </p>
                            ) : (
                                <p>Profile</p>
                            )}
                        </NavLink>
                    </p>
                </div>

                {/* Mobile Menu Toggle */}
                <button className={styles.menuToggle} onClick={toggleMenu}>
                    {menuOpen ? '✖' : '☰'}
                </button>
            </div>
        </>
    );
}

export default Navbar;


