import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';

const NewTrends = () => {
  const [data, setData] = useState([]);
  const { category } = useParams();
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios(`http://localhost:5000/api/get_trends?category=${category}`);
        setTotalPosts(result.data.Totale || 0);
        const processedData = processSentimentsData(result.data);
        setData(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [category]);

  const processSentimentsData = (sentimentData) => {
    // Calcola il totale dei sentimenti escludendo il conteggio totale generale
    const totalSentiments = Object.entries(sentimentData)
                                  .filter(([key, _]) => key !== 'Totale')
                                  .reduce((sum, [_, value]) => sum + value, 0);

    // Calcola la percentuale di ciascun sentimento e conserva sia la percentuale sia il valore numerico
    return Object.entries(sentimentData)
                 .filter(([key, _]) => key !== 'Totale')
                 .map(([key, value]) => {
                     const percentage = (value / totalSentiments * 100).toFixed(2); // Arrotonda alla seconda cifra decimale
                     return { 
                         name: key, 
                         value: parseFloat(percentage), // Percentuale
                         absoluteValue: value // Valore numerico originale
                     };
                 });
  };

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

  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                <p>{payload[0].name}: {payload[0].payload.absoluteValue}</p> {/* Mostra il valore numerico */}
            </div>
        );
    }

    return null;
   };

   const findPercentage = (sentimentType) => {
        const sentiment = data.find(item => item.name === sentimentType);
        return sentiment ? sentiment.value.toFixed(2) : '0.00'; // Formattato con due cifre decimali
    };

  const COLORS = ['red', 'orange', 'green',]; // Colori per ogni slice

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
        <div className='text-center' style={{marginTop: "2%"}}>
          <h2 className='display-6' style={{marginTop: '1%', color: '#171717'}}><strong>Distribuzione del sentimento per la tematica {getCategoryString(category)}</strong></h2>
        </div>
      <div className='position-absolute top-50 start-50 translate-middle' style={{marginTop: '3%'}}>
        <PieChart width={400} height={400}>
                <Pie 
                    data={data} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={150} 
                    fill="#8884d8"
                    label
                >
                    {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} /> {/* Utilizza il tooltip personalizzato */}
                <Legend />
            </PieChart>
      </div>
      <div className='text-center mt-4'>
            <p style={{ fontSize: '1.2rem', marginTop: '30%' }}>
                Su un totale di {totalPosts} post, la tematica del {getCategoryString(category)} ottiene una percentuale del {findPercentage('Negativo')}% di post negativi, {findPercentage('Positivo')}% di post positivi, {findPercentage('Neutrale')}% di post neutrali.
            </p>
      </div>
    </div>
  );
}

export default NewTrends;
