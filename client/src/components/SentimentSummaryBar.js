const barStyle = {
  display: 'flex',
  height: '20px',
  borderRadius: '5px',
  overflow: 'hidden',
  marginBottom: '10px'
};

const valueStyle = {
  height: '100%',
  transition: 'width 0.5s ease-in-out'
};

const SentimentSummaryBar = ({ positivity, negativity, neutrality }) => {
    const convertedPositivity = positivity * 100;
    const convertedNegativity = negativity * 100;
    const convertedNeutrality = neutrality * 100;
  return (
    <div style={barStyle}>
      <div style={{ ...valueStyle, width: `${convertedNegativity}%`, backgroundColor: 'red', borderRadius: '10px' }}></div>
      <div style={{ ...valueStyle, width: `${convertedNeutrality}%`, backgroundColor: 'orange', borderRadius: '10px' }}></div>
      <div style={{ ...valueStyle, width: `${convertedPositivity}%`, backgroundColor: 'green', borderRadius: '10px' }}></div>
    </div>
  );
};

export default SentimentSummaryBar;
