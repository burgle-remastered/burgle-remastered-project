import { useContext, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
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

    useEffect(() => {
        // Set background image for Home page (image from public/images)
        document.body.style.backgroundColor = '#EDC06D';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }, []);

    // handlesubmit function to log the user in. 
    const handleSubmit = async (event) => {
        event.preventDefault();
        setErrorText('');
        const formData = new FormData(event.target)
        const formObject = Object.fromEntries(formData)
        const existingUser = Cookies.get('currentUser')
        if (existingUser) {
            setTimeout(() => {
                navigate(`/users/${existingUser[0].user_id}`)
            }, 100)
        }
        try {
            const response = await axios.post('http://127.0.0.1:5000/auth/login', formObject, {
                withCredentials: true, headers: {
                    'Content-Type': 'application/json', // Make sure it's set to JSON
                }
            });
            const user = response.data
            Cookies.set('currentUser', JSON.stringify(user), { expires: 7 })
            setCurrentUser(user)
            setTimeout(() => {
                navigate(`/`);  // cookies weren't being set in time so we need to wait
            }, 100);
            ;
        } catch (error) {
            setErrorText(error.response?.data?.error || 'An error occurred during login.')
        }
    };
    return (
        <>
            <div className="logInForm">
                <form onSubmit={handleSubmit} aria-labelledby="login-heading" className="logInForm">
                    <h2 id="login-heading" className="header2">
                        Welcome Back, Toots!
                    </h2>

                    <div className="inputBlock">
                        <label htmlFor="username" className="username">Username: </label>
                        <input
                            type="text"
                            autoComplete="username"
                            id="username"
                            className="usernameInput"
                            name="username"
                            placeholder="Your username"
                        />
                    </div>

                    <div className="inputBlock">
                        <label htmlFor="password" className="password">Password: </label>
                        <input
                            type="password"
                            autoComplete="current-password"
                            id="password"
                            name="password"
                            placeholder="Your password"
                        />
                    </div>
                    <button className="button" id="logInButton">Log In!</button>
                </form>
            </div>
        </>
    )
}