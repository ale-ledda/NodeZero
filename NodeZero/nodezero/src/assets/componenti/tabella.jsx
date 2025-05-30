import React, { useRef, useCallback } from 'react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
// librerie
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './css_componenti/tabella.css';
// componenti
import _azioni_servizio from '../pagine/modali/_azioni_servizio';

/** Crea una tabella con i dati passati, standardizzata per il software.
 * dipendenza -> ag-grid-react
 * 
 * @param dati: i dati della nostra tabella, i record devono essere passati in formatto JSON
 * @param intestazione: indica l'header della tabella, i nomi delle colonne sempre in formatto JSON
 * @param contesto: il contesto in cui si trova la tabella, utile per gestire le azioni al click della riga
 * @returns: Una tabella composta con la libreria ag-grid-react
 */
function Tabella({ dati, intestazione, contesto }) {
    const gridRef = useRef();
    const [modalShowAzioniServizio, setModalShowAzioniServizio] = React.useState(false);

    const onRowClicked = useCallback((event) => {
        switch (contesto){
            case "azioniServizio": {
                setModalShowAzioniServizio(true); // TODO: Gestire le operazioni e API attraverso l'id_servizio univoco -> event.data.id_servizio
            }
        }
    }, []);

    const updateParentState = (newValue) => {
        switch (contesto) {
            case "azioniServizio": {
                setModalShowAzioniServizio(newValue);
            }
        }
    };

    return (
        <>
            <div className='layoutTabella'>
                <AgGridReact
                    ref={gridRef}
                    theme={themeQuartz}
                    rowData={dati}
                    columnDefs={intestazione}
                    onRowClicked={onRowClicked}
                />
            </div>
            {/*Lista di componenti per la gestione dei modali*/}
            <_azioni_servizio updated={updateParentState} show={modalShowAzioniServizio} />
        </>
    );
}
export default Tabella;