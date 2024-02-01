const SentimentBar = ({ sentiment }) => (
    <div className="sentiment-bar">
        <div className={`sentiment-value-bar negative`} style={{ width: `${sentiment.Negativo * 100}%` }}></div>
        <div className={`sentiment-value-bar neutral`} style={{ width: `${sentiment.Neutrale * 100}%` }}></div>
        <div className={`sentiment-value-bar positive`} style={{ width: `${sentiment.Positivo * 100}%` }}></div>
    </div>
);

export default SentimentBar;