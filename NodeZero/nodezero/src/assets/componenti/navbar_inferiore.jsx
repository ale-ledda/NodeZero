import React, { useEffect, useState } from 'react';
// librerie
import env from "../../../variabili.json";
// stili
import './css_componenti/navbar_inferiore.css';
import { ThreeDots, Gear, JournalBookmark, Boxes, Bank, Box2, ListStars, House, PersonXFill } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
// componenti
import Elemento from './elemento';
import Modale from './modale';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
// hooks
import usePostElement from '../hooks/fetch/usePostElement.jsx';

const header = {
    endpoint: 'logout-client'
};

function Navbar_inferiore() {
    const navigate = useNavigate();
    const [modalShow, setModalShow] = useState(false);
    const [modalSettingsShow, setModalSettingsShow] = useState(false);
    // Stati delle API
    let { risposta: rispostaFetchPostElement_Logout, eseguiFetch: eseguiFetchPostElement_Logout } = usePostElement(header, {});

    // recupero il path del client per costruire i link correttamente
    const path_cliente = window.location.pathname.split("/")[1]

    // Gestisco l'update dei dati nel modale impostazioni
    const handleApplica = () => {
        // TODO: Implementa API e update
    };

    // Gestisco il logout
    const handleLogOut = () => {
        eseguiFetchPostElement_Logout();
        navigate('/');
    };

    /**
     * Modale del menu
     * Contiene tutte le voci utili alla navigazione nella piattaforma 
     */
    const menu = {
        key: "modale-menu",
        titolo: (
            <>
            </>
        ),
        sottoTitolo: (
            <>
            </>
        ),
        corpo: (
            <>
                <div className="homeButton">
                    <Link to={`${env.URL}/${path_cliente}`} className="stileElementoHome">
                            <Elemento titolo='' icona={<House />} />
                    </Link>
                </div>
                <div className="d-flex justify-content-center flex-column">
                    <div className="row proprietaRiga">
                        <div className='col-6 col-xl-4 col-lg-4 col-md-4'>
                            <Link to={`${env.URL}/${path_cliente}/gestisci-agende`} className="stileElemento">
                                <Elemento titolo='Gestisci agende' icona={<JournalBookmark />} />
                            </Link>
                        </div>
                        <div className='col-6 col-xl-4 col-lg-4 col-md-4'>
                            <Link to={`${env.URL}/${path_cliente}/servizi`} className="stileElemento">
                                <Elemento titolo='Gestione servizi' icona={<Boxes />} />
                            </Link>
                        </div>
                        <div className='col-6 col-xl-4 col-lg-4 col-md-4' hidden>
                            <Elemento titolo='Bilancio' icona={<Bank />} /> { /*TODO: Nella prossima versione */}
                        </div>
                        <div className='col-6 col-xl-4 col-lg-4 col-md-4' hidden>
                            <Elemento titolo='Cassetto fiscale' icona={<Box2 />} /> { /*TODO: Nella prossima versione */}
                        </div>
                        <div className='col-6 col-xl-4 col-lg-4 col-md-4' hidden>
                            <Elemento titolo='Inventario' icona={<ListStars />} /> { /*TODO: Nella prossima versione */}
                        </div>
                        <div className='col-6 col-xl-4 col-lg-4 col-md-4' onClick={() => setModalSettingsShow(true)}>
                            <Link className="stileElemento">
                                <Elemento titolo='Impostazioni' icona={<Gear />} />
                            </Link>
                        </div>
                        <div className='col-6 col-xl-4 col-lg-4 col-md-4' onClick={() => handleLogOut()}>
                            <Link className="stileElemento">
                                <Elemento titolo='Esci' icona={<PersonXFill />} />
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        ),
        azioni: [ ],
    };


    /**Modale impostazioni
     * 
     */
    const modale_impostazioni = {
        key: "modale-impostazioni",
        titolo: "Impostazioni",
        corpo: (
            <div>
                <label htmlFor="tema-input">Tema di default: </label>
                <select id="tema-input" className="form-select" disabled>
                    <option value="1" selected>Tema 1</option>
                    <option value="2">Tema 2</option>
                </select>

                <label htmlFor="lingua-input" className="mt-4">Lingua di default: </label>
                <select id="lingua-input" className="form-select" disabled>
                    <option value="1" selected>Italiano</option>
                    <option value="2">Inglese</option>
                </select>

                <label htmlFor="modalita-input" className="mt-4 mb-2">Modalit&agrave; sala: </label>
                <select id="modalita-input" className="form-select" disabled>
                    <option value="1" selected>Un cliente per volta</option>
                    <option value="2">Più clienti per volta</option>
                </select>

            </div>
        ),
        azioni: [
            <Button key='1' id="applica-impostazioni" className="btn btn-success" onClick={handleApplica}>Applica</Button>
        ]
    };

    // USEEFFECT SEZIONE

    return (
        <>
            <div className="navbar-inferiore-frame" onClick={() => setModalShow(true)}>
                <div className="navbar-inferiore-icona">
                    <ThreeDots className="icona-menu" />
                </div>
            </div>

            <Modale show={modalShow} onHide={() => setModalShow(false)} modale={menu} solo_corpo='true' />
            <Modale show={modalSettingsShow} onHide={() => setModalSettingsShow(false)} modale={modale_impostazioni} solo_corpo='false' />
        </>
    );
}

export default Navbar_inferiore;