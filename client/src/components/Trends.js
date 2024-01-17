import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import MonthlyCompoundChart from './MonthlyCompundChart';
import { useParams } from 'react-router-dom';

const Trends = () => {
  const [sentiments, setSentiments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const {category} = useParams();

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios(`http://localhost:5000/api/get_trends?category=${category}`);
        const processedData = processSentimentsData(result.data);
        setSentiments(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [category]);

  const processSentimentsData = (data) => {
    const compoundByYear = {};
  
    data.forEach(item => {
      if (compoundByYear[item.year]) {
        compoundByYear[item.year].totalCompound += item.compound;
        compoundByYear[item.year].count += 1;
      } else {
        compoundByYear[item.year] = { totalCompound: item.compound, count: 1 };
      }
    });
  
    const processedData = Object.keys(compoundByYear).map(year => {
      const averageCompound = compoundByYear[year].totalCompound / compoundByYear[year].count;
      let sentimentLabel;
  
      if (averageCompound <= 0.5) {
        sentimentLabel = "Negativo";
      } else if (averageCompound <= 1) {
        sentimentLabel = "Neutro";
      } else {
        sentimentLabel = "Positivo";
      }
  
      return {
        year: year,
        averageCompound: averageCompound,
        sentiment: sentimentLabel
      };
    });
  
    return processedData;
  };
  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#fff', padding: '10px', border: '1px solid #ccc' }}>
          <p>{payload[0].payload.sentiment}</p>
        </div>
      );
    }
  
    return null;
  };

  const handleBarClick = (data, index) => {
    setSelectedYear(data.year);
  };
  
  const goBack = () => {
    setSelectedYear(null);
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

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
        <div className='text-center' style={{marginTop: "2%"}}>
          <h2 className='display-6' style={{marginTop: '1%', color: '#171717'}}><strong>Sentimento medio per la tematica {getCategoryString(category)}</strong></h2>
        </div>
      <div className='position-absolute top-50 start-50 translate-middle' style={{marginTop: '3%'}}>
        {selectedYear === null ? (
          sentiments.length > 0 ? (
            <BarChart width={600} height={300} data={sentiments}>
              <XAxis dataKey="year"/>
              <YAxis />
              <Tooltip content={<CustomTooltip />}/>
              <Legend />
              <CartesianGrid stroke="#f5f5f5" />
              <Bar dataKey="averageCompound" fill="#ac84d9" name='Sentimento' onClick={handleBarClick}/>
            </BarChart>
          ) : (
            <p>Caricamento dati...</p>
          )
        ) : (
          <MonthlyCompoundChart year={selectedYear} goBack={goBack}/>
        )}
      </div>
    </div>
  );
  
}

export default Trends;
