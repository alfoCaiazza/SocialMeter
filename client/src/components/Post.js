import profile from './images/user.png'

const Post = ({title, year, month, day, score, comments, text}) => {
    return (
        <div class="card">
        <div class="card-body">
          <h5 class="card-title">{title}</h5>
          <h6 class="card-subtitle mb-2 text-body-secondary">@Anonymous {day}/{month}/{year}</h6>
          <p class="card-text">{text}</p>
          <i class="bi bi-arrow-down-up"></i>{score}
          <i class="bi bi-chat-left-dots"></i>{comments}
        </div>
      </div>
    );
};

export default Post;