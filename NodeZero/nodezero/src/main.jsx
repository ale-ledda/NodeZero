import { createBrowserRouter, RouterProvider } from "react-router-dom"
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client'
import App from './App'
import Home from './assets/pagine/Home.jsx'
import Servizi from './assets/pagine/Servizi.jsx'
import Agende from './assets/pagine/Agende.jsx'
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
    {
        path: "/:aziendaID/gestisci-agende",
        element:
            <Navbar_superiore>
                <Agende />
            </Navbar_superiore>
    },
    
]);

function Main() {
    /**
     * Componente principale che gestisce le azioni comuni a tutte le pagine
     * necessita di un useeffect in quanto serve per eseguire il codice al caricamento della pagina
     */
    useEffect(() => {
        // Imposta il titolo della pagina
        document.title = `NodeZero Alpha`;

        // La pagina non deve permettere lo zoom con il doppio click tanto meno la selezione 
        const preventDefaultOnDblclick = (e) => {
            e.preventDefault();
        };

        document.addEventListener('dblclick', preventDefaultOnDblclick, { passive: false });
        return () => {
            document.removeEventListener('dblclick', preventDefaultOnDblclick);
        };

    }, []);
}


createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
        <Main />
    </React.StrictMode>
)