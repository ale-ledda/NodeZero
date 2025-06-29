import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

function useAddPrenotazione(body) {
    const [risposta, setRisposta] = React.useState(null);
    const [trigger, setTrigger] = React.useState(false);


    const eseguiFetch = useCallback(() => {
        setTrigger(true);
        setRisposta(null);
    }, []);


    const fetchPrenotazione = useCallback(async () => {
        try {
            if (!trigger)
                return;

            setTrigger(false);

            const response = await fetch(env.URL_SERVER + "/API/nuova-prenotazione",
                {
                    method: 'POST',
                    headers:
                    {
                        // 'Authorization': `Bearer ${mioToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(body),
                });

            if (!response.ok) {
                console.log(`Errore HTTP: ${response.status}`);
                throw new Error(`Errore HTTP: ${response.status}`);
            }
            setRisposta(await response.json());

        } catch (err) {
            console.error("Errore durante la chiamata API:", err);
        }
    }, [risposta, trigger]);

    useEffect(() => {
        if (trigger) {
            fetchPrenotazione();
        }
    }, [risposta, trigger, fetchPrenotazione]);

    return { risposta, eseguiFetch }
}

export default useAddPrenotazione;