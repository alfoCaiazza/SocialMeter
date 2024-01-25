import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';


const NewTrends = () => {
  const [data, setData] = useState([]);
  const [trendsOverTime, setTrendsOverTime] = useState([]);
  const { category } = useParams();
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await axios(`http://localhost:5000/api/get_trends?category=${category}`);
        if (result.data.sentiment_counts) {
          setTotalPosts(result.data.sentiment_counts.Totale || 0);
          const processedData = processSentimentsData(result.data.sentiment_counts);
          setData(processedData);
        }
        if (result.data.yearly_sentiment) {
          setTrendsOverTime(processYearlyData(result.data.yearly_sentiment));
        }
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

  const processYearlyData = (yearlyData) => {
    // Trasforma i dati in un formato adatto per il grafico a linee
    return Object.entries(yearlyData).map(([year, sentiments]) => {
      return { 
        year, 
        Positivo: sentiments.Positivo, 
        Negativo: sentiments.Negativo, 
        Neutrale: sentiments.Neutrale 
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

  const calculateTrendDescription = () => {
    // Controlla se ci sono abbastanza dati per calcolare una tendenza.
    // Se ci sono meno di due anni di dati, non è possibile determinare una tendenza.
    if (trendsOverTime.length < 2) {
      return 'stabili'; // Ritorna una descrizione di default
    }
  
    // Prende i dati degli ultimi due anni per confrontarli.
    const latestYear = trendsOverTime[trendsOverTime.length - 1];
    const previousYear = trendsOverTime[trendsOverTime.length - 2];
  
    // Calcola la differenza nel numero di sentimenti positivi tra gli ultimi due anni.
    const trend = latestYear.positive - previousYear.positive;
  
    // Determina se c'è stato un aumento o una diminuzione dei sentimenti positivi.
    // Se il numero è positivo, significa che ci sono stati più sentimenti positivi
    // nell'ultimo anno rispetto all'anno precedente.
    // Se il numero è negativo, significa che ci sono stati meno sentimenti positivi.
    return trend > 0 ? 'un aumento' : 'una diminuzione';
  };
  
  const findMostProminentSentiment = () => {
    // Verifica se ci sono dati disponibili.
    // Se non ci sono, restituisce 'neutrale' come default.
    if (!trendsOverTime.length) return 'neutrale'; 
  
    // Prende i dati dell'ultimo anno disponibile.
    const latestYear = trendsOverTime[trendsOverTime.length - 1];
  
    // Confronta i conteggi dei vari sentimenti (positivo, negativo, neutrale)
    // per determinare quale è stato il più prominente nell'ultimo anno.
    const maxSentiment = Math.max(latestYear.positive, latestYear.negative, latestYear.neutral);
  
    // A seconda di quale sentimento ha il conteggio più alto, 
    // ritorna il sentimento corrispondente.
    if (maxSentiment === latestYear.positive) {
      return 'positivo';
    } else if (maxSentiment === latestYear.negative) {
      return 'negativo';
    } else {
      return 'neutrale';
    }
  };
  

  const trendDescription = calculateTrendDescription();
  const mostProminentSentiment = findMostProminentSentiment();

  const COLORS = ['#f44336', '#ffc658', '#82ca9d',]; // Colori per ogni slice

  return (
    <div className='container-fluid d-flex flex-column align-items-center min-vh-100 p-0'>
        <div className='text-center mt-4'>
          <h2 className='display-6' style={{ color: '#171717' }}>
            <strong>Distribuzione del sentimento per la tematica {getCategoryString(category)}</strong>
          </h2>
        </div>
        <PieChart width={400} height={400} style={{ marginTop: '2rem' }}>
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
          <Tooltip content={renderCustomTooltip} />
          <Legend />
        </PieChart>
        <div className='text-center mt-4' style={{ width: '90%' }}>
          <p style={{ fontSize: '1.2rem' }}>
            Dall'analisi di {totalPosts} post pubblicati sulla tematica {getCategoryString(category)}, si distilla una mappa dei sentimenti prevalenti: il {findPercentage('Negativo')}% manifesta una connotazione negativa, il {findPercentage('Positivo')}% trasmette un'impressione positiva, e il {findPercentage('Neutrale')}% si presenta con una tonalità neutra. Questi dati offrono una visione quantitativa del sentiment generale espresso attraverso i post.
          </p>
        </div>
        <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', height: '50%', marginTop: '2%'}}>
          <LineChart width={1000} height={300} data={trendsOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <RechartsTooltip />
            <Line type="monotone" dataKey="Positivo" stroke="#82ca9d" />
            <Line type="monotone" dataKey="Negativo" stroke="#f44336" />
            <Line type="monotone" dataKey="Neutrale" stroke="#ffc658" />
          </LineChart>
        </div>
        <div className='text-center mt-4' style={{ width: '90%' }}>
          <p style={{ fontSize: '1.2rem' }}>
            L'analisi temporale rivela {trendDescription} nel sentiment {mostProminentSentiment} legato alla tematica {getCategoryString(category)} negli ultimi anni. Questa evoluzione potrebbe riflettere cambiamenti significativi nell'opinione pubblica o nelle dinamiche sociali riguardanti {getCategoryString(category)}. Analizzare queste variazioni nel tempo aiuta a comprendere meglio come le conversazioni e le percezioni si evolvono in relazione a temi così importanti.
          </p>
        </div>
    </div>
  );

}

<PieChart width={400} height={400}>

</PieChart>
export default NewTrends;
