import React, { useState } from 'react';

// stili
import './css_componenti/input_naviga.css';

function Input_naviga({ items }) {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const gestiscoCambiamentoInput = (event) => {
        const value = event.target.value;
        setInputValue(value);
        
        if (value.length > 0) {
            // filtro le aziende in base al valore dell'input
            const filteredSuggestions = items.filter((azienda_) => azienda_.azienda.toLowerCase().includes(value.toLowerCase()));
            setSuggestions(filteredSuggestions);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const gestiscoClickSuggerimenti = (suggestion) => {
        setInputValue(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        // creo il path per gestire il redirect
        window.location.href = '/'+ suggestion;
    };    

    return (
        <div>
            <div style={{ position: 'relative' }}>
                <input type="text" value={inputValue} onChange={gestiscoCambiamentoInput} placeholder="Scegli la struttura..." className="campo-selezione" />
                {showSuggestions && suggestions.length > 0 && (
                    <ul className="lista-suggerimenti">
                        {suggestions.map((suggestion) => (
                            <li key={suggestion.path} onClick={() => gestiscoClickSuggerimenti(suggestion.path)} className="suggerimento">
                                {suggestion.azienda}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}

export default Input_naviga;