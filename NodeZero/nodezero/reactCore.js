import { toast, Slide } from 'react-toastify';

/**
 * Serie di metodi per la gestione dei popup e i toast con la libreria toastify
 * @param {any} msg - il testo del modale
 * @returns il modale specificato con effetto di transazione comune
 */
const impostazioniComuniToast = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
};

const impostazioniToastCaricamento = {
    position: "top-right",
    autoClose: 4000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: true,
    progress: undefined,
    theme: "light",
    transition: Slide,
}

function toastSuccesso(msg) {
     return toast.success(msg, { impostazioniComuniToast });    
};

function toastInformativo(msg) {
    return toast.info(msg, { impostazioniComuniToast });
};

function toastAttenzione(msg) {
    return toast.warn(msg, { impostazioniComuniToast });
};

function toastErrore(msg) {
    return toast.error(msg, { impostazioniComuniToast });
};

function toastCaricamento(msg_caricamento) {
    let id = toast.loading(msg_caricamento);
    return [id, toast, impostazioniToastCaricamento];
};

function ottieniDataOdierna() {
    /**
     * Funzione per ottenere la data odierna in formato YYYY-MM-DD
     */
    const today = new Date();
    return today.toISOString().slice(0, 10);
};

function gestiscoRispostaAPI(r) {
    /**
     * Passato un oggetto interpreto lo stato e sulla base di quello che viene restituito, mostro un pop-up piuttosto che un altro
     */
    const s = r.stato; // contiene lo stato di ritorno dalla API
    let flag = false;

    if (flag == false) {
        flag = true;

        switch (true) {
            case (s == 200 || s == 201): // sucesso
                {
                    toastSuccesso(r.messaggio);
                    break;
                }
            case (s == 404 || s == 500): // errore
                {
                    toastErrore(r.messaggio);
                    break;
                }
            default:
                {
                    toastInformativo("Stato non registrato contattare l'amministratore"); // alert
                    break;
                }
        }
    }
};


const functions = {
    toastSuccesso: toastSuccesso,
    toastInformativo: toastInformativo,
    toastAttenzione: toastAttenzione,
    toastErrore: toastErrore,
    gestiscoRispostaAPI: gestiscoRispostaAPI,
    toastCaricamento: toastCaricamento,
    ottieniDataOdierna: ottieniDataOdierna
};

export default functions;