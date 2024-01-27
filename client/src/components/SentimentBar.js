const sentimentBarStyle = {
    display: 'flex',
    height: '20px',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '10px'
};

const sentimentValueStyle = {
    height: '100%',
    transition: 'width 0.5s ease-in-out'
};

const SentimentBar = ({ sentiment }) => (
    <div style={sentimentBarStyle}>
        <div style={{ ...sentimentValueStyle, width: `${sentiment.Negativo * 100}%`, backgroundColor: 'red', borderRadius: '10px' }}></div>
        <div style={{ ...sentimentValueStyle, width: `${sentiment.Neutrale * 100}%`, backgroundColor: 'orange' , borderRadius: '10px' }}></div>
        <div style={{ ...sentimentValueStyle, width: `${sentiment.Positivo * 100}%`, backgroundColor: 'green' , borderRadius: '10px' }}></div>
    </div>
);

export default SentimentBar;