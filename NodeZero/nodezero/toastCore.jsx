import { toast, Slide } from 'react-toastify';
import Toast_conferma from '/src/assets/componenti/toast_conferma.jsx';

/** Crea un toast di conferma per dare una scelta al'utente
 * 
 * @param {any} msg - il messaggio da mostrare (es. Vuoi eliminare la risorsa?)
 * @param {any} risp_1 - la risposta cher se cliccata eseguirà l'azione
 * @param {any} risp_2 - la risposta che annullerà l'azione
 * @param {any} azione_di_conferma - azione di conferma (es. chiamata api)
 */
function confirmToast(msg, risp_1, risp_2, azione_di_conferma) {
    const body = {
        messaggio: msg,
        risposta_azione: risp_1,
        risposta_annulla: risp_2
    };

    toast(<Toast_conferma onConfirm={azione_di_conferma} body={body} />, {
        position: "top-right",
        autoClose: false, // Importante: non deve chiudersi da solo
        closeOnClick: false, // Impedisce la chiusura cliccando casualmente sul toast
        draggable: false,
        closeButton: false,
    })
};

const functions = {
    confirmToast: confirmToast
};

export default functions;