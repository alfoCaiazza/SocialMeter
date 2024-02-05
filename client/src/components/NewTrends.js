import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';


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
          const processedEmotionData = processEmotionData(result.data.emotion_counts);
          setEmotionData(processedEmotionData);
        }
        if (result.data.subreddit_counts) {
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
    // Calcuate the total for each sentiment, not considerig the component 'Totale'
    const totalSentiments = Object.entries(sentimentData)
                                  .filter(([key, _]) => key !== 'Totale')
                                  .reduce((sum, [_, value]) => sum + value, 0);

    // Calculates each sentiments percentage and store it, with sentiments total
    return Object.entries(sentimentData)
                 .filter(([key, _]) => key !== 'Totale')
                 .map(([key, value]) => {
                     const percentage = (value / totalSentiments * 100).toFixed(2);
                     return { 
                         name: key, 
                         value: parseFloat(percentage), // Percentage
                         absoluteValue: value // Original value
                     };
                 });
  };

  const processYearlyData = (yearlyData) => {
    // Transform data in a correct format for line chart
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

  // Functions that process emotional data
  const processEmotionData = (emotionCounts) => {
    return Object.entries(emotionCounts).map(([emotion, count]) => ({
      name: emotion,
      value: count,
      absoluteValue: count,
    }));
  };

  // Function that process data for each category and for each subreddit
  const processSubredditData = (subredditCounts) => {
    return Object.entries(subredditCounts).map(([subreddit, sentiments]) => ({
      name: subreddit,
      Positivo: sentiments.Positivo || 0,
      Neutrale: sentiments.Neutrale || 0,
      Negativo: sentiments.Negativo || 0,
      Rabbia: sentiments.Rabbia || 0,
      Gioia:  sentiments.Gioia || 0,
      Tristezza:  sentiments.Tristezza || 0,
      Paura: sentiments.Paura || 0
    }));
  };
  
  const renderCustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="custom-tooltip" style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc' }}>
                <p>{payload[0].name}: {payload[0].payload.absoluteValue}</p> 
            </div>
        );
    }

    return null;
  };

  const findPercentage = (sentimentType) => {
    const sentiment = data.find(item => item.name === sentimentType);
    return sentiment ? sentiment.value.toFixed(2) : '0.00'; 
  };

  const SENTIMENT_COLORS = ['#ff5154','#ffbf00','#3bb273']
  const EMOTION_COLOR = ['#8cff98', '#ffd131', '#ff1b1c', '#5c9ead']

  const sentimentNames = ["Positivo", "Negativo", "Neutrale"];
  const sentimentData = data.filter(item => sentimentNames.includes(item.name));
  
  return (
    <div className='container-fluid d-flex flex-column align-items-center min-vh-100 p-0' style={{marginTop: '7%'}}>
      <div className='text-center mt-4'>
        <h2 className='display-6' style={{ color: '#171717' }}>
          <strong>Analizza gli Indici per la Tematica {getCategoryString(category)}</strong>
        </h2>
      </div>

      {/* Sentiment Section */}
        <div className='trends-section'>
          <h3 className='text-center mt-4'>Distribuzione del Sentimento</h3>
          <div className='charts-container'>
            <div className='paragraph-container'>
              {/* PieChart */}
              <div>
                <PieChart width={350} height={350}>
                  <Pie 
                    data={sentimentData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={150}>
                      {sentimentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                      ))}
                  </Pie>
                  <Tooltip content={renderCustomTooltip} />
                  <Legend />
                </PieChart>
              </div>
              <div style={{ maxWidth: '40%', padding: '20px'}}>
                <p>
                  Il grafico a torta mostra la distribuzione dei sentimenti nei post relativi alla tematica selezionata.<br/><br/>
                  Ogni segmento rappresenta il numero di post che esprimono un determinato sentimento, permettendo di visualizzare rapidamente quale di questi prevale.
                </p>
              </div>
            </div>

            {/* BarChart */}
            <div className='paragraph-container'>
              <div>
                <BarChart
                  width={700}
                  height={300}
                  data={subredditData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="Positivo" stackId="a" fill="#3bb273" name="Post Positivi" />
                    <Bar dataKey="Neutrale" stackId="a" fill="#ffbf00" name="Post Neutrali" />
                    <Bar dataKey="Negativo" stackId="a" fill="#ff5154" name="Post Negativi" />
                </BarChart>
              </div>
              <div style={{ maxWidth: '80%', padding: '20px' }}>
                <p>
                  Il grafico a barre mostra la Distribuzione del sentiment nei vari Subreddit analizzati.<br/>
                  Ogni barra rappresenta il numero di post per ciascun sentimento, offrendo una visione dettagliata di come i sentimenti si distribuiscono tra le diverse comunità.
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Emotions Section */}
      <div className='trends-section'>
          <h3 className='text-center mt-4'>Distribuzione delle Emozioni</h3>
          <div className='charts-container'>
            <div className='paragraph-container'>
              {/* PieChart */}
              <div>
                <PieChart width={350} height={350}>
                  <Pie 
                    data={emotionData} 
                    dataKey="value" 
                    nameKey="name" 
                    cx="50%" 
                    cy="50%" 
                    outerRadius={150}>
                      {emotionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EMOTION_COLOR[index % EMOTION_COLOR.length]} />
                      ))}
                  </Pie>
                  <Tooltip content={renderCustomTooltip} />
                  <Legend />
                </PieChart>
              </div>
              <div style={{ maxWidth: '40%', padding: '20px'}}>
                <p>
                  Il grafico a torta mostra la distribuzione delle emozioni nei post relativi alla tematica selezionata.<br/><br/>
                  Ogni segmento rappresenta il numero di post che esprimono una determinata emozione, permettendo di visualizzare rapidamente quale di queste prevale.
                </p>
              </div>
            </div>

            {/* BarChart */}
            <div className='paragraph-container'>
              <div>
                <BarChart
                  width={700}
                  height={300}
                  data={subredditData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="Rabbia" stackId="a" fill="#ff1b1c" name="Rabbia" />
                    <Bar dataKey="Gioia" stackId="a" fill="#8cff98" name="Gioia" />
                    <Bar dataKey="Tristezza" stackId="a" fill="#5c9ead" name="Tristezza" />
                    <Bar dataKey="Paura" stackId="a" fill="#ffd131" name="Paura" />
                </BarChart>
              </div>
              <div style={{ maxWidth: '80%', padding: '20px' }}>
                <p>
                  Il grafico a barre mostra la distribuzione delle emozioni nei vari Subreddit analizzati.<br/>
                  Ogni barra rappresenta il numero di post per ciascuna emozione, offrendo una visione dettagliata di come le stesse si distribuiscono tra le diverse comunità.
                </p>
              </div>
            </div>
          </div>
        </div>
      
      
      {/* Time Trends Graphics*/}
      <div className='trends-section'>
        <div style={{ width: '100%', marginTop: '20px' }}>
          <h3 className='text-center mt-4'>Andamento dei Sentimenti nel Tempo</h3>
          <LineChart width={1000} height={300} data={trendsOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="Positivo" stroke="#3bb273" name="Post Positivi"/>
            <Line type="monotone" dataKey="Negativo" stroke="#ff5154" name="Post Negativi"/>
            <Line type="monotone" dataKey="Neutrale" stroke="#ffbf00" name="Post Neutrali"/>
          </LineChart>
          <div style={{ padding: '20px' }}>
            <p>Questo grafico a linee mostra l'evoluzione dei sentimenti nel tempo. Ogni linea rappresenta un sentimento diverso, permettendo di osservare come la prevalenza di sentimenti positivi, negativi o neutri si sia modificata nel corso del periodo analizzato.</p>
          </div>
        </div>
        <div style={{ width: '100%', marginTop: '20px' }}>
          <h3 className='text-center mt-4'>Andamento delle Emozioni nel Tempo</h3>
          <LineChart width={1000} height={300} data={emotionsOverTime} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <RechartsTooltip />
            <Legend />
            <Line type="monotone" dataKey="Rabbia" stroke="#ff1b1c" name="Rabbia"/>
            <Line type="monotone" dataKey="Gioia" stroke="#8cff98" name="Gioia"/>
            <Line type="monotone" dataKey="Tristezza" stroke="#5c9ead" name="Tristezza"/>
            <Line type="monotone" dataKey="Paura" stroke="#ffd131" name="Paura"/>
          </LineChart>
          <div style={{ padding: '20px' }}>
            <p>Questo grafico a linee illustra come le diverse emozioni si siano manifestate nei post nel corso del tempo. Tracciando la frequenza di emozioni come gioia, tristezza, rabbia e paura, si può comprendere meglio il clima emotivo generale e le sue variazioni.</p>
          </div>
        </div>
      </div>
    </div>
  );

}

export default NewTrends;



