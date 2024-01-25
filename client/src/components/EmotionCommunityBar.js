const emotionBarStyle = {
    display: 'flex',
    height: '20px',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '10px'
};

const emotionValueStyle = {
    height: '100%',
    transition: 'width 0.5s ease-in-out'
};

const EmotionBar = ({ emotion }) => (
    <div style={emotionBarStyle}>
        <div style={{ ...emotionValueStyle, width: `${emotion.Rabbia}%`, backgroundColor: 'red', borderRadius: '10px' }}></div>
        <div style={{ ...emotionValueStyle, width: `${emotion.Gioia}%`, backgroundColor: 'yellow' , borderRadius: '10px' }}></div>
        <div style={{ ...emotionValueStyle, width: `${emotion.Tristezza}%`, backgroundColor: 'blue' , borderRadius: '10px' }}></div>
        <div style={{ ...emotionValueStyle, width: `${emotion.Paura}%`, backgroundColor: 'purple' , borderRadius: '10px' }}></div>
    </div>
);

export default EmotionBar;