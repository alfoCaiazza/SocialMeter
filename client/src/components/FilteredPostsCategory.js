import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const FilteredPostsCategory = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();

    const cardsData = [
        { title: "Sessismo", category: "woman_condition"},
        { title: "Razzismo", category: "racism"},
        { title: "Clima", category: "climate_change" },
    ];

    const handleCardClick = (path, category) => {
        setSelectedCard(category);
        navigate(`/${path}/${category}`);
    };

    const links = [
        { to: '/filtered_posts', label: 'Sessismo', category: 'woman_condition'},
        { to: '/filtered_posts', label: 'Razzismo', category: 'racism'},
        { to: '/filtered_posts', label: 'Cambiamento Climatico', category: 'climate_change'},
      ];
    
      return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0 '>
          <div className="text-center position-absolute top-50 start-50 translate-middle mt-5 features-background">
            <h2 className='display-4' style={{marginTop: '7%', color: '#171717'}}><strong>Categorie</strong></h2>
            <div>
              <ul className="list-unstyled" style={{marginTop: '5%'}}>
                {links.map((link, index) => (
                  <li key={index} style={{marginBottom: '5%'}}>
                    <Link to={link.to + '/' + link.category} className="my-link">
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

export default FilteredPostsCategory;