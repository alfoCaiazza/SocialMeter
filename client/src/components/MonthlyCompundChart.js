import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const MonthlyCompoundChart = ({ year, goBack }) => {
  const [monthlyData, setMonthlyData] = useState([]);

  useEffect(() => {
    // Carica o elabora i dati mensili qui (esempio con dati fittizi)
    setMonthlyData(generateMonthlyData(year));
  }, [year]);

  return (
    <div>
      <button onClick={goBack}>Torna al Grafico Annuale</button>
      <h3>Andamento Compound per il {year}</h3>
      <BarChart width={600} height={300} data={monthlyData}>
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <CartesianGrid stroke="#f5f5f5" />
        <Bar dataKey="compound" fill="#82ca9d" />
      </BarChart>
    </div>
  );
};

const generateMonthlyData = (year) => {
  // Genera dati fittizi
  return Array.from({ length: 12 }, (_, i) => ({
    month: `Mese ${i + 1}`,
    compound: Math.random() * 2 - 1
  }));
};

export default MonthlyCompoundChart;
