import React, { useState, useEffect } from 'react';
// librerie
import env from '/variabili.json';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
// componenti
import Input_naviga from './assets/componenti/input_naviga';

function App() {
    const [dataAPI, setDataAPI] = useState(null);

    // Recupero la lista di client dal db
    useEffect(() => {
        
        fetch(env.URL_SERVER + "/API/get-clients")
            .then(response => {
                if (!response.ok) {
                    console.log(`Errore HTTP: ${response.status}`);
                    throw new Error(`Errore HTTP: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                // creo il dizionario azienda - path
                setDataAPI(data.recordset.map((clients) => ({ "azienda": clients.azienda, "path": clients.path }) ));
            })
            .catch(error => {
                console.error("Errore durante la chiamata API:", error);
            });

    }, []);

    return (
        <>
            <div className="contenitorePrincipale">
                <h1>Node Zero</h1>
                <Input_naviga items={dataAPI} />
            </div>
            
        </>
    );
}
export default App;