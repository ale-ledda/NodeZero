import React from 'react';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
import { useNavigate } from 'react-router-dom';
// librerie
import f from '../../../reactCore.js';
import env from '/variabili.json';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './css_pagine/Agende.css';
//componenti
import Navbar_inferiore from '../componenti/navbar_inferiore';
import _nuova_agenda from '../pagine/modali/_nuova_agenda.jsx';
import Tabella from '../componenti/tabella.jsx';
// hooks
import useGetElement from '../hooks/fetch/useGetElement.jsx';
import usePostElement from '../hooks/fetch/usePostElement.jsx';

// HEADER - per gestire un alta modulabilità configuriamo qua i vari parametri
const header = {
    endpoint: null
};

function Agende() {
    ModuleRegistry.registerModules([AllCommunityModule]);
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    // Stati delle API
    const { risposta: rispostaFetchGetElement, eseguiFetch: eseguiFetchGetElement } = useGetElement(header);
    const { risposta: rispostaFetchPostElement, eseguiFetch: eseguiFetchPostElement } = usePostElement(header);

    const updateParentState = (newValue) => {
        setModalShow(newValue);
        eseguiFetchGetElement();
    };

    const [colonne, setColonne] = useState([
        { field: "id_agenda", hide: true },
        { field: "nome_agenda", flex: 1, resizable: false, draggable: false },
        { field: "descrizione", flex: 1, resizable: false, draggable: false },
    ]);


    // USE EFFECT
    useEffect(() => {
        //Prima di tutto verifico che sei loggato
        header.endpoint = 'verifico-token-sessione';
        eseguiFetchPostElement();
    }, []);

    useEffect(() => {
        // Richiedo i dati solo se sei loggato
        if (rispostaFetchPostElement != undefined) {
            if (rispostaFetchPostElement.stato == 200) {
                header.endpoint = 'agende';
                header.path = localStorage.getItem('client');
                eseguiFetchGetElement();
            }
            else
                navigate('/');
        }
    }, [rispostaFetchPostElement]);


    return (
        <>
            <div className='PannelloBottoni mb-3'>
                <div>
                    <button type="button" className="btn btn-success" onClick={() => setModalShow(true)}>Nuova agenda</button>
                </div>
            </div>
            <_nuova_agenda updated={updateParentState} show={modalShow} />

            <Tabella updated={updateParentState} dati={rispostaFetchGetElement} intestazione={colonne} contesto="azioniAgenda" />

            <Navbar_inferiore />
            <ToastContainer />
        </>
    );
}
export default Agende;