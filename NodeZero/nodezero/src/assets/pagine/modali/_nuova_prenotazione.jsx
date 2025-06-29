import React, { useState, useEffect} from 'react';
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
import useAddPrenotazione from '../../hooks/fetch/useAddPrenotazione.jsx';
import useGetAgende from '../../hooks/fetch/useGetAgende.jsx';
import useGetServizi from '../../hooks/fetch/useGetServizi.jsx';
import useGetOrariDisponibili from '../../hooks/fetch/useGetOrariDisponibili.jsx';

// variabili
let prenotazione = {
    id_agenda: null, // FIXME: recupera dal session token
    id_servizio: null,
    giorno_prenotazione: null,
    orario_prenotazione: null,
    email: null,
    telefono: null
};


const dataOdierna = f.ottieniDataOdierna();

function _nuova_prenotazione({ updated, show }) {
    const [fectAgende, setFetchAgende] = React.useState([]);
    const [fectServizi, setFetchServizi] = React.useState([]);
    const [servizioSelezionato, setServizioSelezionato] = React.useState('');
    const [agendaSelezionato, setAgendaSelezionato] = React.useState('');


    // Ottengo i dati dalle API
    const { risposta, eseguiFetch } = useAddPrenotazione(prenotazione);
    const { recordServizi, ricaricaServizi } = useGetServizi();
    const { recordAgende, ricaricaAgende } = useGetAgende();
    const { recordOrariDisponibili, ricaricaOrariDisponibili } = useGetOrariDisponibili(prenotazione);

    const handleHide = () => {
        updated(false);
    };

    const handleAggPrenotazione = async () => {
        // ottengo i valori dall'input
        prenotazione.agenda = document.getElementById('agenda-input').value;
        prenotazione.servizio = document.getElementById('servizio-input').value;
        prenotazione.giorno_prenotazione = document.getElementById('giorno-prenotazione-input').value;
        prenotazione.orario_prenotazione = document.getElementById('orario-prenotazione-input').value;
        prenotazione.email = document.getElementById('email-input').value;
        prenotazione.telefono = document.getElementById('telefono-input').value;

        eseguiFetch();
    };

    const handleAggiornamentoGGPrenotazione = (event) => {
        // Ogni volta che aggiorno la data della prenotazione, mando al server per ottenere la lista degli orari disponibili
        prenotazione.agenda = document.getElementById('agenda-input').value;
        prenotazione.servizio = document.getElementById('servizio-input').value;
        prenotazione.giorno_prenotazione = document.getElementById('giorno-prenotazione-input').value;
        prenotazione.orario_prenotazione = document.getElementById('orario-prenotazione-input').value;

        ricaricaOrariDisponibili();

        if (recordOrariDisponibili)
            console.log("Orari disponibili aggiornati:", recordOrariDisponibili);
    };

    // Gestore per il cambio di selezione nella select box
    const handleSelezioneRT = (event, contesto) => {
        console.log("valuto: "+ event.target.value);
        // gestisco lo switch per riciclare l'handleselezioneRT
        switch (contesto) {
            case 0:
                setAgendaSelezionato(event.target.value); // gestisco la select delle agende
            case 1:
                setServizioSelezionato(event.target.value); // gestisco la select dei servizi
            
            default:
                break;
        }
    };


    useEffect(() => {
        if(!recordServizi)
            ricaricaServizi();
        if(!recordAgende)
            ricaricaAgende();

        setFetchAgende(recordAgende);
        setFetchServizi(recordServizi);
    });

    useEffect(() => {
        if (!risposta)
            return;

        const [id_, toast_, impostazioni_] = f.toastCaricamento("Inserimento del nuovo ordine in corso...");

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
        key: "modale-nuova-prenotazione",
        titolo: "Nuova prenotazione",
        corpo: (
            <div>
                <div className="form-floating mb-3">
                    <select value={agendaSelezionato} onChange={() => handleSelezioneRT(event, 0)} className="form-select" id="agenda-input">
                        {
                            fectAgende.map((agenda) => (
                                <option key={agenda.id_agenda} value={agenda.id_agenda}> {agenda.nome_agenda} </option>
                            ))
                        }
                    </select>
                    <label htmlFor="agenda-input">Seleziona una agenda</label>
                </div>
                <div className="form-floating mb-3">
                    <select value={servizioSelezionato} onChange={() => handleSelezioneRT(event, 1)} className="form-select" id="servizio-input">
                        {
                            fectServizi.map((servizi) => (
                                <option key={servizi.id_servizio} value={servizi.id_servizio}> {servizi.servizio} </option>
                            ))
                        }
                    </select>
                    <label htmlFor="servizio-input">Seleziona un servizio</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="date" id="giorno-prenotazione-input" className="form-control" placeholder="-" min={dataOdierna} onChange={handleAggiornamentoGGPrenotazione} />
                    <label htmlFor="giorno-prenotazione-input">Giorno prenotazione</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="time" id="orario-prenotazione-input" className="form-control" placeholder="-" />
                    <label htmlFor="orario-prenotazione-input">Orario prenotazione</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="email" id="email-input" className="form-control" placeholder="-" />
                    <label htmlFor="email-input">Email</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="tel" id="telefono-input" className="form-control" placeholder="-" />
                    <label htmlFor="telefono-input">Numero telefono</label>
                </div>
            </div>
        ),
        azioni: [
            <Button key='1' className="btn btn-success" onClick={handleAggPrenotazione}>Prenota</Button>
        ]
    };

    return (
        <>
            <Modale show={show} onHide={handleHide} modale={nuovo_servizio} solo_corpo='false' />
            <ToastContainer />
        </>
    );
}
export default _nuova_prenotazione;