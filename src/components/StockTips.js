import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './StockTips.css';

const StockTips = () => {
  const [tips, setTips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_KEY = 'cvdcrq1r01qm9khk2rdgcvdcrq1r01qm9khk2re0';

  const popularStocks = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'META', 'TSLA', 'NVDA', 'INTC'];

  useEffect(() => {
    fetchStockTips();
    const interval = setInterval(fetchStockTips, 300000); // Update every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const fetchStockTips = async () => {
    try {
      setLoading(true);
      const tipsData = await Promise.all(
        popularStocks.map(async (symbol) => {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
          );
          const data = response.data;
          
          // Calculate technical indicators
          const currentPrice = data.c;
          const previousClose = data.pc;
          const highPrice = data.h;
          const lowPrice = data.l;
          const priceChange = currentPrice - previousClose;
          const priceChangePercent = data.dp;
          
          // Generate AI-powered analysis
          const trend = priceChangePercent > 0 ? 'bullish' : 'bearish';
          const momentum = Math.abs(priceChangePercent);
          const volatility = ((highPrice - lowPrice) / previousClose) * 100;
          
          // Generate recommendation
          let recommendation = '';
          if (momentum > 2 && trend === 'bullish') {
            recommendation = 'Strong Buy';
          } else if (momentum > 2 && trend === 'bearish') {
            recommendation = 'Strong Sell';
          } else if (momentum > 1) {
            recommendation = trend === 'bullish' ? 'Buy' : 'Sell';
          } else {
            recommendation = 'Hold';
          }

          return {
            symbol,
            currentPrice,
            priceChange,
            priceChangePercent,
            recommendation,
            trend,
            momentum,
            volatility
          };
        })
      );

      setTips(tipsData);
      setError(null);
    } catch (err) {
      setError('Failed to fetch stock tips. Please try again later.');
      console.error('Error fetching stock tips:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="stock-tips">
        <h2>AI-Powered Stock Tips</h2>
        <div className="loading">Loading stock tips...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="stock-tips">
        <h2>AI-Powered Stock Tips</h2>
        <div className="error">{error}</div>
      </div>
    );
  }

  return (
    <div className="stock-tips">
      <h2>AI-Powered Stock Tips</h2>
      <div className="tips-grid">
        {tips.map((tip) => (
          <div key={tip.symbol} className={`tip-card ${tip.trend}`}>
            <div className="tip-header">
              <h3>{tip.symbol}</h3>
              <span className={`recommendation ${tip.recommendation.toLowerCase()}`}>
                {tip.recommendation}
              </span>
            </div>
            
            <div className="tip-content">
              <div className="price-info">
                <span className="current-price">${tip.currentPrice.toFixed(2)}</span>
                <span className={`price-change ${tip.priceChange >= 0 ? 'positive' : 'negative'}`}>
                  {tip.priceChange >= 0 ? '+' : ''}{tip.priceChange.toFixed(2)} ({tip.priceChangePercent.toFixed(2)}%)
                </span>
              </div>
              
              <div className="technical-indicators">
                <div className="indicator">
                  <span className="label">Momentum:</span>
                  <span className={`value ${tip.momentum > 2 ? 'strong' : ''}`}>
                    {tip.momentum.toFixed(2)}%
                  </span>
                </div>
                <div className="indicator">
                  <span className="label">Volatility:</span>
                  <span className="value">{tip.volatility.toFixed(2)}%</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StockTips; 