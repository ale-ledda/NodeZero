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
import useGetElement from '../../hooks/fetch/useGetElement.jsx';
import usePostElement from '../../hooks/fetch/usePostElement.jsx';

// variabili
const dataOdierna = f.ottieniDataOdierna();

let header = {
    endpoint: '',
    id: null,
    // dati sulla prenotazione
    id_agenda: null, 
    id_servizio: null,
    prenotazione_tm: null,
    inizio_prestazione_tm: null,
    email: null,
    numero_telefono: null,
    data_odierna: null,
    giorno_scelto: null,
    path: null
};

let body = {
    id_agenda: null,
    id_servizio: null,
    inizio_prestazione_tm: null,
    email: null,
    numero_telefono: null,
    data_odierna: null
};

function _nuova_prenotazione({ updated, show }) {
    const [fectOrariDisponibili, setFetchOrariDisponibili] = useState([]);
    // Gestisco le  selectbox
    const [servizioSelezionato, setServizioSelezionato] = useState('');
    const [agendaSelezionato, setAgendaSelezionato] = useState('');
    const [orarioSelezionato, setOrarioSelezionato] = useState('');

    // Ottengo i dati dalle API
    const { risposta: rispostaFetchPostElement_AggiungiPrenotazione, eseguiFetch: eseguiFetchPostElement_AggiungiPrenotazione } = usePostElement(header, body);
    const { risposta: rispostaFetchGetElement_OrariDisponibili, eseguiFetch: eseguiFetchGetElement_OrariDisponibili } = useGetElement(header, 2);
    const { risposta: rispostaFetchGetElement_Servizi, eseguiFetch: eseguiFetchGetElement_Servizi } = useGetElement(header);
    const { risposta: rispostaFetchGetElement_Agende, eseguiFetch: eseguiFetchGetElement_Agende } = useGetElement(header);

    // Gestione degli errori
    //const [statoRispostaGetOrari, setStatoRispostaGetOrari] = React.useState(400);

    const handleHide = () => {
        updated(false);
    };

    const handleAggPrenotazione = () => {
        // ottengo i valori dall'input
        body.id_agenda = document.getElementById('agenda-input').value;
        body.id_servizio = document.getElementById('servizio-input').value;
        const prenotazione_tm_ = document.getElementById('giorno-prenotazione-input').value; // data
        const inizio_prestazione_tm_ = document.getElementById('orario-prenotazione-input').value; // orario
        body.email = document.getElementById('email-input').value;
        body.numero_telefono = document.getElementById('telefono-input').value;
        body.data_odierna = dataOdierna;

        // elaborazione data prenotazione + orario prenotazione nel db viene inserito un timestamp
        body.inizio_prestazione_tm = prenotazione_tm_ + ' ' + inizio_prestazione_tm_ + ':00';

        header.endpoint = 'nuova-prenotazione';
        eseguiFetchPostElement_AggiungiPrenotazione();
    };

    const handleAggiornamentoGGPrenotazione = async (event) => {
        // Ogni volta che aggiorno la data della prenotazione, mando al server per ottenere la lista degli orari disponibili
        header.id_agenda = document.getElementById('agenda-input').value;
        header.id_servizio = document.getElementById('servizio-input').value;
        header.prenotazione_tm = document.getElementById('giorno-prenotazione-input').value;
        header.giorno_scelto = new Date(document.getElementById('giorno-prenotazione-input').value).getDay(); // ottengo il giorno della settimana (0-6) la domenica è 0
        header.giorno_scelto = header.giorno_scelto == 0 ? 7 : header.giorno_scelto;

        // eseguo la fetch per ottenere la lista di orari
        header.endpoint = 'orari-disponibili';
        eseguiFetchGetElement_OrariDisponibili();
    };

    // Gestore per il cambio di selezione nella select box
    const handleSelezioneRT = (event, contesto) => {
        switch (contesto) {
            case 0:
                setAgendaSelezionato(event.target.value); // gestisco la select delle agende
            case 1:
                setServizioSelezionato(event.target.value); // gestisco la select dei servizi
            case 2:
                setOrarioSelezionato(event.target.value); // gestisco la select degli orari

            default:
                break;
        }
    };


    /**
     * USE-EFFECT SEZIONE
     */

    // Dico al'API di mandare i dati una sola volta all'apertura della pagina
    useEffect(() => {
        header.path = localStorage.getItem('client');

        //Gestisco l'agenda
        header.endpoint = 'agende';
        eseguiFetchGetElement_Agende();

        // Gestisco i servizi
        header.endpoint = 'servizi';
        eseguiFetchGetElement_Servizi();
    }, []);


    useEffect(() => {
        /**
         * Gestisco l'inserimento del nuovo ordine
         */
        if (!rispostaFetchPostElement_AggiungiPrenotazione)
            return;

        const [id_, toast_, impostazioni_] = f.toastCaricamento("Inserimento del nuovo ordine in corso...");

        if (rispostaFetchPostElement_AggiungiPrenotazione.stato == 200) {
            // successo
            const data = rispostaFetchPostElement_AggiungiPrenotazione;
            const impostazioniLocaliOK_ = { render: data.messaggio, type: "success", isLoading: false };
            toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliOK_ });

            // chiudo il modale
            setTimeout(() => {
                handleHide();
                toast_.dismiss(id_);
            }, 2000);

        } else {
            // alert di errore
            const errorData = rispostaFetchPostElement_AggiungiPrenotazione;
            const impostazioniLocaliErrore_ = { render: errorData.messaggio, type: "error", isLoading: false };
            toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliErrore_ });
            setTimeout(() => {
                toast_.dismiss(id_);
            }, 5000);
        }
    }, [rispostaFetchPostElement_AggiungiPrenotazione]);

    
    useEffect(() => {
        /**
         * Gestisco ogni volta che il componente recordOrariDisponibili subisce una modifica tento di salvarne lo stato
         */
        if (!rispostaFetchGetElement_OrariDisponibili | !header.id_agenda | !header.id_servizio)
            return;

        if (rispostaFetchGetElement_OrariDisponibili == 'E1') {
            setFetchOrariDisponibili(['Non disponibile']);
            document.getElementById('orario-prenotazione-input').disabled = true;
            return;
        }
        
        // Gestisco gli undefined
        if (rispostaFetchGetElement_OrariDisponibili == undefined) {
            console.warn("Non è sono stati recuperati gli orari disponibili, &egrave; stato restituito undefined. Se la list box orari disponibili è valorizzata ignora questo alert!");
            f.toastAttenzione('Qualcosa è andato storto se il problema persiste conttatare il supporto tecnico'); // la è non la legge
            setFetchOrariDisponibili(['']);
        }
        else {
            setFetchOrariDisponibili(rispostaFetchGetElement_OrariDisponibili);
            const selectBoxOrari = document.getElementById('orario-prenotazione-input');
            selectBoxOrari.disabled = false;
            document.getElementById('orario-prenotazione-input').disabled = false;
        }


    }, [rispostaFetchGetElement_OrariDisponibili]);

    /**
     * Modale nuova_prenotazione
     */
    const nuova_prenotazione = {
        key: "modale-nuova-prenotazione",
        titolo: "Nuova prenotazione",
        corpo: (
            <div>
                <div className="form-floating mb-3">
                    <select value={agendaSelezionato} onChange={() => handleSelezioneRT(event, 0)} className="form-select" id="agenda-input">
                        {
                            rispostaFetchGetElement_Agende.map((agenda) => (
                                <option key={agenda.id_agenda} value={agenda.id_agenda}> {agenda.nome_agenda} </option>
                            ))
                        }
                    </select>
                    <label htmlFor="agenda-input">Seleziona una agenda</label>
                </div>
                <div className="form-floating mb-3">
                    <select value={servizioSelezionato} onChange={() => handleSelezioneRT(event, 1)} className="form-select" id="servizio-input">
                        {
                            rispostaFetchGetElement_Servizi.map((servizi) => (
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
                    <select value={orarioSelezionato} onChange={() => handleSelezioneRT(event, 2)} className="form-select" id="orario-prenotazione-input" disabled>
                        {
                            fectOrariDisponibili.map((orario, index) => (
                                <option key= { index }> {orario} </option>
                            ))
                        }
                    </select>
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
            <Modale show={show} onHide={handleHide} modale={nuova_prenotazione} solo_corpo='false' />
            <ToastContainer />
        </>
    );
}
export default _nuova_prenotazione;