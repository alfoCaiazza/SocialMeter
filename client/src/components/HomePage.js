import React from 'react';
import { Link } from 'react-router-dom';
import hero from './images/homepage.gif'
const HomePage = () => {
  return (
      <section id="hero" class="d-flex align-items-center" style={{marginBottom: '10%'}}>
        <div class="container" style={{marginTop: '10%'}}>
          <div class="row">
            <div class="col-lg-6 pt-4 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center">
              <h1>Recupera gli insight dai post di Reddit</h1>
              <h2>
                Attraverso algoritmi avanzati di analisi del linguaggio naturale, la nostra applicazione scava nel cuore delle conversazioni, identificando e analizzando le emozioni espresse dagli utenti in vari post e commenti di Reddit.
                <br/><br/>
                Con la nostra web app, avrai a disposizione uno strumento potente per navigare attraverso un oceano di dati, trasformando complesse dinamiche sociali in comprensibili metriche visive e analitiche.
              </h2>
              <div><Link to="/features" class="btn-get-started scrollto">Inizia l'Analisi</Link></div>
            </div>
            <div class="col-lg-6 order-1 order-lg-2 hero-img">
              <img src={hero} class="img-fluid" alt=""/>
            </div>
          </div>
        </div>
      </section>
  );
}

export default HomePage;