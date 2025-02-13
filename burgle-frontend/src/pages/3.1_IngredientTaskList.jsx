//import burger 
//fetch burger, then fetch burger.top_bun etc/ depending on the component that the user clicked (listen)
import axios from "axios";
import Cookies from "js-cookie";
import { useParams,useNavigate } from "react-router-dom";
import { useState,useEffect,useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";


export default function IngredientTaskList() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const { burgerId, component } = useParams();
    const [burger, setBurger] = useState()
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    const getDate = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        console.log(`${year}-${month}-${date}`)
        return `${year}-${month}-${date}`;
    }

    useEffect(() => {
        const savedUser = Cookies.get("currentUser");
        console.log(savedUser);
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
            console.log(response.data)
            setBurger(response.data)
          } catch (err) {
            setError(err.message);
          }
        };
        fetchBurger();
        
      }, []);

    return (
    <>
    <button onClick={()=>navigate(`/users/${currentUser[0].user_id}/kitchen`)}>Back</button>
        <h2>Ingredient Task List</h2>
            <p>Selected Component: {component}</p>
            {burger ? (
        <p>{burger[component]}</p>
    ) : error ? (
      <p>Error: {error}</p>
    ) : (
      <p>Loading...</p>
    )}
        </>
    )

}