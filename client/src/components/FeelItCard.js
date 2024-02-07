const sentimentIcons = {
    Negativo: { className: "bi bi-emoji-frown", color: "red" }, 
    Positivo: { className: "bi bi-emoji-smile", color: "green" },
};

const FeelItCard = ({ sentiment }) => {
    const sentimentClass = sentimentIcons[sentiment] ? `emotion-icon ${sentimentIcons[sentiment].className}` : 'emotion-icon';
    const colorClass = sentimentIcons[sentiment] ? `icon-${sentiment.toLowerCase()}` : '';

    return (
        <div className="post-emotion-card">
            <div className="post-emotion-header">SENTIMENTO POST<br/>FEEL-IT</div>
            <div className="sentiment-value">{sentiment}</div>
            <div className="post-emotion">
                {sentiment && 
                    <i className={`${sentimentClass} ${colorClass}`}></i>
                }
            </div>
        </div>
    );
};



export default FeelItCard;
