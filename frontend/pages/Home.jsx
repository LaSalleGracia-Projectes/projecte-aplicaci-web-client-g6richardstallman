import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header.jsx';
import Footer from '../components/Footer.jsx';

function Home() {
    return (
        <div className='homeContainer'>
            <Header />
            <Footer />
        </div>
    );
}

export default Home;