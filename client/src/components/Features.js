import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const links = [
    { to: '/filtered_posts', label: 'Sentiment Analysis' },
    { to: '/hot_themes', label: 'Temi Caldi' },
    { to: '/trends', label: 'Tendenze' },
    { to: '/keywords', label: 'Parole Chiavi' },
    { to: '/shadow', label: 'Shadow (Analisi di Reti)' },
  ];

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0 features-background'>
      <div className="text-center position-absolute top-50 start-50 translate-middle mt-5">
        <h2 className='display-4' style={{marginTop: '7%', color: '#171717'}}><strong>Features</strong></h2>
        <ul className="list-unstyled" style={{marginTop: '5%'}}>
          {links.map((link, index) => (
            <li key={index} style={{marginBottom: '5%'}}>
              <Link to={link.to} className="my-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default HomePage;
