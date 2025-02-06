import { useState } from "react";
import { Link } from "react-router-dom";
import BurgrLogo from "../reusable_components/BurgrLogo";

export default function NoAccPage() {
    return (
        <>
            <BurgrLogo />
            <div className="landingPageButtons">
                <div id="logInButtonMess">Old?</div>
                {/* this will route to the log in page */}
                <button><Link to='/login'>Log In!</Link></button>

                <div id="logInButtonMess">New?</div>
                {/* This will route to the sign up page */}
                <button><Link to='/signup'>Sign Up!</Link></button>
            </div>


        </>


    )
}