import React, { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
// librerie
import env from '/variabili.json';
import f from '../../../../reactCore.js';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
//componenti
import Modale from '../../componenti/modale.jsx';
import { XSquare, PencilSquare, CalendarWeek } from 'react-bootstrap-icons';
import Elemento from '../../componenti/elemento.jsx';
import _calendario_appuntamenti from '../modali/_calendario_appuntamenti.jsx';

// variabili
let servizio = {
    id_client: 102, // FIXME: recupera dal session token
    servizio: null,
    durata: null,
    prezzo: null
};

let descrizione = null;
let calendario = {
    key: "modale-calendario-ordini",
    titolo: null,
    corpo: (
        null
    ),
};

function _azioni_tabella({ updated, show, contesto, dati, indice}) {
    const [showCalendario, setShowCalendario] = useState(false);

    const handleHide = () => {
        updated(false);
    };

    const handleHide_calendario = () => {
        setShowCalendario(false);
    };

    const handleModifica = () => {
        if (contesto == "azioniServizio") {
            console.log("Modifica servizio non è attualmente disponibile");
        }
        else if (contesto == "azioniAgenda") {
            console.log("Modifica agenda non è attualmente disponibile");
        }
        
    };

    const handleElimina = () => {
        if (contesto == "azioniServizio") {
            console.log("Elimina servizio non è attualmente disponibile");
        }
        else if (contesto == "azioniAgenda") {
            console.log("Elimina agenda non è attualmente disponibile");
        }
    };

    const handleVisualizza = () => {
        setShowCalendario(true);
    };

    /**
     * Modale azioni
     * modale in apertura al click sulla tabella dei servizi mostra le azioni che puoi compiere
     */
    const azioni = {
        key: "modale-azioni-tabella",
        titolo: null,
        corpo: (
            <div className="d-flex justify-content-center flex-column mt-2">
                <div className="row">
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4' onClick={() => handleModifica()}>
                        <Elemento titolo='Modifica' icona={<PencilSquare />} />
                    </div>
                    {
                        /**Esiste solo per le Agende*/
                        contesto == 'azioniAgenda' ?
                        <div className='col-6 col-xl-4 col-lg-4 col-md-4' onClick={() => handleVisualizza()}>
                            <Elemento titolo='Visualizza' icona={<CalendarWeek />} />
                        </div> : null
                    }
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4' onClick={() => handleElimina()}>
                        <Elemento titolo='Elimina' icona={<XSquare />} />
                    </div>
                </div>
            </div>
        ),
    };

    useEffect(() => {
        if (dati != undefined) {
            descrizione = dati.map(d => d.nome_agenda);

            calendario = {
                key: "modale-calendario-ordini",
                titolo: null,
                corpo: (
                    <_calendario_appuntamenti nomeAgenda={descrizione[indice]} />
                ),
            };
        }
            

    }, [dati, indice]);

    return (
        <>
            <Modale show={show} onHide={handleHide} modale={azioni} solo_corpo='true' />
            <Modale show={showCalendario} onHide={handleHide_calendario} modale={calendario} solo_corpo='true' />
            <ToastContainer />
        </>
    );
}
export default _azioni_tabella;