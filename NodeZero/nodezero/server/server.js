const express = require('express');
const cors = require('cors');
const app = express();
const f = require('./functions');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

try {
    // API
    const serviziRoutes = require('./API/servizi');
    const clientsRoutes = require('./API/clients');
    const agendeRoutes = require('./API/agende');
    const sessioniRoutes = require('./API/sessioni');

    //app.use(cors());
    app.use(cors({
        origin: f.getFileVariabiliJSON().URL,
        credentials: true // Permette l'invio dei cookie tra domini diversi
    }));

    app.use(bodyParser.json());
    app.use(cookieParser());

    

    app.use('/API', serviziRoutes); //API - Gestione dei servizi
    app.use('/API', clientsRoutes); //API - Gestione dei clients
    app.use('/API', agendeRoutes); //API - Gestione delle agende
    app.use('/API', sessioniRoutes); //API - Gestione delle sessioni e login
}
catch (error) {
    console.log("Errore durante il routing delle API, eccezione: " + error);
}

app.listen(f.getFileVariabiliJSON().PORTA, () => { console.log("server in ascolto sulla porta: " + f.getFileVariabiliJSON().PORTA); });