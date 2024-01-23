import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from './Post';
import SentimentCard from './SentimentCard';
import ScoreCard from './ScoreCard';

const PostDetail = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log(postId);
        const response = await axios(`http://localhost:5000/get_post_by_id?postId=${postId}`);
        setPost(response.data);
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
  
    return counts;
  };

  const sentimentCounts = calculateSentimentCounts(post.comments);

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
          <SentimentCard
            sentiment={{ ...sentimentCounts, dominant: post.avg_comments_sentiment }}
          />
          <ScoreCard
            upvotes={post.estimated_upvotes}
            downvotes={post.estimated_downvotes}
          />
        </div>
    </div>
  );
};

export default PostDetail;
