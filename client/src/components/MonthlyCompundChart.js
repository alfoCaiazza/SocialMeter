import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import DailyCompoundChart from './DailyCompoundChart';


const MonthlyCompoundChart = ({ year, goBack }) => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);

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

  const monthNames = {
    1: "Gen",
    2: "Feb",
    3: "Mar",
    4: "Apr",
    5: "Mag",
    6: "Giu",
    7: "Lug",
    8: "Ago",
    9: "Set",
    10: "Ott",
    11: "Nov",
    12: "Dic"
  };  

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
  
      if (averageCompound <= 0.5) {
        sentimentLabel = "Negativo";
      } else if (averageCompound <= 1) {
        sentimentLabel = "Neutro";
      } else {
        sentimentLabel = "Positivo";
      }
  
      return {
        month: monthNames[month],
        month_numb: month,
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
    setSelectedMonth(data.month_numb);
  };

  const goBackMonth = () => {
    setSelectedMonth(null);
  };

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
      <div className='position-absolute top-50 start-50 translate-middle'>
          {selectedMonth === null && (
            <div className="header-container">
              <button onClick={goBack} className='icon-button'>
                <i className="bi bi-arrow-left"></i>
              </button>
              <h3>{year}</h3>
            </div>
          )}
        {selectedMonth === null ? (
          monthlyData.length > 0 ? (
            <BarChart width={600} height={300} data={monthlyData}>
              <XAxis dataKey="month"/>
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
          <DailyCompoundChart year={year} month={selectedMonth} goBack={goBackMonth}/>
        )}
      </div>
    </div>
  );
};


export default MonthlyCompoundChart;
