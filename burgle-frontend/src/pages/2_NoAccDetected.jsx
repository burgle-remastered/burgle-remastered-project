import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import BurgrLogo from "../reusable_components/BurgrLogo";
import Truck from "../props/3D_props/TruckProp";

export default function NoAccPage() {
    useEffect(() => {
        // Set background image for Home page (image from public/images)
        document.body.style.backgroundColor = '#EDC06D';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }, []);


    return (
        <>
            <div id="accMenuBox">
                <BurgrLogo />
                <Truck />
                <div className="landingPageButtons">
                    <div>
                        <div className="logInButtonMess" >Old?</div>
                        {/* this will route to the log in page */}
                        <button className="button"><Link to='/login' className="link">Log In!</Link></button>
                    </div>

                    <div>
                        <div className="logInButtonMess">New?</div>
                        {/* This will route to the sign up page */}
                        <button className="button"><Link to='/signup' className="link">Sign Up!</Link></button>
                    </div>
                </div>
            </div>



        </>


    )
}