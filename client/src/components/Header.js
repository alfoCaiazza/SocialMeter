import React, {useState, useEffect} from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [showLink, setShowLink] = useState(true);
  
  // Imposta uno stato per nascondere il link quando la larghezza è inferiore a 768 pixel
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
    <header >
      <nav className="navbar navbar-expand" style={{backgroundColor: '#171717'}} >
        <div className="container">
          {showLink && (
            <Link to='/' className="navbar-brand" style={{marginLeft: '2%', color: 'white'}}>SocialMeter</Link>
          )}
          <div className="navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link to='/' className="header-link">Home</Link>
              </li>
              <li className="nav-item">
                <Link to='/features' className="header-link">Features</Link>
              </li>
              <li className="nav-item">
                <Link to='/results' className="header-link">Risultati</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
