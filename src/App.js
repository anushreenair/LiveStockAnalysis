import './App.css';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
} from 'chart.js';
import axios from 'axios';
import News from './pages/News';
import Portfolio from './components/Portfolio';
import Account from './components/Account';
import Footer from './components/Footer';
import StockPoll from './components/StockPoll';
import FunStockPrediction from './components/FunStockPrediction';
import InvestmentStyleQuiz from './components/InvestmentStyleQuiz';
import HistoricalEvents from './components/HistoricalEvents';
import Leaderboard from './components/Leaderboard';
import StockFacts from './components/StockFacts';
import MarketOverview from './components/MarketOverview';
import Login from './components/Login';
import { mockStockData } from './utils/mockData';

// Register Chart.js components
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Remove this line from outside the component
// const [searchQuery, setSearchQuery] = useState('');

function App() {
  // Add searchQuery state inside the component
  const [searchQuery, setSearchQuery] = useState('');
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stockSymbol, setStockSymbol] = useState('AAPL');
  const [prediction, setPrediction] = useState(null);
  const [predictionError, setPredictionError] = useState('');
  const [articles, setArticles] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const API_KEY = 'cvdcrq1r01qm9khk2rdgcvdcrq1r01qm9khk2re0'; // Finnhub API key

  useEffect(() => {
    // Check login status on component mount
    const loginStatus = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loginStatus);
  }, []);

  useEffect(() => {
    // Update theme when darkMode changes
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const fetchLiveStockData = async () => {
      try {
        const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${stockSymbol}&token=${API_KEY}`
        );

        const { c: currentPrice, t: timestamp } = response.data;

        // Prepare data for the chart
        const time = new Date(timestamp * 1000).toLocaleTimeString();

        setChartData((prevData) => {
          const updatedLabels = prevData ? [...prevData.labels, time] : [time];
          const updatedData = prevData
            ? [...prevData.datasets[0].data, currentPrice]
            : [currentPrice];

          return {
            labels: updatedLabels,
            datasets: [
              {
                label: `${stockSymbol} Stock Price`,
                data: updatedData,
                borderColor: '#61dafb',
                backgroundColor: 'rgba(97, 218, 251, 0.2)',
                tension: 0.4,
              },
            ],
          };
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching live stock data:', error);
        setLoading(false);
      }
    };

    // Fetch data every 5 seconds
    const interval = setInterval(fetchLiveStockData, 5000);

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [stockSymbol]);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const articlesResponse = await axios.get(
          `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`
        );

        setArticles(articlesResponse.data.slice(0, 5)); // Get top 5 articles
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, []);

  const predictStockTrend = async (symbol) => {
    try {
      setPredictionError('');
      setLoading(true);

      // Validate symbol
      if (!symbol.match(/^[A-Z]{1,5}$/)) {
        setPredictionError('Invalid symbol format. Please enter a valid stock symbol.');
        return;
      }

      let stockData;
      try {
        // Try API first
        const response = await axios.get(
          `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`
        );
        
        // Check if we got valid data
        if (!response.data || response.data.c === 0) {
          throw new Error('Invalid data received');
        }
        
        stockData = response.data;
      } catch (error) {
        // Check if symbol exists in mock data
        if (mockStockData[symbol]) {
          stockData = mockStockData[symbol];
          setPredictionError('Using historical data for prediction (API unavailable)');
        } else {
          // Generate synthetic data based on symbol pattern
          const basePrice = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
          stockData = {
            c: basePrice + Math.random() * 50,
            h: basePrice + Math.random() * 60,
            l: basePrice + Math.random() * 40,
            pc: basePrice + Math.random() * 45,
          };
          setPredictionError('Using simulated data for demonstration');
        }
      }

      // Enhanced technical analysis
      const currentPrice = stockData.c;
      const previousClose = stockData.pc;
      const highPrice = stockData.h;
      const lowPrice = stockData.l;

      // Calculate multiple technical indicators
      const priceChange = currentPrice - previousClose;
      const priceRange = highPrice - lowPrice;
      const momentum = priceChange / previousClose;
      const relativeStrength = (currentPrice - lowPrice) / (highPrice - lowPrice);
      
      // Weighted prediction using multiple factors
      const trendFactor = momentum * 0.4 + relativeStrength * 0.6;
      const predictedChange = trendFactor * priceRange;
      const predictedPrice = currentPrice + predictedChange;

      // Enhanced confidence calculation
      const volatility = priceRange / previousClose;
      const trendStrength = Math.abs(trendFactor);
      const confidence = Math.min(Math.max((trendStrength * 70 + (1 - volatility) * 30), 30), 90);

      setPrediction({
        symbol,
        currentPrice: currentPrice.toFixed(2),
        predictedPrice: predictedPrice.toFixed(2),
        confidence: confidence.toFixed(1),
        trend: predictedChange >= 0 ? 'upward' : 'downward',
        priceChange: priceChange.toFixed(2),
        volatility: (volatility * 100).toFixed(1)
      });

    } catch (error) {
      setPredictionError('Unable to generate prediction. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Update handleSearch function to use searchQuery
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search functionality here
      console.log('Search query:', searchQuery);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div className={`App ${darkMode ? 'dark' : 'light'}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <div className="app-container">
                <nav className="navbar">
                  <div className="nav-brand">
                    <Link to="/">StockWizard</Link>
                  </div>
                  <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/news">News</Link>
                    <Link to="/portfolio">Portfolio</Link>
                    <Link to="/account">Account</Link>
                    <button onClick={toggleTheme} className="theme-toggle">
                      {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </div>
                </nav>

                <div className="page-content">
                  <h1>Welcome to StockWizard!</h1>
                  <MarketOverview />
                  <div className="stock-input">
                    <input
                      type="text"
                      value={stockSymbol}
                      onChange={(e) => setStockSymbol(e.target.value.toUpperCase())}
                      placeholder="Enter stock symbol"
                    />
                    <button 
                      onClick={() => predictStockTrend(stockSymbol)}
                      disabled={!stockSymbol}
                      className="predict-button"
                    >
                      Predict Trend
                    </button>
                  </div>

                  <div className="prediction-chart-container">
                    <div className="prediction-chart-layout">
                      <div className="chart-section">
                        {loading ? (
                          <p>Loading live stock data...</p>
                        ) : chartData ? (
                          <Line
                            data={chartData}
                            options={{
                              responsive: true,
                              maintainAspectRatio: false,
                              plugins: {
                                legend: {
                                  display: true,
                                  position: 'top',
                                },
                              },
                              scales: {
                                x: {
                                  title: {
                                    display: true,
                                    text: 'Time',
                                    color: darkMode ? '#fff' : '#000',
                                  },
                                  ticks: {
                                    color: darkMode ? '#fff' : '#000',
                                  },
                                },
                                y: {
                                  title: {
                                    display: true,
                                    text: 'Price (USD)',
                                    color: darkMode ? '#fff' : '#000',
                                  },
                                  ticks: {
                                    color: darkMode ? '#fff' : '#000',
                                  },
                                },
                              },
                            }}
                          />
                        ) : (
                          <p>No data available</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="articles-events-container">
                    <div className="articles-section">
                      <h2>Latest Articles</h2>
                      <div className="articles">
                        {articles.map((article, index) => (
                          <div key={index} className="article">
                            <h3>{article.headline}</h3>
                            <p>{article.summary}</p>
                            <a href={article.url} target="_blank" rel="noopener noreferrer">Read more</a>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="interactive-features">
                      <h2>Interactive Features</h2>
                      <div className="interactive-row">
                        <div className="interactive-column">
                          <InvestmentStyleQuiz />
                        </div>
                        <div className="interactive-column">
                          <HistoricalEvents />
                        </div>
                      </div>
                    </div>

                    <StockFacts />
                  </div>
                </div>

                <Footer />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/news" element={
            <ProtectedRoute>
              <div className="app-container">
                <nav className="navbar">
                  <div className="nav-brand">
                    <Link to="/">StockWizard</Link>
                  </div>
                  <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/news">News</Link>
                    <Link to="/portfolio">Portfolio</Link>
                    <Link to="/account">Account</Link>
                    <button onClick={toggleTheme} className="theme-toggle">
                      {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </div>
                </nav>
                <News />
                <Footer />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/portfolio" element={
            <ProtectedRoute>
              <div className="app-container">
                <nav className="navbar">
                  <div className="nav-brand">
                    <Link to="/">StockWizard</Link>
                  </div>
                  <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/news">News</Link>
                    <Link to="/portfolio">Portfolio</Link>
                    <Link to="/account">Account</Link>
                    <button onClick={toggleTheme} className="theme-toggle">
                      {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </div>
                </nav>
                <Portfolio />
                <Footer />
              </div>
            </ProtectedRoute>
          } />

          <Route path="/account" element={
            <ProtectedRoute>
              <div className="app-container">
                <nav className="navbar">
                  <div className="nav-brand">
                    <Link to="/">StockWizard</Link>
                  </div>
                  <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/news">News</Link>
                    <Link to="/portfolio">Portfolio</Link>
                    <Link to="/account">Account</Link>
                    <button onClick={toggleTheme} className="theme-toggle">
                      {darkMode ? '☀️' : '🌙'}
                    </button>
                    <button onClick={handleLogout} className="logout-button">
                      Logout
                    </button>
                  </div>
                </nav>
                <Account />
                <Footer />
              </div>
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
