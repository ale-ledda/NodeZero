import { createBrowserRouter, RouterProvider } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client'
import App from './App'
import Home from './assets/pagine/Home.jsx'
import Servizi from './assets/pagine/Servizi.jsx'
import Navbar_superiore from './assets/componenti/navbar_superiore.jsx'
import './index.css'

const router = createBrowserRouter([
    {
        path: "/",
        element:
            <Navbar_superiore>
                < App />
            </Navbar_superiore>
    },
    {
        path: "/:aziendaID",
        element:
            <Navbar_superiore>
                <Home />
            </Navbar_superiore>,
    },
    {
        path: "/:aziendaID/servizi",
        element:
            <Navbar_superiore>
                <Servizi />
            </Navbar_superiore>
    },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </React.StrictMode>
)