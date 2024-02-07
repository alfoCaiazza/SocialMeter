import FeelItSentimentBar from "./FeelItSentimentBar";

const FeelItSentimentCard = ({ sentiment }) => {
    return (
        <div className="sentiment-card">
            <div className="sentiment-header">SENTIMENTO COMMUNITY</div>
            <div className="dominant-sentiment">{sentiment.dominant}</div>
            <FeelItSentimentBar sentiment={sentiment} />
            <div className="sentiment-numbers-card">
                <div>
                    <div>Negativo</div>
                    <i className="bi bi-emoji-frown sentiment-icon-card"></i>
                    <span className="sentiment-value">{sentiment.Negativo}</span>
                </div>
                <div>
                    <div>Positivo</div>
                    <i className="bi bi-emoji-smile sentiment-icon-card positive"></i>
                    <span className="sentiment-value">{sentiment.Positivo}</span>
                </div>
            </div>
        </div>
    );
};

export default FeelItSentimentCard;