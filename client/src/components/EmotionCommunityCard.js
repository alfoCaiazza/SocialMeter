import EmotionBar from "./EmotionCommunityBar";

const EmotionCard = ({ emotion }) => (
    <div className="emotion-card">
        <div className="emotion-header">EMOZIONI COMMUNITY</div>
        <div className="dominant-emotion">{emotion.dominant}</div>
        <EmotionBar emotion={emotion} />
        <div className="emotion-numbers">
            <div>
                <div>Rabbia</div>
                <i className="bi bi-emoji-angry emotion-icon"></i>
                <span>{emotion.Rabbia}</span>
            </div>
            <div>
                <div>Gioia</div>
                <i className="bi bi-emoji-laughing emotion-icon joy"></i>
                <span>{emotion.Gioia}</span>
            </div>
            <div>
                <div>Tristezza</div>
                <i className="bi bi-emoji-frown emotion-icon sadness"></i>
                <span>{emotion.Tristezza}</span>
            </div>
            <div>
                <div>Paura</div>
                <i className="bi bi-emoji-dizzy emotion-icon fear"></i>
                <span>{emotion.Paura}</span>
            </div>
        </div>
    </div>
);


export default EmotionCard;