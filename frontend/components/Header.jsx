//import React from 'react';
import { Link } from 'react-router-dom';
import { FaSearch, FaMapMarkerAlt, FaHeart, FaTicketAlt, FaUser } from 'react-icons/fa';
import '../styles/Reset.css';
import '../styles/Header.css';

function Header() {
    return (
        <header className="header">
            <div className="header__left">
                <Link to="/" className="header__logo"></Link>
            </div>
            <div className="header__center">
                <div className="search-container">
                    <div className="search-input">
                        <FaSearch className="icon" />
                        <input type="search" placeholder="Buscar eventos" autoComplete="off" />
                    </div>
                    <div className="divider"></div>
                    <div className="search-input">
                        <FaMapMarkerAlt className="icon" />
                        <input type="search" placeholder="Ciudad" autoComplete="off" />
                    </div>
                    <button className="search-button">
                        <FaSearch />
                    </button>
                </div>
            </div>
            <div className="header__right">
                <div className="navigateIcons">
                    <Link to="/favoritos" className="header__button">
                        <FaHeart className="heartIcon" />
                        <span>Favoritos</span>
                    </Link>
                    <Link to="/tickets" className="header__button">
                        <FaTicketAlt />
                        <span>Tickets</span>
                    </Link>
                </div>
                <Link to="/perfil" className="header__button">
                    <FaUser className="userIcon" />
                    <span>Perfil</span>
                </Link>
            </div>
        </header>
    );
}

export default Header;
