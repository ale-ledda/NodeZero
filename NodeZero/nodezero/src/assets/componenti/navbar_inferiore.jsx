import React from 'react';
// librerie
import env from "../../../variabili.json";
// stili
import './css_componenti/navbar_inferiore.css';
import { ThreeDots, Gear, JournalBookmark, Boxes, Bank, Box2, ListStars, House} from 'react-bootstrap-icons';
// componenti
import Elemento from './elemento';
import Modale from './modale';
import { Link } from 'react-router-dom';


function Navbar_inferiore() {
    const [modalShow, setModalShow] = React.useState(false);
    // recupero il path del client per costruire i link correttamente
    const path_cliente = window.location.pathname.split("/")[1]


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
            <div className="d-flex justify-content-center flex-column mt-2">
                <Link to={`${env.URL}/${path_cliente}`} >
                    <Elemento titolo='' icona={<House />} />
                </Link>
                <div className="row">
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4'>
                        <Link to={`${env.URL}/${path_cliente}/gestisci-agende`} >
                            <Elemento titolo='Gestisci agende' icona={<JournalBookmark />} />
                        </Link>
                    </div>
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4'>
                        <Link to={`${env.URL}/${path_cliente}/servizi`} >
                            <Elemento titolo='Gestione servizi' icona={<Boxes />} />
                        </Link>
                    </div>
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4'>
                        <Elemento titolo='Bilancio' icona={<Bank />} /> { /*TODO: Nella prossima versione */}
                    </div>
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4'>
                        <Elemento titolo='Cassetto fiscale' icona={<Box2 />} /> { /*TODO: Nella prossima versione */}
                    </div>
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4'>
                        <Elemento titolo='Inventario' icona={<ListStars />} /> { /*TODO: Nella prossima versione */}
                    </div>
                    <div className='col-6 col-xl-4 col-lg-4 col-md-4'>
                        <Elemento titolo='Impostazioni' icona={<Gear />} />
                    </div>
                </div>
            </div>
        ),
        azioni: [ ],
    };

    return (
        <>
            <div className="navbar-inferiore-frame" onClick={() => setModalShow(true)}>
                <div className="navbar-inferiore-icona">
                    <ThreeDots className="icona-menu" />
                </div>
            </div>
            <Modale show={modalShow} onHide={() => setModalShow(false)} modale={menu} solo_corpo='true' />
        </>
    );
}

export default Navbar_inferiore;