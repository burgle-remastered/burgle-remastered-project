// import template menu component 
// import default burger prop (component) (MODEL)
// import additional ingredients prop (component) (INCLUDES MODEL)
// import spoons count prop (component)
// import settings icon prop (component) (STRETCH)
// import user account settings icon (component)
// useState for save button and add tasks pop up (pop up when burger model is made)
import { useState, useContext, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import axios from "axios";
import Cookies from "js-cookie";

export default function Kitchen() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [pickles, setPickles] = useState('');
    const [lettuce, setLettuce] = useState('');
    const [tomato, setTomato] = useState('');
    const [burger, setBurger] = useState({
        top_bun: "",
        meat: "",
        cheese: "",
        sauce: "",
        bottom_bun: "",
        spoon_count: "",
        additional_components: []
    });
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;
    const getDate = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        console.log(`${year}-${month}-${date}`)
        return `${year}-${month}-${date}`;
      }
    useEffect(() => {
        const fetchBurger = async () => {
          try {
            const date = getDate()
            const user = JSON.parse(Cookies.get('currentUser')) 
            console.log(user[0].user_id)  // This will give you the data directly
            const response = await axios.post(`http://127.0.0.1:5000/burger/${date}`,{
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
                Accept: "application/json", // We're telling the server we expect JSON
              },  body: {user: user[0].user_id}
            });
            console.log(response.data)
            setBurger(response.data); // Assuming the response contains `burgers` data
          } catch (err) {
            setError(err.message);
          }
        };
        fetchBurger();
      }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        const formData = new FormData(event.target)
        const formObject = Object.fromEntries(formData)

        try {
            const user = JSON.parse(Cookies.get('currentUser')) 
            const burgerData = {
                "top_bun": formObject.top_bun,
                "meat": formObject.meat,
                "cheese": formObject.cheese,
                "sauce": formObject.sauce,
                "bottom_bun": formObject.bottom_bun,
                "spoon_count": formObject.spoon_count,
                "user_id": user[0].user_id
            };
            const response = await axios.post('http://127.0.0.1:5000/burger/', burgerData, {
                withCredentials: true, headers: {
                    'Content-Type': 'application/json', 
                  }
              });
            const burger = response.data
            setBurger(burger)
          } catch (error) {
            setError(error.response?.data?.error || 'An error occurred during creation.')
          }
    };

    const handleUpdateBurger = async (component,value) => {
        try {
            const user = JSON.parse(Cookies.get('currentUser')) 
            const updatedData = { burger_id:burger.id,user_id:user[0].user_id,[component]: value };
            const response = await axios.patch(`http://127.0.0.1:5000/burger/${burger.id}`, updatedData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(response.data)
            setBurger(response.data); // Update the burger state with the new data
        } catch (error) {
            setError('Failed to update burger');
        }
    };

    const handleOpen = async (component,value) => {
        navigate(`/users/${burger.user_id}/${burger.id}/${component}`)
    }

    const handleTemplate = async () => {
        try {
            const user = JSON.parse(Cookies.get('currentUser')) 
            const updatedData = { burger_id:burger.id,user_id:user[0].user_id, is_template: true};
            const response = await axios.patch(`http://127.0.0.1:5000/burger/${burger.id}`, updatedData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            });
            console.log(response.data)
            setBurger(response.data); // Update the burger state with the new data
        } catch (error) {
            setError('Failed to update burger');
        }
    }
    

    return (
        <>
            <h2> Kitchen </h2>
            <button onClick={()=>navigate('/')}>Back</button>
            {burger && (
                <div className="burgerDetails">
                    <h3>Your Burger</h3>
                    <button onClick={()=>handleOpen("top_bun",burger.top_bun)} >Top Bun: {burger.top_bun}</button>
                    <button onClick={()=>handleOpen("meat",burger.meat)} >Meat: {burger.meat}</button>
                    <button onClick={()=>handleOpen("cheese",burger.cheese)} >Cheese: {burger.cheese}</button>
                    <button onClick={()=>handleOpen("sauce",burger.sauce)} >Sauce: {burger.sauce}</button>
                    {burger.pickles && (
                        <button onClick={()=>handleOpen("pickles",burger.pickles)} >Pickles: {burger.pickles}</button>
                    )}
                    {burger.lettuce && (
                        <button onClick={()=>handleOpen("lettuce",burger.lettuce)} >Lettuce: {burger.lettuce}</button>
                    )}
                    {burger.tomato && (
                        <button onClick={()=>handleOpen("tomato",burger.tomato)} >Tomato: {burger.tomato}</button>
                    )}
                    <button onClick={()=>handleOpen("bottom_bun",burger.bottom_bun)} >Bottom Bun: {burger.bottom_bun}</button>
                    <button >Spoon Count: {burger.spoon_count}</button>

                    <button onClick={() => setBurger(null)}>Modify Your Burger</button>
                </div>
            )}
            <button onClick={()=>handleTemplate()}>Add as template</button>
            <div className="burgerForm">
                <form onSubmit={handleSubmit} aria-labelledby="burger-heading">
                    <h2 id="burger-heading" className="header2">
                        Welcome Back to the Kitchen, Toots!
                    </h2>

                    <div className="top_bunBlock">
                        <label htmlFor="top_bun" className="top_bun">top_bun</label>
                        <input
                            type="text"
                            autoComplete="top_bun"
                            id="top_bun"
                            name="top_bun"
                            placeholder="Enter your morning routine"
                        />
                    </div>

                    <div className="meatBlock">
                        <label htmlFor="meat" className="meat">meat</label>
                        <input
                            type="meat"
                            autoComplete="current-meat"
                            id="meat"
                            name="meat"
                            placeholder="Enter your big task"
                        />
                    </div>
                    <div className="cheeseBlock">
                        <label htmlFor="cheese" className="cheese">cheese</label>
                        <input
                            type="cheese"
                            autoComplete="current-cheese"
                            id="cheese"
                            name="cheese"
                            placeholder="Enter your relaxation"
                        />
                    </div>
                    <div className="sauceBlock">
                        <label htmlFor="sauce" className="sauce">sauce</label>
                        <input
                            type="sauce"
                            autoComplete="current-sauce"
                            id="sauce"
                            name="sauce"
                            placeholder="Enter your reflection"
                        />
                    </div>
                    <div className="bottom_bunBlock">
                        <label htmlFor="bottom_bun" className="bottom_bun">bottom_bun</label>
                        <input
                            type="bottom_bun"
                            autoComplete="current-bottom_bun"
                            id="bottom_bun"
                            name="bottom_bun"
                            placeholder="Enter your night routine"
                        />
                    </div>
                    <div className="spoon_countBlock">
                        <label htmlFor="spoon_count" className="spoon_count">spoon_count</label>
                        <input
                            type="spoon_count"
                            autoComplete="current-spoon_count"
                            id="spoon_count"
                            name="spoon_count"
                            placeholder="Enter your spoons"
                        />
                    </div>
                    <button>Create Burger!</button>
                </form>
                {/* Dynamic form for additional components */}
                <div className="additionalComponents">
                        <h3>Add Extra Components</h3>

                        {/* Input and button for pickles */}
                        <div className="picklesBlock">
                            <label htmlFor="pickles">Pickles</label>
                            <input
                                type="text"
                                id="pickles"
                                value={pickles}
                                onChange={(e) => setPickles(e.target.value)}
                                placeholder="Add pickles"
                            />
                            <button type="button" onClick={() => handleUpdateBurger('pickles', pickles)}>
                                Add Pickles
                            </button>
                        </div>

                        {/* Input and button for lettuce */}
                        {burger && (<div>
                            <div className="lettuceBlock">
                            <label htmlFor="lettuce">Lettuce</label>
                            <input
                                type="text"
                                id="lettuce"
                                value={lettuce}
                                onChange={(e) => setLettuce(e.target.value)}
                                placeholder="Add lettuce"
                            />
                            <button type="button" onClick={() => handleUpdateBurger('lettuce', lettuce)}>
                                Add Lettuce
                            </button>
                        </div>

                        {/* Input and button for tomato */}
                        <div className="tomatoBlock">
                            <label htmlFor="tomato">Tomato</label>
                            <input
                                type="text"
                                id="tomato"
                                value={tomato}
                                onChange={(e) => setTomato(e.target.value)}
                                placeholder="Add tomato"
                            />
                            <button type="button" onClick={() => handleUpdateBurger('tomato', tomato)}>
                                Add Tomato
                            </button>
                        </div>
                    </div>
                    )}
                </div>
            </div>
        </>
    )
}