import React, { useState, useEffect } from 'react';
// librerie
import env from '/variabili.json';
import { Link } from 'react-router';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './css_pagine/Home.css';
import { Bookmark } from 'react-bootstrap-icons';
//componenti
import Navbar_inferiore from '../componenti/navbar_inferiore'

function Home() {
    const [dataAPI, setDataAPI] = useState({});

    // Recupero il client selezionato
    useEffect(() => {
        fetch(env.DOMINIO + "/API/getClient",
            {
                method: 'GET',
                headers:
                {
                    'path': window.location.pathname.replace('/', ''),
                    // 'Authorization': `Bearer ${mioToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.log(`Errore HTTP: ${response.status}`);
                    throw new Error(`Errore HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setDataAPI(data.recordset[0]);
            })
            .catch(error => {
                console.error("Errore durante la chiamata API:", error);
            });
    }, []);

    return (
        <>
            <h1>{dataAPI.azienda}</h1>
            <h3>{!dataAPI.email ? 'Email non presente' : dataAPI.email}</h3>
            <p>telefono: {!dataAPI.numero_telefono ? 'Numero di telefono non presente' : dataAPI.numero_telefono}</p>

            <button type="button" className="btn btn-light btn-lg mt-4">
                <Bookmark className='me-3'/>Prenota
            </button>
            <Navbar_inferiore />
        </>
    );
}
export default Home;