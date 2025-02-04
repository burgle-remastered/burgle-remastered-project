import { useState } from "react";
import BurgrLogo from "../components/BurgrLogo";

export default function LandingPage() {
    return (
        <>
            <BurgrLogo />
            <div className="landingPageButtons">
                <div id="logInButtonMess">Old?</div>
                {/* this will route to the log in page */}
                <button>Log In!</button>

                <div id="logInButtonMess">New?</div>
                {/* This will route to the sign up page */}
                <button>Sign Up!</button>
            </div>


        </>


    )
}