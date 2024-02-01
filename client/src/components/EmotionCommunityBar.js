const EmotionBar = ({ emotion }) => (
    <div className="emotion-bar">
        <div className={`emotion-value anger`} style={{ width: `${emotion.Rabbia * 100}%` }}></div>
        <div className={`emotion-value joy`} style={{ width: `${emotion.Gioia * 100}%` }}></div>
        <div className={`emotion-value sadness`} style={{ width: `${emotion.Tristezza * 100}%` }}></div>
        <div className={`emotion-value fear`} style={{ width: `${emotion.Paura * 100}%` }}></div>
    </div>
);

export default EmotionBar;