import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
      <div className='flex-grow-1 d-flex align-items-center justify-content-center homepage-background'>
          <Link to='/features' className="zoom-on-hover display-1" style={{color: '#171717'}}><strong>Esplora le tendenze!</strong></Link>
      </div>
      <div className='container' >
        <h1>Perché nasce Unamed Webapp</h1>
        <p style={{fontSize:'20px'}}>
          Questo progetto è nato con l'obiettivo di esplorare e comprendere le dinamiche delle interazioni online attraverso l'analisi dei dati provenienti da una delle più grandi comunità virtuali al mondo: Reddit.<br/>
          Attraverso l'uso di tecniche avanzate di web scraping, questa piattaforma estrae e analizza in modo efficiente i dati da Reddit, consentendo agli utenti di accedere a informazioni preziose e insight significativi.<br/>
          <br/>Che tu sia uno studente interessato alla ricerca accademica, un professionista del settore o semplicemente un appassionato di Reddit, la nostra web app è progettata per offrirti un accesso intuitivo e utile al vasto mondo delle interazioni online.
        </p>
      </div>
    </div>
  );
}

export default HomePage;