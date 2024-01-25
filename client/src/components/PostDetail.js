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

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [dataForChart, setDataForChart] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(postId);
        const response = await axios(`http://localhost:5000/get_post_by_id?postId=${postId}`);
        setPost(response.data);
        if (response.data && response.data.comments) {
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

  const processData = (comments) => {
    const countsByHour = {};
  
    comments.forEach(comment => {
      const date = new Date(comment.created_utc * 1000);
      // Formatta la data per includere anno, mese, giorno e ora
      const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:00`;
  
      if (!countsByHour[formattedDate]) {
          countsByHour[formattedDate] = { date: formattedDate, totalComments: 0 };
      }
  
      // Incrementa il conteggio totale dei commenti per quell'ora
      countsByHour[formattedDate].totalComments++;
    });
  
    // Converti l'oggetto in un array di oggetti e ordinalo per data e ora
    return Object.values(countsByHour).sort((a, b) => new Date(a.date) - new Date(b.date));
  };  
  
  return (
    <div className='container-fluid d-flex flex-column align-items-center min-vh-100 p-0'>
        <div className='my-auto mt-5 mb-2' style={{ width: '80%'}}>
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
        <div className='w-100 d-flex justify-content-center'>
          <SentimentSummaryCard
            positivity={post.positivity}
            negativity={post.negativity}
            neutrality={post.neutrality}
            dominantSentiment={post.sentiment}
          />
          <SentimentCard
            sentiment={{ ...sentimentCounts, dominant: dominantSentiment }}
          />
          <ScoreCard
            upvotes={post.estimated_upvotes}
            downvotes={post.estimated_downvotes}
          />
          <PostEmotionCard
            emotion={post.emotion}
          />
          <EmotionCommunityCard
            emotion={{...emotionCounts, dominant: dominantEmotion}}
          />
        </div>
        <div className='d-flex justify-content-center align-items-center' style={{ width: '100%', marginTop: '5%' }}>
          <div style={{ width: '1000px' }}> {/* Imposta la larghezza desiderata per il LineChart qui */}
            <LineChart width={1000} height={300} data={dataForChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="totalComments" stroke="red" />
            </LineChart>
          </div>
        </div>
    </div>
  );
};

export default PostDetail;
