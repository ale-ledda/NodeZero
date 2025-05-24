import React, { useEffect } from 'react';
import env from '/variabili.json';

function useGetServizi() {

    const [record, setRecord] = React.useState([]);

    useEffect(() => {
        console.log("hook agganciato");
        fetch(env.DOMINIO + "/API/get-servizi",
            {
                method: 'GET',
                headers:
                {
                    'id_client': '102', //FIXME: Prendi dal token sessione
                    // 'Authorization': `Bearer ${mioToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    console.log(`Errore HTTP: ${response.status}`);
                    throw new Error(`Errore HTTP: ${response.status}`);
                }

                return response.json();
            })
            .then(data => {
                setRecord(data.dati.recordset);
            })
            .catch(error => {
                console.error("Errore durante la chiamata API:", error);
            });
    }, []);

    return record ;
}

export default useGetServizi;