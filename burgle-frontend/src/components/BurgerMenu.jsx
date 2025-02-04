import React from "react";
import { Link } from 'react-router-dom'
import BurgrLogo from "./BurgrLogo";

export default function BurgerUserMenu() {

    /*
    1. check if user is logged in! always! 
    2. check user's profile for a "saved template". if so, render "templates" option
    3. if not, render "new burger" option. new burger takes you to burger building page
    */

    return (
        <>
            <BurgrLogo />
            {/* formatting the options into a column structure using flex */}
            <div id="burgerMenuOptions" className="flex, flex-col">
                {/* If the user is logged in and has no saved templates */}
                <Link>New Burger</Link>
                {/* if user is logged in AND has a saved template */}
                <Link>Templates</Link>

            </div>
        </>
    )

}