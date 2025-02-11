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

import { useState, useContext, useEffect } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import axios from "axios";
import Cookies from "js-cookie";

export default function AccountPage() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [burgers, setBurgers] = useState([]);
  const [error, setError] = useState(null);

  axios.defaults.withCredentials = true;

  const user = Cookies.get("currentUser");
  console.log(user);

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

  const handleUpdate = async (currentUser) => {
    try {
      const response = await axios.patch(
        `http://127.0.0.1:5000/auth/${currentUser.username}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // We're sending JSON here
          },
        }
      );
      console.log("Account updated:", response.data);
    } catch (err) {
      console.error("Failed to update account:", err.message);
    }
  };

  const handleDelete = async (currentUser) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:5000/auth/${currentUser.username}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json", // We're sending JSON here
          },
        }
      );
      setCurrentUser(null);
      Cookies.remove("currentUser");
      console.log("Account deleted:", response.data);
    } catch (err) {
      console.error("Failed to delete account:", err.message);
    }
  };

  return (
    <>
      <div>
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
          <button onClick={() => handleUpdate(currentUser)}>Update Account</button>
          <button onClick={() => handleDelete(currentUser)}>Delete Account</button>
        </ul>
      </div>
    </>
  );
}
