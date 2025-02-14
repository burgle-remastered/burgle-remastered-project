import { Link, useNavigate } from "react-router-dom";
import BurgrLogo from "../reusable_components/BurgrLogo";
import { useState,useContext } from "react";
import CurrentUserContext from "../contexts/current-user-context";
import axios from "axios"
import Cookies from 'js-cookie'


export default function Landing() {
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState('');
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    axios.defaults.withCredentials = true
    /* here we'd:
    1. check if the user is logged in.
    2. if yes, the buttons go to their acc, or their kitchen with their templates and current burger
    3. if no, the buttons lead to the noAccDetected page which will have login/signup options 
    */
    const handleClick = (button) => {
        const existingUser = Cookies.get('currentUser')
            if(existingUser){ 
                const existingUserData = JSON.parse(Cookies.get('currentUser'))
                setTimeout(()=>{
                    if(button === 'kitchen') navigate(`/users/${existingUserData[0].user_id}/kitchen`)
                    if(button === 'account') navigate(`/users/${existingUserData[0].user_id}`)
                },100) 
        }else navigate('/no-acc')
    }
    return (
        <>
            <BurgrLogo />
            <div>
                {/* make it so they are both not highlighted. Now that the routes are in place, these links can use the paths established by the routes to navigate the site! */}
                {/* conditional render, function inside "to" tag will check if there's a user logged in. if user isn't logged in, both buttons lead to log in page. If user is logged in, buttons will lead to their respective pages   */}
                <button id="kitchenButton" onClick={()=>handleClick('kitchen')}>Go to Kitchen!</button>
                <button id="accountButton" onClick={()=>handleClick('account')}>Account</button>
            </div>
        </>
    )

}   