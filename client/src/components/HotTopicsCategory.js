import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import img1 from './images/woman.png';
import img2 from './images/no-racism.png';
import img3 from './images/global-warming.png';
import img4 from './images/fake-news.png';

const HotTopicsCategory = () => {
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();

    const cardsData = [
        { title: "Sessismo", image: img1, category: "woman_condition"},
        { title: "Razzismo", image: img2, category: "racism"},
        { title: "Crisi Climatica", image: img3, category: "climate_change" },
        { title: "Complottismo", image: img4, category: "conspiracy" },
        // Aggiungi più oggetti qui per più card
    ];

    const handleCardClick = (path, category) => {
        setSelectedCard(category);
        navigate(`/${path}/${category}`);
    };

    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
            <div  className='flex-grow-1 d-flex justify-content-center' style={{marginTop: '7%'}}>
                <h2>Seleziona la categoria</h2>
            </div>
            <div className='position-absolute top-50 start-50 translate-middle text-center' style={{marginTop: '5%'}}>
                <div className='row row-cols-4'>
                    {cardsData.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title} 
                            image={card.image}
                            category={card.category}
                            onCardClick={() => handleCardClick("hot_topics_sentiment",card.category)} 
                        />
                    ))}
                </div>
            </div>
            {selectedCard && <div>Card Selezionata: {selectedCard}</div>}
        </div>
    );
};

export default HotTopicsCategory;