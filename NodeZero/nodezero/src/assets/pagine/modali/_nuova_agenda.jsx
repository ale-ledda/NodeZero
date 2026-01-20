import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
// librerie
import env from '/variabili.json';
import f from '../../../../reactCore.js';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
//componenti
import Modale from '../../componenti/modale';
import FGA from '../../componenti/form_giorno_agenda';
import Button from 'react-bootstrap/Button';
// hooks
import usePostElement from '../../hooks/fetch/usePostElement.jsx';


let header = {
    endpoint: 'nuova-agenda',
    id: null
};

let body = {
    id_client: null,
    nome_agenda: null,
    descrizione: null,
    foto: null,
    orario_inizio: [],
    orario_fine: [],
    pause: [],
    giorno: []
};

function _nuova_agenda({ updated, show }) {
    // Ottengo i dati dalle API
    const { risposta: rispostaFetchPostElement_AggiungiAgenda, eseguiFetch: eseguiFetchPostElement_AggiungiAgenda } = usePostElement(header, body);

    const handleHide = () => {
        updated(false);
    };

    const handleAggServizio = async () => {
        // ottengo i valori dall'input
        body.nome_agenda = document.getElementById('titolo-input').value;
        body.descrizione = document.getElementById('descrizione-input').value;

        for (var i = 1; i < 8; i++)
        {
            var inizio = document.getElementById('disponibilita-inizio-' + i + '-input').value;
            var fine = document.getElementById('disponibilita-fine-' + i + '-input').value;
            var pausa = document.getElementById('pause-' + i + '-input').value;

            if (inizio != '' & fine != '') {
                body.orario_inizio.push(inizio);
                body.orario_fine.push(fine);
                body.pause.push(pausa);
                body.giorno.push(i);
            }
        }

        eseguiFetchPostElement_AggiungiAgenda();
    };

    useEffect(() => {
        if (!rispostaFetchPostElement_AggiungiAgenda)
            return;

        const [id_, toast_, impostazioni_] = f.toastCaricamento("Inserimento della nuova agenda in corso...");

        if (rispostaFetchPostElement_AggiungiAgenda.stato == 200) {
            // successo
            const data = rispostaFetchPostElement_AggiungiAgenda;
            const impostazioniLocaliOK_ = { render: data.messaggio, type: "success", isLoading: false };
            toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliOK_ });

            // chiudo il modale
            setTimeout(() => {
                handleHide();
                toast_.dismiss(id_);
            }, 2000);
        } else {
            // alert di errore
            const errorData = rispostaFetchPostElement_AggiungiAgenda;
            const impostazioniLocaliErrore_ = { render: errorData.messaggio, type: "error", isLoading: false };
            toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliErrore_ });
            setTimeout(() => {
                toast_.dismiss(id_);
            }, 5000);
        }
    }, [rispostaFetchPostElement_AggiungiAgenda]);

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
                <FGA giorno="Luned&igrave;" indice="1"/>
                <FGA giorno="Marted&igrave;" indice="2" />
                <FGA giorno="Mercoled&igrave;" indice="3" />
                <FGA giorno="Gioved&igrave;" indice="4" />
                <FGA giorno="Venerd&igrave;" indice="5" />
                <FGA giorno="Sabato" indice="6" />
                <FGA giorno="Domenica" indice="7" />
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