import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from './images/logo_chatGPT.png';

const Header = () => {
  const [showLink, setShowLink] = useState(true);

  // Imposta uno stato per nascondere il link quando la larghezza è inferiore Link 768 pixel
  useEffect(() => {
    const handleResize = () => {
      setShowLink(window.innerWidth > 768);
    };

    // Aggiunge un listener per rilevare i cambiamenti di dimensioni della finestra
    window.addEventListener('resize', handleResize);

    // Esegui la funzione di cleanup quando il componente si smonta
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header id="header" className="fixed-top">
      <div className="container d-flex align-items-center justify-content-between">
        {/* <Link to="/" className="logo"><img src={logo} alt="" className="img-fluid"/></Link>  */}
        <h1 className="logo"><Link to="/">SocialMeter</Link></h1>
        <nav id="navbar" className="navbar">
          <ul>
            <li><Link className="nav-link scrollto" to="/">Home</Link></li>
            <li><Link className="nav-link scrollto" to="/about_us">About</Link></li>
            <li className="dropdown"><Link to="/features"><span>Feaures</span><i className="bi bi-chevron-down"></i></Link>
              <ul>
                <li><Link to="/filtered_posts_category">Filtra Post</Link></li>
                <li><Link to="/hot_topics_category">Parole Chiavi</Link></li>
                <li><Link to="/trends_category">Tendenze</Link></li>
                <li><Link to="/matrix_profile">Evoluzione Interazioni</Link></li>
              </ul>
            </li>
            <li><Link className="nav-link scrollto" to="/results">Ristultati</Link></li>
          </ul>
          <i className="bi bi-list mobile-nav-toggle"></i>
        </nav>
      </div>
    </header>
  );
}

export default Header;
