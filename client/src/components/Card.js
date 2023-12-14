// Card.js
import React from 'react';

const Card = ({ post }) => {
  return (
    <div className="card mb-3" style={{borderRadius: '10px'}}>
      <div className="card-body">
        <h5 className="card-title mb-2">{post.title}</h5>
        <h6 className='card-subtitle mb-2 text-body-secondary' >Autore: {post.author} - Data: {post.pubdate}</h6>
        <p className="card-text">{post.text}</p>
        <div className='information'>
          <span>
            <strong>Commenti:</strong> {post.num_comments}
          </span>
          <span>
            <strong>Score:</strong> {post.score}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
