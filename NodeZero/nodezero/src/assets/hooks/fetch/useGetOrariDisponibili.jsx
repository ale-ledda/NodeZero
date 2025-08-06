import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

function useGetOrariDisponibili(prenotazione) {
    const [recordOrariDisponibili, setRecordOrariDisponibili] = React.useState({});
    const [trigger, setTrigger] = React.useState(false);


    const eseguiFetchOrari = useCallback(() => {
        setTrigger(true);
        setRecordOrariDisponibili(null);
    }, []);

    const fetchOrari = useCallback(async () => {
        try {
            if(!trigger)
                return;

            setTrigger(false);

            const response = await fetch(env.URL_SERVER + "/API/get-orari-disponibili",
                {
                    method: 'GET',
                    headers:
                    {
                        'id_client': "102",
                        'id_agenda': prenotazione.id_agenda,
                        'id_servizio': prenotazione.id_servizio,
                        // 'Authorization': `Bearer ${mioToken}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (!response.ok) {
                console.log(`Errore HTTP: ${response.status}`);
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            const app = await response.json();

            setRecordOrariDisponibili(app);

        } catch (error) {
            console.error("Errore durante la chiamata API:", error);
        }
    }, [recordOrariDisponibili, trigger]);

    useEffect(() => {
        if (trigger) {
            fetchOrari();
        }
    }, [recordOrariDisponibili, trigger, fetchOrari]);

    return { recordOrariDisponibili, eseguiFetchOrari }
}

export default useGetOrariDisponibili;