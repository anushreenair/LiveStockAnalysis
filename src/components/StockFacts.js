import React, { useState, useEffect } from 'react';
import './StockFacts.css';

const StockFacts = () => {
  const [currentFact, setCurrentFact] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const stockFacts = [
    {
      fact: "The New York Stock Exchange was founded in 1792 under a buttonwood tree on Wall Street.",
      icon: "🌳"
    },
    {
      fact: "The first stock ticker was invented in 1867 by Edward Calahan, allowing stock prices to be transmitted over telegraph.",
      icon: "📡"
    },
    {
      fact: "The Dow Jones Industrial Average was created in 1896 and initially consisted of just 12 companies.",
      icon: "📊"
    },
    {
      fact: "The first stock market crash in the United States occurred in 1792, just months after the NYSE was founded.",
      icon: "📉"
    },
    {
      fact: "The NASDAQ was the world's first electronic stock market, founded in 1971.",
      icon: "💻"
    },
    {
      fact: "The largest single-day percentage gain in the Dow Jones was 15.34% on March 15, 1933.",
      icon: "📈"
    },
    {
      fact: "The first company to reach a $1 trillion market cap was Apple in 2018.",
      icon: "🍎"
    },
    {
      fact: "The term 'bull market' comes from the way bulls attack their prey, thrusting their horns upward.",
      icon: "🐂"
    },
    {
      fact: "The term 'bear market' comes from the way bears attack their prey, swiping their paws downward.",
      icon: "🐻"
    },
    {
      fact: "The first stock exchange in the world was the Amsterdam Stock Exchange, founded in 1602.",
      icon: "🏛️"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentFact((prev) => (prev + 1) % stockFacts.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="stock-facts-container">
      <h2>Did You Know?</h2>
      <div className={`fact-card ${isVisible ? 'visible' : 'hidden'}`}>
        <div className="fact-icon">{stockFacts[currentFact].icon}</div>
        <p className="fact-text">{stockFacts[currentFact].fact}</p>
      </div>
      <div className="fact-progress">
        {stockFacts.map((_, index) => (
          <div
            key={index}
            className={`progress-dot ${index === currentFact ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default StockFacts; 