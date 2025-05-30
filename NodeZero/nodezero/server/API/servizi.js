// API - Gestione servizi
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const f = require('../functions');

let id_servizio = -1;
let pool = null;


/**[get-servizi - API get]
 * Restituisco la lista dei servizi di un client
 */
router.get('/get-servizi', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id_client = req.headers.id_client;

            const query = 'SELECT id_servizio, servizio, durata, prezzo FROM Servizi WHERE id_client=@id_client';
            request.input('id_client', sql.Int, id_client);

            let result = await request.query(query);

            // la API deve inserire un solo valore
            if (result.rowsAffected = 0)
                return res.status(404).json({ messaggio: "La lista dei servizi è vuota"});

            return res.status(200).json({ messaggio: "Servizi recuperati dal server", dati: result});
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il recupero della lista servizi. errore:" + error, ex: error });
        }
    })()
});


/**[nuovo-servizio - API POST]
 * Inserisco un nuovo servizio nella tabella Servizi
 * Un servizio può essere aggiunto solo da un Client in quanto è direttamente connesso a lui
 */
router.post('/nuovo-servizio', (req, res) => {
    (async () => {
        try {
            let flagReturn = false;
            const { id_client, servizio, durata, prezzo } = req.body;

            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();

            // Chiudo la richiesta dopo 5 secondi, non sta generando un id univoco
            setTimeout(async () => {
                if (!flagReturn) {
                    flagReturn = true;
                    const errore = "Il server non è riuscito ad inserire il nuovo servizio. Se il problema persiste contatta l'amministratore";
                    console.log(errore);
                    return res.status(408).json({ messaggio: errore });
                }
            }, 5000);


            // id_servizio deve essere generato randomicamente
            console.log("genero id univoco");
            id_servizio = await f.generaID_univoco('Servizi', 'id_servizio', request, sql);

            const query = 'INSERT INTO Servizi (id_servizio, id_client, servizio, durata, prezzo) values (@id_servizio, @id_client, @servizio, @durata, @prezzo)';
            request.input('id_servizio', sql.BigInt, id_servizio);
            request.input('id_client', sql.BigInt, id_client);
            request.input('servizio', sql.VarChar(30), servizio);
            request.input('durata', sql.Int, durata);
            request.input('prezzo', sql.Decimal(38, 2), prezzo);

            console.log("smando la query di insert.");
            let result = await request.query(query);

            // la API deve inserire un solo valore
            if (result.rowsAffected != 1)
                return res.status(501).json({ messaggio: "Qualcosa è andato storto. Sono state inserite: " + result.rowsAffected + " righe nel db" });

            console.log("siamo alla fine tutto ok.");
            //req.body = null;
            flagReturn = true;
            return res.status(200).json({ messaggio: "Servizio inserito correttamente" });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante l'inserimento del servizio:" + error, ex: error });

        }
    })()
});


module.exports = router;