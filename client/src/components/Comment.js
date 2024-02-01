const Comment = ({ comment }) => {
    const { text, author, num_replies, score, emotion, sentiment, created_utc } = comment;
    const date = new Date(created_utc * 1000);
    const formattedDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  
    return (
      <div className="comment">
        <div className="comment-header">
          <div className="author-details">
            <strong>@{author}</strong>
            <span className="comment-date">{formattedDate}</span>
          </div>
          <div className="card-subtitle mb-2 text-body-secondary">
            <span className="comment-detail">Emozione: {emotion}</span>
            <br></br>
            <span className="comment-detail">Sentimento: {sentiment}</span>
          </div>
        </div>
        <p className="comment-text">{text}</p>
        <div className="comment-footer">
          <i className="bi bi-arrow-down-up"></i>{score}
          <i className="bi bi-chat-left-dots" style={{marginLeft: '2%'}}></i>{num_replies}
        </div>
      </div>
    );
  };
export default Comment;