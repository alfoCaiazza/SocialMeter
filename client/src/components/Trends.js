import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const Trends = () => {
  const [sentiments, setSentiments] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const result = await axios('http://localhost:5000/api/get_trends');
      setSentiments(result.data.map(item => ({
        ...item,
        fill: getBarColor(item.score) // Assegna un colore in base al sentiment
      })));
    }
    fetchData();
  }, []);

  // Funzione per determinare il colore della barra in base al sentiment
  const getBarColor = (score) => {
    if (score === "Positivo") return '#4caf50'; // Verde per i valori positivi
    if (score === "Negativo") return '#f44336'; // Rosso per i valori negativi
    return '#2196f3'; // Blu per i valori neutri
  };

  return (
    <div>
      <h1>Sentiment Analysis Results</h1>
      <BarChart width={600} height={300} data={sentiments}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Legend />
        {sentiments.map((entry, index) => (
          <Bar key={`bar-${index}`} dataKey="score" fill={entry.fill} />
        ))}
      </BarChart>
    </div>
  );
}

export default Trends;
