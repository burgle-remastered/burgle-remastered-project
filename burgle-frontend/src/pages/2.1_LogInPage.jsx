import { useContext, useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
// Madison has to make a log-user-in function using the adapters
// import { logUserIn } from "../adapters/auth-adapter";
import CurrentUserContext from "../contexts/current-user-context";
import axios from 'axios'
import Cookies from 'js-cookie'

export default function LoginPage() {
    const navigate = useNavigate();
    const [errorText, setErrorText] = useState('');
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);

    axios.defaults.withCredentials = true

    // returns the user to their homepage 
    if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

    // handlesubmit function to log the user in. 
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorText('');
        const formData = new FormData(event.target)
        const formObject = Object.fromEntries(formData)
        const existingUser = Cookies.get('currentUser')
        console.log(existingUser)
        if(existingUser){
            setTimeout(()=>{
                 navigate(`/users/${existingUser[0].user_id}`)
            },100) 
        }
        //   const [user, error] = await logUserIn(Object.fromEntries(formData));
        try {
            const response = await axios.post('http://127.0.0.1:5000/auth/login', formObject, {
                withCredentials: true, headers: {
                    'Content-Type': 'application/json', // Make sure it's set to JSON
                  } // This ensures the session cookie is sent// This ensures the session cookie is sent
              });
            const user = response.data
            Cookies.set('currentUser', JSON.stringify(user), { expires: 7 })
            setCurrentUser(user)
            // console.log(user[0].user_id)
            setTimeout(() => {
                navigate(`/`);  // cookies weren't being set in time so we need to wait
              }, 100); 
            ;  // Navigate to user page // 3: number
          } catch (error) {
            setErrorText(error.response?.data?.error || 'An error occurred during login.')
          }
        //have to set the path for this one. Ask Zo or Carmen about how routes work here with navigate?
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