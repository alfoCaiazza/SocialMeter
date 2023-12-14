import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
      <div className='flex-grow-1 d-flex align-items-center justify-content-center homepage-background'>
          <Link to='/features' className="zoom-on-hover display-1" style={{color: '#171717'}}><strong>Esplora le tendenze!</strong></Link>
      </div>
    </div>
  );
}

export default HomePage;

/*<p className='zoom-on-hover display-1'>Espolora le tendenze!</p>*/