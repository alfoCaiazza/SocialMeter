import React from 'react';
import ReactWordcloud from 'react-wordcloud';

const WordCloudComponent = ({ words, options }) => {
  return <ReactWordcloud words={words} options={options} />;
};

export default WordCloudComponent;
