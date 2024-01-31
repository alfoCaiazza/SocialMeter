import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import WordCloudComponent from './WordCloudComponent';

const HotTopics = () =>{
    const [data, setData] = useState(null)
    const {category} = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/api/get_hotTopics?topics_category=${category}`);
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
    }, [category]);

    const getCategoryString = (category) => {
        const categoryStrings = {
            'woman_condition': 'Sessismo',
            'racism': 'Razzismo',
            'climate_change': 'Cambiamento Climatico',
        };
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
            <div className='text-center' style={{marginTop: "3%", marginTop: '7%'}}>
                <h2 className='display-6' style={{marginTop: '1%', color: '#171717'}}><strong>{getCategoryString(category)}</strong></h2>
                <p style={{ fontSize: '1.5rem' }}>
                    I concetti e i termini più rilevanti all'interno dei post che trattano di {getCategoryString(category)} sono i seguenti
                </p>
            </div>
            <div className='text-center position-absolute top-50 start-50 translate-middle mt-5 wordCloudContainer'>
                {data ? <WordCloudComponent words={data} options={options}/> : <p>Caricamento dati...</p>}
            </div>
        </div>
    );
}

export default HotTopics;