import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  const [showLink, setShowLink] = useState(true);

  // Use a state to hide the link when the width of the window is less then 768 pixel
  useEffect(() => {
    const handleResize = () => {
      setShowLink(window.innerWidth > 768);
    };

    //Add a listener to detect changes in window dimensions
    window.addEventListener('resize', handleResize);

    // Exec cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header id="header" className="fixed-top">
      <div className="container d-flex align-items-center justify-content-between">
        <h1 className="logo"><Link to="/">SocialMeter</Link></h1>
        <nav id="navbar" className="navbar">
          <ul>
            <li><Link className="nav-link scrollto" to="/">Home</Link></li>
            <li className="dropdown"><Link to="/features"><span>Features</span><i className="bi bi-chevron-down"></i></Link>
              <ul>
                <li><Link to="/filtered_posts_category">Esplora Post</Link></li>
                <li><Link to="/hot_topics_category">Parole Chiavi</Link></li>
                <li><Link to="/trends_category">Tendenze</Link></li>
                <li><Link to="/matrix_profile">Engagement</Link></li>
              </ul>
            </li>
            <li><Link className="nav-link scrollto" to="/about_us">About Us</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
