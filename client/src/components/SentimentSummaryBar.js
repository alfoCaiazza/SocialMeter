const SentimentSummaryBar = ({ positivity, negativity, neutrality }) => {
  const convertedPositivity = positivity * 100;
  const convertedNegativity = negativity * 100;
  const convertedNeutrality = neutrality * 100;

return (
  <div className="sentiment-summary-bar">
    <div className={`sentiment-value-bar negative`} style={{ width: `${convertedNegativity}%` }}></div>
    <div className={`sentiment-value-bar neutral`} style={{ width: `${convertedNeutrality}%` }}></div>
    <div className={`sentiment-value-bar positive`} style={{ width: `${convertedPositivity}%` }}></div>
  </div>
);
};


export default SentimentSummaryBar;
