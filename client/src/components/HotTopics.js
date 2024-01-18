import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import WordCloudComponent from './WordCloudComponent';

const HotTopics = () =>{
    const [data, setData] = useState(null)
    const {category, sentiment} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/get_hotTopics?topics_category=${category}&sentiment_type=${sentiment}`);
                const transformedData = response.data.map(item => ({
                    text: item[0],
                    value: item[1]
                }));
                setData(transformedData);
            } catch (error) {
                console.error('Errore durante il recupero dei dati:', error);
            }
        };

        fetchData();
    }, [category, sentiment]);

    const getCategoryString = (category) => {
        const categoryStrings = {
            'woman_condition': 'Sessismo',
            'racism': 'Razzismo',
            'climate_change': 'Cambiamento Climatico',
            'conspiracy': 'Complottismo',
        };
    
        // Return the string for the given category, or a default string if the category is not found
        return categoryStrings[category];
    };

    const options = {
        fontSizes: [30,100],
        rotationAngles: [0, 90],
        rotations: 2,
        padding: 1.5,
        enableTooltip: false,
      };

    return (
        <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
            <div className='text-center' style={{marginTop: "3%"}}>
                <h2 className='display-6' style={{marginTop: '1%', color: '#171717'}}><strong>Temi Caldi {getCategoryString(category)}: sentimento {sentiment}</strong></h2>
            </div>
            <div className='text-center position-absolute top-50 start-50 translate-middle mt-5 wordCloudContainer'>
                {data ? <WordCloudComponent words={data} options={options}/> : <p>Caricamento dati...</p>}
            </div>
        </div>
    );
}

export default HotTopics;