import AuthUserContext from "./AuthUserContext";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function AuthUserProvider({ children }) {
    
    const [authUser, setAuthUser] = useState(null);
    const [loading, setLoading] = useState(true);
  
    // Fetch user data from API
    const fetchAuthUser = async () => {
      const authToken = Cookies.get("authToken");
  
      if (!authToken) {
        setAuthUser(null);
        setLoading(false);
        return;
      }
  
      try {
        const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/me", {
          headers: { Authorization: `Bearer ${authToken}` },
        });
  
        if (response.ok) {
          const data = await response.json();
          setAuthUser({
            name: data.name,
            username: data.username,
            tags: data.tags || [],
            imgUrl: data.imageUrl || "",
            email: data.email,
          });
          console.log(authUser)
        } else {
          setAuthUser(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };
  
    // Call fetchAuthUser when the component mounts
    useEffect(() => {
      fetchAuthUser();
    }, []);
  
    // Logout function
    const logout = () => {
      Cookies.remove("authToken");
      Cookies.remove("currentUserId");
      setAuthUser(null);
    };
  
    return (
      <AuthUserContext.Provider value={{ authUser, loading, fetchAuthUser, logout }}>
        {children}
      </AuthUserContext.Provider>
    );
  }