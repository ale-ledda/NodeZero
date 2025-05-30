import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

function useAddAgenda(body) {
    useCallback(async () => {
        try {
            const response = await fetch(env.URL_SERVER + "/API/nuova-agenda",
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
            return await response.json();
        } catch (err) {
            console.error("Errore durante la chiamata API:", error);
        }
    }, []);
}

export default useAddAgenda;