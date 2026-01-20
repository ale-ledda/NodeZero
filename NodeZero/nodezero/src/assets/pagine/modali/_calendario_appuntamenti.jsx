import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
// librerie
import env from '/variabili.json';
import f from '../../../../reactCore.js';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import itLocale from '@fullcalendar/core/locales/it'; // Importa il file di localizzazione per l'italiano
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import useGetElement from '../../hooks/fetch/useGetElement.jsx';

// stili
import 'bootstrap/dist/css/bootstrap.min.css';
//componenti

// variabili
const header = {
    endpoint: 'appuntamenti',
    id: null
};

function _calendario_appuntamenti({ nomeAgenda, idAgenda}) {
    /**
     * Modale calendario
     * modale in apertura al click sulla tabella alla voce visualizza,
     * mostra il calendario degli appuntamenti per l'agenda selezionata.
     */

    //imposto le variabili di header
    header.id = idAgenda;

    // TODO: Inserire la action che quando si clicca sul evento prenotato apre il dialer delle chiamate per rintracciare l'utente
    const [appuntamenti, setAppuntamenti] = useState(null);
    // Stati delle API
    let { risposta: rispostaFetchGetElement, eseguiFetch: eseguiFetchGetElement } = useGetElement(header);
    const [appuntamentiFormattati, setAppuntamentiFormattati] = useState(null);

    useEffect(() => {
        if (appuntamenti) {
            const appuntamenti_ = appuntamenti[0].map(elemento => ({
                    title: elemento.servizio + " # cliente: " + elemento.email,
                    start: elemento.inizio_prestazione_tm,
                    end: new Date(elemento.inizio_prestazione_tm).setMinutes(new Date(elemento.inizio_prestazione_tm).getMinutes() + elemento.durata)
            }));
            setAppuntamentiFormattati(appuntamenti_);
        }
       
    }, [appuntamenti]);

    useEffect(() => {
        // mi assicuro che la fetch restituisca un oggetto valido
        if (!rispostaFetchGetElement)
            return;
        else if (Object.keys(rispostaFetchGetElement).length == 0)
            return;
        else {
            if (rispostaFetchGetElement.stato == 200)
                setAppuntamenti(rispostaFetchGetElement.dati);
            else
                f.toastAttenzione(rispostaFetchGetElement.messaggio);
        }
    }, [rispostaFetchGetElement]);

    useEffect(() => {
        eseguiFetchGetElement();
    }, []);

    return (
        <>
            <div>
                <h1>Appuntamenti - {nomeAgenda}</h1>
                <FullCalendar
                    plugins={[timeGridPlugin, dayGridPlugin, bootstrap5Plugin]} // Includi sia dayGrid che timeGrid
                    initialView="timeGridDay" // Imposta la vista iniziale su giornaliera
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay'
                    }}
                    locale={itLocale}
                    themeSystem="bootstrap5"
                    slotDuration= '00:15:00'
                    // Puoi anche impostare l'inizio e la fine degli slot visibili
                    //slotMinTime= '08:00:00'
                    //slotMaxTime= '18:00:00'
                    events={appuntamentiFormattati}
                />
            </div>
        </>
    );
}
export default _calendario_appuntamenti;