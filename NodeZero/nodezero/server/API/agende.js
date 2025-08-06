// API - Gestione servizi
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const f = require('../functions');

let pool = null;
let id_agenda = null;
let id_ordine = null;


/**[nuova-prenotazione - API post]
 * Passati i dati di una prenotazione effetuo l'inserimento nel database
 */
router.post('/nuova-prenotazione', (req, res) => {
    (async () => {
        try {
            const { id_agenda, id_servizio, inizio_prestazione_tm, email, numero_telefono, data_odierna } = req.body;

            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();

            // id_ordine deve essere generato randomicamente
            id_ordine = await f.generaID_univoco('Ordini', 'id_ordine', request, sql);

            const query = 'INSERT INTO Ordini (id_ordine, id_agenda, id_servizio, prenotazione_tm, inizio_prestazione_tm, email, numero_telefono) values (@id_ordine, @id_agenda, @id_servizio, @prenotazione_tm, @inizio_prestazione_tm, @email, @numero_telefono)';
            request.input('id_agenda', sql.VarChar(20), id_agenda);
            request.input('id_ordine', sql.VarChar(20), id_ordine);
            request.input('id_servizio', sql.VarChar(20), id_servizio);
            request.input('prenotazione_tm', sql.VarChar(10), data_odierna);
            request.input('inizio_prestazione_tm', sql.VarChar(19), inizio_prestazione_tm);
            request.input('email', sql.VarChar(30), email);
            request.input('numero_telefono', sql.VarChar(20), numero_telefono);
            let result = await request.query(query);

            // la API deve inserire un solo valore
            if (result.rowsAffected != 1)
                return res.status(501).json({ messaggio: "Qualcosa è andato storto. Sono state inserite: " + result.rowsAffected + " righe nel db", stato: 501 });


            return res.status(200).json({ messaggio: "Prenotazione effetuata!", stato: 200 });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante l'inserimento della prenotazione:" + error, ex: error, stato: 500 });

        }
    })()
});

/**[get-orari-disponibili - API get]
 * Passati i dati di id_agenda, id_servizio e giorno prenotazione restituire una lista di orari compattibili con la prenotazione in corso.
 */
router.get('/get-orari-disponibili', (req, res) => {
    (async () => {
        try {

            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id_agenda = BigInt(req.headers.id_agenda);
            const id_servizio = BigInt(req.headers.id_servizio);

            // Recupero i dati che mi servono dalla agenda
            const query_agenda = 'SELECT id_agenda, ora_inizio, ora_fine, orari_pausa FROM Agende WHERE id_agenda=@id_agenda';
            request.input('id_agenda', sql.BigInt, id_agenda);
            let result_qa = await request.query(query_agenda);
            if (result_qa.rowsAffected == 0 | !result_qa)
                return res.status(404).json({ messaggio: "C'è stato un problema con il recupero dei dati della agenda. Riprova" });

            // Recupero i dati che mi servono dai servizi
            const query_servizi = 'SELECT id_servizio, durata FROM Servizi WHERE id_servizio=@id_servizio';
            request.input('id_servizio', sql.BigInt, id_servizio);
            let result_s = await request.query(query_servizi);
            if (result_s.rowsAffected == 0 | !result_s)
                return res.status(404).json({ messaggio: "C'è stato un problema con il recupero dei dati dei servizi. Riprova" });

            // Recupero i dati degli ordini già inseriti per questa agenda e questa giornata
            // todo: aggiungere il filtro per la giornata passata
            const query_ordini = 'select id_ordine, id_agenda, prenotazione_tm, inizio_prestazione_tm, durata from Ordini as a left join (select durata, id_servizio from Servizi) as b ON a.id_servizio = b.id_servizio WHERE id_agenda=@id_agenda';
            //request.input('id_agenda', sql.BigInt, id_agenda);
            let result_o = await request.query(query_ordini);
            if (!result_o)
                return res.status(404).json({ messaggio: "Errore inaspettato sul recupero ordini. Riprova" });
            

            // Creo la lista dei possibili orari
            let listaOrari = f.generaListaOrariDisponibili(result_qa.recordsets[0][0], result_s.recordsets[0][0], result_o.recordsets);


            return res.status(200).json({ messaggio: "Orari possibili per il servizio richiesto: ", dati: listaOrari });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il calcolo degli orari possibili. errore:" + error, ex: error });
        }
    })()
});

/**[nuova-agenda - API post]
 * Questa API permette di inserire una nuova agenda associata ad un client passato
 */
router.post('/nuova-agenda', (req, res) => {
    (async () => {
        try {
            let flagReturn = false;
            
            const { id_client, nome_agenda, descrizione, foto, inizio, fine, pause } = req.body;

            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();

            // Chiudo la richiesta dopo 5 secondi, non sta generando un id univoco
            setTimeout(async () => {
                if (!flagReturn) {
                    flagReturn = true;
                    const errore = "Il server non è riuscito ad inserire la nuova agenda. Se il problema persiste contatta l'amministratore";
                    console.log(errore);
                    return res.status(408).json({ messaggio: errore, stato: 408 });
                }
            }, 5000);


            // id_servizio deve essere generato randomicamente
            id_agenda = await f.generaID_univoco('Agende', 'id_agenda', request, sql);

            const query = 'INSERT INTO Agende (id_client, id_agenda, nome_agenda, descrizione, foto, ora_inizio, ora_fine, orari_pausa) values (@id_client, @id_agenda, @nome_agenda, @descrizione, @foto, @inizio, @fine, @pause)';
            request.input('id_agenda', sql.BigInt, id_agenda);
            request.input('id_client', sql.Int, id_client);
            request.input('nome_agenda', sql.VarChar(50), nome_agenda);
            request.input('descrizione', sql.VarChar(150), descrizione);
            request.input('foto', sql.VarChar(30), foto);
            request.input('inizio', sql.VarChar(5), inizio);
            request.input('fine', sql.VarChar(5), fine);
            request.input('pause', sql.VarChar(sql.MAX), pause);
            let result = await request.query(query);

            // la API deve inserire un solo valore
            if (result.rowsAffected != 1)
                return res.status(501).json({ messaggio: "Qualcosa è andato storto. Sono state inserite: " + result.rowsAffected + " righe nel db", stato: 501 });


            flagReturn = true;
            return res.status(200).json({ messaggio: "Agenda inserita correttamente", stato: 200 });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante l'inserimento della agenda:" + error, ex: error, stato: 500 });

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