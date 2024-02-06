const emotionIcons = {
    Rabbia: { className: "bi bi-emoji-angry", color: "red" }, 
    Gioia: { className: "bi bi-emoji-laughing", color: "green" }, 
    Tristezza: { className: "bi bi-emoji-frown", color: "blue" },
    Paura: { className: "bi bi-emoji-dizzy", color: "purple" },
};

const PostEmotionCard = ({ emotion, sentiment }) => {
    const emotionClass = emotionIcons[emotion] ? `emotion-icon ${emotionIcons[emotion].className}` : 'emotion-icon';
    const colorClass = emotionIcons[emotion] ? `icon-${emotion.toLowerCase()}` : '';

    return (
        <div className="post-emotion-card">
            <div className="post-emotion-header">EMOZIONE DEL POST</div>
            <div className="post-emotion">{emotion}</div>
            <div className="post-emotion">
                {emotion && 
                    <i className={`${emotionClass} ${colorClass}`}></i>
                }
            </div>
            <div className="post-emotion-header">SENTIMENTO DEL POST (FEEL IT)</div>
            <div className="post-emotion">{sentiment}</div>
        </div>
    );
};



export default PostEmotionCard;
