import React from "react";
import { useState, useNavigate } from "react";
// import { Link } from 'react-router-dom'

//this is actually going to be a template menu
export default function BurgerUserMenu() {

    // All of what is necessary to make sure that the user is logged in and we can fetch their templates if they have any
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [userProfile, setUserProfile] = useState(null);
    const [errorText, setErrorText] = useState(null);
    const { id } = useParams();
    const isCurrentUserProfile = currentUser && currentUser.id === Number(id);


    useEffect(() => {
        const loadUser = async () => {
            const [user, error] = await getUser(id);
            if (error) return setErrorText(error.message);
            setUserProfile(user);
        };

        loadUser();
    }, [id]);

    const handleLogout = async () => {
        logUserOut();
        setCurrentUser(null);
        navigate('/');
    };

    // getting the burger templates from the users db using the user's id 
    // 
    /*
    1. check if user is logged in! always! 
    2. check user's profile for a "saved template". if so, render "templates" from the user's account info db
    3. New templates will be added when a current burger (in the kitchen) is saved using the save button below the burger, and named 
    4. Menu will be able to scroll horizontally to see multiple burger templates. Default state is for the templates to fade in and out as menu options like in a real restaurant 
    */



    return (
        <>
            <div id="menuBlock">
                <h3>Menu</h3>
                {/* If the user is logged in and has no saved templates */}
                <div>No specials yet! Save a burger to create a template.</div>

                {/* formatting the options into a row structure using flex */}
                <div id="burgerMenuOptions" className="flex, flex-row">
                    {/* if user is logged in AND has a saved template */}

                    <ul>
                        { }
                    </ul>

                </div>
            </div>

        </>
    )

}