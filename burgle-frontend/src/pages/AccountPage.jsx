import { useState,useContext,useEffect } from "react"
import CurrentUserContext from "../contexts/current-user-context"
import axios from 'axios'

export default function AccountPage() {
  const { currentUser } = useContext(CurrentUserContext)
  const [burgers, setBurgers] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:5000/burger/all')
        setBurgers(response.data)
      } catch (err) {
        setError(err.message)
      }
    }

    fetchBurgers()
  }, [])

  const handleUpdate = async (currentUser) => {
    // since its a button it doesnt have to be in useEffect()
    try {
      const response = await axios.patch(`http://127.0.0.1:5000/auth/${currentUser.username}`)
      console.log("Account updated:", response.data)
    } catch (err) {
      console.error("Failed to update account:", err.message)
    }
   
  }

  const handleDelete = async (currentUser) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/auth/${currentUser.username}`)
      console.log("Account deleted:", response.data)
    } catch (err) {
      console.error("Failed to delete account:", err.message)
    }
  }

  return (
  <>
     <div>
      <h1>All Burgers</h1>
      <ul>
        {burgers.map((burger) => (
          <li key={burger.id}>{burger}</li>
        ))}
      </ul>
      <ul>
        <button onClick={handleUpdate(currentUser)}>Update Account</button>
        <button onClick={handleDelete(currentUser)}>Delete Account</button>
      </ul>
    </div>    
  </>
    )
}