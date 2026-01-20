import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
// librerie
import env from '/variabili.json';
import f from '../../../../reactCore.js';
import tc from '../../../../toastCore.jsx';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
//componenti
import Modale from '../../componenti/modale.jsx';
import { XSquare, PencilSquare, CalendarWeek } from 'react-bootstrap-icons';
import Elemento from '../../componenti/elemento.jsx';
import _calendario_appuntamenti from '../modali/_calendario_appuntamenti.jsx';
import useRemoveElement from '../../hooks/fetch/useRemoveElement.jsx';

// hooks
import useGetElement from '../../hooks/fetch/useGetElement.jsx';
import useUpdateElement from '../../hooks/fetch/useUpdateElement.jsx';

// variabili
let descrizione = null;

let calendario = {
    key: "modale-calendario-ordini",
    titolo: null,
    corpo: (
        null
    ),
};

// HEADER - per gestire un alta modulabilità configuriamo qua i vari parametri
let header = {
    id: null,
    nome_agenda: null,
    descrizione: null,
    servizio: null,
    durata: null,
    prezzo: null,
    endpoint: null,
    // 'Authorization': `Bearer ${mioToken}`,
    'Content-Type': 'application/json'
};


// [QUESTO COMPONENTE USA LA LOGICA DI "CONTESTO"]
function _azioni_tabella({ updated, show, contesto, dati, indice }) {
    // PARTE: modifica_agenda
    // Gestione hooks: modifica_agenda
    const { risposta: rispostaFetchGetElement, eseguiFetch: eseguiFetchGetElement } = useGetElement(header, 1);
    const { risposta: rispostaFetchUpdateElement, eseguiFetch: eseguiFetchUpdateElement } = useUpdateElement(header);
    const [showPannelloModifica, setShowPannelloModifica] = useState(false);

    // Handle gestione del flag, agenda_attiva TODO: implementa più avanti
    const handleOnchangeFlagAttivo = (event) => {
        console.log("Non disponibile");
    };

    // nascondo il modale modifica_agenda
    const handleHide_pannello_modifica = () => {
        setShowPannelloModifica(false);
    };

    // Gestione popup modifica_agenda sucesso o erroriF
    useEffect(() => {
        if (rispostaFetchUpdateElement) {
            if (rispostaFetchUpdateElement.stato = 200) {
                const [id_, toast_, impostazioni_] = f.toastCaricamento("Sto applicando le modifiche...");

                const impostazioniLocaliOK_ = { render: rispostaFetchUpdateElement.messaggio, type: "success", isLoading: false };
                toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliOK_ });
                // chiudo il modale
                setTimeout(() => {
                    handleHide();
                    toast_.dismiss(id_);
                }, 2000); 
            }
            else {
                // alert di errore
                const impostazioniLocaliErrore_ = { render: rispostaFetchUpdateElement.messaggio, type: "error", isLoading: false };
                toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliErrore_ });
                setTimeout(() => {
                    toast_.dismiss(id_);
                }, 5000);
            }
        }
    }, [rispostaFetchUpdateElement]);



    // PARTE: Gestione calendario
    const [showCalendario, setShowCalendario] = useState(false);

    // Mostro il calendario
    const handleVisualizza = () => {
        setShowCalendario(true);
    };

    // Nascondo il modale calendario
    const handleHide_calendario = () => {
        setShowCalendario(false);
    };



    // PARTE: Rimuovi agenda
    const { risposta: rispostaFetchRimuovi, eseguiFetch: eseguiFetchRimuovi} = useRemoveElement(header);

    const handleHide = () => {
        updated(false);
    };



    //PARTE: Modifica servizio
    // nascondo il modale modifica_servizio
    const [showPannelloModificaServizio, setShowPannelloModificaServizio] = useState(false);

    const handleHide_pannello_modifica_servizio = () => {
        setShowPannelloModificaServizio(false);
    };



    /** Funzioni soggette a contesto. 
     * utilizzo una variabile 'contesto' per capire se il menù azioni tabella viene richiamato dalla pagina dei Servizi oppure Agende questo mi permette di riciclare il codice
     * il contesto viene passato sotto forma di stringa dal componente superiore, il contesto è presente nei props (es. contesto = 'azioniAgenda', 'azioniServizio', ..)
     * 
     * handleModifica: in base al contesto modifica un agenda o un servizo
     * handleElimina: in base al contesto elimina una agenda o un servizio
     */
    

    const handleModifica = () => {
        if (contesto == "azioniServizio") {
            header.id = dati[indice].id_servizio;
            header.endpoint = 'servizio';
            setShowPannelloModificaServizio(true);
            eseguiFetchGetElement();
        }
        else if (contesto == "azioniAgenda") {
            header.id = dati[indice].id_agenda;
            header.endpoint = 'agenda';
            setShowPannelloModifica(true);
            eseguiFetchGetElement();
        }
    };

    const handleElimina = () => {
        if (contesto == "azioniServizio") {
            header.id = dati[indice].id_servizio;
            header.endpoint = 'servizio';
            tc.confirmToast('Vuoi rimuovere l\'elemento selezionato?', 'Elimina', 'Indietro', () => eseguiFetchRimuovi());

        }
        else if (contesto == "azioniAgenda") {
            header.id = dati[indice].id_agenda;
            header.endpoint = 'agenda';
            tc.confirmToast('Vuoi rimuovere l\'elemento selezionato?', 'Elimina', 'Indietro', () => eseguiFetchRimuovi());
        }               
    };


    /* Gestisco le funzioni di update basando la logica sul contesto, quando viene cliccato sul tato Applica
        mando al server le informazioni aggiornate attraverso l'Hook comune eseguiFetchUpdateElement() */
    const handleApplica = () => {
        switch (contesto) {
            case "azioniServizio":
                {
                    header.servizio = document.getElementById('servizio-input').value;
                    header.durata = document.getElementById('durata-input').value;
                    header.prezzo = document.getElementById('prezzo-input').value;
                    break;
                }
            case "azioniAgenda":
                {
                    header.nome_agenda = document.getElementById('titolo-input').value;
                    header.descrizione = document.getElementById('descrizione-input').value;
                    break;
                }
        }
        eseguiFetchUpdateElement();
    };

    // EFFETTI: Basato sul contesto gestisco i field dei valori da modificare sulla base del contesto
    useEffect(() => {
        switch (contesto) {
            case "azioniAgenda":
                {
                    if (showPannelloModifica == true & rispostaFetchGetElement != null) {
                        document.getElementById('titolo-input').value = rispostaFetchGetElement.nome_agenda;
                        document.getElementById('descrizione-input').value = rispostaFetchGetElement.descrizione;
                    }
                    else if (rispostaFetchGetElement == null & showPannelloModifica == true)
                        eseguiFetchGetElement();
                    break;
                }
            case "azioniServizio":
                {
                    if (showPannelloModificaServizio == true & rispostaFetchGetElement != null) {
                        document.getElementById('servizio-input').value = rispostaFetchGetElement.servizio;
                        document.getElementById('durata-input').value = rispostaFetchGetElement.durata;
                        document.getElementById('prezzo-input').value = rispostaFetchGetElement.prezzo;
                    }
                    else if (rispostaFetchGetElement == null & showPannelloModificaServizio == true)
                        eseguiFetchGetElement();
                    break;
                }
        }
    }, [showPannelloModifica, rispostaFetchGetElement, showPannelloModificaServizio]);


    /**Modale azioni
     * modale in apertura al click sulla tabella dei servizi mostra le azioni che puoi compiere
     * serve per navigare fra lòe varie azioni che si possono compiere sella tabella iniziale
     */
    const azioni = {
        key: "modale-azioni-tabella",
        titolo: null,
        corpo: (
            <div className="d-flex justify-content-center flex-column mt-2">
                <div className="row justify-content-center">
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

    // EFFETTI: Relativi alla gestione del calendario
    useEffect(() => {
        // Gestisco gli errori dovuti all'alberatura di dati, indice e id_agenda
        if (dati != undefined & indice != undefined) {
            if (dati[indice] != undefined) {
                descrizione = dati.map(d => d.nome_agenda);
                calendario = {
                    key: "modale-calendario-ordini",
                    titolo: null,
                    corpo: (

                        <_calendario_appuntamenti nomeAgenda={descrizione[indice]} idAgenda={dati[indice].id_agenda} />
                    ),
                };
            }
            
        }
    }, [dati, indice]);

    // Gestisco i toast di risposta
    useEffect(() => {
        if (rispostaFetchRimuovi) {
            if (rispostaFetchRimuovi.stato = 200) {
                const [id_, toast_, impostazioni_] = f.toastCaricamento("Sto applicando le modifiche...");

                const impostazioniLocaliOK_ = { render: rispostaFetchRimuovi.messaggio, type: "success", isLoading: false };
                toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliOK_ });
                // chiudo il modale
                setTimeout(() => {
                    handleHide();
                    toast_.dismiss(id_);
                }, 2000);
            }
            else {
                // alert di errore
                const impostazioniLocaliErrore_ = { render: rispostaFetchRimuovi.messaggio, type: "error", isLoading: false };
                toast_.update(id_, { ...impostazioni_, ...impostazioniLocaliErrore_ });
                setTimeout(() => {
                    toast_.dismiss(id_);
                }, 5000);
            }
        }
        header.id = null;
    }, [rispostaFetchRimuovi]);


    /**Modale modifica agenda 
     * Viene aperto sul click di interfaccia nel icona di modifica di una agenda
     */
    const modifica_agenda = {
        key: "modale-modifica-agenda",
        titolo: "Modifica agenda",
        corpo: (
            <div>
                <div className="form-floating mb-3">
                    <input type="text" id="titolo-input" className="form-control" placeholder="-" />
                    <label htmlFor="titolo-input">Titolo</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="text" id="descrizione-input" className="form-control" placeholder="-" />
                    <label htmlFor="descrizione-input">Descrizione</label>
                </div>
                <div className="mb-3">
                    <input type="checkbox" id="descrizione-input" className="form-check-input me-3" placeholder="-" onChange={handleOnchangeFlagAttivo} disabled checked />
                    <label htmlFor="descrizione-input" disabled>Agenda attiva</label>
                </div>

            </div>
        ),
        azioni: [
            <Button key='1' id= "applica-modifica-agenda" className="btn btn-success" onClick={handleApplica}>Applica</Button>
        ]
    };




    /**Modale modifica servizio 
     * Viene aperto sul click di interfaccia nel icona di modifica di una servizio
     */
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

    

    return (
        <>
            <Modale show={show} onHide={handleHide} modale={azioni} solo_corpo='true' />
            <Modale show={showCalendario} onHide={handleHide_calendario} modale={calendario} solo_corpo='true' />
            <Modale show={showPannelloModifica} onHide={handleHide_pannello_modifica} modale={modifica_agenda} solo_corpo='false' />
            <Modale show={showPannelloModificaServizio} onHide={handleHide_pannello_modifica_servizio} modale={modifica_servizio} solo_corpo='false' />

            <ToastContainer />
        </>
    );
}
export default _azioni_tabella;