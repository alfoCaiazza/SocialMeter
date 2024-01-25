import EmotionCommunityBar from "./EmotionCommunityBar";

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

const dominantEmotionStyle = {
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    margin: '10px 0'
};

const emotionNumbersStyle = {
    display: 'flex',
    justifyContent: 'space-around'
};

const EmotionCard = ({ emotion }) => (
    <div style={cardStyle}>
        <div style={headerStyle}>EMOZIONI COMMUNITY</div>
        <div style={dominantEmotionStyle}>{emotion.dominant}</div>
        <EmotionCommunityBar emotion={emotion} />
        <div style={emotionNumbersStyle}>
            <div>
                <div>Rabbia</div>
                <i className="bi bi-emoji-angry" style={{color: 'red'}}></i>
                <span>{emotion.Rabbia}</span>
            </div>
            <div>
                <div>Gioia</div>
                <i className="bi bi-emoji-laughing" style={{color: 'yellow'}}></i>
                <span>{emotion.Gioia}</span>
            </div>
            <div>
                <div>Tristezza</div>
                <i className="bi bi-emoji-frown" style={{color: 'blue'}}></i>
                <span>{emotion.Tristezza}</span>
            </div>
            <div>
                <div>Paura</div>
                <i className="bi bi-emoji-dizzy" style={{color: 'purple'}}></i>
                <span>{emotion.Paura}</span>
            </div>
        </div>
    </div>
);

export default EmotionCard;