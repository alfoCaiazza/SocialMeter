import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const MonthlyCompoundChart = ({ year, goBack }) => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios('http://localhost:5000/api/get_trends');
        const filteredData = result.data.filter(item => item.year == year);
        setMonthlyData(processSentimentsData(filteredData));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [year]);

  const processSentimentsData = (data) => {
    const compoundByMonth = {};
  
    data.forEach(item => {
      const monthKey = item.month
      if (compoundByMonth[monthKey]) {
        compoundByMonth[monthKey].totalCompound += item.compound;
        compoundByMonth[monthKey].count += 1;
      } else {
        compoundByMonth[monthKey] = { totalCompound: item.compound, count: 1 };
      }
    });
  
    const processedData = Object.keys(compoundByMonth).map(month => {
      const averageCompound = compoundByMonth[month].totalCompound / compoundByMonth[month].count;
      let sentimentLabel;
  
      if (averageCompound >= 0.05) {
        sentimentLabel = "Positivo";
      } else if (averageCompound <= -0.05) {
        sentimentLabel = "Negativo";
      } else {
        sentimentLabel = "Neutro";
      }
  
      return {
        month: month,
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

  return (
    <div>
      <div className="header-container">
        <button onClick={goBack} className='icon-button'>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h3>Sentimento medio per l'anno {year}</h3>
      </div>
      <BarChart width={600} height={300} data={monthlyData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip content={<CustomTooltip />}/>
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Bar dataKey="averageCompound" fill="#ac84d9"  name='Sentimento'/>
      </BarChart>
    </div>
  );
};


export default MonthlyCompoundChart;
