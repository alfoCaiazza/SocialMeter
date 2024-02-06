import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts';
import Post from './Post';
import SentimentCard from './SentimentCard';
import ScoreCard from './ScoreCard';
import SentimentSummaryCard from './SentimentSummaryCard';
import EmotionCommunityCard from './EmotionCommunityCard';
import PostEmotionCard from './PostEmotionCard';
import TotalRedditorsCard from './TotalRedditorsCard';
import Comment from './Comment';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [dataForChart, setDataForChart] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(0); 
  const [selectedComments, setSelectedComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
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

  // Function thath counts the number of post for each sentiment category and then the predominant sentiment
  const calculateSentimentCounts = (comments) => {
    const counts = { Negativo: 0, Neutrale: 0, Positivo: 0 };
    comments.forEach(comment => {
        if (comment.sentiment) {
            counts[comment.sentiment] += 1;
        }
    });

    // Finds dominant sentiment 
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

  // Function thath counts the number of post for each emotion category and then the predominant emotion
  const calculateEmotionCounts = (comments) => {
    const counts = { Rabbia: 0, Gioia: 0, Tristezza: 0, Paura: 0 };
    comments.forEach(comment => {
        if (comment.emotion) {
            counts[comment.emotion] += 1;
        }
    });

    // Finds dominant emotion
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
    const userSet = new Set();
    comments.forEach(comment => {
      userSet.add(comment.author);
    });
    setUniqueUsers(userSet.size); 
  }


  const handlePointClick = (data) => {
    if (!data.activePayload) return;
  
    setLoadingComments(true); 
  
    const clickedDate = data.activePayload[0].payload.date;
    const filteredComments = post.comments
      .filter(comment => {
        const commentDate = new Date(comment.created_utc * 1000);
        const formattedCommentDate = `${commentDate.getFullYear()}-${commentDate.getMonth() + 1}-${commentDate.getDate()} ${commentDate.getHours()}:00`;
        return formattedCommentDate === clickedDate;
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  
    setSelectedComments(filteredComments);
    setLoadingComments(false);
  };  

  return (
    <div className='container-fluid d-flex flex-column align-items-center min-vh-100 p-0' style={{marginBottom: '5%'}}>
        <div className='text-center' style={{marginTop: "3%"}}>
          <h2 className='display-6' style={{marginTop: '20%', color: '#171717'}}><strong>Approfondisci l'analisi del post</strong></h2>
        </div>
        <div className='my-auto mt-5 mb-2' style={{ width: '80%' }}>
            <Post
                title={post.title}
                text={post.og_text}
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
        <div className='row w-100 justify-content-center custom-container' style={{ maxWidth: '1200px' }}> 
          <div className='col-md-4 mb-4'> 
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
            <PostEmotionCard emotion={post.emotion} sentiment={post.sentiment_feel_it} />
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
          <div style={{ width: '1000px' }}> 
            <LineChart width={1000} height={300} data={dataForChart} margin={{ top: 5, right: 30, left: 20, bottom: 5 }} onClick={handlePointClick}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="totalComments" stroke="#2fa2d6" name="Commenti Totali per Ora" />
            </LineChart>
          </div>
        </div>
        { (loadingComments || selectedComments.length > 0) && (
            <div className='comments-container my-auto mt-5 mb-2' style={{ maxWidth: '80%' }}>
                {loadingComments ? (
                    <p>Caricamento commenti...</p>
                ) : (
                    <>
                        <div>
                            <p className='display-6 text-center'>Commenti con più Engagement</p>
                        </div>
                        {selectedComments.map(comment => (
                            <div className='mt-5' key={comment.id}>
                                <Comment comment={comment} />
                            </div>
                        ))}
                    </>
                )}
            </div>
        )}
    </div>
  );
};

export default PostDetail;
