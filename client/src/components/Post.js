const Post = ({title, year, month, day, score, num_comments, text, author}) => {
    return (    
      <div className="card">
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <h6 className="card-subtitle mb-2 text-body-secondary">@{author} {day}/{month}/{year}</h6>
          <p className="card-text">{text}</p>
          <i className="bi bi-arrow-down-up"></i>{score}
          <i className="bi bi-chat-left-dots" style={{marginLeft: '2%'}}></i>{num_comments -1}
        </div>
      </div>
    );
};

export default Post;