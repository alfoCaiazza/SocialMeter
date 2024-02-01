const emotionIcons = {
    Rabbia: { className: "bi bi-emoji-angry", color: "red" }, 
    Gioia: { className: "bi bi-emoji-laughing", color: "green" }, 
    Tristezza: { className: "bi bi-emoji-frown", color: "blue" },
    Paura: { className: "bi bi-emoji-dizzy", color: "purple" },
};

const PostEmotionCard = ({ emotion }) => {
    // Determina la classe dell'icona in base al tipo di emozione
    const emotionClass = emotionIcons[emotion] ? `emotion-icon ${emotionIcons[emotion].className}` : 'emotion-icon';
    // Assegna la classe per il colore in base al tipo di emozione
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
        </div>
    );
};



export default PostEmotionCard;
