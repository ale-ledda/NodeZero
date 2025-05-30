import React from 'react';
import { ToastContainer } from 'react-toastify';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// librerie
import f from '../../../reactCore.js';
import env from '/variabili.json';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './css_pagine/Servizi.css';
//componenti
import Navbar_inferiore from '../componenti/navbar_inferiore';
import _nuovo_servizio from './modali/_nuovo_servizio';
import Tabella from '../componenti/tabella';
import useGetServizi from '../hooks/fetch/useGetServizi.jsx';

function Servizi() {
    // Register all Community features
    ModuleRegistry.registerModules([AllCommunityModule]);

    const [modalShow, setModalShow] = React.useState(false);

    // Colonne della tabella Servizi - non ridemensionabili, non spostabili e che occupano tutta la tabella
    const [colonne, setColonne] = React.useState([
        { field: "id_servizio", hide: true},
        { field: "servizio", flex: 1, resizable: false, draggable: false },
        { field: "durata", flex: 1, resizable: false, draggable: false },
        { field: "prezzo", flex: 1, resizable: false, draggable: false },
    ]);

    const { record, ricaricaServizi } = useGetServizi();


    const updateParentState = (newValue) => {
        setModalShow(newValue);
        ricaricaServizi();
    };


    return (
        <>
            <div className='PannelloBottoni mb-3'>
                <div>
                    <button type="button" className="btn btn-success" onClick={() => setModalShow(true)}>Nuovo servizio</button>
                </div>
            </div>
            <_nuovo_servizio updated={updateParentState} show={modalShow} />

            <Tabella dati={record} intestazione={colonne} contesto="azioniServizio"/>

            <Navbar_inferiore />
            <ToastContainer/>
        </>
    );
}
export default Servizi;