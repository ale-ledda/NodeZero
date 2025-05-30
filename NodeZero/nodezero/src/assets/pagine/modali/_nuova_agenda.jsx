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
// hooks
import useAddAgenda from '../../hooks/fetch/useAddAgenda.jsx';


// variabili
let agenda = {
    id_client: 102, // FIXME: recupera dal session token
    nome_agenda: null,
    descrizione: null,
    foto: null
};
function _nuova_agenda({ updated, show }) {

    const handleHide = () => {
        updated(false);
    };

    const handleAggServizio = async () => {
        // ottengo i valori dall'input
        agenda.nome_agenda = document.getElementById('titolo-input').value;
        agenda.descrizione = document.getElementById('descrizione-input').value;

        const response  = useAddAgenda(agenda);

        // creo le due variabili che mi aiutano a gestire il caricamento
        const [id_, toast_, impostazioni_] = f.toastCaricamento("Inserimento della nuova agenda in corso...");

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
        key: "modale-nuova-agenda",
        titolo: "Nuova agenda",
        corpo: (
            <div>
                <div className="form-floating mb-3">
                    <input type="text" id="titolo-input" className="form-control" placeholder="-" />
                    <label htmlFor="titolo-input">Titolo</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" id="descrizione-input" className="form-control" placeholder="-" />
                    <label htmlFor="descrizione-input">Descrizione</label>
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
export default _nuova_agenda;