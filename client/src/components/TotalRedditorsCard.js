const PostEmotionCard = ({ number }) => (
    <div className="post-emotion-card">
        <div className="post-emotion-header">REDDITORS TOTALI</div>
        <div className="post-emotion-count">{number}</div>
        <div className="post-emotion-icon">
            <i className="bi bi-reddit"></i>
        </div>
    </div>
);

export default PostEmotionCard;
