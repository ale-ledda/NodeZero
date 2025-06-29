import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

function useGetClient() {
    const [record, setRecord] = React.useState([]);

    const fetchClient = useCallback(async () => {
        try {
            const response = await fetch(env.URL_SERVER + "/API/get-client",
                {
                    method: 'GET',
                    headers:
                    {
                        'path': window.location.pathname.replace('/', ''),
                        // 'Authorization': `Bearer ${mioToken}`,
                        'Content-Type': 'application/json'
                    }
                });

            if (!response.ok) {
                console.log(`Errore HTTP: ${response.status}`);
                throw new Error(`Errore HTTP: ${response.status}`);
            }

            const data = await response.json();
            setRecord(data.recordset[0]); // Aggiorna lo stato dei prodotti
        } catch (error) {
            console.error("Errore durante la chiamata API:", error);
        }
    }, []);

    useEffect(() => {
        fetchClient();
    }, [fetchClient]);

    return { record }

}

export default useGetClient;