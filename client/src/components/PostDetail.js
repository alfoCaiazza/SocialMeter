import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip} from 'recharts';
import Post from './Post';
import SentimentCard from './SentimentCard';
import ScoreCard from './ScoreCard';
import SentimentSummaryCard from './SentimentSummaryCard';
import EmotionCommunityCard from './EmotionCommunityCard';
import PostEmotionCard from './PostEmotionCard';
import TotalRedditorsCard from './TotalRedditorsCard';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [dataForChart, setDataForChart] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(0); // Stato per tenere traccia del numero di utenti unici


  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(postId);
        const response = await axios(`http://localhost:5000/get_post_by_id?postId=${postId}`);
        setPost(response.data);
        if (response.data && response.data.comments) {
          calculateUniqueUsers(response.data.comments);
          const processedData = processData(response.data.comments);
          setDataForChart(processedData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPost();
  }, [postId]);

  if (!post) return <div>Caricamento...</div>;

  const calculateSentimentCounts = (comments) => {
    const counts = { Negativo: 0, Neutrale: 0, Positivo: 0 };
    comments.forEach(comment => {
        if (comment.sentiment) {
            counts[comment.sentiment] += 1;
        }
    });

    // Trova il sentiment con il conteggio più alto
    let dominantSentiment = null;
    let maxCount = 0;
    Object.entries(counts).forEach(([sentiment, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dominantSentiment = sentiment;
        }
    });

    return { counts, dominantSentiment };
  };


  const calculateEmotionCounts = (comments) => {
    const counts = { Rabbia: 0, Gioia: 0, Tristezza: 0, Paura: 0 };
    comments.forEach(comment => {
        if (comment.emotion) {
            counts[comment.emotion] += 1;
        }
    });

    // Trova l'emozione con il conteggio più alto
    let dominantEmotion = null;
    let maxCount = 0;
    Object.entries(counts).forEach(([emotion, count]) => {
        if (count > maxCount) {
            maxCount = count;
            dominantEmotion = emotion;
        }
    });

    return { counts, dominantEmotion };
  };

  const { counts: sentimentCounts, dominantSentiment } = calculateSentimentCounts(post.comments);
  const { counts: emotionCounts, dominantEmotion } = calculateEmotionCounts(post.comments);

  function processData(comments) {
    const countsByHour = {};
  
    comments.forEach(comment => {
      const date = new Date(comment.created_utc * 1000);
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
  
      if (!countsByHour[formattedDate]) {
          countsByHour[formattedDate] = { date: formattedDate, totalComments: 0 };
      }
  
      countsByHour[formattedDate].totalComments++;
    });
  
    return Object.values(countsByHour).sort((a, b) => new Date(a.date) - new Date(b.date));
  }
  
  
  function calculateUniqueUsers(comments) {
    const userSet = new Set(); // Utilizza un Set per garantire l'unicità
    comments.forEach(comment => {
      userSet.add(comment.author);
    });
    setUniqueUsers(userSet.size); // Aggiorna lo stato con il numero di utenti unici
  }

  return (
    <div className='container-fluid d-flex flex-column align-items-center min-vh-100 p-0'>
        <div className='text-center' style={{marginTop: "3%"}}>
          <h2 className='display-6' style={{marginTop: '1%', color: '#171717'}}><strong>Approfondisci l'analisi del post</strong></h2>
        </div>
        <div className='my-auto mt-5 mb-2' style={{ width: '80%' }}>
            <Post
                title={post.title}
                text={post.text}
                year={post.year}
                month={post.month}
                day={post.day}
                score={post.score}
                num_comments={post.tot_comments}
                author={post.author}
            />
        </div>
        <div className='text-center mt-4' style={{ width: '90%' }}>
          <p style={{ fontSize: '1.5rem' }}>
            Dall'analisi congiunta del sentimento e dell'emozione di post e community sono emersi i seguenti risultati:
          </p>
        </div>
        <div className='row w-100 justify-content-center' style={{ maxWidth: '1200px' }}> {/* Aggiunta della classe row e impostazione della larghezza massima */}
          <div className='col-md-4 mb-4'> {/* Ogni card in una colonna di 4 unità */}
            <TotalRedditorsCard number={uniqueUsers} />
          </div>
          <div className='col-md-4 mb-4'>
            <SentimentSummaryCard
              positivity={post.positivity}
              negativity={post.negativity}
              neutrality={post.neutrality}
              dominantSentiment={post.sentiment}
            />
          </div>
          <div className='col-md-4 mb-4'>
            <PostEmotionCard emotion={post.emotion} />
          </div>
          <div className='col-md-4 mb-4'>
            <ScoreCard upvotes={post.estimated_upvotes} downvotes={post.estimated_downvotes} />
          </div>
          <div className='col-md-4 mb-4'>
            <SentimentCard sentiment={{ ...sentimentCounts, dominant: dominantSentiment }} />
          </div>
          <div className='col-md-4 mb-4'>
            <EmotionCommunityCard emotion={{ ...emotionCounts, dominant: dominantEmotion }} />
          </div>
        </div>
        <div className='text-center mt-4' style={{ width: '90%' }}>
          <p style={{ fontSize: '1.5rem' }}>
            Il grafico mostra la tendenza dell'attivita dei redditors nel post 
          </p>
        </div>
        <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', marginTop: '5%' }}>
          <div style={{ width: '1000px' }}> {/* Imposta la larghezza desiderata per il LineChart qui */}
            <LineChart width={1000} height={300} data={dataForChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalComments" stroke="#8884d8" />
            </LineChart>
          </div>
        </div>
    </div>
  );
};

export default PostDetail;
