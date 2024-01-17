import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';


const MonthlyCompoundChart = ({ year, month, goBack }) => {
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios('http://localhost:5000/api/get_trends');
        const filteredData = result.data.filter(item => item.year == year && item.month == month);
        setDailyData(processSentimentsData(filteredData));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    fetchData();
  }, [year, month]);

  const processSentimentsData = (data) => {
    const compoundByDay = {};
  
    data.forEach(item => {
      const dayKey = item.day
      if (compoundByDay[dayKey]) {
        compoundByDay[dayKey].totalCompound += item.compound;
        compoundByDay[dayKey].count += 1;
      } else {
        compoundByDay[dayKey] = { totalCompound: item.compound, count: 1 };
      }
    });
  
    const processedData = Object.keys(compoundByDay).map(day => {
      const averageCompound = compoundByDay[day].totalCompound / compoundByDay[day].count;
      let sentimentLabel;
  
      if (averageCompound <= 0.5) {
        sentimentLabel = "Negativo";
      } else if (averageCompound <= 1) {
        sentimentLabel = "Neutro";
      } else {
        sentimentLabel = "Positivo";
      }
  
      return {
        day: day,
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

  const monthNames = {
    1: "Gennaio",
    2: "Febbraio",
    3: "Marzo",
    4: "Aprile",
    5: "Maggio",
    6: "Giugno",
    7: "Luglio",
    8: "Agosto",
    9: "Settembre",
    10: "Ottobre",
    11: "Novembre",
    12: "Dicembre"
  };  

  return (
    <div>
      <div className="header-container">
        <button onClick={goBack} className='icon-button'>
          <i className="bi bi-arrow-left"></i>
        </button>
        <h3>{monthNames[month]}</h3>
      </div>
      <BarChart width={600} height={300} data={dailyData}>
        <XAxis dataKey="day" tickFormatter={(day) => `${day}/${month}`}/>
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
