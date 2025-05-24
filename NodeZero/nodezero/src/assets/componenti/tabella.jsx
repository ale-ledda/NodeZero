import React from 'react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { AgGridReact } from 'ag-grid-react';
// librerie
// stili
import 'bootstrap/dist/css/bootstrap.min.css';

import './css_componenti/tabella.css';

/** Crea una tabella con i dati passati, standardizzata per il software.
 * dipendenza -> ag-grid-react
 * 
 * @param dati: i dati della nostra tabella, i record devono essere passati in formatto JSON
 * @param intestazione: indica l'header della tabella, i nomi delle colonne sempre in formatto JSON
 * @returns: Una tabella composta con la libreria ag-grid-react
 */
function Tabella({ dati, intestazione}) {
    return (
        <>
            <div className='layoutTabella'>
                <AgGridReact
                    theme={themeQuartz}
                    rowData={dati}
                    columnDefs={intestazione}
                />
            </div>
        </>
    );
}
export default Tabella;