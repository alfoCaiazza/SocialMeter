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

const emotionIcons = {
    Rabbia: "bi bi-emoji-angry",
    Gioia: "bi bi-emoji-laughing",
    Tristezza: "bi bi-emoji-frown",
    Paura: "bi bi-emoji-dizzy",
};

const iconStyle = {
    fontSize: '2em',  // Puoi aumentare questo valore per rendere l'icona più grande
    display: 'block', // Assicura che l'icona sia su una nuova riga
    textAlign: 'center' // Centra l'icona
};

const PostEmotionCard = ({ emotion }) => (
    <div style={cardStyle}>
        <div style={headerStyle}>EMOZIONE DEL POST</div>
        <div style={emotionStyle}>{emotion}</div>
        <div style={emotionStyle}>
            {emotion && 
                <i className={emotionIcons[emotion]} style={iconStyle}></i>
            }
        </div>
    </div>
);

export default PostEmotionCard;
