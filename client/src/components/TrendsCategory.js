import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import img1 from './images/woman.png';
import img2 from './images/no-racism.png';
import img3 from './images/global-warming.png';

const TrendsCategory = () => {
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


    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
            <div  className='flex-grow-1 d-flex justify-content-center' style={{marginTop: '7%'}}>
                <h2>Seleziona la categoria</h2>
            </div>
            <div className='position-absolute top-50 start-50 translate-middle text-center' style={{marginTop: '5%'}}>
                <div className='row row-cols-3'>
                    {cardsData.map((card, index) => (
                        <Card 
                            key={index}
                            title={card.title} 
                            image={card.image}
                            category={card.category}
                            onCardClick={() => handleCardClick("trends", card.category)} 
                        />
                    ))}
                </div>
            </div>
            {selectedCard && <div>Card Selezionata: {selectedCard}</div>}
        </div>
    );
};

export default TrendsCategory;