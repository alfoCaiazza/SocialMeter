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
  const [emotionData, setEmotionData] = useState([]);
  const [subredditData, setSubredditData] = useState([]);
  const [emotionsOverTime, setEmotionsOverTime] = useState([]);

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
        if (result.data.emotion_counts) {
          // Processa e imposta i dati di 'emotion'
          const processedEmotionData = processEmotionData(result.data.emotion_counts);
          setEmotionData(processedEmotionData);
        }
        if (result.data.subreddit_counts) {
          // Processa e imposta i dati di 'subreddit'
          const processedSubredditData = processSubredditData(result.data.subreddit_counts);
          setSubredditData(processedSubredditData);
        }
        if (result.data.yearly_emotions) {
          setEmotionsOverTime(processYearlyEmotionData(result.data.yearly_emotions))
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

  const processYearlyEmotionData = (yearlyData) => {
    // Trasforma i dati in un formato adatto per il grafico a linee
    return Object.entries(yearlyData).map(([year, emotions]) => {
      return { 
        year, 
        Rabbia: emotions.Rabbia, 
        Gioia: emotions.Gioia, 
        Tristezza: emotions.Tristezza,
        Paura : emotions.Paura,
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

  // Esempio di funzione per processare i dati di 'emotion'
  const processEmotionData = (emotionCounts) => {
    return Object.entries(emotionCounts).map(([emotion, count]) => ({
      name: emotion,
      value: count
    }));
  };

  // Esempio di funzione per processare i dati di 'subreddit'
  const processSubredditData = (subredditCounts) => {
    return Object.entries(subredditCounts).map(([subreddit, count]) => ({
      name: subreddit,
      value: count
    }));
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

  const COLORS = ['#FF2400', '#FFA500','#00FF7F', '#FFD700',' #87CEEB',' #7851A9', '#FF7F50',' #800020']; 
  
  return (
    <div className='container-fluid d-flex flex-column align-items-center min-vh-100 p-0'>
        <div className='text-center mt-4'>
          <h2 className='display-6' style={{ color: '#171717' }}>
            <strong>Distribuzione indici per la tematica {getCategoryString(category)}</strong>
          </h2>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'center', width: '100%', flexWrap: 'wrap' }}>
          <div>
            <div className='text-center mt-4'>
              <p>SENTIMENTO</p>
            </div>
            <PieChart width={400} height={400} style={{ marginTop: '2rem' }}>
              <Pie 
                  data={data} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={150} 
              >
                  {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
              </Pie>
              <Tooltip content={renderCustomTooltip} />
              <Legend />
            </PieChart>
          </div>
          <div>
            <div className='text-center mt-4'>
                <p>EMOZIONE</p>
            </div>      
            <PieChart width={400} height={400}>
              <Pie
                data={emotionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
              >
                {emotionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
          <div>
            <div className='text-center mt-4'>
              <p>SUBREDDIT</p>
            </div>
            <PieChart width={400} height={400}>
              <Pie
                data={subredditData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={150}
              >
                {subredditData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>
        <div className='text-center mt-4' style={{ width: '90%' }}>
          <p style={{ fontSize: '1.2rem' }}>
            Numero di post per sentimento 
          </p>
        </div>
        <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', height: '50%', marginTop: '2%'}}>
          <LineChart width={1000} height={300} data={trendsOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="Positivo" stroke="#82ca9d" name="Post Positivi"/>
            <Line type="monotone" dataKey="Negativo" stroke="#f44336" name="Post Negativi"/>
            <Line type="monotone" dataKey="Neutrale" stroke="#ffc658" name="Post Neutrali"/>
          </LineChart>
        </div>
        <div className='text-center mt-4' style={{ width: '90%' }}>
          <p style={{ fontSize: '1.2rem' }}>
            Numero di post per emozione 
          </p>
        </div>
        <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', height: '50%', marginTop: '2%'}}>
          <LineChart width={1000} height={300} data={emotionsOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="Rabbia" stroke="red" name="Rabbia"/>
            <Line type="monotone" dataKey="Gioia" stroke="green" name="Gioia"/>
            <Line type="monotone" dataKey="Tristezza" stroke="blue" name="Tristezza"/>
            <Line type="monotone" dataKey="Paura" stroke="purple" name="Paura"/>
          </LineChart>
        </div>
    </div>
  );

}

<PieChart width={400} height={400}>

</PieChart>
export default NewTrends;
