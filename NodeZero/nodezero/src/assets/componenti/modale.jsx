import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

/**
 * Istanzio un componente che rappresenta una finestra modale
 * @param {any} props.modale il modale
 * @param {any} props.solo_corpo booleano che dice se mostrare solo il body oppure anche footer e header (usato per gestire le differenze tra modali classici e menu)
 * @returns un modale come richiesto
 */
function Modale(props) {
    const modale = props.modale;
    const solo_corpo = props.solo_corpo;

    return (
        <Modal
            {...props}
            key={modale.key}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            {solo_corpo == 'false' &&
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        <h4>{modale.titolo}</h4>
                    </Modal.Title>
                </Modal.Header>
            }
            <Modal.Body>
                <h6>{modale.sottoTitolo}</h6>
                    {modale.corpo}
            </Modal.Body>
            {solo_corpo == 'false' &&
                <Modal.Footer>
                    <Button className="btn btn-light" onClick={props.onHide}>Chiudi</Button>
                    {modale.azioni}
                </Modal.Footer>
            }
        </Modal>
    );
}
export default Modale;