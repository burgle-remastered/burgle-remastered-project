import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LandingPage from './pages/1_LandingPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
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
      <LandingPage />

    </>
  )
}

export default App
