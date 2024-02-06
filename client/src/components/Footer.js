import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer id="footer">
            <div className="footer-top">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-3 col-md-6 footer-contact">
                            <h3>SocialMeter</h3>
                        </div>

                        <div className="col-lg-3 col-md-6 footer-links">
                            <h4>Link</h4>
                            <ul>
                            <li><i className="bx bx-chevron-right"></i> <Link to="/">Home</Link></li>
                            <li><i className="bx bx-chevron-right"></i> <Link to="/about_us">About us</Link></li>
                            <li><i className="bx bx-chevron-right"></i> <Link to="/features">Features</Link></li>
                            </ul>
                        </div>

                        <div className="col-lg-3 col-md-6 footer-links">
                            <h4>Features</h4>
                            <ul>
                            <li><i className="bx bx-chevron-right"></i> <Link to="/filtered_posts_category">Esplora Post</Link></li>
                            <li><i className="bx bx-chevron-right"></i> <Link to="/hot_topics_category">Parole Chiavi</Link></li>
                            <li><i className="bx bx-chevron-right"></i> <Link to="/trends_category">Tendenze</Link></li>
                            <li><i className="bx bx-chevron-right"></i> <Link to="/engagement_profile">Engagement</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                <div className="copyright">
                    &copy; Copyright <strong><span>SocialMeter</span></strong>. All Rights Reserved
                </div>
                <div className="credits">
                    Designed by <Link to="https://bootstrapmade.com/">BootstrapMade</Link>
                </div>
            </div>
        </footer>
    );
}

export default Footer;