import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

/**
 * Utilizzo un solo hook per fare tutte le operazioni di delete
 * passato un header che è un oggetto composto diverse voci gestisco tutte le operazioni instradando verso l'API giusta
 *      
 * 
 * @param {any} header: oggetto header con le informazioni per la chiamata API:
 *      header.endpoint = stringa che indica l'endpoint da chiamare API
 *      header.id = id dell'elemento da aggiornare
 * @returns un oggetto composto come segue:
 *      data.stato -> stato della chiamata (successo o fallimento) es. 200, 500 etc..
 *      data.messaggio -> messaggio di ritorno dalla chiamata es. "Elemento rimosso con successo"
 */
function useRemoveElement(header) {
    const [risposta, setRisposta] = React.useState(null);
    const [trigger, setTrigger] = React.useState(false);


    const eseguiFetch = useCallback(() => {
        setTrigger(true);
        setRisposta(null);
    }, []);

    const fetch_ = useCallback(async () => {
        try {
            setTrigger(false);

            const response = await fetch(env.URL_SERVER + "/API/delete-" +header.endpoint,
                {
                    method: 'DELETE',
                    credentials: 'include', // usato per la gestione del JWT http only
                    headers:
                    {
                        'id': header.id, // id da cancellare
                        // 'Authorization': `Bearer ${mioToken}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (!response.ok) {
                console.log(`Errore HTTP: ${response.status}`);
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            const data = await response.json();
            setRisposta(data);
        } catch (error) {
            console.error(error);
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

export default useRemoveElement;