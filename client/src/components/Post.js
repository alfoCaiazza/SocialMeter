const Post = ({ title, year, month, day, score, num_comments, text, author }) => {
  return (    
    <div className="custom-post-card">
      <div className="custom-post-body">
        <h5 className="custom-post-title">{title}</h5>
        <h6 className="custom-post-subtitle mb-2 text-muted">@{author} {day}/{month}/{year}</h6>
        <p className="custom-post-text">{text}</p>
        <div className="custom-post-icons">
          <i className="bi bi-arrow-down-up"></i>{score}
          <i className="bi bi-chat-left-dots" style={{marginLeft: '2%'}}></i>{num_comments - 1}
        </div>
      </div>
    </div>
  );
};

export default Post;
