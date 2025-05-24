/**Questo componente rappresenta un elemento del menù di navigazione*/
import React from 'react';
// stili
import './css_componenti/elemento.css';

function Elemento(props) {

    return (
        <div className="frame-elemento">
            <div className="icona">{props.icona}</div>
            <p className="titolo">{ props.titolo }</p>
        </div>
    );
}

export default Elemento;