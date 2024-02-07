import React from 'react';
import SentimentSummaryBar from './SentimentSummaryBar';

const SentimentSummaryCard = ({ positivity, negativity, neutrality, dominantSentiment }) => {
  const roundedPositivity = parseFloat(positivity.toFixed(2));
  const roundedNegativity = parseFloat(negativity.toFixed(2));
  const roundedNeutrality = parseFloat(neutrality.toFixed(2));

  return (
    <div className="sentiment-summary-card">
      <div className="sentiment-header">SENTIMENTO POST<br/>BERT</div>
      <div className="sentiment-value">{dominantSentiment}</div>
      <SentimentSummaryBar
        positivity={positivity}
        negativity={negativity}
        neutrality={neutrality}
      />
      <div className="sentiment-numbers">
            <div>
                <div>Negativo</div>
                <i className="bi bi-emoji-frown sentiment-icon"></i>
                <span>{roundedNegativity}%</span>
            </div>
            <div>
                <div>Neutrale</div>
                <i className="bi bi-emoji-neutral sentiment-icon neutral"></i>
                <span>{roundedNeutrality}%</span>
            </div>
            <div>
                <div>Positivo</div>
                <i className="bi bi-emoji-smile sentiment-icon positive"></i>
                <span>{roundedPositivity}%</span>
            </div>
        </div>
    </div>
  );
};


export default SentimentSummaryCard;
