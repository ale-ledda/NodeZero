// API - Gestione servizi
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const f = require('../functions');

let pool = null;


/**[nuova-agenda - API post]
 * Questa API permette di inserire una nuova agenda associata ad un client passato
 */
router.post('/nuova-agenda', (req, res) => {
    (async () => {
        try {
            let flagReturn = false;
            const { id_client, nome_agenda, descrizione, foto } = req.body;

            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();

            // Chiudo la richiesta dopo 5 secondi, non sta generando un id univoco
            setTimeout(async () => {
                if (!flagReturn) {
                    flagReturn = true;
                    const errore = "Il server non è riuscito ad inserire la nuova agenda. Se il problema persiste contatta l'amministratore";
                    console.log(errore);
                    return res.status(408).json({ messaggio: errore });
                }
            }, 5000);


            // id_servizio deve essere generato randomicamente
            id_agenda = await f.generaID_univoco('Agende', 'id_agenda', request, sql);

            const query = 'INSERT INTO Agende (id_client, id_agenda, nome_agenda, descrizione, foto) values (@id_client, @id_agenda, @nome_agenda, @descrizione, @foto)';
            request.input('id_agenda', sql.BigInt, id_agenda);
            request.input('id_client', sql.Int, id_client);
            request.input('nome_agenda', sql.VarChar(50), nome_agenda);
            request.input('descrizione', sql.VarChar(150), descrizione);
            request.input('foto', sql.VarChar(30), foto);

            let result = await request.query(query);

            // la API deve inserire un solo valore
            if (result.rowsAffected != 1)
                return res.status(501).json({ messaggio: "Qualcosa è andato storto. Sono state inserite: " + result.rowsAffected + " righe nel db" });


            flagReturn = true;
            return res.status(200).json({ messaggio: "Agenda inserita correttamente" });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante l'inserimento della agenda:" + error, ex: error });

        }
    })()
});

/**[get-agende - API get]
 * Restituisco la lista delle agende associate ad un client passato
 */
router.get('/get-agende', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id_client = req.headers.id_client;

            const query = 'SELECT id_agenda, nome_agenda, descrizione, foto FROM Agende WHERE id_client=@id_client';
            request.input('id_client', sql.Int, id_client);

            let result = await request.query(query);

            // la API deve inserire un solo valore
            if (result.rowsAffected = 0)
                return res.status(404).json({ messaggio: "La lista delle agende è vuota" });

            return res.status(200).json({ messaggio: "Agende recuperati dal server", dati: result });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il recupero della lista delle agende. errore:" + error, ex: error });
        }
    })()
});

module.exports = router;