import React, { useState, useEffect } from 'react';
import { Box, Card, CardContent, Typography, Grid, CircularProgress } from '@mui/material';
import axios from 'axios';
import './MarketOverview.css';

const MarketOverview = () => {
  // Initial mock data to show immediately
  const initialData = {
    'AAPL': { c: 175.50, h: 176.00, l: 174.50, pc: 174.00, name: 'Apple', region: 'US', icon: '🍎' },
    'GOOGL': { c: 140.50, h: 141.00, l: 139.50, pc: 139.00, name: 'Google', region: 'US', icon: '🔍' },
    'MSFT': { c: 380.20, h: 381.00, l: 379.50, pc: 378.00, name: 'Microsoft', region: 'US', icon: '💻' },
    'AMZN': { c: 175.50, h: 176.00, l: 174.50, pc: 174.00, name: 'Amazon', region: 'US', icon: '📦' },
    'META': { c: 480.20, h: 481.00, l: 479.50, pc: 478.00, name: 'Meta', region: 'US', icon: '👥' },
    'TSLA': { c: 190.50, h: 191.00, l: 189.50, pc: 189.00, name: 'Tesla', region: 'US', icon: '🚗' }
  };

  const [marketData, setMarketData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(300);

  const API_KEY = 'cvhrsa9r01qgkck5r6s0cvhrsa9r01qgkck5r6sg';

  const fetchMarketData = async () => {
    try {
      setLoading(true);
      const symbols = Object.keys(initialData);
      const newData = { ...marketData };

      for (const symbol of symbols) {
        try {
          const response = await axios.get(
            `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
          );

          if (response.data && response.data.c > 0) {
            newData[symbol] = {
              ...response.data,
              name: initialData[symbol].name,
              region: initialData[symbol].region,
              icon: initialData[symbol].icon,
              lastUpdated: new Date().toLocaleTimeString()
            };
          }
        } catch (err) {
          console.warn(`Error fetching data for ${symbol}:`, err);
        }
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      setMarketData(newData);
      setError(null);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError('Unable to update live data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Start fetching real data immediately after showing initial data
    fetchMarketData();

    const refreshInterval = setInterval(fetchMarketData, 300000);
    const countdownInterval = setInterval(() => {
      setCountdown(prev => (prev > 0 ? prev - 1 : 300));
    }, 1000);

    return () => {
      clearInterval(refreshInterval);
      clearInterval(countdownInterval);
    };
  }, []);

  const renderMarketCard = (symbol) => {
    const data = marketData[symbol];
    if (!data) return null;

    const change = data.c - data.pc;
    const changePercent = (change / data.pc) * 100;
    const isPositive = change >= 0;

    return (
      <Grid item xs={12} sm={6} md={4} key={symbol}>
        <Card className={`market-card ${isPositive ? 'positive' : 'negative'}`}>
          <CardContent>
            <Box className="card-header">
              <span className="stock-icon">{data.icon}</span>
              <Box>
                <Typography variant="h6" component="h2" className="stock-name">
                  {data.name}
                </Typography>
                <Typography color="textSecondary" className="stock-symbol">
                  {symbol}
                </Typography>
              </Box>
            </Box>
            
            <Box className="price-container">
              <Typography variant="h4" component="p" className="price">
                ${data.c?.toFixed(2)}
              </Typography>
              <Typography className={`change ${isPositive ? 'positive' : 'negative'}`}>
                {isPositive ? '▲' : '▼'} {Math.abs(change?.toFixed(2))} ({Math.abs(changePercent?.toFixed(2))}%)
              </Typography>
            </Box>

            <Box className="details">
              <div className="detail-row">
                <span>Day's High</span>
                <span>${data.h?.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span>Day's Low</span>
                <span>${data.l?.toFixed(2)}</span>
              </div>
              <div className="detail-row">
                <span>Previous Close</span>
                <span>${data.pc?.toFixed(2)}</span>
              </div>
            </Box>

            {data.lastUpdated && (
              <Typography variant="caption" className="update-time">
                Last updated: {data.lastUpdated}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Grid>
    );
  };

  return (
    <Box className="market-overview">
      <Box className="header">
        <Typography variant="h4" component="h1">
          Market Overview
        </Typography>
        <Typography variant="subtitle1" className="update-info">
          {loading ? 'Updating...' : `Next update in: ${Math.floor(countdown / 60)}:${(countdown % 60).toString().padStart(2, '0')}`}
        </Typography>
      </Box>

      {error && (
        <Typography color="error" className="error-message">
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {Object.keys(initialData).map(symbol => renderMarketCard(symbol))}
      </Grid>
    </Box>
  );
};

export default MarketOverview; 