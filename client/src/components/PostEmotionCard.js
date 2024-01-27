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
    Rabbia: { className: "bi bi-emoji-angry", color: "red" }, 
    Gioia: { className: "bi bi-emoji-laughing", color: "yellow" }, 
    Tristezza: { className: "bi bi-emoji-frown", color: "blue" },
    Paura: { className: "bi bi-emoji-dizzy", color: "purple" },
};

const iconStyle = {
    fontSize: '3em',  // Puoi aumentare questo valore per rendere l'icona più grande
    display: 'block', // Assicura che l'icona sia su una nuova riga
    textAlign: 'center' // Centra l'icona
};

const PostEmotionCard = ({ emotion }) => {
    // Calcola lo stile aggiornato dell'icona all'interno del componente per accedere a `emotion`
    const updatedIconStyle = {
        ...iconStyle,
        // Se `emotion` esiste in `emotionIcons`, usa il suo colore, altrimenti usa 'black'
        color: emotionIcons[emotion] ? emotionIcons[emotion].color : 'black',
    };

    return (
        <div style={cardStyle}>
            <div style={headerStyle}>EMOZIONE DEL POST</div>
            <div style={emotionStyle}>{emotion}</div>
            <div style={emotionStyle}>
                {emotion && 
                    // Usa `updatedIconStyle` qui per assicurarti che lo stile venga calcolato con il valore corrente di `emotion`
                    <i className={emotionIcons[emotion] ? emotionIcons[emotion].className : ''} style={updatedIconStyle}></i>
                }
            </div>
        </div>
    );
};


export default PostEmotionCard;
