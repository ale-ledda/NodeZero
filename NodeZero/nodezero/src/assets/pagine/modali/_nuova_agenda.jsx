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
    foto: null,
    inizio: null,
    fine: null,
    pause: null
};


function _nuova_agenda({ updated, show }) {

    const handleHide = () => {
        updated(false);
    };

    const { risposta, eseguiFetch } = useAddAgenda(agenda);


    const handleAggServizio = async () => {
        // ottengo i valori dall'input
        agenda.nome_agenda = document.getElementById('titolo-input').value;
        agenda.descrizione = document.getElementById('descrizione-input').value;
        agenda.inizio = document.getElementById('disponibilita-inizio-input').value;
        agenda.fine = document.getElementById('disponibilita-fine-input').value;
        agenda.pause = document.getElementById('pause-input').value;

        console.log(agenda.inizio);

        eseguiFetch();
    };

    React.useEffect(() => {
        if (!risposta)
            return;

        const [id_, toast_, impostazioni_] = f.toastCaricamento("Inserimento della nuova agenda in corso...");

        if (risposta.stato == 200) {
            // successo
            const data = risposta;
            const impostazioniLocaliOK_ = { render: data.messaggio, type: "success", isLoading: false };
            toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliOK_ });

            // chiudo il modale
            setTimeout(() => {
                handleHide();
                toast_.dismiss(id_);
            }, 2000);

        } else {
            // alert di errore
            const errorData = risposta;
            const impostazioniLocaliErrore_ = { render: errorData.messaggio, type: "error", isLoading: false };
            toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliErrore_ });
            setTimeout(() => {
                toast_.dismiss(id_);
            }, 5000);
        }
    }, [risposta]);

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
                <div className="form-floating mb-3">
                    <input type="time" id="disponibilita-inizio-input" className="form-control" placeholder="-" />
                    <label htmlFor="disponibilita-inizio-input">Appuntamenti da:</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="time" id="disponibilita-fine-input" className="form-control" placeholder="-" />
                    <label htmlFor="disponibilita-fine-input">Appuntamenti fino a:</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" id="pause-input" className="form-control" placeholder="-" />
                    <label htmlFor="pause-input">Pause</label>
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