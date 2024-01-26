import React from 'react';
import SentimentSummaryBar from './SentimentSummaryBar';

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

const valueStyle = {
  fontWeight: 'bold',
  fontSize: '1.2em',
  textAlign: 'center',
  margin: '10px 0'
};

const sentimentNumbersStyle = {
    display: 'flex',
    justifyContent: 'space-between'
};

const SentimentSummaryCard = ({ positivity, negativity, neutrality, dominantSentiment }) => {
  return (
    <div style={cardStyle}>
      <div style={headerStyle}>SENTIMENTO POST</div>
      <div style={valueStyle}>{dominantSentiment}</div>
      <SentimentSummaryBar
        positivity={positivity}
        negativity={negativity}
        neutrality={neutrality}
      />
      <div style={sentimentNumbersStyle}>
            <div>
                <div>Negativo</div>
                <i className="bi bi-emoji-frown" style={{color: 'red'}}></i>
                <span>{negativity}%</span>
            </div>
            <div>
                <div>Neutrale</div>
                <i className="bi bi-emoji-neutral" style={{color: 'orange'}}></i>
                <span>{neutrality}%</span>
            </div>
            <div>
                <div>Positivo</div>
                <i className="bi bi-emoji-smile" style={{color: 'green'}}></i>
                <span>{positivity}%</span>
            </div>
        </div>
    </div>
  );
};

export default SentimentSummaryCard;
