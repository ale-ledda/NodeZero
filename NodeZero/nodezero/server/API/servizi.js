// API - Gestione servizi
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const f = require('../functions');

let id_servizio = -1;
let pool = null;


/**[update-servizio - API update]
 * Passato l'id di una servizio e le sue informazioni aggiorno i dati passati
 */
router.put('/update-servizio', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id = BigInt(req.headers.id);
            const servizio = req.headers.servizio;
            const durata = req.headers.durata;
            const prezzo = req.headers.prezzo;

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            // Recupero i dati che mi servono dagli ordini
            const query = `UPDATE Servizi
                            SET servizio = @servizio, durata = @durata, prezzo = @prezzo
                            WHERE id_servizio = @id AND id_client = @id_client`;

            request.input('id', sql.BigInt, id);
            request.input('servizio', sql.VarChar(30), servizio);
            request.input('durata', sql.Int, durata);
            request.input('prezzo', sql.Decimal(38, 2), prezzo);
            request.input('id_client', sql.Int, token_jwt_decodificato.id_client);
            let result = await request.query(query);

            // query non settata
            if (!result)
                return res.status(404).json({ stato: 404, messaggio: "Problema con la modifica dei dati. Riprova" });

            // intercetto la casistica agenda vuota
            const messaggio = 'I dati sono stati aggiornati';

            if (result.rowsAffected == 1)
                return res.status(200).json({ stato: 200, messaggio: messaggio });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ stato: 500, messaggio: "Errore durante l'aggiornamento dei dati del servizio: " + req.headers.id + ". errore:" + error, ex: error });
        }
    })()
});

/**[get-servizio - API get]
 * Restituisco un istanza della tabella servizio associata al id passato nel header */
router.get('/get-servizio', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id_servizio = BigInt(req.headers.id);

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            const query = `SELECT *
                            FROM Servizi
                            WHERE id_servizio = @id_servizio AND id_client = @id_client`;

            request.input('id_servizio', sql.BigInt, id_servizio);
            request.input('id_client', sql.Int, token_jwt_decodificato.id_client);

            let result = await request.query(query);

            if (result.rowsAffected = 0)
                return res.status(404).json({ messaggio: "Servizio non trovata", stato: 404 });

            return res.status(200).json({ dati: result, stato: 200 });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il recupero del servizio. errore:" + error, ex: error, stato: 500 });
        }
    })()
});

/**[delete-servizio - API delete]
 * Passato l'id di una servizio la rimuovo dal db
 */
router.delete('/delete-servizio', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id = BigInt(req.headers.id);

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            // Recupero i dati che mi servono dagli ordini
            const query = `DELETE FROM servizi
                            WHERE id_servizio = @id AND id_client = @id_client`;

            request.input('id', sql.BigInt, id);
            request.input('id_client', sql.BigInt, token_jwt_decodificato.id_client);

            let result = await request.query(query);

            // query non settata
            if (!result)
                return res.status(404).json({ stato: 404, messaggio: "Problema con la cancellazione del servizio. Riprova" });

            // intercetto la casistica agenda vuota
            const messaggio = 'Servizio rimosso con sucesso';

            if (result.rowsAffected == 1)
                return res.status(200).json({ stato: 200, messaggio: messaggio });
            else {
                // cancellata piu di una riga
                return res.status(201).json({ stato: 201, messaggio: messaggio });
            }
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ stato: 500, messaggio: "Errore durante il cnacellamento del servizio: " + req.headers.id + ". errore:" + error, ex: error });
        }
    })()
});


/**[get-servizi - API GET]
 * Restituisco la lista dei servizi di un client passato nel header: path
 */
router.get('/get-servizi', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const path = req.headers.path;

            const query = `SELECT id_servizio, servizio, durata, prezzo
                            FROM Servizi s
                            LEFT JOIN(select id_client, path from Client) c ON s.id_client = c.id_client
                            WHERE c.path = @path`;

            request.input('path', sql.NVarChar, path);

            let result = await request.query(query);
            if (result.rowsAffected = 0)
                return res.status(404).json({ messaggio: "La lista dei servizi è vuota", stato: 404 });

            return res.status(200).json({ messaggio: "Servizi recuperati dal server", dati: result, stato: 200});
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il recupero della lista servizi. errore:" + error, ex: error, stato: 500});
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
            const { servizio, durata, prezzo } = req.body;

            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            // Chiudo la richiesta dopo 5 secondi, non sta generando un id univoco
            setTimeout(async () => {
                if (!flagReturn) {
                    flagReturn = true;
                    const errore = "Il server non è riuscito ad inserire il nuovo servizio. Se il problema persiste contatta l'amministratore";
                    console.log(errore);
                    return res.status(408).json({ messaggio: errore, stato:408});
                }
            }, 5000);


            // id_servizio deve essere generato randomicamente
            id_servizio = await f.generaID_univoco('Servizi', 'id_servizio', request, sql);

            const query = `INSERT INTO Servizi (id_servizio, id_client, servizio, durata, prezzo)
                            VALUES (@id_servizio, @id_client, @servizio, @durata, @prezzo)`;

            request.input('id_servizio', sql.BigInt, id_servizio);
            request.input('id_client', sql.Int, token_jwt_decodificato.id_client);
            request.input('servizio', sql.VarChar(30), servizio);
            request.input('durata', sql.Int, durata);
            request.input('prezzo', sql.Decimal(38, 2), prezzo);

            let result = await request.query(query);

            // la API deve inserire un solo valore
            if (result.rowsAffected != 1)
                return res.status(501).json({ messaggio: "Qualcosa è andato storto. Sono state inserite: " + result.rowsAffected + " righe nel db", stato: 501});

            flagReturn = true;
            return res.status(200).json({ messaggio: "Servizio inserito correttamente", stato: 200});
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante l'inserimento del servizio:" + error, ex: error, stato: 500});

        }
    })()
});


module.exports = router;