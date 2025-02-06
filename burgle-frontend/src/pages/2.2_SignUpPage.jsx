import { useContext, useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
//create current user context in a context folder 
import CurrentUserContext from "../contexts/current-user-context";
// need adapters
// import { createUser } from "../adapters/user-adapter";


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


    //   // users shouldn't be able to see the sign up page if they are already logged in.
    //   // if the currentUser exists in the context, navigate the user to 
    //   // the /users/:id page for that user, using the currentUser.id value
    //   if (currentUser) return <Navigate to={`/users/${currentUser.id}`} />;


    const handleSubmit = async (event) => {
        //preventing it from refreshing
        event.preventDefault();
        setErrorText('');

        if (!username || !password) return setErrorText('Missing username or password');

        const [user, error] = await createUser({ username, password, name, email });
        if (error) return setErrorText(error.message);

        console.log(errorText)

        //setting the current user's information values to create their account and navigate them to their homepage
        setCurrentUser(user);
        //set the values of the inputs back to empty


        navigate(`/users/${user.id}`);
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
                <h2 className="header2">Sign Up</h2>
                <form className="signUpForm" onSubmit={handleSubmit}>
                    {/* Name */}
                    <div className="nameInput">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder=""
                            required
                            autoComplete="off"
                            onChange={handleChange}
                            value={name}
                        />
                        <label htmlFor="name">Your Name</label>
                    </div>

                    {/* Username */}
                    <div className="username">
                        <input
                            type="text"
                            name="username"
                            id="username"
                            placeholder=""
                            required
                            autoComplete="off"
                            onChange={handleChange}
                            value={username}
                        />
                        <label htmlFor="username">Username</label>
                    </div>

                    {/* Password */}
                    <div className="password">
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder=""
                            required
                            autoComplete="off"
                            onChange={handleChange}
                            value={password}
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    <div className="email">
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder=""
                            required
                            autoComplete="off"
                            onChange={handleChange}
                            value={email}
                        />
                        <label htmlFor="email">Email</label>
                    </div>
                    <button type="submit">Sign Up Now</button>
                </form>

                {!!errorText && <p>{errorText}</p>}
                <p className="smallWords">Already have an account with us? <Link to="/login">Log in!</Link></p>
            </div>

        </>
    )
};