import React from 'react';
// stili
import 'bootstrap/dist/css/bootstrap.min.css';
import './css_componenti/navbar_superiore.css';
// componenti
import { Kanban } from 'react-bootstrap-icons';

function Navbar_superiore({ children }) {
    return (
        <>
            <nav className="navbar navbar-light bg-light">
                <a className="navbar-brand" href="/">
                    <div className='logo-container'>
                        <Kanban className='icon-logo-node-zero' />Node Zero
                    </div>                       
                </a>
            </nav>
            <main>{children}</main>
        </>
    );
}
export default Navbar_superiore;