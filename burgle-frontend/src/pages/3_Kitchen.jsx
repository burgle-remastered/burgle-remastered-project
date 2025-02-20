// import template menu component 
// import default burger prop (component) (MODEL)
// import additional ingredients prop (component) (INCLUDES MODEL)
// import spoons count prop (component)
// import settings icon prop (component) (STRETCH)
// import user account settings icon (component)
// useState for save button and add tasks pop up (pop up when burger model is made)
import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import axios from "axios";
import Cookies from "js-cookie";
// burger prop
import BurgerProp from "../props/3D_props/BurgerProp";

export default function Kitchen() {
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [pickles, setPickles] = useState('');
    const [lettuce, setLettuce] = useState('');
    const [tomato, setTomato] = useState('');
    const [burger, setBurger] = useState(null);
    const [templateBurgers, setTemplateBurgers] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate()
    axios.defaults.withCredentials = true;

    useEffect(() => {
        const savedUser = Cookies.get("currentUser");
        if (savedUser) {
            setCurrentUser(JSON.parse(savedUser));
        }
    }, []);

    useEffect(() => {
        // Set background image for Home page (image from public/images)
        document.body.style.backgroundColor = '#EDC06D';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }, []);

    const getDate = () => {
        const today = new Date();
        const month = today.getMonth() + 1;
        const year = today.getFullYear();
        const date = today.getDate();
        return `${year}-${month}-${date}`;
    }
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
                    }, body: { user: user.user_id }
                });
                setBurger(response.data)
            } catch (err) {
                setError(err.message);
            }
        };
        fetchBurger();
    }, []);

    useEffect(() => {
        const fetchTemplateBurgers = async () => {
            try {
                const user = JSON.parse(Cookies.get('currentUser'))
                const response = await axios.post("http://127.0.0.1:5000/burger/template", {
                    withCredentials: true,
                    headers: {
                        Accept: "application/json",
                    },
                    body: { user: user[0].user_id }
                    ,
                });
                setTemplateBurgers(response.data.burgers)
            } catch (err) {
                setError(err.message);
            }
        };
        fetchTemplateBurgers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log(event.target)
        setError('');
        console.log('clicked')
        const formData = new FormData(event.target)
        const formObject = Object.fromEntries(formData)
        console.log(formObject)

        try {
            const user = JSON.parse(Cookies.get('currentUser'))
            const burgerData = {
                "top_bun": formObject.top_bun,
                "meat": formObject.meat,
                "cheese": formObject.cheese,
                "sauce": formObject.sauce,
                "bottom_bun": formObject.bottom_bun,
                "spoon_count": formObject.spoon_count,
                "user_id": user.user_id
            };
            console.log(burgerData)
            const response = await axios.post('http://127.0.0.1:5000/burger/', burgerData, {
                withCredentials: true, headers: {
                    'Content-Type': 'application/json',
                }
            });
            const burger = response.data
            setBurger(burger)
            console.log(burger)
        } catch (error) {
            console.log(error)
            setError(error.response?.data?.error || 'An error occurred during creation.')
        }
    };

    const handleUpdateBurger = async (component, value) => {
        try {
            const user = JSON.parse(Cookies.get('currentUser'))
            const updatedData = { burger_id: burger.id, user_id: user[0].user_id, [component]: value };
            const response = await axios.patch(`http://127.0.0.1:5000/burger/${burger.id}`, updatedData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
            setBurger(response.data); // Update the burger state with the new data
        } catch (error) {
            setError('Failed to update burger');
        }
    };

    const handleOpen = async (component, value) => {
        navigate(`/users/${currentUser.id}/${burger.id}/${component}`)
    }

    const handleTemplate = async () => {
        try {
            const user = JSON.parse(Cookies.get('currentUser'))
            const updatedData = { burger_id: burger.id, user_id: user.user_id, is_template: true };
            const response = await axios.patch(`http://127.0.0.1:5000/burger/${burger.id}`, updatedData, {
                withCredentials: true,
                headers: { 'Content-Type': 'application/json' }
            })
            setTemplateBurgers((prevBurgers) => [...prevBurgers, response.data]) // Update the burger state with the new data
        } catch (error) {
            setError('Failed to update burger');
        }
    }


    return (
        <>
            <div className="kitchenHeader">
                <div className="backButton">
                <button className="button"onClick={() => navigate('/')}>Back to Truck</button>
                </div>
            
            <h1> Kitchen</h1>
            </div>

            <h2 id="kitchenWelcome" className="header2">
                            Welcome Back to the Kitchen, Toots!
                        </h2>
            
            <div id="kitchenSpace" className="flex flex-row h-64">

                {/* Template menu */}
                <div id="burgerAndMenu">
                <div id="userMenu">
                    <div id="menuLine">
                    <h3>Menu</h3>
                    <div className='recipe_container'>
                    {templateBurgers.length > 0 ? (
                        templateBurgers.map((burger) => <li className='recipe_container' key={burger.id}>{
                            <div className='Recipe'>
                                <h4 className='ingredient'>Burger From: {burger.created_at}!</h4>
                                <ul className='ingredient'>Top Bun: {burger.top_bun}</ul>
                                <ul className='ingredient'>Meat: {burger.meat}</ul>
                                <ul className='ingredient'>Cheese: {burger.cheese}</ul>
                                <ul className='ingredient'>Sauce: {burger.sauce}</ul>
                                {burger.pickles && (<ul className='ingredient'>Pickles: {burger.pickles}</ul>)}
                                {burger.lettuce && (<ul className='ingredient'>Lettuce: {burger.lettuce}</ul>)}
                                {burger.tomato && (<ul className='ingredient'>Tomato: {burger.tomato}</ul>)}
                                <ul className='ingredient'>Bottom Bun: {burger.bottom_bun}</ul>
                            </div>
                        }</li>)
                    ) : (
                        <p className="emptyMessage" >No template burgers :(</p>
                    )}</div>

                    </div>
                </div>
            
                {/* Burger */}

                <div id="burgerSpace">
                    {burger ? (
                        <div>
                         <BurgerProp onPartClick={handleOpen} />
                         <button className="button" >Spoon Count: {burger.spoon_count}</button>
                         <button className="button"onClick={() => handleTemplate()}>Add as template</button>
                        </div>
                       
                    ) : (
                        // <p>Loading burger...</p> // Placeholder or loading message
                        <div>
                        {error && <h4 className="emptyBurgerMessage">You haven't made a burger today yet!</h4>}
                        <div className="burgerForm">
                {!burger && (
                    <form onSubmit={handleSubmit} aria-labelledby="burger-heading">
                        <div className="burgerInputs">
                        
                        <div className="inputBlock">
                            <label htmlFor="top_bun" className="top_bun">Top Bun: </label>
                            <input
                                type="text"
                                autoComplete="top_bun"
                                id="top_bun"
                                name="top_bun"
                                placeholder="morning routine"
                            />
                        </div>

                        <div className="inputBlock">
                            <label htmlFor="meat" className="meat">Meat: </label>
                            <input
                                type="text"
                                autoComplete="current-meat"
                                id="meat"
                                name="meat"
                                placeholder="focus 4 2day"
                            />
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="cheese" className="cheese">Cheese: </label>
                            <input
                                type="text"
                                autoComplete="current-cheese"
                                id="cheese"
                                name="cheese"
                                placeholder="mandatory treat!!"
                            />
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="sauce" className="sauce">Sauce: </label>
                            <input
                                type="text"
                                autoComplete="current-sauce"
                                id="sauce"
                                name="sauce"
                                placeholder="reflection exercise"
                            />
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="bottom_bun" className="bottom_bun">Bottom Bun: </label>
                            <input
                                type="text"
                                autoComplete="current-bottom_bun"
                                id="bottom_bun"
                                name="bottom_bun"
                                placeholder="night routine"
                            />
                        </div>
                        <div className="inputBlock">
                            <label htmlFor="spoon_count" className="spoon_count">Spoon Count: </label>
                            <input
                                type="text"
                                autoComplete="current-spoon_count"
                                id="spoon_count"
                                name="spoon_count"
                                placeholder="energy level (in spoons)"
                            />
                        </div>

                        </div>
                        <button className="button" type="submit">Create Burger!</button>
                    </form>
                )}
                {/* Dynamic form for additional components */}
                <div className="additionalComponents">
                    {burger && (<div>
                        <h3>Add Extra Components</h3>
                        {!burger.pickles && (
                            <div className="picklesBlock">
                                <label htmlFor="pickles">Pickles: </label>
                                <input
                                    type="text"
                                    id="pickles"
                                    value={pickles}
                                    onChange={(e) => setPickles(e.target.value)}
                                    placeholder="Add pickles"
                                />
                                <button className="button" type="button" onClick={() => handleUpdateBurger('pickles', pickles)}>
                                    Add Pickles
                                </button>
                            </div>
                        )}
                        {!burger.lettuce && (
                            <div>
                                <div className="lettuceBlock">
                                    <label htmlFor="lettuce">Lettuce</label>
                                    <input
                                        type="text"
                                        id="lettuce"
                                        value={lettuce}
                                        onChange={(e) => setLettuce(e.target.value)}
                                        placeholder="Add lettuce"
                                    />
                                    <button className="button" type="button" onClick={() => handleUpdateBurger('lettuce', lettuce)}>
                                        Add Lettuce
                                    </button>
                                </div>
                            </div>
                        )
                        }
                        {!burger.tomato && (
                            <div className="tomatoBlock">
                                <label htmlFor="tomato">Tomato</label>
                                <input
                                    type="text"
                                    id="tomato"
                                    value={tomato}
                                    onChange={(e) => setTomato(e.target.value)}
                                    placeholder="Add tomato"
                                />
                                <button className="button" type="button" onClick={() => handleUpdateBurger('tomato', tomato)}>
                                    Add Tomato
                                </button>
                            </div>
                        )}
                    </div>
                    )}
                </div>
            </div>
                        </div>
                        
                    )}
                </div>

            </div>
                </div>
        </>
    )
}