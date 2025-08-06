const fs = require('fs');
const { Time } = require('mssql');
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
 * questo valore pu� essere usato come identificativo del record
 * @returns Un valore numerico di tipo bigint non superiore alle 19 cifre
 */
function generaID(dim = 7) {
    const buffer = Buffer.alloc(dim);
    crypto.getRandomValues(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));

    let bigIntValue = BigInt(0);
    for (let i = 0; i < dim; i++) {
        bigIntValue = (bigIntValue << BigInt(dim)) | BigInt(buffer[i]);
    }

    return String(bigIntValue).slice(0, 19);
}

function generaListaOrariDisponibili(datiAgenda, datiServizio, datiPrenotazioni) {
    /**
     * Passati i tre parametri che contengono i dati utili al calcolo
     * creo e restituisco una lista di valori contenente gli orari possibili per la prenotazione richiesta gestendo
     * le prenotazioni gi� effetuate.
     * 
     * datiAgenda: contiene i dati della agenda (orario_inizio, orario_fine e orari_pausa)
     * datiServizio: contiene i dati del servizio (durata) 
     * datiPrenotazioni: contiene i dati delle prenotazioni gi� effetuate*/

    // parto dall'ora di apertura della agenda e cro una lista di orari, ad intervalli di x minuti (in base al servizio attuale), fino all'orario di chiusura
    let orariDisponibili = [];

    // estraggo dal db l'ora di inizio appuntamenti per l'agenda
    let ora_ = datiAgenda.ora_inizio.toString().split(':');
    let ora = new Date(0, 0, 0, ora_[0], ora_[1]);
    //estraggo dal db l'ora di fine appuntamenti per l'agenda
    let ora_fine_ = datiAgenda.ora_fine.toString().split(':');
    let ora_fine = new Date(0, 0, 0, ora_fine_[0], ora_fine_[1]);

    // creo la lista di possibili appuntamenti per questa agenda
    for (ora; ora < ora_fine; ora.setMinutes(ora.getMinutes() + datiServizio.durata)) {
        // per ogni intervallo dato dal calcolo del servizio, lo iserisco nella lista con cast a hh:mm
        orariDisponibili.push(conversioneHHmm(ora));
    }

    // ottengo la lista in formatto hh:mm degli orari da escludere (pause)
    let listaOrariPausa = datiAgenda.orari_pausa.toString().split(';');

    // per ogni elemento della lista listaOrariPausa scorro e mi creo una data di inizio e di fine
    listaOrariPausa.forEach((orario) => {
        // gestisco i range
        let rangePausa = orario.toString().split('-');
        // ottengo il perimetro della pausa
        ora_ = rangePausa[0].toString().split(':');
        ora = new Date(0, 0, 0, ora_[0], ora_[1]);
        ora_fine_ = rangePausa[1].toString().split(':');
        ora_fine = new Date(0, 0, 0, ora_fine_[0], ora_fine_[1]);

        // converto inizio e fine in hh:mm
        ora = conversioneHHmm(ora);
        ora_fine = conversioneHHmm(ora_fine);

        // restituisco solo gli orari disponibili escludendo quelli rpesenti nelle pause
        orariDisponibili = orariDisponibili.filter((target) => !((target >= ora & target < ora_fine) | gestioneCollisioni(target, datiServizio.durata, ora, ora_fine)));
    });

    // confronto gli orari disponibili fin ora con le prenotazioni gi� effettuate
    if (datiPrenotazioni && datiPrenotazioni.length > 0) {
        // scorro le prenotazioni gi� effettuate
        datiPrenotazioni.forEach((prenotazione) => {
            prenotazione.forEach((prenotazione_) => {
                // prendo l'orario della prenotazione e lo converto in hh:mm
                let orarioPrenotazione = new Date(prenotazione_.inizio_prestazione_tm);
                // utilizzo un orario utc per evitare problemi di fuso orario
                orarioPrenotazione = convertoUTC(orarioPrenotazione);
                let orarioFine = new Date(prenotazione_.inizio_prestazione_tm);
                orarioFine = convertoUTC(orarioFine);

                orarioFine = orarioFine.setMinutes(orarioFine.getMinutes() + prenotazione_.durata);

                orarioFine = new Date(orarioFine);

                orarioFine = conversioneHHmm(orarioFine);
                orarioPrenotazione = conversioneHHmm(orarioPrenotazione);

                // se l'orario della prenotazione � presente nella lista degli orari disponibili, lo rimuovo
                orariDisponibili = orariDisponibili.filter((target) => !((target >= orarioPrenotazione & target < orarioFine) | gestioneCollisioni(target, prenotazione_.durata, orarioPrenotazione, orarioFine)));
            });
        });
    }

    return orariDisponibili;
}

function conversioneHHmm(tempo) {
    /**
     * Converte un oggetto Date in una stringa di tipo hh:mm
     * tempo: oggetto Date esteso da convertire
     * returns: stringa di tipo hh:mm (time)
     */
    return tempo = tempo.toLocaleTimeString('it-IT', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

function convertoUTC(tempo) {
    /**
     * Converte un oggetto Date in un oggetto Date con orario UTC
     * tempo: oggetto Date esteso da convertire
     * returns: oggetto Date con orario UTC, senza fuso orario applicato
     */
    tempo.setMinutes(tempo.getUTCMinutes());
    tempo.setHours(tempo.getUTCHours());

    return tempo;
}

function gestioneCollisioni(orario, durata, ora_inizio, ora_fine) {
    /**
     * Gestisce le collisioni tra orari, ogni orario non deve nadare in conflitto con l'orario di inizio di un altra prenotazione o pausa
     * orario: stringa di tipo hh:mm da gestire
     * returns: true se l'orario � disponibile, false altrimenti
     */
    let orario_ = new Date(2000, 10, 10, orario.toString().split(':')[0], orario.toString().split(':')[1], 0);

    orario_ = orario_.setMinutes(orario_.getMinutes() + durata);
    orario_ = new Date(orario_);
    orario_ = conversioneHHmm(orario_);

    if ((orario_ > ora_inizio) & (orario_ < ora_fine))
        return true;
    else
        return false;
};

const functions = {
    getFileVariabiliJSON: getFileVariabiliJSON,
    generaID_univoco: generaID_univoco,
    generaListaOrariDisponibili: generaListaOrariDisponibili,
};

module.exports = functions;