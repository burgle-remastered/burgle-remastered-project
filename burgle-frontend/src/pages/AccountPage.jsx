// import { useState,useContext,useEffect } from "react"
// import CurrentUserContext from "../contexts/current-user-context"
// import axios from 'axios'
// import Cookies from 'js-cookie'


// export default function AccountPage() {
//   const { currentUser, setCurrentUser } = useContext(CurrentUserContext)
//   const [burgers, setBurgers] = useState([])
//   const [error, setError] = useState(null)

//   axios.defaults.withCredentials = true

//   const user = Cookies.get('currentUser')
//   console.log(user) 
//   useEffect(() => {
//     const savedUser = Cookies.get('currentUser');
//     console.log(savedUser)
//     if (savedUser) {
//       setCurrentUser(JSON.parse(savedUser));
//     }
//   }, []);

//   useEffect(() => {
//     const fetchBurgers = async () => {
//       try {
//         const response = await axios.get('http://127.0.0.1:5000/burger/all',  {
          
//           withCredentials: true, 
//           headers: {
//             'Content-type':'application/json',
//             'Accept': 'application/json', // Make sure it's set to JSON
//           } // This ensures the session cookie is sent
//         }); console.log(response)
//   //       .then(response => console.log(response.data))
//   // .catch(error => console.error('Error:', error));
//         let data = response.json()
//         console.log(data.data.burgers)
//         setBurgers(data.data.burgers)
//       } catch (err) {
//         setError(err.message)
//       }
//     }
    
//     fetchBurgers()
//   }, [])

//   const handleUpdate = async (currentUser) => {
//     // since its a button it doesnt have to be in useEffect()
//     try {
//       const response = await axios.patch(`http://127.0.0.1:5000/auth/${currentUser.username}`,{
//         withCredentials: true, headers: {
//           'Content-Type': 'application/json', // Make sure it's set to JSON
//         }// This ensures the session cookie is sent
//       });
//       console.log("Account updated:", response.data)
//     } catch (err) {
//       console.error("Failed to update account:", err.message)
//     }
   
//   }

//   const handleDelete = async (currentUser) => {
//     try {
//       const response = await axios.delete(`http://127.0.0.1:5000/auth/${currentUser.username}`,{
//         withCredentials: true, headers: {
//           'Content-Type': 'application/json', // Make sure it's set to JSON
//         }// This ensures the session cookie is sent
//       });
//       setCurrentUser(null);
//       Cookies.remove("currentUser");
//       console.log("Account deleted:", response.data)
//     } catch (err) {
//       console.error("Failed to delete account:", err.message)
//     }
//   }

//   return (
//   <>
//      <div>
//       <h1>All Burgers</h1>
//       <ul>
//       {error && <p>Error loading burgers: {error}</p>}
//       <ul>
//         {burgers.length > 0 ? (
//           burgers.map((burger) => <li key={burger.id}>{burger.id}</li>)
//         ) : (
//           <p>No burgers found</p>
//         )}
//       </ul>
//       </ul>
//       <ul>
//         <button onClick={() => handleUpdate(currentUser)}>Update Account</button>
//         <button onClick={() => handleDelete(currentUser)}>Delete Account</button>
//       </ul>
//     </div>    
//   </>
//     )
// }

import { useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import axios from "axios";
import Cookies from "js-cookie";

export default function AccountPage() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [burgers, setBurgers] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;

  const user = Cookies.get("currentUser");

  useEffect(() => {
    const savedUser = Cookies.get("currentUser");
    console.log(savedUser);
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const user = JSON.parse(Cookies.get('currentUser'))   // This will give you the data directly
        const response = await axios.post("http://127.0.0.1:5000/burger/all", {
          withCredentials: true,
          headers: {
            Accept: "application/json", // We're telling the server we expect JSON
          },
          body: {user: user[0].user_id}
          ,
        });
        setBurgers(response.data.burgers); // Assuming the response contains `burgers` data
      } catch (err) {
        setError(err.message);
      }
    };

    fetchBurgers();
  }, []);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.target)
    const formObject = Object.fromEntries(formData)

    try {
      const user = JSON.parse(Cookies.get('currentUser')) 
      const userData = {
        user_id: user[0].user_id,
        username: formObject.username || user.username,
        email: formObject.email || user.email,
        password: formObject.password || user.password
      };
      const response = await axios.patch(
        `http://127.0.0.1:5000/auth/user/${userData.user_id}`, userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `http://127.0.0.1:5000/auth/user/${userData.user_id}`,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        }
      );
      console.log("Account updated:", response.data);
    } catch (err) {
      console.error("Failed to update account:", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const user = JSON.parse(Cookies.get('currentUser')) 
      const response = await axios.delete(
        `http://127.0.0.1:5000/auth/user/del/${user[0].user_id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `http://127.0.0.1:5000/auth/user/del/${user[0].user_id}`,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        }
      );
      setCurrentUser(null);
      Cookies.remove("currentUser");
      console.log("Account deleted:", response.data);
      navigate(`/`)
    } catch (err) {
      console.error("Failed to delete account:", err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const user = JSON.parse(Cookies.get('currentUser')) 
      const response = await axios.get(
        `http://127.0.0.1:5000/auth/logout`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `http://127.0.0.1:5000/auth/logout`,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        }
      );
      setCurrentUser(null);
      Cookies.remove("currentUser");
      console.log("Account deleted:", response.data);
      navigate(`/`)
    } catch (err){
      console.error("Failed to sign out:", err.message);
    }
  }

  return (
    <>
      <div>
      <button onClick={()=>navigate('/')}>Back</button>
        <h1>All Burgers</h1>
        <ul>
          {error && <p>Error loading burgers: {error}</p>}
          {burgers.length > 0 ? (
            burgers.map((burger) => <li key={burger.id}>{burger.id}</li>)
          ) : (
            <p>No burgers found</p>
          )}
        </ul>
        <ul>
        <div className="Update-Form">
                <form onSubmit={handleUpdate} aria-labelledby="update-heading">
                    <h2 id="update-heading" className="header2">
                        Fix Your Account, Toots!
                    </h2>

                    <div className="usernameBlock">
                        <label htmlFor="username" className="username">Username</label>
                        <input
                            type="text"
                            autoComplete="username"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="emailBlock">
                        <label htmlFor="email" className="email">Email</label>
                        <input
                            type="text"
                            autoComplete="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className="passwordBlock">
                        <label htmlFor="password" className="password">Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button>Update!</button>
                </form>
              </div>
          <button onClick={() => handleDelete()}>Delete Account</button>
          <button onClick={() => handleSignOut()}>Sign Out</button>
        </ul>
      </div>
    </>
  );
}
