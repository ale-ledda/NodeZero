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
import Button from 'react-bootstrap/Button';

/*function _modifica_servizio({ handleApplica }) {

    const modifica_servizio = {
        key: "modale-modifica-servizio",
        titolo: "Modifica servizio",
        corpo: (
            <div>
                <div className="form-floating mb-3">
                    <input type="text" id="servizio-input" className="form-control" placeholder="-" />
                    <label htmlFor="servizio-input">Servizio</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="number" id="durata-input" className="form-control" placeholder="-" />
                    <label htmlFor="durata-input">Durata</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="number" id="prezzo-input" className="form-control" placeholder="-" />
                    <label htmlFor="prezzo-input" disabled>Prezzo</label>
                </div>

            </div>
        ),
        azioni: [
            <Button key='1' id="applica-modifica-servizio" className="btn btn-success" onClick={handleApplica}>Applica</Button>
        ]
    };
}
export default _modifica_servizio;*/