import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

/**
 * Utilizzo un solo hook per fare tutte le operazioni di get
 * passato un header che è un oggetto composto diverse voci gestisco tutte le operazioni instradando verso l'API giusta
 *      
 * 
 * @param {any} header: oggetto header con le informazioni per la chiamata API:
 *      header.endpoint = stringa che indica l'endpoint da chiamare API
 *      header.id = id dell'elemento da aggiornare
 * 
 * @param {any} ottieni_il_primo: valore numerico che indica se l'API deve restituire una singola istanza oppure una lista
 *         = 2 restiuisce un oggetto non presente nel attributo recordset (es. useGetOrari non ha attributi in risposta recordset o recordsets)
 *         = 1 restituisce un singolo oggetto come per get-client dentro recordset
 *         = 0 (default) restituisce una lista dentro recordset
 * 
 * 
 * @returns un oggetto composto come segue:
 *      data.stato -> stato della chiamata (successo o fallimento) es. 200, 500 etc..
 *      data.messaggio -> messaggio di ritorno dalla chiamata es. "Elemento aggiornato con successo"
 */
function useGetElement(header, ottieni_il_primo = 0) {
    let [risposta, setRisposta] = React.useState([]);
    let [trigger, setTrigger] = React.useState(false);

    const eseguiFetch = useCallback(() => {
        setTrigger(true);
        setRisposta([]);
        fetch_();
    }, []);

    const fetch_ = useCallback(async () => {
        try {
            setTrigger(false);

            const response = await fetch(env.URL_SERVER + "/API/get-" + header.endpoint,
                {
                    method: 'GET',
                    credentials: 'include', // usato per la gestione del JWT http only
                    headers:
                    {
                        'id': header.id,
                        'id_agenda': header.id_agenda,
                        'id_servizio': header.id_servizio,
                        'giorno_scelto': header.giorno_scelto,
                        'path': header.path,
                        // 'Authorization': `Bearer ${mioToken}`,
                        'Content-Type': 'application/json',
                    }
                });

            if (!response.ok) {
                console.log(`Errore HTTP: ${response.status}`);
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            const data = await response.json();

            //ottieni_il_primo = 0 restituisce un array, = 1 la prima istanza
            if (ottieni_il_primo == 0)
                setRisposta(data.dati.recordset);
            else if (ottieni_il_primo == 1)
                setRisposta(data.dati.recordset[0]);
            else if (ottieni_il_primo == 2)
                setRisposta(data.dati);

        } catch (error) {
            console.error("[useGetElement.jsx] - Errore durante la chiamata API:", error, " - provenienza: " + header.endpoint);
        }
    }, []);


    useEffect(() => {
        if (trigger) {
            fetch_();
        }
    }, [risposta, fetch_]);

    return { risposta, eseguiFetch }

}

export default useGetElement;