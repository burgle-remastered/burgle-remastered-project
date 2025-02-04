import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
// Madison has to make a log-user-in function using the adapters
// import { logUserIn } from "../adapters/auth-adapter";
import CurrentUserContext from "../contexts/current-user-context";

export default function LoginPage() {
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState('');
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    // returns the user to their homepage 
    if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

    // handlesubmit function to log the user in. 
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorText('');
        const formData = new FormData(event.target);

        //   Madison needs to make the log user in function  for this
        //   const [user, error] = await logUserIn(Object.fromEntries(formData));
        if (error) return setErrorText(error.message);
        setCurrentUser(user);

        //have to set the path for this one. Ask Zo or Carmen about how routes work here with navigate?
        navigate(`/users/${user.id}`);
    };

    return (
        <>
            {/* old user log in form */}

            <div className="logInForm">
                <form onSubmit={handleSubmit} aria-labelledby="login-heading">
                    <h2 id="login-heading" className="header2">
                        Welcome Back, Toots!
                    </h2>

                    <div className="usernameBlock">
                        <label htmlFor="username" className="username">Username</label>
                        <input
                            type="text"
                            autoComplete="username"
                            id="username"
                            name="username"
                            placeholder="Enter your username"
                        />
                    </div>

                    <div className="passwordBlock">
                        <label htmlFor="password" className="password">Password</label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            id="password"
                            name="password"
                            placeholder="Enter your password"
                        />
                    </div>

                    <button>Log In!</button>
                </form>
            </div>

        </>
    )

}