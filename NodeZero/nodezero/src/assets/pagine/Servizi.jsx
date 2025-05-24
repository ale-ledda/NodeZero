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
import useGetServizi from '../hooks/useGetServizi.jsx';

function Servizi() {
    // Register all Community features
    ModuleRegistry.registerModules([AllCommunityModule]);

    const [modalShow, setModalShow] = React.useState(false);
    //const [record, setRecord] = React.useState([]);

    // Colonne della tabella Servizi - non ridemensionabili, non spostabili e che occupano tutta la tabella
    const [colonne, setColonne] = React.useState([
        { field: "servizio", flex: 1, resizable: false, draggable: false },
        { field: "durata", flex: 1, resizable: false, draggable: false },
        { field: "prezzo", flex: 1, resizable: false, draggable: false },
    ]);

    const record = useGetServizi();

    const handleToast = async () => {
        /*f.toastAttenzione('attenzione');
        f.toastErrore('errore');
        f.toastInformativo('informazione');
        f.toastSuccesso('hola');*/
    }

    // Recupero i servizi dalla API
    /*function getDatiFromAPI()
    {
        React.useEffect(() => {
            fetch(env.DOMINIO + "/API/get-servizi",
                {
                    method: 'GET',
                    headers:
                    {
                        'id_client': '102', //FIXME: Prendi dal token sessione
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
                    setRecord(data.dati.recordset);
                })
                .catch(error => {
                    console.error("Errore durante la chiamata API:", error);
                });
        }, []);
    }
    getDatiFromAPI();*/

    const updateParentState = (newValue) => {
        setModalShow(newValue);

    };

    const updateRecord = (newValue) => {
        record = newValue;
    };

    return (
        <>
            <div className='PannelloBottoni mb-3'>
                <div>
                    <button type="button" className="btn btn-success" onClick={() => setModalShow(true)}>Nuovo servizio</button>
                </div>
                <div className='ms-3'>
                    <button type="button" className="btn btn-success" onClick={() => handleToast()}>Show modale</button>
                </div>
            </div>
            <_nuovo_servizio updated={updateParentState} show={modalShow} />

            <Tabella dati={record} intestazione={colonne} nuovirecord={updateRecord} />

            <Navbar_inferiore />
            <ToastContainer/>
        </>
    );
}
export default Servizi;