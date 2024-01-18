import profile from './images/user.png';

const Post = ({id,title, year, month, day, score, num_comments, text, comments}) => {
    return (    
      <div class="card">
        <div class="card-body">
          <h5 class="card-title">{title}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">@Anonymous {day}/{month}/{year}</h6>
          <p class="card-text">{text}</p>
          <i class="bi bi-arrow-down-up"></i>{score}
          <i class="bi bi-chat-left-dots" style={{marginLeft: '2%'}}></i>{num_comments}
        </div>
      </div>
    );
};

export default Post;