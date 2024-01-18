import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from './Post'

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

  return (
    <div className='container-fluid d-flex flex-column min-vh-100 p-0'>
        <div className='position-absolute top-50 start-50 translate-middle' style={{marginTop:'10%'}}>
            <Post
                title={post.title}
                text={post.text}
                year={post.year}
                month={post.month}
                day={post.day}
                score={post.score}
                num_comments={post.tot_comments}
                comments={post.comments}
            />
        </div>
    </div>
  );
};

export default PostDetail;
