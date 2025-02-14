//import burger 
//fetch burger, then fetch burger.top_bun etc/ depending on the component that the user clicked (listen)
import axios from "axios";
import Cookies from "js-cookie";
import { useParams,useNavigate } from "react-router-dom";
import { useState,useEffect,useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";


export default function IngredientTaskList() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext)
    const { burgerId, component } = useParams()
    const [burger, setBurger] = useState()
    const [error, setError] = useState(null)
    const [isEditing, setIsEditing] = useState(false)
    const [newValue, setNewValue] = useState('')
    const navigate = useNavigate()

    const getDate = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${year}-${month}-${date}`;
    }

    useEffect(() => {
        const savedUser = Cookies.get("currentUser");
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
      }, []);

    useEffect(() => {
        const fetchBurger = async () => {
          try {
            const date = getDate()
            const user = JSON.parse(Cookies.get('currentUser')) 
            const response = await axios.post(`http://127.0.0.1:5000/burger/${date}`,{
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json", // We're telling the server we expect JSON
              },  body: {user: user[0].user_id}
            });
            setBurger(response.data)
          } catch (err) {
            setError(err.message);
          }
        };
        fetchBurger();
      }, []);

    const handleUpdateBurger = async (component) => {
        try {
            const user = JSON.parse(Cookies.get('currentUser')) 
            const updatedData = { burger_id:burger.id,user_id:user[0].user_id,[component]: newValue };
            const response = await axios.patch(`http://127.0.0.1:5000/burger/${burger.id}`, updatedData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
            setBurger(response.data) // Update the burger state with the new data
            setIsEditing(false)
        } catch (error) {
            setError('Failed to update burger');
        }
    };

    return (
    <>
    <button onClick={()=>navigate(`/users/${currentUser[0].user_id}/kitchen`)}>Back</button>
        <h2>Ingredient Task List</h2>
            <p>Selected Component: {component}</p>
            {burger ? (
        <>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>{burger[component]}</button>
          ) : (
            <div>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`New value for ${component}`}
              />
              <button onClick={() => handleUpdateBurger(component)}>Update</button>
              <button onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          )}
        </>
      ) : error ? (
        <p>Error: {error}</p>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
