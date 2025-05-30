import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

function useGetAgende() {
    const [record, setRecord] = React.useState([]);

    const fetchAgende = useCallback(async () => {
        try {
            const response = await fetch(env.URL_SERVER + "/API/get-agende",
                {
                    method: 'GET',
                    headers:
                    {
                        'id_client': '102', //FIXME: Prendi dal token sessione
                        // 'Authorization': `Bearer ${mioToken}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (!response.ok) {
                console.log(`Errore HTTP: ${response.status}`);
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            const data = await response.json();
            setRecord(data.dati.recordset); // Aggiorna lo stato dei prodotti
        } catch (err) {
            console.error("Errore durante la chiamata API:", error);
        }
    }, []);

    useEffect(() => {
        fetchAgende();
    }, [fetchAgende]);

    return { record, ricaricaAgende: fetchAgende }

}

export default useGetAgende;