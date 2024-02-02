import React from 'react';
import { Link } from 'react-router-dom';
import illustration from './images/about-us.png'

const AboutUs = () =>{
    return(
        <section id="about" class="about" style={{marginTop:'10%', marginBottom: '10%'}}>
        <div class="container">

            <div class="row">
            <div class="col-xl-5 col-lg-6 d-flex justify-content-center video-box align-items-stretch position-relative">
                <Link to={illustration} class="glightbox play-btn mb-4"></Link>
            </div>

            <div class="col-xl-7 col-lg-6 icon-boxes d-flex flex-column align-items-stretch justify-content-center py-5 px-lg-5">
                <h3>Perchè nasce SocialMeter</h3>
                <p>SocialMeter è una web app per l'analisi dei post di Reddit, per esplorare tendenze e sentiment di discussioni controverse.<br/>Attraverso l'elaborazione di parole chiave e l'analisi dell'engagement, l'app mira a decifrare il complesso panorama delle opinioni online, offrendo agli utenti strumenti per comprendere meglio le dinamiche delle conversazioni digitali e le loro implicazioni su temi di ampio interesse.</p>

                
                <div class="icon-box">
                    <div class="icon"><i class="bx bx-atom"></i></div>
                    <h4 class="title"><Link to="/filtered_posts_category">Filtraggio dei Post</Link></h4>
                    <p class="description">Consente agli utenti di selezionare categorie di interesse e di essere reindirizzati a una pagina che elenca tutti i post pertinenti. Qui, è possibile affinare ulteriormente la ricerca filtrando per categoria, data di pubblicazione, sentiment ed emozione, facilitando la navigazione mirata attraverso il vasto contenuto delle discussioni online.</p>
                </div>

                <div class="icon-box">
                    <div class="icon"><i class="bx bx-gift"></i></div>
                    <h4 class="title"><Link to="/hot_topics_category">Comprensione delle Parole Chiavi</Link></h4>
                    <p class="description">Viene presentata una word cloud che evidenzia le parole più frequenti nei post di specifiche categorie, offrendo una visione immediata dei temi dominanti e facilitando l'identificazione delle tendenze e dei punti focali all'interno delle conversazioni online.</p>
                </div>

                <div class="icon-box">
                    <div class="icon"><i class="bx bx-fingerprint"></i></div>
                    <h4 class="title"><Link to="/trends_category">Analisi delle Tendenze</Link></h4>
                    <p class="description">Permette di visualizzare la distribuzione temporale dei post per sentiment ed emozioni nelle subreddit analizzate, offrendo una mappa dettagliata delle variazioni annuali e delle dinamiche prevalenti nelle conversazioni online.</p>
                </div>

                <div class="icon-box">
                    <div class="icon"><i class="bx bx-atom"></i></div>
                    <h4 class="title"><Link to="/matrix_profile">Studio dell'engagement</Link></h4>
                    <p class="description">Consente agli utenti di selezionare categorie e indici di analisi quali sentiment, commenti, post giornalieri e score, insieme a un intervallo temporale, per generare un line chart che illustra le variazioni dell'engagement nel periodo specificato, offrendo insight preziosi sull'evoluzione delle interazioni.</p>
                </div>
            </div>
            </div>

        </div>
        </section>
    );
}

export default AboutUs;