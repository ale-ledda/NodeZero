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
import './css_pagine/Servizi.css';
//componenti
import Navbar_inferiore from '../componenti/navbar_inferiore.jsx';
import _nuovo_servizio from '../pagine/modali/_nuovo_servizio.jsx';
import Tabella from '../componenti/tabella.jsx';
// Hooks
import useGetElement from '../hooks/fetch/useGetElement.jsx';
import usePostElement from '../hooks/fetch/usePostElement.jsx';

// HEADER - per gestire un alta modulabilità configuriamo qua i vari parametri
const header = {
    endpoint: null,
    path: null,
};

function Servizi() {
    // Register all Community features
    const navigate = useNavigate();
    ModuleRegistry.registerModules([AllCommunityModule]);
    const [modalShow, setModalShow] = useState(false);
    // Stati delle API
    const { risposta: rispostaFetchGetElement, eseguiFetch: eseguiFetchGetElement } = useGetElement(header);
    const { risposta: rispostaFetchPostElement, eseguiFetch: eseguiFetchPostElement } = usePostElement(header);

    // Se l'elemento figlio viene aggiornato
    const updateParentState = (newValue) => {
        setModalShow(newValue);
        eseguiFetchGetElement();
    };

    // Colonne della tabella Servizi - non ridemensionabili, non spostabili e che occupano tutta la tabella
    const [colonne, setColonne] = useState([
        { field: "id_servizio", hide: true},
        { field: "servizio", flex: 1, resizable: false, draggable: false },
        { field: "durata", flex: 1, resizable: false, draggable: false },
        { field: "prezzo", flex: 1, resizable: false, draggable: false },
    ]);

    // Dico al'API di mandare i dati una sola volta all'apertura della pagina
    useEffect(() => {
        //Prima di tutto verifico che sei loggato
        header.endpoint = 'verifico-token-sessione';
        eseguiFetchPostElement();
    }, []);

    useEffect(() => {
        // Richiedo i dati solo se sei loggato
        if (rispostaFetchPostElement != undefined) {
            if (rispostaFetchPostElement.stato == 200) {
                header.endpoint = 'servizi';
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
                    <button type="button" className="btn btn-success" onClick={() => setModalShow(true)}>Nuovo servizio</button>
                </div>
            </div>
            <_nuovo_servizio updated={updateParentState} show={modalShow} />
            <Tabella updated={updateParentState} dati={rispostaFetchGetElement} intestazione={colonne} contesto="azioniServizio" />

            <Navbar_inferiore />
            <ToastContainer />
            
        </>
    );
}
export default Servizi;