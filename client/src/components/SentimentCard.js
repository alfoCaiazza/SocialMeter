import SentimentBar from "./SentimentBar";

const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    width: '300px',
    margin: '20px'
};

const headerStyle = {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: '10px'
};

const dominantSentimentStyle = {
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    margin: '10px 0'
};

const sentimentNumbersStyle = {
    display: 'flex',
    justifyContent: 'space-between'
};

const SentimentCard = ({ sentiment }) => {
    return (
        <div style={cardStyle}>
            <div style={headerStyle}>SENTIMENTO COMMUNITY</div>
            <div style={dominantSentimentStyle}>{sentiment.dominant}</div>
            <SentimentBar sentiment={sentiment} />
            <div style={sentimentNumbersStyle}>
                <div>
                    <div>Negativo</div>
                    <i className="bi bi-emoji-frown" style={{color: 'red'}}></i>
                    <span style={{color: 'red'}}>{sentiment.negative}</span>
                    <span>{sentiment.Negativo}</span>
                </div>
                <div>
                    <div>Neutrale</div>
                    <i className="bi bi-emoji-neutral" style={{color: 'orange'}}></i>
                    <span style={{color: 'orange'}}>{sentiment.neutral}</span>
                    <span>{sentiment.Neutrale}</span>
                </div>
                <div>
                    <div>Positivo</div>
                    <i className="bi bi-emoji-smile" style={{color: 'green'}}></i>
                    <span style={{color: 'green'}}>{sentiment.positive}</span>
                    <span>{sentiment.Positivo}</span>
                </div>
            </div>
        </div>
    );
};

export default SentimentCard;