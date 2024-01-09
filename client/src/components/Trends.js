import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label } from 'recharts';
import MonthlyCompoundChart from './MonthlyCompundChart';

const Trends = () => {
  const [sentiments, setSentiments] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios('http://localhost:5000/api/get_trends');
        const processedData = processSentimentsData(result.data);
        setSentiments(processedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, []);

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
  
      if (averageCompound >= 0.05) {
        sentimentLabel = "Positivo";
      } else if (averageCompound <= -0.05) {
        sentimentLabel = "Negativo";
      } else {
        sentimentLabel = "Neutro";
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

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
      <div className='position-absolute top-50 start-50 translate-middle'>
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
