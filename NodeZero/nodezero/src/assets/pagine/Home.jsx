import React, { useState, useEffect } from 'react';
// librerie
import env from '/variabili.json';
// hooks
import useGetElement from '../hooks/fetch/useGetElement.jsx';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './css_pagine/Home.css';
import { Bookmark } from 'react-bootstrap-icons';
//componenti
import Navbar_inferiore from '../componenti/navbar_inferiore'
import _nuova_prenotazione from '../pagine/modali/_nuova_prenotazione'


// HEADER - per gestire un alta modulabilità configuriamo qua i vari parametri
const header = {
    endpoint: 'client',
    path: localStorage.getItem('client')
};

function Home() {
    const [modalShow, setModalShow] = useState(false);
    // Stati delle API
    let { risposta: rispostaFetchGetElement, eseguiFetch: eseguiFetchGetElement } = useGetElement(header, 1);

    const updateParentState = (newValue) => {
        setModalShow(newValue);
        eseguiFetchGetElement();
    };

    const handleClickPrenota = () => {
        setModalShow(true);
    };

   

    // Dico al'API di mandare i dati una sola volta all'apertura della pagina
    useEffect(() => {
        eseguiFetchGetElement();
    }, []);

    
    return (
        <>
            <h1>{rispostaFetchGetElement.azienda}</h1>
            <h3>{!rispostaFetchGetElement.email ? 'Email non presente' : rispostaFetchGetElement.email}</h3>
            <p>telefono: {!rispostaFetchGetElement.numero_telefono ? 'Numero di telefono non presente' : rispostaFetchGetElement.numero_telefono}</p> 

            <button type="button" className="btn btn-light btn-lg mt-4" onClick={handleClickPrenota}>
                <Bookmark className='me-3' />Prenota
            </button>
            <Navbar_inferiore />
            <_nuova_prenotazione updated={updateParentState} show={modalShow} />
        </>
    );
}
export default Home;