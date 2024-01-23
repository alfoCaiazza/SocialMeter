import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Card from './Card';
import img1 from './images/woman.png';
import img2 from './images/no-racism.png';
import img3 from './images/global-warming.png';

const HotTopicsCategory = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();

    const cardsData = [
        { title: "Sessismo", image: img1, category: "woman_condition"},
        { title: "Razzismo", image: img2, category: "racism"},
        { title: "Clima", image: img3, category: "climate_change" },
    ];

    const handleCardClick = (path, category) => {
        setSelectedCard(category);
        navigate(`/${path}/${category}`);
    };

    // return (
    //     <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
    //         <div  className='flex-grow-1 d-flex justify-content-center' style={{marginTop: '7%'}}>
    //             <h2>Seleziona la categoria</h2>
    //         </div>
    //         <div className='position-absolute top-50 start-50 translate-middle text-center' style={{marginTop: '5%'}}>
    //             <div className='row row-cols-3'>
    //                 {cardsData.map((card, index) => (
    //                     <Card
    //                         key={index}
    //                         title={card.title} 
    //                         image={card.image}
    //                         category={card.category}
    //                         onCardClick={() => handleCardClick("hot_topics",card.category)} 
    //                     />
    //                 ))}
    //             </div>
    //         </div>
    //         {selectedCard && <div>Card Selezionata: {selectedCard}</div>}
    //     </div>
    // );

    const links = [
        { to: '/hot_topics', label: 'Sessismo', category: 'woman_condition'},
        { to: '/hot_topics', label: 'Razzismo', category: 'racism'},
        { to: '/hot_topics', label: 'Cambiamento Climatico', category: 'climate_change'},
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

export default HotTopicsCategory;