import React, { useState, useEffect } from 'react';
import { BoxArrowInRight } from 'react-bootstrap-icons';
// librerie
import env from '/variabili.json';
import Button from 'react-bootstrap/Button';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// componenti
import Input_naviga from './assets/componenti/input_naviga';
import Elemento from './assets/componenti/elemento';
import Modale from './assets/componenti/modale.jsx';
// hooks
import usePostElement from './assets/hooks/fetch/usePostElement.jsx';
import useGetElement from './assets/hooks/fetch/useGetElement.jsx';

let body = {
    email: null,
    password: null
};

let header = {
    endpoint: null,
};

function App() {
    //Use state
    const [dataAPI, setDataAPI] = useState(null);
    const [showPannelloLogin, setShowPannelloLogin] = useState(false);
    // risposte API
    const { risposta: rispostaFetchPostElement_Login, eseguiFetch: eseguiFetchPostElement_Login } = usePostElement(header, body);
    const { risposta: rispostaFetchPostElement_SessioneAttiva, eseguiFetch: eseguiFetchPostElement_SessioneAttiva } = usePostElement(header, {});
    const { risposta: rispostaFetchGetElement_Clients, eseguiFetch: eseguiFetchGetElement_Clients } = useGetElement(header);

    // gestisco il modale del pannello login
    const handleVisualizzaPannelloLogin = () => {
        setShowPannelloLogin(true);
    };
    const handleHidePannelloLogin = () => {
        setShowPannelloLoginx(false);
    };

    //Effetuo il login
    const handleLogin = () => {
        // imposto il body con i dati presi dal form
        body.email = document.getElementById('email-input').value;
        body.password = document.getElementById('password-input').value;

        header.endpoint = 'login-client';
        eseguiFetchPostElement_Login();
    };

    // gestisco la risposta
    useEffect(() => {
        if (rispostaFetchPostElement_Login) {
            console.log('risposta: ' + rispostaFetchPostElement_Login.stato);
            if (rispostaFetchPostElement_Login.stato == 200) {
                localStorage.setItem('client', rispostaFetchPostElement_Login.messaggio);
                window.location.href = '/'+rispostaFetchPostElement_Login.messaggio;
            }
        }
    }, [rispostaFetchPostElement_Login]); 

    // Scarico i client dal API appena avviato
    useEffect(() => {
        header.endpoint = 'clients';
        eseguiFetchGetElement_Clients();

        // se sei loggato ti riporto alla tua area di competenza
        header.endpoint = 'verifico-token-sessione';
        eseguiFetchPostElement_SessioneAttiva();
    }, []); 

    // imposto la mappa per la select box
    useEffect(() => {
        setDataAPI(rispostaFetchGetElement_Clients.map((clients) => ({ "azienda": clients.azienda, "path": clients.path })));
        
    }, [rispostaFetchGetElement_Clients]); 

    // controllo se la sessione è attiva
    useEffect(() => {
        if (rispostaFetchPostElement_SessioneAttiva != undefined) {
            if (rispostaFetchPostElement_SessioneAttiva.stato == 200) {

                localStorage.setItem('client', rispostaFetchPostElement_SessioneAttiva.messaggio);
                window.location.href = '/' + rispostaFetchPostElement_SessioneAttiva.messaggio;
            }
                
        }

    }, [rispostaFetchPostElement_SessioneAttiva]); 

    const pannello_login = {
        key: "modale-login",
        titolo: "Inserisci le credenziali",
        corpo: (
            <div>
                <div className="form-floating mb-3">
                    <input type="text" id="email-input" className="form-control" placeholder="-" />
                    <label htmlFor="email-input">E-mail</label>
                </div>
                <div className="form-floating mb-3">
                    <input type="password" id="password-input" className="form-control" placeholder="-" />
                    <label htmlFor="password-input">Password</label>
                </div>

                <h6>Centro supporto: 9aleledda8@gmail.com</h6>
            </div>
        ),
        azioni: [
            <Button key='1' id="entra" className="btn btn-success" onClick={handleLogin}>Entra</Button>
        ]
    };

    return (
        <>
            <div className="contenitorePrincipale">
                <h1>Node Zero</h1>
                <Input_naviga items={dataAPI} />
                <div className='contenitorePulsanteLogin' onClick={handleVisualizzaPannelloLogin}>
                    <Elemento titolo='' icona={<BoxArrowInRight />} />
                </div>
            </div>

            <Modale show={showPannelloLogin} onHide={handleHidePannelloLogin} modale={pannello_login} solo_corpo='false' />
        </>
    );
}
export default App;