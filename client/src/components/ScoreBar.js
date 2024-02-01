const ScoreBar = ({ upvotes, downvotes }) => {
    const totalVotes = upvotes + downvotes;
    const upvotePercentage = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
    const downvotePercentage = totalVotes > 0 ? (downvotes / totalVotes) * 100 : 0;

    return (
        <div className="score-bar">
            <div className={`score-value up`} style={{ width: `${upvotePercentage}%` }}></div>
            <div className={`score-value down`} style={{ width: `${downvotePercentage}%` }}></div>
        </div>
    );
};

export default ScoreBar;