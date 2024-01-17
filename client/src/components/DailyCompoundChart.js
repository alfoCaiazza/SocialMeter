import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import Post from './Post';
import { Link } from 'react-router-dom';


const DailyCompoundChart = ({ year, month, goBack }) => {
  const [dailyData, setDailyData] = useState([]);
  const [topPost, setTopPost] = useState({});


  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios('http://localhost:5000/api/get_trends');
        const filteredData = result.data.filter(item => item.year == year && item.month == month);
        setDailyData(processSentimentsData(filteredData));
        fetchTopPost(filteredData);
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

  const fetchTopPost = (data) => {
    const topPost = data.reduce((max, item) => {
      const commentsCount = item.comments ? item.comments.length : 0;
      console.log(commentsCount)
      return commentsCount > (max.commentsCount || 0) ? { ...item, commentsCount } : max;
    }, {});
    console.log(topPost)
    setTopPost(topPost);
  };
  
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + '...';
    }
    return text;
  };

  return (
    <div className='container'>
      <div className='position-relative' style={{marginTop: '50%'}}>
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
      <div className='container overflow-hidden' style={{marginTop: '5%', paddingBottom: '3%'}}>
        <h5>Post con più interazzioni nel mese di {monthNames[month]} {year}</h5>
        {topPost && topPost.comments &&(
          <Post
            text={truncateText(topPost.text, 250)}
            year={topPost.year}
            month={topPost.month}
            day={topPost.day}
            score={topPost.score}
            comments={topPost.comments.length}
            sentiment={topPost.sentiment}
          />
        )}
      </div>
    </div>
  );
};


export default DailyCompoundChart;
