import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

/**
 * Utilizzo un solo hook per fare tutte le operazioni di post
 * passato un header che è un oggetto composto diverse voci gestisco tutte le operazioni instradando verso l'API giusta
 *      
 * 
 * @param {any} header: oggetto header con le informazioni per la chiamata API:
 *      header.endpoint = stringa che indica l'endpoint da chiamare API
 *      Oltre ai parametri di soppra obbligatori l'header può contenre anche altri parametri utili al passaggio dati verso l'API
 * 
 * @param {any} body: oggetto body con le informazioni da postare verso l'API
 * 
 * @returns un oggetto composto come segue:
 *      data.stato -> stato della chiamata (successo o fallimento) es. 200, 500 etc..
 *      data.messaggio -> messaggio di ritorno dalla chiamata es. "Elemento aggiornato con successo"
 */
function usePostElement(header, body) {
    const [risposta, setRisposta] = React.useState(null);
    const [trigger, setTrigger] = React.useState(false);

    const eseguiFetch = useCallback(() => {
        setTrigger(true);
        setRisposta(null);
    }, []);

    const fetch_ = useCallback(async () => {
        try {
            setTrigger(false);
            const response = await fetch(env.URL_SERVER + "/API/" + header.endpoint,
                {
                    method: 'POST',
                    credentials: 'include', // usato per la gestione del JWT http only
                    headers:
                    {
                        // 'Authorization': `Bearer ${mioToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body)
                });

            if (!response.ok) {
                console.log(`Errore HTTP: ${response.status}`);
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            const data = await response.json();
            setRisposta(data);
        } catch (error) {
            console.error("Errore durante la chiamata API:", error);
        }
    }, []);

    useEffect(() => {
        if (trigger) {
            fetch_();
        }
    }, [risposta, trigger, fetch_]);

    return { risposta, eseguiFetch }

}

export default usePostElement;