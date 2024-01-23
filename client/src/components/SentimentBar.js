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
        <div style={{ ...sentimentValueStyle, width: `${sentiment.Negativo}%`, backgroundColor: 'red', borderRadius: '10px' }}></div>
        <div style={{ ...sentimentValueStyle, width: `${sentiment.Neutrale}%`, backgroundColor: 'orange' , borderRadius: '10px' }}></div>
        <div style={{ ...sentimentValueStyle, width: `${sentiment.Positivo}%`, backgroundColor: 'green' , borderRadius: '10px' }}></div>
    </div>
);

export default SentimentBar;