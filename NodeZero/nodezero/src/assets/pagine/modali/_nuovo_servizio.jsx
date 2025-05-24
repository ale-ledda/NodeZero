import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
// librerie
import env from '/variabili.json';
import f from '../../../../reactCore.js';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
//componenti
import Modale from '../../componenti/modale';
import Button from 'react-bootstrap/Button';

//import useGetServizi from '../hooks/useGetServizi.jsx';

// variabili
let servizio = {
    id_client: 102, // FIXME: recupera dal session token
    servizio: null,
    durata: null,
    prezzo: null
};
function _nuovo_servizio({ updated, show, nuovirecord}) {

    const handleHide = () => {
        updated(false);
    };

    const handleNuoviRecord = () => {
        nuovirecord(false);
        const record = useGetServizi();
    };


    const handleAggServizio = async () => {
        // ottengo i valori dall'input
        servizio.servizio = document.getElementById('servizio-input').value;
        servizio.durata = document.getElementById('durata-input').value;
        servizio.prezzo = document.getElementById('prezzo-input').value;

        const response = await fetch(env.DOMINIO + "/API/nuovo-servizio",
            {
                method: 'POST',
                headers:
                {
                    // 'Authorization': `Bearer ${mioToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(servizio),
            });

        // creo le due variabili che mi aiutano a gestire il caricamento
        const [id_, toast_, impostazioni_] = f.toastCaricamento("Inserimento del servizio in corso...");

        if (response.ok) {
            // successo
            const data = await response.json();
            console.log("data:" + data.messaggio);
            const impostazioniLocaliOK_ = { render: data.messaggio, type: "success", isLoading: false };
            toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliOK_ });

            // chiudo il modale
            setTimeout(() => {
                handleHide();
                toast_.dismiss(id_);
            }, 2000); 
            
        } else {
            // alert di errore
            const errorData = await response.json();
            const impostazioniLocaliErrore_ = { render: errorData.messaggio, type: "error", isLoading: false };
            toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliErrore_ });
            setTimeout(() => {
                toast_.dismiss(id_);
            }, 5000); 
        }
    };


    /**
     * Modale nuovo servizio
     */
    const nuovo_servizio = {
        key: "modale-nuovo-servizio",
        titolo: "Nuovo servizio",
        corpo: (
            <div>
                <div className="form-floating mb-3">
                    <input type="text" id="servizio-input" className="form-control" placeholder="-" />
                    <label htmlFor="servizio-input">Nome del servizio</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="number" id="durata-input" className="form-control" placeholder="-" />
                    <label htmlFor="durata-input">Durata del servizio (minuti)</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="number" id="prezzo-input" className="form-control" placeholder="-" />
                    <label htmlFor="prezzo-input">Prezzo del servizio</label>
                </div>
            </div>
        ),
        azioni: [
            <Button key='1' className="btn btn-success" onClick={handleAggServizio}>Inserisci</Button>
        ]
    };

    return (
        <>
            <Modale show={show} onHide={handleHide} modale={nuovo_servizio} solo_corpo='false' />
            <ToastContainer />
        </>
    );
}
export default _nuovo_servizio;