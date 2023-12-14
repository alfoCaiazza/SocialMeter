import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const links = [
    { to: '/filtered_posts', label: 'Filtra Post' },
    { to: '/hot_themes', label: 'Temi Caldi' },
    { to: '/trends', label: 'Tendenze' },
    { to: '/keywords', label: 'Parole Chiavi' },
    { to: '/shadow', label: 'Shadow' },
  ];

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
      <div className="text-center mt-5">
        <h2 className='display-4' style={{marginTop: '7%', color: '#171717'}}><strong>Features</strong></h2>
        <ul className="list-unstyled" style={{marginTop: '2%'}}>
          {links.map((link, index) => (
            <li key={index} style={{marginBottom: '1%'}}>
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
