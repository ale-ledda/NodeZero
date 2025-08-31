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
import useGetAppuntamenti from '../../hooks/fetch/useGetAppuntamenti.jsx';

// stili
import 'bootstrap/dist/css/bootstrap.min.css';
//componenti

// variabili
let header = {
    id_agenda: '703253447104679'
}

function _calendario_appuntamenti({ nomeAgenda }) {
    /**
     * Modale calendario
     * modale in apertura al click sulla tabella alla voce visualizza,
     * mostra il calendario degli appuntamenti per l'agenda selezionata.
     */

    // TODO: Inserire la action che quando si clicca sul evento prenotato apre il dialer delle chiamate per rintracciare l'utente
    const [appuntamenti, setAppuntamenti] = useState(null);
    const { recordAppuntamenti, eseguiFetchAppuntamenti } = useGetAppuntamenti(header);
    const [appuntamentiFormattati, setAppuntamentiFormattati] = useState(null);

    useEffect(() => {
        if (appuntamenti) {
            //let orarioFine = new Date(prenotazione_.inizio_prestazione_tm);
            //orarioFine = convertoUTC(orarioFine);

            //orarioFine = orarioFine.setMinutes(orarioFine.getMinutes() + prenotazione_.durata);

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
        if (!recordAppuntamenti)
            return;
        else if (Object.keys(recordAppuntamenti).length == 0)
            return;
        else {
            if (recordAppuntamenti.stato == 200)
                setAppuntamenti(recordAppuntamenti.dati);
            else
                f.toastAttenzione(recordAppuntamenti.messaggio);
        }
    }, [recordAppuntamenti]);

    useEffect(() => {
        // recupero gli appuntmenti dal server
        eseguiFetchAppuntamenti();
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