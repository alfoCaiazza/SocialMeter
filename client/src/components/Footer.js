import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const as = [
        { to: '/filtered_posts', label: 'Filtra Post' },
        { to: '/hot_topics_category', label: 'Temi Caldi' },
        { to: '/trends_category', label: 'Tendenze' },
        { to: '/matrix_profile', label: 'Evoluzione Interazioni' },
      ];
    const logo = require('./images/Black.png');
  

  return (
    <footer id="footer">
        <div class="footer-top">
            <div class="container">
                <div class="row">
                    <div class="col-lg-3 col-md-6 footer-contact">
                        <h3>SocialMeter</h3>
                    </div>

                    <div class="col-lg-3 col-md-6 footer-links">
                        <h4>Link</h4>
                        <ul>
                        <li><i class="bx bx-chevron-right"></i> <Link to="/">Home</Link></li>
                        <li><i class="bx bx-chevron-right"></i> <Link to="/">About us</Link></li>
                        <li><i class="bx bx-chevron-right"></i> <Link to="/features">Features</Link></li>
                        <li><i class="bx bx-chevron-right"></i> <Link to="/results">Risultati</Link></li>
                        </ul>
                    </div>

                    <div class="col-lg-3 col-md-6 footer-links">
                        <h4>Features</h4>
                        <ul>
                        <li><i class="bx bx-chevron-right"></i> <Link to="/filtered_posts_category">Filtra Post</Link></li>
                        <li><i class="bx bx-chevron-right"></i> <Link to="/hot_topics_category">Parole Chiavi</Link></li>
                        <li><i class="bx bx-chevron-right"></i> <Link to="/trends_category">Tendenze</Link></li>
                        <li><i class="bx bx-chevron-right"></i> <Link to="/matrix_profile">Marketing</Link></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <div class="container py-4">
            <div class="copyright">
                &copy; Copyright <strong><span>SocialMeter</span></strong>. All Rights Reserved
            </div>
            <div class="credits">
                Designed by <Link to="https://bootstrapmade.com/">BootstrapMade</Link>
            </div>
        </div>
    </footer>
  );
}

export default Footer;