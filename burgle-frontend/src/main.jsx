import ReactDOM from 'react-dom/client';
import React from 'react';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import UserContextProvider from './contexts/CurrentUserContextProvider.jsx';
import './index.css'
import App from './App.jsx'

//establishing 

ReactDOM.createRoot(document.getElementById('root')).render(
  <UserContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </UserContextProvider>
)
