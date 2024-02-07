import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import { LineChart, BarChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip } from 'recharts';


const TrendsSentiment = () => {
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
  const totalEmotions = Object.values(emotionCounts).reduce((sum, value) => sum + value, 0);
  return Object.entries(emotionCounts).map(([emotion, count]) => {
    const percentage = (count / totalEmotions * 100).toFixed(2);
    return {
      name: emotion,
      value: parseFloat(percentage), // Usa il valore percentuale qui
      absoluteValue: count, // Mantieni anche il valore assoluto se necessario
    };
  });
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
  
  const renderCustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          {label && <p className="label">{`${label}:`}</p>} {/* Controlla se label è presente prima di renderizzarlo */}
          {payload.map((entry, index) => (
            <p key={`item-${index}`} className="item">
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
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
          <strong>Analizza le Tendenze della Tematica {getCategoryString(category)}</strong>
        </h2>
      </div>

      {/* Sentiment Section */}
      <div className='trends-section'>
        <h3 className='text-center mt-4'>Distribuzione del Sentimento</h3>
        <div className='charts-container'>
          <div style={{ width: '100%', marginTop: '5%', marginLeft: '15%' }}>
            <LineChart width={800} height={250} data={trendsOverTime} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis />
              <RechartsTooltip content={renderCustomTooltip}/>
              <Legend />
              <Line type="monotone" dataKey="Positivo" stroke="#3bb273" name="Post Positivi"/>
              <Line type="monotone" dataKey="Negativo" stroke="#ff5154" name="Post Negativi"/>
              <Line type="monotone" dataKey="Neutrale" stroke="#ffbf00" name="Post Neutrali"/>
            </LineChart>
          </div>
          <div style={{ padding: '20px' }}>
            <p className="chart-description">
              Il grafico a linee mostra l'evoluzione dei sentimenti nel tempo, evidenziando come sentimenti positivi, negativi e neutri si siano alternati nel periodo considerato.
            </p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '1%', marginLeft: '5%', marginRight: '5%'}}>
            <div style={{ flex: 1, marginRight: '2%' }}>
              <PieChart width={250} height={250}>
                <Pie 
                  data={sentimentData} 
                  dataKey="value" 
                  nameKey="name" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={90}>
                    {sentimentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={SENTIMENT_COLORS[index % SENTIMENT_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip content={renderCustomTooltip} />
                <Legend />
              </PieChart>
            </div>
            <div style={{ padding: '20px', width: '100%'}}>
              <p className="chart-description">
                Il grafico a torta rappresenta la distribuzione percentuale del sentimento, offrendo una visione immediata della prevalenza di ciascuna categoria.
              </p>
            </div>
            <div style={{ flex: 1 }}>
              <BarChart
                width={500}
                height={250}
                data={subredditData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <RechartsTooltip content={renderCustomTooltip}/>
                  <Legend />
                  <Bar dataKey="Positivo" stackId="a" fill="#3bb273" name="Post Positivi" />
                  <Bar dataKey="Neutrale" stackId="a" fill="#ffbf00" name="Post Neutrali" />
                  <Bar dataKey="Negativo" stackId="a" fill="#ff5154" name="Post Negativi" />
              </BarChart>
            </div>
            <div style={{ padding: '20px' }}>
              <p className="chart-description">
                Il grafico a barre mostra la distribuzione dei sentimenti nei diversi subreddit, permettendo di comparare direttamente le differenti comunità.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

}

export default TrendsSentiment;



