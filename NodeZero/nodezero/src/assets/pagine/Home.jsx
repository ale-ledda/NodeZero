import React, { useState, useEffect } from 'react';
// librerie
import env from '/variabili.json';
import { Link } from 'react-router';
// hooks
import useGetClient from '../hooks/fetch/useGetClient.jsx';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './css_pagine/Home.css';
import { Bookmark } from 'react-bootstrap-icons';
//componenti
import Navbar_inferiore from '../componenti/navbar_inferiore'
import _nuova_prenotazione from '../pagine/modali/_nuova_prenotazione'

function Home() {
    const [modalShow, setModalShow] = React.useState(false);

    // Recupero il client selezionato dal hook
    const { record } = useGetClient();

    const updateParentState = (newValue) => {
        setModalShow(newValue);
    };

    const handleClickPrenota = () => {
        setModalShow(true);
    };

    return (
        <>
            <h1>{record.azienda}</h1>
            <h3>{!record.email ? 'Email non presente' : record.email}</h3>
            <p>telefono: {!record.numero_telefono ? 'Numero di telefono non presente' : record.numero_telefono}</p>

            <button type="button" className="btn btn-light btn-lg mt-4" onClick={handleClickPrenota}>
                <Bookmark className='me-3' />Prenota
            </button>
            <Navbar_inferiore />
            <_nuova_prenotazione updated={updateParentState} show={modalShow} />
        </>
    );
}
export default Home;