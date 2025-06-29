import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
// librerie
import env from '/variabili.json';
import f from '../../../../reactCore.js';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
//componenti
import Modale from '../../componenti/modale.jsx';
import { XSquare, PencilSquare } from 'react-bootstrap-icons';
import Elemento from '../../componenti/elemento.jsx';

// variabili
let servizio = {
    id_client: 102, // FIXME: recupera dal session token
    servizio: null,
    durata: null,
    prezzo: null
};
function _azioni_tabella({ updated, show }) {

    const handleHide = () => {
        updated(false);
    };

    const handleModifica = () => {
        console.log("Modifica servizio non è attualmente disponibile");
    };

    const handleElimina = () => {
        console.log("Elimina servizio non è attualmente disponibile");
    };

    /**
     * Modale azioni servizio
     * modale in apertura al click sulla tabella dei servizi mostra le azioni che puoi compiere su questo servizio
     */
    const azioni_servizio = {
        key: "modale-azioni-servizio",
        titolo: null,
        corpo: (
            <div className="d-flex justify-content-center flex-column mt-2">
                <div className="row">
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4' onClick={() => handleModifica()}>
                        <Elemento titolo='Modifica' icona={<PencilSquare />} />
                    </div>
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4' onClick={() => handleElimina()}>
                        <Elemento titolo='Elimina' icona={<XSquare />} />
                    </div>
                </div>
            </div>
        ),
    };

    return (
        <>
            <Modale show={show} onHide={handleHide} modale={azioni_servizio} solo_corpo='true' />
            <ToastContainer />
        </>
    );
}
export default _azioni_tabella;