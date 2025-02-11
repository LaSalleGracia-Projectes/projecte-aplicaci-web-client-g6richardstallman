import React, { useState } from 'react';
import '..styles/Reset.css';

function Header() {
    return (
        <header className='headerBox'>
            <div className='logoBox'>
                <img src='' alt='Logo' />
            </div>
            <div className='searchBox'>
                <div>
                    <span>🔍</span>
                    <input type='text' placeholder='Buscar evento...' />
                </div>
                <div>
                    <span>📍</span>
                    <input type='text' placeholder='Buscar ciudad...' />
                </div>
                <button type='submit'><span></span></button>
            </div>
        </header>
    );
}

export default Header;