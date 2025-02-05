import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import CurrentUserContextProvider from './contexts/current-user-context.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CurrentUserContextProvider>
       <App />
    </CurrentUserContextProvider>
  </StrictMode>
)
