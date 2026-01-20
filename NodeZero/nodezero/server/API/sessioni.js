// API - Gestione servizi
const express = require('express');
const sql = require('mssql');
const router = express.Router();
const f = require('../functions');
const jwt = require('jsonwebtoken');
let pool = null;


/**[verifico-token-sessione - API post]
 * verifico se il token JWT è abilitato e cotrrettamente settato*/
router.post('/verifico-token-sessione', (req, res) => {
    (async () => {
        try {
            const token = req.cookies.token;

            if (!token) {
                return res.json({ messaggio: "Nessun token presente", stato: 401});
            }

            try {
                const decoded = jwt.verify(token, f.getFileVariabiliJSON().JWT_SECRET_KEY);
                return res.status(200).json({ messaggio: decoded.path, stato: 200 });
            } catch (err) {
                res.json({ stato: 401 });
            }
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Qualcosa è andato strto durante la validazione del token. errore:" + error, ex: error, stato: 500 });
        }
    })()
});

/**[logout-client - API post]
 * Effetuo il logout dalla sessione corrente*/
router.post('/logout-client', (req, res) => {
    (async () => {
        try {
            // Pulisco il token, causando il logout
            res.clearCookie('token', {
                httpOnly: true,
                secure: true,
                sameSite: 'Lax'
            });

            return res.status(200).json({ messaggio: "Logout effetuato con sucesso!", stato: 200 });
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il logout del client. errore:" + error, ex: error, stato: 500 });
        }
    })()
});

/**[login-client - API post]
 * Passati nel body email e password verifico una corrispondenza
 * in caso di riscontro creo un JWT e lo restituisco al client*/
router.post('/login-client', (req, res) => {
    (async () => {
        try {
            const { email, password } = req.body;
            
            pool = await sql.connect(f.getFileVariabiliJSON().CONNECTION_STRING);
            const request = pool.request();

            const query = `SELECT id_client, path
                            FROM Client
                            WHERE email=@email AND password=@password`;

            request.input('email', sql.VarChar(30), email);
            request.input('password', sql.VarChar(sql.max), password);
            let result = await request.query(query);

            // se il conteggio è diverso da 1 restituisco l'errore altrimenti trovato
            if (!result.recordsets[0][0])
                return res.json({ messaggio: "Credenziali errate riprova!", stato: 404 });
            else {
                // Creo il token di sessione JWT
                const token = jwt.sign(
                    {
                        id_client: result.recordsets[0][0].id_client,
                        path: result.recordsets[0][0].path
                    },
                    f.getFileVariabiliJSON().JWT_SECRET_KEY,
                    { expiresIn: '720h' } // 30gg
                );

                res.cookie('token', token, {
                    httpOnly: true,
                    secure: true,
                    sameSite: 'Lax',   // Ibrido 
                    maxAge: 2592000000 // 30gg
                });


                //estraggo il token
                //const token_jwt = req.cookies.token;
                //f.estraiJWT(res, token_jwt, f.getFileVariabiliJSON().JWT_SECRET_KEY);
                
                return res.status(200).json({ messaggio: result.recordsets[0][0].path, stato: 200 });
            }
                
        }
        catch (error) {
            console.log("exception: " + error);
            return res.status(500).json({ messaggio: "Errore durante il login del client. errore:" + error, ex: error, stato: 500 });
        }
    })()
});

module.exports = router;