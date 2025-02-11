import { useState } from 'react'
import { Routes, Route } from 'react-router-dom';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import NoAccPage from './pages/2_NoAccDetected'
import Landing from './pages/1_LandingPage'
import LoginPage from './pages/1.1_LogInPage'
import SignUp from './pages/1.2_SignUpPage'
import Kitchen from './pages/3_Kitchen'
import IngredientTaskList from './pages/3.1_IngredientTaskList'
import AccountPage from './pages/AccountPage';

// import UserContext from './contexts/current-user-context';
// import { checkForLoggedInUser } from './adapters/auth-adapter';



function App() {
  // insert Check for logged in user auth adapter here 

  // const { setCurrentUser } = useContext(UserContext);
  // useEffect(() => {
  //   checkForLoggedInUser().then(setCurrentUser);
  // }, [setCurrentUser]);


  return (
    <>
      <main>
        <Routes>
          <Route path='/' element={<Landing />} />
          <Route path='/no-acc' element={<NoAccPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/users/:id' element={<AccountPage />} />
          <Route path='/users/:id/kitchen' element={<Kitchen />} />
          <Route path='/users/:id/:burgerid' element={<IngredientTaskList />} />
        </Routes>
      </main>

      {/*  

    The end result should look more like this. 
    
    <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/sign-up-header' element={<SignUpPath />} />
        <Route path='/sign-up-helper' element={<SignUpHelper />} />
        <Route path='/sign-up-neighbor' element={<SignUpNeighbor />} />
        <Route path='/users' element={<UsersPage />} />
        <Route path='/users/:id' element={<UserPage />} />
        <Route path='/users/:id/neighbor' element={<NeighborTaskInputCard />} />
        <Route path='/users/:id/helper' element={<HelperBasePage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes> */}


    </>
  )
}

export default App
