import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockPoll.css';

const StockPoll = () => {
  const [pollData, setPollData] = useState({
    question: "Which tech stock will perform best this week?",
    options: [
      { symbol: 'AAPL', name: 'Apple Inc.', votes: 0 },
      { symbol: 'MSFT', name: 'Microsoft', votes: 0 },
      { symbol: 'GOOGL', name: 'Alphabet', votes: 0 },
      { symbol: 'META', name: 'Meta Platforms', votes: 0 }
    ],
    totalVotes: 0,
    userVote: null
  });

  const [stockPrices, setStockPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const API_KEY = 'cvgngd1r01qi76d425u0cvgngd1r01qi76d425ug';

  useEffect(() => {
    fetchStockPrices();
    const interval = setInterval(fetchStockPrices, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchStockPrices = async () => {
    try {
      const promises = pollData.options.map(option =>
        axios.get(`https://finnhub.io/api/v1/quote?symbol=${option.symbol}&token=${API_KEY}`)
      );
      const responses = await Promise.all(promises);
      const prices = {};
      responses.forEach((response, index) => {
        prices[pollData.options[index].symbol] = {
          price: response.data.c,
          change: response.data.dp
        };
      });
      setStockPrices(prices);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching stock prices:', error);
      setLoading(false);
    }
  };

  const handleVote = (symbol) => {
    if (pollData.userVote === symbol) return; // Prevent double voting

    setPollData(prevData => {
      const updatedOptions = prevData.options.map(option => {
        if (option.symbol === symbol) {
          return { ...option, votes: option.votes + 1 };
        }
        return option;
      });

      return {
        ...prevData,
        options: updatedOptions,
        totalVotes: prevData.totalVotes + 1,
        userVote: symbol
      };
    });
  };

  const calculatePercentage = (votes) => {
    if (pollData.totalVotes === 0) return 0;
    return ((votes / pollData.totalVotes) * 100).toFixed(1);
  };

  return (
    <div className="stock-poll">
      <h2>Stock Market Poll</h2>
      <p className="poll-question">{pollData.question}</p>
      
      <div className="poll-options">
        {pollData.options.map((option) => {
          const percentage = calculatePercentage(option.votes);
          const isVoted = pollData.userVote === option.symbol;
          const stockPrice = stockPrices[option.symbol];
          
          return (
            <div 
              key={option.symbol} 
              className={`poll-option ${isVoted ? 'voted' : ''}`}
              onClick={() => handleVote(option.symbol)}
            >
              <div className="option-header">
                <span className="option-symbol">{option.symbol}</span>
                <span className="option-name">{option.name}</span>
              </div>
              
              {!loading && stockPrice && (
                <div className="stock-info">
                  <span className="stock-price">${stockPrice.price.toFixed(2)}</span>
                  <span className={`stock-change ${stockPrice.change >= 0 ? 'positive' : 'negative'}`}>
                    {stockPrice.change >= 0 ? '+' : ''}{stockPrice.change.toFixed(2)}%
                  </span>
                </div>
              )}
              
              <div className="vote-bar">
                <div 
                  className="vote-fill"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              
              <div className="vote-count">
                {option.votes} votes ({percentage}%)
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="poll-footer">
        <span className="total-votes">
          Total Votes: {pollData.totalVotes}
        </span>
        {pollData.userVote && (
          <span className="voted-message">
            You voted for {pollData.options.find(opt => opt.symbol === pollData.userVote)?.symbol}
          </span>
        )}
      </div>
    </div>
  );
};

export default StockPoll; 