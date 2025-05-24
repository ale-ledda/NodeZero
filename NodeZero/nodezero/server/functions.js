const fs = require('fs');
const path = require('path');
//const toastify = require('react-toastify');

// VARIABILI
let id = null;


/**
 * Restituisce il file variabili.json sottoforma di oggetto JSON
 * il file contiene le variabili di ambiente
 * @returns oggetto JSON con le variabili di ambiente
 */
function getFileVariabiliJSON() {
    const jsonDataAsString = fs.readFileSync(path.dirname(__dirname) + "/variabili.json", 'utf8');
    return JSON.parse(jsonDataAsString);
}

/**
 * Utilizzo generaID per generare un id univoco nella tabella passata come parametro (params: tabella)
 * @params tabella: nome della tabella in cui voglio generare un id univoco
 * @params campo_id: nome del campo in cui voglio generare un id univoco
 * @params request: oggetto di tipo sql.Request della API padre
 * @params sql: oggetto di tipo sql della API padre
 * @returns un numero univoco di tipo bigint univoco nella tabella passata come parametro
 */
async function generaID_univoco(tabella, campo_id, request, sql) {
    id = generaID();

    const query_univoco = `SELECT * FROM ${tabella} where ${campo_id} = ${id}`;
    let r_query_univoco = await request.query(query_univoco);

    if (r_query_univoco.rowsAffected != 0) {
        id = null;
        console.log("Generato numero non univoco, riprovo.");
        await generaID_univoco(tabella, campo_id, request, sql);
    }
    return id;
}

/** -- PRIVATO --
 * Genero un valore di tipo bigint, mi assicuro non superi le 19 cifre
 * questo valore può essere usato come identificativo del record
 * @returns Un valore numerico di tipo bigint non superiore alle 19 cifre
 */
function generaID(dim = 8) {
    const buffer = Buffer.alloc(dim);
    crypto.getRandomValues(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));

    let bigIntValue = BigInt(0);
    for (let i = 0; i < dim; i++) {
        bigIntValue = (bigIntValue << BigInt(dim)) | BigInt(buffer[i]);
    }

    return String(bigIntValue).slice(0, 19);
}


const functions = {
    getFileVariabiliJSON: getFileVariabiliJSON,
    generaID_univoco: generaID_univoco,
};

module.exports = functions;