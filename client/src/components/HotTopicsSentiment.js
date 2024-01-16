import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import { useParams } from 'react-router-dom';
// import img1 from './images/oooo';
// import img2 from './images/ooooo';
// import img3 from './images/ooooo';

const HotTopicsSentiment = () => {
    const {category} = useParams();
    const [selectedCard, setSelectedCard] = useState(null);
    const navigate = useNavigate();

    const cardsData = [
        { title: "Positivo"},
        { title: "Negativo"},
        { title: "Neutrale"},
    ];

    const handleCardClick = (path, category, sentiment) => {
        setSelectedCard(category);
        navigate(`/${path}/${category}/${sentiment}`);
    };

    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
            <div  className='flex-grow-1 d-flex justify-content-center' style={{marginTop: '7%'}}>
                <h2>Seleziona il sentimento</h2>
            </div>
            <div className='position-absolute top-50 start-50 translate-middle text-center' style={{marginTop: '5%'}}>
                <div className='row row-cols-3'>
                    {cardsData.map((card, index) => (
                        <Card
                            key={index}
                            title={card.title}
                            image={card.image}
                            onCardClick={() => handleCardClick("hot_topics", category, card.title)} 
                        />
                    ))}
                </div>
            </div>
            {selectedCard && <div>Card Selezionata: {selectedCard}</div>}
        </div>
    );
};

export default HotTopicsSentiment;