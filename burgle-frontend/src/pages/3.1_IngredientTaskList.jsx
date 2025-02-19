//import burger 
//fetch burger, then fetch burger.top_bun etc/ depending on the component that the user clicked (listen)
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import CurrentUserContext from "../contexts/current-user-context";
// BURGER PROP
import BurgerProp from "../props/3D_props/BurgerProp";

export default function IngredientTaskList() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext)
  const { burgerId, component } = useParams()
  const [burger, setBurger] = useState()
  const [error, setError] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [newValue, setNewValue] = useState('')
  const navigate = useNavigate()

  const { scene } = useGLTF(`http://127.0.0.1:5000/static/ThreeJSModels/${component}.glb`);
  console.log(scene)


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
        const response = await axios.post(`http://127.0.0.1:5000/burger/${date}`, {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // We're telling the server we expect JSON
          }, body: { user: user[0].user_id }
        });
        setBurger(response.data)
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBurger();
  }, []);

  const handleUpdateBurger = async (burgerComponent) => {
    try {
      const user = JSON.parse(Cookies.get('currentUser'))
      const updatedData = { burger_id: burger.id, user_id: user[0].user_id, [burgerComponent]: newValue };
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
      <button onClick={() => navigate(`/users/${currentUser[0].user_id}/kitchen`)}>Back</button>
      <h2>Ingredient Task List</h2>
      {/* burger prop */}
      <h2>Part Details: {component}</h2>
      <Canvas style={{ width: 900, height: 500 }} camera={[10, 10, 10]}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        {isolatedPart && <primitive object={isolatedPart} position={[0, 0, 0]} />}
      </Canvas>
      {burger ? (
        <>
          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>{burger[burgerComponent]}</button>
          ) : (
            <div>
              <input
                type="text"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`New value for ${burgerComponent}`}
              />
              <button onClick={() => handleUpdateBurger(burgerComponent)}>Update</button>
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
