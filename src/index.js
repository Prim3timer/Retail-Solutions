import React from 'react';
import ReactDOM from 'react-dom/client';
// import './index.css';
import './alt.css'
import App from './App';
// Dave store
// import { store } from "./app/store"
import {BrowserRouter, Routes, Route, createBrowserRouter} from 'react-router-dom'

// Nickel Store
import store from './store'
// import { Provider } from "react-redux"
import { AuthProvider } from './context/authProvider';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <Routes>
      <Route path='/*' element={<App/>}/>
      </Routes>
    </AuthProvider>
    </BrowserRouter>
  // </React.StrictMode>
);


