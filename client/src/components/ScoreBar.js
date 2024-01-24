const sentimentBarStyle = {
    display: 'flex',
    height: '20px',
    borderRadius: '5px',
    overflow: 'hidden',
    marginBottom: '10px',
    marginTop: '45px'
};

const sentimentValueStyle = {
    height: '100%',
    transition: 'width 0.5s ease-in-out'
};

const ScoreBar = ({ upvotes, downvotes }) => {
    const totalVotes = upvotes + downvotes;
    const upvotePercentage = totalVotes > 0 ? (upvotes / totalVotes) * 100 : 0;
    const downvotePercentage = totalVotes > 0 ? (downvotes / totalVotes) * 100 : 0;

    return (
        <div style={sentimentBarStyle}>
            <div style={{  ...sentimentValueStyle, width: `${upvotePercentage}%`, backgroundColor: 'blue', borderRadius: '10px'}}></div>
            <div style={{  ...sentimentValueStyle, width: `${downvotePercentage}%`, backgroundColor: 'red', borderRadius: '10px'}}></div>
        </div>
    );
};

export default ScoreBar;