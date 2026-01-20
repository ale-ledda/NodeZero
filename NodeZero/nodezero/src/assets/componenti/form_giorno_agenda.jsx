/**Questo componente rappresenta un elemento del menù di navigazione*/
import React from 'react';
// stili `
import './css_componenti/form_giorno_agenda.css';

function FGA(props) {

    return (
        <div className="frame-elemento">
            <p>{props.giorno}</p>
            <div className="frame-form">
                <div className="form-floating elemento_inizio me-2 mb-3">
                    <input type="time" id={`disponibilita-inizio-${props.indice}-input`} className="form-control" placeholder="-" />
                    <label htmlFor={`disponibilita-inizio-${props.indice}-input`}>Inizio:</label>
                </div>
                <div className="form-floating mb-3 elemento_fine">
                    <input type="time" id={`disponibilita-fine-${props.indice}-input`} className="form-control" placeholder="-" />
                    <label htmlFor={`disponibilita-fine-${props.indice}-input`}>Fine:</label>
                </div>
            </div>
            <div className="frame-pausa">
                <div className="form-floating mb-3 elemento_pausa">
                    <input type="text" id={`pause-${props.indice}-input`} className="form-control" placeholder="-" />
                    <label htmlFor={`pause-${props.indice}-input`}>Pause: [13:00 - 14:00;16:00 - 16:15, 18:00 - 19:00]</label>
                </div>
            </div>
        </div>
    );
}

export default FGA;