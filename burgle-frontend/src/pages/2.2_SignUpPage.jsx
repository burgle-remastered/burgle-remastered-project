import { useContext, useState, useEffect } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import axios from "axios"
import Cookies from "js-cookie";

// Controlling the sign up form is a good idea because we want to add (eventually)
// more validation and provide real time feedback to the user about usernames and passwords
export default function SignUp() {
    const navigate = useNavigate();
    const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
    const [errorText, setErrorText] = useState('');
    // user personal info -- name and location 
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        // Set background image for Home page (image from public/images)
        document.body.style.backgroundColor = '#EDC06D';
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }, []);

    //   // users shouldn't be able to see the sign up page if they are already logged in.
    //   // if the currentUser exists in the context, navigate the user to 
    //   // the /users/:id page for that user, using the currentUser.id value
    //   if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;

    const handleSubmit = async (event) => {
        //preventing it from refreshing
        event.preventDefault();
        setErrorText('');
        const formData = new FormData(event.target)
        const formObject = Object.fromEntries(formData)

        try {
            const userData = {
                username: formObject.username,
                email: formObject.email,
                password: formObject.password
            };

            console.log("User to add:", userData)
            const response = await axios.post('http://127.0.0.1:5000/auth/register', userData, {
                withCredentials: true, headers: {
                    'Content-Type': 'application/json', // Make sure it's set to JSON
                }
            })
            const user = response.data
            Cookies.set('currentUser', JSON.stringify(user), { expires: 7 })
            setCurrentUser(user)
            setTimeout(() => {
                const user = JSON.parse(Cookies.get('currentUser'))
                navigate(`/users/${user.user_id}`);  // cookies weren't being set in time so we need to wait
            }, 100);
        } catch (err) {
            console.log("Error:", err);
            console.log("Error response:", err.response);
            setErrorText(err.response?.data?.error || 'An error occurred during signup.')
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'name') setName(value);
        if (name === 'username') setUsername(value);
        if (name === 'password') setPassword(value);
        if (name === 'email') setEmail(value);
    };

    return (
        <>
            <div className="signUpForm">


                <h2 className="header2">Sign Up... Muahahah</h2>
                <form onSubmit={handleSubmit}>
                    {/* Name */}

                    <div className="inputBlock">
                        <label htmlFor="name">Your Name: </label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            className="inputBox"
                            placeholder="Don't forget it!"
                            required
                            autoComplete="off"
                            onChange={handleChange}
                            value={name}
                        />
                    </div>

                    {/* Username */}
                    <div className="inputBlock">
                        <label htmlFor="username" className="username">Username: </label>
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder="Make it good..."
                            required
                            autoComplete="off"
                            onChange={handleChange}
                            value={username}
                        />
                    </div>

                    {/* Password */}
                    <div className="inputBlock">
                        <label htmlFor="password" className="password">Password: </label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder="Be strong..."
                            required
                            autoComplete="off"
                            onChange={handleChange}
                            value={password}
                        />
                    </div>

                    <div className="inputBlock">
                        <label htmlFor="email">Email: </label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder="@!$#"
                            required
                            autoComplete="off"
                            onChange={handleChange}
                            value={email}
                        />
                    </div>


                    <button type="submit" className="button" id="signUpButton">Sign Up!</button>
                </form >

                {!!errorText && <p>{errorText}</p>
                }
                <p className="smallWords">Already have an account with us? <Link to="/login" id="loginMessage">Log in!</Link></p>
            </div >

        </>
    )
};