import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CurrentUserContext from "../contexts/current-user-context";
import axios from "axios";
import Cookies from "js-cookie";

export default function AccountPage() {
  const { currentUser, setCurrentUser } = useContext(CurrentUserContext);
  const [burgers, setBurgers] = useState([]);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate()
  axios.defaults.withCredentials = true;

  const user = Cookies.get("currentUser");

  useEffect(() => {
    const savedUser = Cookies.get("currentUser")
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

  useEffect(() => {
    // Set background image for Home page (image from public/images)
    document.body.style.backgroundColor = '#EDC06D';
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
  }, []);

  useEffect(() => {
    const fetchBurgers = async () => {
      try {
        const user = JSON.parse(Cookies.get('currentUser'))   // This will give you the data directly
        const response = await axios.post("http://127.0.0.1:5000/burger/all", {
          withCredentials: true,
          headers: {
            Accept: "application/json", // We're telling the server we expect JSON
          },
          body: { user: user[0].user_id }
          ,
        });
        setBurgers(response.data.burgers); // Assuming the response contains `burgers` data
      } catch (err) {
        setError(err.message);
      }
    };
    fetchBurgers();
  }, []);

  const handleUpdate = async (event) => {
    event.preventDefault();
    setError('');
    const formData = new FormData(event.target)
    const formObject = Object.fromEntries(formData)
    try {
      const user = JSON.parse(Cookies.get('currentUser'))
      const userData = {
        user_id: user[0].user_id,
        username: formObject.username || user.username,
        email: formObject.email || user.email,
        password: formObject.password || user.password
      };
      const response = await axios.patch(
        `http://127.0.0.1:5000/auth/user/${userData.user_id}`, userData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `http://127.0.0.1:5000/auth/user/${userData.user_id}`,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        }
      );
      setUsername('')
      setEmail('')
      setPassword('')
    } catch (err) {
      console.error("Failed to update account:", err.message);
    }
  };

  const handleDelete = async () => {
    try {
      const user = JSON.parse(Cookies.get('currentUser'))
      const response = await axios.delete(
        `http://127.0.0.1:5000/auth/user/del/${user[0].user_id}`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `http://127.0.0.1:5000/auth/user/del/${user[0].user_id}`,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        }
      );
      setCurrentUser(null);
      Cookies.remove("currentUser");
      navigate(`/`)
    } catch (err) {
      console.error("Failed to delete account:", err.message);
    }
  };

  const handleSignOut = async () => {
    try {
      const user = JSON.parse(Cookies.get('currentUser'))
      const response = await axios.get(
        `http://127.0.0.1:5000/auth/logout`,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": `http://127.0.0.1:5000/auth/logout`,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS"
          }
        }
      );
      setCurrentUser(null);
      Cookies.remove("currentUser");
      navigate(`/`)
    } catch (err) {
      console.error("Failed to sign out:", err.message);
    }
  }

  return (
    <>
      <div className="text">
        <button onClick={() => navigate('/')}>Back</button>
        <h1>All Burgers</h1>
        <ul class='recipe_container'>
          {error && <p>Error loading burgers: {error}</p>}
          {burgers.length > 0 ? (
            burgers.map((burger) => <li class='recipe_container'key={burger.id}>  <div class='Recipe'>
              <h4 class='ingredient'>Burger From: {burger.created_at}!</h4>
              <ul class='ingredient'>Top Bun: {burger.top_bun}</ul>
              <ul class='ingredient'>Meat: {burger.meat}</ul>
              <ul class='ingredient'>Cheese: {burger.cheese}</ul>
              <ul class='ingredient'>Sauce: {burger.sauce}</ul>
              {burger.pickles && (<ul class='ingredient'>Pickles: {burger.pickles}</ul>)}
              {burger.lettuce && (<ul class='ingredient'>Lettuce: {burger.lettuce}</ul>)}
              {burger.tomato && (<ul class='ingredient'>Tomato: {burger.tomato}</ul>)}
              <ul class='ingredient'>Bottom Bun: {burger.bottom_bun}</ul>
            </div>
            </li>)
          ) : (
            <p>No burgers found</p>
          )}
        </ul>
        <ul>
          <div className="Update-Form">
            <form onSubmit={handleUpdate} aria-labelledby="update-heading">
              <h2 id="update-heading" className="header2">
                Fix Your Account, Toots!
              </h2>

              <div className="usernameBlock">
                <label htmlFor="username" className="username">Username</label>
                <input
                  type="text"
                  autoComplete="username"
                  id="username"
                  name="username"
                  placeholder="Enter your username"
                  value={username} // Bind the state
                  onChange={(e) => setUsername(e.target.value)} // Update state on change
                />
              </div>
              <div className="emailBlock">
                <label htmlFor="email" className="email">Email</label>
                <input
                  type="text"
                  autoComplete="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={email} // Bind the state
                  onChange={(e) => setEmail(e.target.value)} // Update state on change
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
                  value={password} // Bind the state
                  onChange={(e) => setPassword(e.target.value)} // Update state on change
                />
              </div>

              <button>Update!</button>
            </form>
          </div>
          <button onClick={() => handleDelete()}>Delete Account</button>
          <button onClick={() => handleSignOut()}>Sign Out</button>
        </ul>
      </div>
    </>
  );
}
