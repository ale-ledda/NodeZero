import React from 'react';
import { ToastContainer } from 'react-toastify';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
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
import useGetAgende from '../hooks/fetch/useGetAgende.jsx'

function Agende() {
    ModuleRegistry.registerModules([AllCommunityModule]);

    const [modalShow, setModalShow] = React.useState(false);

    const updateParentState = (newValue) => {
        setModalShow(newValue);
    };

    const [colonne, setColonne] = React.useState([
        { field: "id_agenda", hide: true },
        { field: "nome_agenda", flex: 1, resizable: false, draggable: false },
        { field: "descrizione", flex: 1, resizable: false, draggable: false },
    ]);

    const { record, ricaricaRecord } = useGetAgende();

    return (
        <>
            <div className='PannelloBottoni mb-3'>
                <div>
                    <button type="button" className="btn btn-success" onClick={() => setModalShow(true)}>Nuova agenda</button>
                </div>
            </div>
            <_nuova_agenda updated={updateParentState} show={modalShow} />

            <Tabella dati={record} intestazione={colonne} contesto="azioniAgenda" />

            <Navbar_inferiore />
            <ToastContainer />
        </>
    );
}
export default Agende;