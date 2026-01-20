import { toast } from 'react-toastify';

/**Apre un toast di conferma con la libreria toastify, mostrando un testo e le opzioni di scelta
 * verrà avviata l'operazione solo se 
 * 
 * @param {any} param0
 * @returns
 */
function Toast_conferma({ closeToast, onConfirm, body}) {
    return (
        <div>
            <p style={{ marginBottom: '10px', fontWeight: 'bold', font: 'sans-serif', size: '14px' }}>
                { body.messaggio } 
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => {
                        onConfirm();
                        closeToast(); // Chiude il toast dopo l'azione
                    }} style={{ background: '#FF4770', color: 'white', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}> {body.risposta_azione}</button>
                <button onClick={closeToast} style={{ background: '#eee', color: '#333', border: 'none', padding: '5px 15px', borderRadius: '4px', cursor: 'pointer' }}>
                    { body.risposta_annulla }
                </button>
            </div>
        </div>
    );
};
export default Toast_conferma;