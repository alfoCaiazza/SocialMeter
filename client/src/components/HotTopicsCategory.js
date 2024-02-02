import React from 'react';
import { Link } from 'react-router-dom';

const HotTopicsCategory = () => {
  const links = [
    { to: '/hot_topics', label: 'Sessismo', category: 'woman_condition', icon: 'bi-gender-ambiguous'},
    { to: '/hot_topics', label: 'Razzismo', category: 'racism',  icon: 'bi bi-people-fill'},
    { to: '/hot_topics', label: 'Cambiamento Climatico', category: 'climate_change',icon: 'bi bi-thermometer-sun'},
  ];

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0 '>
      <div className="text-center position-absolute top-50 start-50 translate-middle mt-5 features-background">
        <h2 className='display-4' style={{marginTop: '7%', color: '#171717'}}><strong>Parole Chiavi</strong></h2>
        <div>
          <ul className="list-unstyled" style={{marginTop: '5%'}}>
            {links.map((link, index) => (
              <li key={index} style={{marginBottom: '5%'}}>
                <Link to={link.to + '/' + link.category} className="my-link">
                  <i className={`bi ${link.icon} me-2`}></i> {/* Aggiunta icona Bootstrap */}
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default HotTopicsCategory;