import React, { useEffect, useCallback } from 'react';
import env from '/variabili.json';

function useGetAppuntamenti(header) {
    const [recordAppuntamenti, setRecordAppuntamenti] = React.useState({});
    const [trigger, setTrigger] = React.useState(false);


    const eseguiFetchAppuntamenti = useCallback(() => {
        setTrigger(true);
        setRecordAppuntamenti(null);
    }, []);

    const fetchAppuntamenti = useCallback(async () => {
        try {
            if (!trigger)
                return;

            setTrigger(false);

            const response = await fetch(env.URL_SERVER + "/API/get-appuntamenti",
                {
                    method: 'GET',
                    headers:
                    {
                        'id_agenda': header.id_agenda,
                        // 'Authorization': `Bearer ${mioToken}`,
                        'Content-Type': 'application/json'
                    }
                });

            const _response = await response.json();
            setRecordAppuntamenti(_response);

        } catch (error) {
            console.error("Errore durante la chiamata API:", error);
        }
    }, [recordAppuntamenti, trigger]);

    useEffect(() => {
        if (trigger) {
            fetchAppuntamenti();
        }
    }, [recordAppuntamenti, trigger, fetchAppuntamenti]);

    return { recordAppuntamenti, eseguiFetchAppuntamenti }
}

export default useGetAppuntamenti;