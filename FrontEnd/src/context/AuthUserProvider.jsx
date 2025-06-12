// import AuthUserContext from "./AuthUserContext";
// import { useState, useEffect } from "react";
// import Cookies from "js-cookie";

// export function AuthUserProvider({ children }) {
    
//     const [authUser, setAuthUser] = useState(null);
//     const [loading, setLoading] = useState(true);
  
//     // Fetch user data from API
//     const fetchAuthUser = async () => {
//       const authToken = Cookies.get("authToken");
  
//       if (!authToken) {
//         setAuthUser(null);
//         setLoading(false);
//         return;
//       }
  
//       try {
//         const response = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/me", {
//           headers: { Authorization: `Bearer ${authToken}` },
//         });
  
//         if (response.ok) {
//           const data = await response.json();
//           setAuthUser({
//             authName: data.name,
//             authUsername: data.username,
//             authTags: data.tags || [],
//             authImgUrl: data.imageUrl || "",
//             authEmail: data.clgemail,
//           });
//         } else {
//           setAuthUser(null);
//         }
//       } catch (error) {
//         console.error("Error fetching user data:", error);
//         setAuthUser(null);
//       } finally {
//         setLoading(false);
//         console.log(authUser)
//       }
//     };

//     try {
//       const response = await fetch("https://querynest-4tdw.onrender.com/api/User/me", {
//         headers: { Authorization: `Bearer ${authToken}` },
//       });

//       if (response.ok) {
//         const data = await response.json();
//         setAuthUser();
//       } else {
//         setAuthUser(null);
//       }
//     } catch (error) {
//       console.error("Error fetching user data:", error);
//       setAuthUser(null);
//     } finally {
//       setLoading(false);
//       console.log(authUser)
//     }
//   };
    


//     useEffect(() => {
//       console.log(authUser)
//     }, [authUser]);
  
//     // Call fetchAuthUser when the component mounts
//     useEffect(() => {
//       fetchAuthUser();
//     }, []);
  
//     // Logout function
//     const logout = () => {
//       Cookies.remove("authToken");
//       Cookies.remove("currentUserId");
//       setAuthUser(null);
//     };
  
//     return (
//       <AuthUserContext.Provider value={{ authUser, loading, fetchAuthUser, logout }}>
//         {children}
//       </AuthUserContext.Provider>
//     );
//   }



import AuthUserContext from "./AuthUserContext";
import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function AuthUserProvider({ children }) {
  const [authUser, setAuthUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAuthUser = async () => {
    const authToken = Cookies.get("authToken");

    if (!authToken) {
      setAuthUser(null);
      setLoading(false);
      return;
    }

    try {
      // Fetch user details
      const userProfileResponse = await fetch("https://querynest-4tdw.onrender.com/api/UserProfile/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const userProfileData = userProfileResponse.ok ? await userProfileResponse.json() : null;

      // Fetch isProfileCompleted status
      const userResponse = await fetch("https://querynest-4tdw.onrender.com/api/User/me", {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const userData = userResponse.ok ? await userResponse.json() : null;

      if (userProfileData) {
        setAuthUser({
          authId : userProfileData.userid,
          authName: userProfileData.name,
          authUsername: userProfileData.username,
          authTags: userProfileData.tags || [],
          authImgUrl: userProfileData.imageUrl || "",
          authEmail: userProfileData.clgemail,
          isAuthProfileCompleted: userData?.isProfileCompleted ?? false, // Set from second API
        });
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

  useEffect(() => {
    console.log(authUser)
  }, [authUser]);

  useEffect(() => {
    fetchAuthUser();
  }, []);

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
