import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

function useGetOrariDisponibili(prenotazione) {
    const [recordOrariDisponibili, setRecordOrariDisponibili] = React.useState([]);

    const fetchOrari = useCallback(async () => {
        try {
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

            const data = await response.json();
            setRecordOrariDisponibili(data.recordset[0]); // Aggiorna lo stato dei prodotti
        } catch (error) {
            console.error("Errore durante la chiamata API:", error);
        }
    }, []);

    useEffect(() => {
        fetchOrari();
    }, [fetchOrari]);

    return { recordOrariDisponibili}

}

export default useGetOrariDisponibili;