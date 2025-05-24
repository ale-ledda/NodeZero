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

function toastSuccesso1(msg) {
    try {
        toast.success("aa", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
            transition: "Slide"
        });
    }
    catch (error) {
        console.log(error);
    } 
};

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

const functions = {
    toastSuccesso: toastSuccesso,
    toastInformativo: toastInformativo,
    toastAttenzione: toastAttenzione,
    toastErrore: toastErrore,
    toastSuccesso1: toastSuccesso1,
    toastCaricamento: toastCaricamento,
};

export default functions;