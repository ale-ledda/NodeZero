// API - Gestione servizi
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const f = require('../functions');

let pool = null;
let id_ordine = null;
let transaction = null;

/**[get-agenda - API get]
 * Restituisco gli attributo della tabella agende, per una data agenda passata
 */
router.get('/get-agenda', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id_agenda = BigInt(req.headers.id);

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            const query = `SELECT * FROM Agende
                            WHERE id_agenda = @id_agenda AND id_client = @id_client`;

            request.input('id_agenda', sql.BigInt, id_agenda);
            request.input('id_client', sql.Int, token_jwt_decodificato.id_client);

            let result = await request.query(query);

            if (result.rowsAffected = 0)
                return res.status(404).json({ messaggio: "Agenda non trovata", stato: 404});


            return res.status(200).json({ dati: result, stato: 200});
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il recupero della lista delle agende. errore:" + error, ex: error, stato: 500});
        }
    })()
});

/**get-giorni-chiusura - API get]
 * Passato l'id di una agenda ottengo i giorni di chiusura settimanali
 * il formatto di ritorno è una lista di numeri che rappresentano i giorni di chiusura
 * 1= lunedi, 2= martedi, 3= mercoledi, 4= giovedi, 5= venerdi, 6= sabato, 7= domenica
 */
router.get('/get-giorni-chiusura', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id = BigInt(req.headers.id);

            // Recupero i dati che mi servono dagli ordini, i giorni della settimana sono rappresentati da un intero da 1 a 7 restituisco quelli non presenti nella tabella giorni_lavorativi
            const query = `SELECT GiornoDellaSettimana.Giorno
                            FROM (VALUES (1), (2), (3), (4), (5), (6), (7)) AS GiornoDellaSettimana(Giorno)
                            WHERE GiornoDellaSettimana.Giorno NOT IN (
                                SELECT DISTINCT giorno 
                                FROM Giorni_lavorativi
	                            WHERE id_agenda = @id
                                );`

            request.input('id', sql.BigInt, id);
            let result = await request.query(query);

            // query non settata
            if (!result)
                return res.status(404).json({ stato: 404, messaggio: "Errore durante il recupero dei giorni di chiusura. Riprova" });


            return res.status(200).json({ stato: 200, messaggio: null, dati: result });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({stato: 500, messaggio: "Error generico. Errore durante il recupero dei giorni di chiusura, errore:" + error, ex: error });
        }
    })()
});
/**[update-agenda - API update]
 * Passato l'id di una agenda e le sue informazioni aggiorno i dati passati
 */
router.put('/update-agenda', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id = BigInt(req.headers.id);
            const nome_agenda = req.headers.nome_agenda;
            const descrizione = req.headers.descrizione;

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            // Recupero i dati che mi servono dagli ordini
            const query = `UPDATE agende SET nome_agenda = @nome_agenda, descrizione = @descrizione
                            WHERE id_agenda = @id AND id_client = @id_client`;

            request.input('id', sql.BigInt, id);
            request.input('nome_agenda', sql.VarChar(50), nome_agenda);
            request.input('descrizione', sql.VarChar(150), descrizione);
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
            return res.status(500).json({ stato: 500, messaggio: "Errore durante l'aggiornamento dei dati dell'agenda: " + req.headers.id + ". errore:" + error, ex: error });
        }
    })()
});

/**[delete-agenda - API delete]
 * Passato l'id di una agenda la rimuovo dalla lista
 * utilizzo l'atomizzazione a livello dbms per garantire che le tabelle figlie subiscano una delete in CASCADE/SOVRASCRIVI mode
 */
router.delete('/delete-agenda', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            let request = pool.request();
            const id = BigInt(req.headers.id);

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            // Recupero i dati che mi servono dagli ordini (l'ordine di cancellazione è il seguente: pause, giorni_lavorativi e poi in fine agende)
            const query = `DELETE FROM agende
                            WHERE id_agenda = @id AND id_client = @id_client`;

            request.input('id', sql.BigInt, id);
            request.input('id_client', sql.Int, token_jwt_decodificato.id_client);
            let result = await request.query(query);

            // query non settata
            if (!result)
                return res.status(404).json({ stato: 404, messaggio: "Problema con la cancellazione della agenda. Riprova" });

            // intercetto la casistica agenda vuota
            const messaggio = 'Agenda rimossa con sucesso';

            if (result.rowsAffected == 1)
                return res.status(200).json({ stato: 200, messaggio: messaggio });
            else {
                // cancellata piu di una riga
                return res.status(201).json({ stato: 201, messaggio: messaggio });
            }
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ stato: 500, messaggio: "Errore durante la cancellazione dell agenda: " + req.headers.id + ". errore:" + error, ex: error });
        }
    })()
});

/**[get-appuntamenti - API get]
 * Passato nel header l'id della agenda ottengo tutti gli appuntamenti della agenda passata
 * return : una lista di oggetti che rappresentano gli appuntamenti [{titolo: - }, {inizio: -}, {fine: -}]
 */
router.get('/get-appuntamenti', (req, res) => {
    (async () => {
        try {
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();
            const id_agenda = BigInt(req.headers.id);

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            // Recupero i dati che mi servono dagli ordini
            const query_appuntamenti = `SELECT inizio_prestazione_tm, email, numero_telefono, servizio, durata
                                        FROM Ordini A
                                        LEFT JOIN (SELECT id_servizio as id_servizio_, servizio, durata FROM Servizi) B ON A.id_servizio = B.id_servizio_
                                        WHERE id_agenda=@id_agenda AND id_client = @id_client`;

            request.input('id_agenda', sql.BigInt, id_agenda);
            request.input('id_client', sql.Int, token_jwt_decodificato.id_client);
            let result_qa = await request.query(query_appuntamenti); 

            // query non settata
            if (!result_qa)
                return res.status(404).json({ stato: 404, messaggio: "Problema con il recupero dei dati della agenda. Riprova" });

            // intercetto la casistica agenda vuota
            if (result_qa.rowsAffected == 0)
                return res.status(200).json({ stato: 200, messaggio: "Questa agenda non ha appuntamenti per ora", dati: result_qa });

            return res.status(200).json({ stato: 200, messaggio: "", dati: result_qa });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ stato: 500, messaggio: "Errore durante l'ottenimento degli appuntamenti per questa agenda. errore:" + error, ex: error });
        }
    })()
});

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

            const query = `INSERT INTO Ordini (id_ordine, id_agenda, id_servizio, prenotazione_tm, inizio_prestazione_tm, email, numero_telefono)
                            VALUES (@id_ordine, @id_agenda, @id_servizio, @prenotazione_tm, @inizio_prestazione_tm, @email, @numero_telefono)`;

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
            const in_giorno_scelto = req.headers.giorno_scelto;


            // predisporre la nuova lettura, restituisce una riga che indica le infromazioni per la giornata selezionata
            const query_dati = `SELECT
                                    A.id_agenda, orario_inizio, orario_fine, id_client, nome_agenda, descrizione, giorno,
                                    STRING_AGG(CONCAT(P.orario_inizio_pausa, ' - ', P.orario_fine_pausa), '; ') AS orario_pause_aggregate
                                FROM Agende A
                                    LEFT JOIN Giorni_lavorativi G ON A.id_agenda = G.id_agenda
                                    LEFT JOIN Pause P ON P.id_giorno_lavorativo = G.id_giorno_lavorativo
                                WHERE A.id_agenda = @id_agenda AND giorno = @in_giorno_scelto
                                GROUP BY A.id_agenda, orario_inizio, orario_fine, id_client, nome_agenda, descrizione, giorno`
            request.input('id_agenda', sql.BigInt, id_agenda);
            request.input('in_giorno_scelto', sql.Int, in_giorno_scelto);

            let result_dati = await request.query(query_dati);
            if (!result_dati | result_dati.recordsets[0][0] == null | result_dati.recordsets[0][0] == undefined)
                return res.json({ messaggio: "Ops, questa agenda non lavora in questa giornata. Riprova con un altro giorno", stato: 404, dati: 'E1'});
            else { 
                // Recupero i dati che mi servono dai servizi
                const query_servizi = 'SELECT id_servizio, durata FROM Servizi WHERE id_servizio=@id_servizio';
                request.input('id_servizio', sql.BigInt, id_servizio);
                let result_s = await request.query(query_servizi);
                if (result_s.rowsAffected == 0 | !result_s)
                    return res.status(404).json({ messaggio: "C'è stato un problema con il recupero dei dati dei servizi. Riprova", stato: 404 });

                // Recupero i dati degli ordini già inseriti per questa agenda e questa giornata
                // todo: aggiungere il filtro per la giornata passata
                const query_ordini = `SELECT id_ordine, id_agenda, prenotazione_tm, inizio_prestazione_tm, durata
                                        FROM Ordini as a
                                        LEFT JOIN(select durata, id_servizio from Servizi) AS b ON a.id_servizio = b.id_servizio
                                        WHERE id_agenda = @id_agenda`;
                let result_o = await request.query(query_ordini);
                if (!result_o)
                    return res.status(404).json({ messaggio: "Errore inaspettato sul recupero ordini. Riprova" });

                // Creo la lista dei possibili orari
                let listaOrari = f.generaListaOrariDisponibili(result_dati.recordsets[0][0], result_s.recordsets[0][0], result_o);

                return res.status(200).json({ messaggio: "Orari possibili per il servizio richiesto: ", dati: listaOrari });
            }
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il calcolo degli orari possibili. errore:" + error, ex: error, stato: 500 });
        }
    })()
});

/**[nuova-agenda - API post]
 * Questa API permette di inserire una nuova agenda associata ad un client passato
 * inoltre utilizza le trasanzioni per annullare tutte le modifiche in caso di errore, che porti ad uno stato non coerente del db
 */
router.post('/nuova-agenda', (req, res) => {
    (async () => {
        try {
            let flagReturn = false;
            let { nome_agenda, descrizione, foto, orario_inizio, orario_fine, pause, giorno } = req.body;

            // estraggo i dati dal token di sessione
            const token_jwt = req.cookies.token;
            const token_jwt_decodificato = f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);

            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            let request = pool.request();

            // inizializzo la transaction per gestire commit/rollback
            transaction = new sql.Transaction(pool);
            await transaction.begin();
            request = new sql.Request(transaction);

            // inserisco nel buffer input i parametri fissi dal body
            request.input('id_client', sql.Int, token_jwt_decodificato.id_client);
            request.input('nome_agenda', sql.VarChar(50), nome_agenda);
            request.input('descrizione', sql.VarChar(150), descrizione);
            request.input('foto', sql.VarChar(30), foto);

            try {
                // Chiudo la richiesta dopo 10 secondi, non sta generando un id univoco
                setTimeout(async () => {
                    if (!flagReturn) {
                        flagReturn = true;
                        const errore = "Il server non è riuscito ad inserire la nuova agenda. Se il problema persiste contatta l'amministratore";
                        console.log(errore);
                        await transaction.rollback();
                        return res.status(408).json({ messaggio: errore, stato: 408 });
                    }
                }, 10000);

                // id_agenda deve essere generato randomicamente, e comune a tutte le query
                let id_agenda = await f.generaID_univoco('Agende', 'id_agenda', request, sql);
                request.input('id_agenda', sql.BigInt, id_agenda);

                // step1: creo l'agenda
                const query = `INSERT INTO Agende (id_client, id_agenda, nome_agenda, descrizione, foto)
                                VALUES (@id_client, @id_agenda, @nome_agenda, @descrizione, @foto)`;
                let result = await request.query(query);

                // la API deve inserire un solo valore
                if (!result | result == undefined | result.rowsAffected != 1) {
                    await transaction.rollback();
                    return res.status(501).json({ messaggio: "Qualcosa è andato storto. Sono state inserite: " + result.rowsAffected + " righe nel db", stato: 501 });
                }

                // step2: creo le righe in tabella giorni_lavorativi
                let id_giorno_lavorativo, query_GL, result_GL, id_pausa;

                // nelle operazioni asincrone con forEach non funziona come dovrebbe, utilizzando for...of funziona correttamente
                for (const [i, x] of orario_inizio.entries()) { 
                    id_giorno_lavorativo = await f.generaID_univoco('Giorni_lavorativi', 'id_giorno_lavorativo', request, sql);

                    // inserisco nel buffer gli input numerati, ogni input deve essere univoco
                    request.input(`id_giorno_lavorativo_${i}`, sql.BigInt, id_giorno_lavorativo);
                    request.input(`orario_inizio_${i}`, sql.VarChar(5), orario_inizio[i]);
                    request.input(`orario_fine_${i}`, sql.VarChar(5), orario_fine[i]);
                    request.input(`giorno_${i}`, sql.Int, giorno[i]);

                    query_GL = `INSERT INTO Giorni_lavorativi (id_giorno_lavorativo, id_agenda, orario_inizio, orario_fine, giorno)
                                VALUES (@id_giorno_lavorativo_${i}, @id_agenda, @orario_inizio_${i}, @orario_fine_${i}, @giorno_${i})`;
                    result_GL = await request.query(query_GL);
                    if (!result_GL | result_GL == undefined | result_GL.lentgh == 0) {
                        await transaction.rollback();
                        console.log("Errore durante l'inserimento della lista dei giorni lavorativi. Elemento non inserito!");
                    }

                    // per ogni giorno lavorato inserisco le rispettive pause
                    // pausa ha formatto: ["13:00 - 14:00;16:00 - 16:15", "18:00 - 19:00"] -> lista di stringhe
                    // creo n righe sulla base dei ; associati alla stessa agenda
                    let pause_ = pause[i].toString().split(';');

                    // ogni range pausa lo divido in inizio e fine e creo la riga
                    for (const [j, range] of pause_.entries()) {
                        let tempo = range.toString().split('-');

                        if (tempo != null & tempo != undefined & !tempo) {
                            // inserisco nel buffer gli input numerati, ogni input deve essere univoco rispetto a i e j
                            id_pausa = await f.generaID_univoco('Pause', 'id_pausa', request, sql);
                            request.input(`id_pausa_${i}_${j}`, sql.BigInt, id_pausa);
                            request.input(`orario_inizio_pausa_${i}_${j}`, sql.VarChar(5), tempo[0].trim());
                            request.input(`orario_fine_pausa_${i}_${j}`, sql.VarChar(5), tempo[1].trim());

                            // inserisco le pause
                            query_P = `INSERT INTO Pause (id_pausa, id_giorno_lavorativo, orario_inizio_pausa, orario_fine_pausa)
                                        VALUES (@id_pausa_${i}_${j}, @id_giorno_lavorativo_${i}, @orario_inizio_pausa_${i}_${j}, @orario_fine_pausa_${i}_${j})`;
                            result_P = await request.query(query_P);
                            if (!result_P | result_P == undefined | result_P.lentgh == 0) {
                                await transaction.rollback();
                                console.log("Errore durante l'inserimento della lista Pause. Elemento non inserito!");
                            }
                        }
                    }
                }
                
                // in caso di sucesso, faccio la commit e salvo le modifiche
                await transaction.commit();
                
                flagReturn = true;
                return res.status(200).json({ messaggio: "Agenda inserita correttamente", stato: 200 });
            }
            catch (errore) {
                await transaction.rollback();
                console.error("Transazione fallita. Eseguito il rollback. Dettagli errore:", errore.message);
                return res.status(505).json({ messaggio: "Una o più query sono fallite, modifiche annullate:" + errore, ex: errore, stato: 505 });
            }
        }
        catch (errore) { return res.status(500).json({ messaggio: "Errore durante l'inserimento della agenda:" + errore, ex: errore, stato: 500 }); }
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
            const path = req.headers.path;

            const query = `SELECT id_agenda, nome_agenda, descrizione, foto
                        FROM Agende a
                        LEFT JOIN(select id_client, path from Client) c ON a.id_client = c.id_client
                        WHERE c.path = @path`;

            request.input('path', sql.NVarChar, path);
            
            let result = await request.query(query);

            if (result.rowsAffected = 0)
                return res.status(404).json({ messaggio: "La lista delle agende è vuota", stato: 404});

            return res.status(200).json({ messaggio: "Agende recuperati dal server", dati: result, stato: 200});
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il recupero della lista delle agende. errore:" + error, ex: error });
        }
    })()
});

module.exports = router;