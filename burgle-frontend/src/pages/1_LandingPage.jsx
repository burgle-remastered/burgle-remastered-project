import { Link } from "react-router-dom";
import BurgrLogo from "../reusable_components/BurgrLogo";


export default function Landing() {

    /* here we'd:
    1. check if the user is logged in.
    2. if yes, the buttons go to their acc, or their kitchen with their templates and current burger
    3. if no, the buttons lead to the noAccDetected page which will have login/signup options 
    */
    console.log('home!')

    return (
        <>
            <BurgrLogo />
            <div>
                {/* make it so they are both not highlighted. Now that the routes are in place, these links can use the paths established by the routes to navigate the site! */}
                {/* conditional render, function inside "to" tag will check if there's a user logged in. if user isn't logged in, both buttons lead to log in page. If user is logged in, buttons will lead to their respective pages   */}
                <button id="kitchenButton"> <Link to='/no-acc'>Go to Kitchen!</Link></button>
                <button id="accountButton"><Link to='/no-acc'>Account</Link></button>
            </div>
        </>
    )

}   