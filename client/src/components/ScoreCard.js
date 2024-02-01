import ScoreBar from "./ScoreBar";

const ScoreCard = ({ upvotes, downvotes }) => {
    return (
        <div className="score-card">
            <div className="score-header">DISTRIBUZIONE SCORE</div>
            <ScoreBar upvotes={upvotes} downvotes={downvotes}/>
            <div className="score-numbers">
                <div>
                    <div>Upvote</div>
                    <i className="bi bi-arrow-up score-icon up"></i>
                    <span>{upvotes}</span>
                </div>
                <div>
                    <div>Downvote</div>
                    <i className="bi bi-arrow-down score-icon down"></i>
                    <span>{downvotes}</span>
                </div>
                
            </div>
        </div>
    );
};

export default ScoreCard;