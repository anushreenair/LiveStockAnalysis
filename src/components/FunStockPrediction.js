import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Fade,
  Chip
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import './FunStockPrediction.css';

const FunStockPrediction = () => {
  const [symbol, setSymbol] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generatePrediction = () => {
    if (!symbol) {
      setError('Please enter a stock symbol');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call with timeout
    setTimeout(() => {
      const randomTrend = Math.random() > 0.5 ? 'up' : 'down';
      const randomPercentage = (Math.random() * 5 + 1).toFixed(2);
      const confidence = (Math.random() * 30 + 60).toFixed(1);
      const currentPrice = (Math.random() * 500 + 50).toFixed(2);
      const predictedPrice = randomTrend === 'up' 
        ? (currentPrice * (1 + randomPercentage/100)).toFixed(2)
        : (currentPrice * (1 - randomPercentage/100)).toFixed(2);

      setPrediction({
        symbol: symbol.toUpperCase(),
        trend: randomTrend,
        percentage: randomPercentage,
        confidence: confidence,
        currentPrice: currentPrice,
        predictedPrice: predictedPrice
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <Card className="fun-prediction-card">
      <CardContent>
        <Box className="prediction-header">
          <ShowChartIcon className="prediction-icon" />
          <Typography variant="h5" component="h2">
            Fun Stock Prediction
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" className="prediction-subtitle">
          Enter a stock symbol and see what might happen next! (Just for fun!)
        </Typography>

        <Box className="prediction-input">
          <TextField
            fullWidth
            label="Stock Symbol"
            variant="outlined"
            value={symbol}
            onChange={(e) => setSymbol(e.target.value.toUpperCase())}
            error={!!error}
            helperText={error}
            placeholder="e.g., AAPL, GOOGL"
          />
          <Button
            variant="contained"
            onClick={generatePrediction}
            disabled={loading}
            startIcon={<TrendingUpIcon />}
            className="predict-button"
          >
            Predict Trend
          </Button>
        </Box>

        {loading && (
          <Box className="loading-container">
            <CircularProgress size={40} />
            <Typography>Analyzing market patterns...</Typography>
          </Box>
        )}

        {prediction && !loading && (
          <Fade in={true}>
            <Box className="prediction-result">
              <Box className="result-header">
                <EmojiEventsIcon className="trophy-icon" />
                <Typography variant="h6">
                  Prediction for {prediction.symbol}
                </Typography>
              </Box>

              <Box className="price-info">
                <div className="price-item">
                  <Typography variant="body2">Current Price</Typography>
                  <Typography variant="h6">${prediction.currentPrice}</Typography>
                </div>
                <div className="price-item">
                  <Typography variant="body2">Predicted Price</Typography>
                  <Typography variant="h6">${prediction.predictedPrice}</Typography>
                </div>
              </Box>

              <Box className="prediction-details">
                <Chip
                  label={`Trend: ${prediction.trend === 'up' ? '▲ Up' : '▼ Down'}`}
                  className={`trend-chip ${prediction.trend}`}
                />
                <Chip
                  label={`Change: ${prediction.percentage}%`}
                  className={`change-chip ${prediction.trend}`}
                />
                <Chip
                  label={`Confidence: ${prediction.confidence}%`}
                  className="confidence-chip"
                />
              </Box>

              <Typography variant="caption" className="disclaimer">
                * This is a fun prediction tool and should not be used for actual investment decisions.
              </Typography>
            </Box>
          </Fade>
        )}
      </CardContent>
    </Card>
  );
};

export default FunStockPrediction; 