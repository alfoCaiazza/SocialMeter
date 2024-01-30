import ScoreBar from "./ScoreBar";

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

const ScoreCard = ({ upvotes, downvotes }) => {
    return (
        <div style={cardStyle}>
            <div style={headerStyle}>DISTRIBUZIONE SCORE</div>
            <ScoreBar upvotes={upvotes} downvotes={downvotes}/>
            <div style={sentimentNumbersStyle}>
                <div>
                    <div>Upvote</div>
                    <i className="bi bi-arrow-up" style={{color:'blue'}}></i>
                    <span>{upvotes}</span>
                </div>
                <div>
                    <div>Downvote</div>
                    <i className="bi bi-arrow-down" style={{color:'red'}}></i>
                    <span>{downvotes}</span>
                </div>
                
            </div>
        </div>
    );
};

export default ScoreCard;