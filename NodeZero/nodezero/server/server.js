const express = require('express');
const cors = require('cors');
const app = express();
const f = require('./functions');
const bodyParser = require('body-parser');


try {
    // API
    const serviziRoutes = require('./API/servizi');
    const clientsRoutes = require('./API/clients');

    app.use(cors());
    app.use(bodyParser.json());

    app.use('/API', serviziRoutes); //API - Gestione dei servizi
    app.use('/API', clientsRoutes); //API - Gestione dei clients
}
catch (error) {
    console.log("Errore durante il routing delle API, eccezione: " + error);
}

app.listen(f.getFileVariabiliJSON().PORTA, () => { console.log("server in ascolto sulla porta: " + f.getFileVariabiliJSON().PORTA); });