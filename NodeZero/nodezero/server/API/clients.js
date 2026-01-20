// API - Gestione servizi
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const f = require('../functions');


/**
 * [get-clients - API GET]
 * Restituisce una lista di Account attivi presi dalla tabella Clients
 */
router.get("/get-clients", async (req, res) => {
    (async () => {
        try {
            await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const result = await sql.query(`SELECT * FROM Client WHERE attivo = 1`);

            // controllo che ci siano Clients
            if (result.recordset.length == 0)
                return res.status(201).send("Non è stato trovato nessun profilo attivo, riprova più tardi.");

            return res.status(200).json({ dati: result });
        }
        catch (error) {
            return res.status(500).send("Errore durante il recupero dei client:" + error);
        }
        /*finally {
            sql.connected ? sql.close() : null;
        }*/
    })()
});

/**
 * [get-client - API GET]
 * Restituisce i dati di uno specifico client passato come parametro
 */
router.get("/get-client", async (req, res) => {
    (async () => {
        try {
            await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const path = req.headers.path;

            const request = new sql.Request();
            const query = `SELECT azienda, numero_telefono, email, logo
                            FROM Client
                            WHERE attivo = 1 AND path = @path`;

            request.input('path', sql.NVarChar, path);

            const result = await request.query(query);

            if (result.recordset.length == 0)
                return res.status(404).send("Pagina momentaneamente non disponibile, riprova più tardi");
            else if (!path)
                return res.status(404).send("Errore durante la lettura del header");

            return res.status(200).json({ dati: result });
        }
        catch (error) {
            return res.status(500).send("Errore durante il recupero del client:" + error);
        }
        /*finally {
            sql.connected ? sql.close() : null;
        }*/
    })()
});

module.exports = router;