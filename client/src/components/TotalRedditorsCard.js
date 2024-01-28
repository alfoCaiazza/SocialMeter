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

const emotionStyle = {
    textAlign: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    margin: '10px 0'
};

const iconStyle = {
    fontSize: '2.4em',  // Puoi aumentare questo valore per rendere l'icona più grande
    display: 'block', // Assicura che l'icona sia su una nuova riga
    textAlign: 'center', // Centra l'icona
    color: 'red'
};

const PostEmotionCard = ({ number }) => (
    <div style={cardStyle}>
        <div style={headerStyle}>REDDITORS TOTALI</div>
        <div style={emotionStyle}>{number}</div>
        <div style={emotionStyle}>
            <i className="bi bi-reddit" style={iconStyle}></i>
        </div>
    </div>
);

export default PostEmotionCard;
