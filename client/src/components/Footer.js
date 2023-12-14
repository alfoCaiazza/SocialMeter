// Footer.js
import React from 'react';
import logo from './images/logo.png'

const Footer = () => {
    const as = [
        { href: '/filtered_posts', label: 'Filtra Post' },
        { href: '/hot_themes', label: 'Temi Caldi' },
        { href: '/trends', label: 'Tendenze' },
        { href: '/keywords', label: 'Parole Chiavi' },
        { href: '/shadow', label: 'Shadow' },
      ];

  return (
        <div className="container">
            <footer className="row row-cols-1 row-cols-sm-2 row-cols-md-5 py-5 my-5 border-top border-dark-subtle">
                <div className="col mb-3">
                <a href="/" className="d-flex align-items-center mb-3 a-dark text-decoration-none">
                    <svg className="bi me-2" style={{width: '40px', height: '32px'}}>
                        <use xlinkHref={logo}></use>
                    </svg>
                </a>
                <p className="text-muted">© 2023</p>
                </div>

                <div className="col mb-3">

                </div>

                <div className="col mb-3">
                <h5><a href='/' style={{textDecoration: 'None', color: 'black'}}>Home</a></h5>
                </div>

                <div className="col mb-3">
                <h5><a href='/features' style={{textDecoration: 'None', color: 'black'}}>Features</a></h5>
                <ul className="nav flex-column">
                    {as.map((a, index) => (
                        <li key={index}>
                            <a href={a.href} className="nav-link p-1 text-muted">
                                {a.label}
                            </a>
                        </li>
                    ))}
                </ul>
                </div>

                <div className="col mb-3">
                <h5><a href='/results' style={{textDecoration: 'None', color: 'black'}}>Results</a></h5>
                <ul className="nav flex-column">
                    
                </ul>
                </div>
            </footer>
        </div>
  );
}

export default Footer;