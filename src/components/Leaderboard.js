import React, { useState } from 'react';
import './Leaderboard.css';

const Leaderboard = () => {
  const [timeFrame, setTimeFrame] = useState('weekly');

  const leaderboardData = {
    weekly: [
      {
        rank: 1,
        username: "StockMaster",
        portfolioValue: "$1,234,567",
        return: "+15.8%",
        trades: 42,
        avatar: "👑",
        streak: "🔥 7 days"
      },
      {
        rank: 2,
        username: "TechTrader",
        portfolioValue: "$987,654",
        return: "+12.3%",
        trades: 38,
        avatar: "💻",
        streak: "🔥 5 days"
      },
      {
        rank: 3,
        username: "CryptoKing",
        portfolioValue: "$876,543",
        return: "+10.5%",
        trades: 35,
        avatar: "🚀",
        streak: "🔥 6 days"
      },
      {
        rank: 4,
        username: "ValueInvestor",
        portfolioValue: "$765,432",
        return: "+9.2%",
        trades: 28,
        avatar: "📈",
        streak: "🔥 4 days"
      },
      {
        rank: 5,
        username: "DayTraderPro",
        portfolioValue: "$654,321",
        return: "+8.7%",
        trades: 45,
        avatar: "⚡",
        streak: "🔥 3 days"
      }
    ],
    monthly: [
      {
        rank: 1,
        username: "ValueInvestor",
        portfolioValue: "$2,345,678",
        return: "+28.5%",
        trades: 156,
        avatar: "📈",
        streak: "🔥 30 days"
      },
      {
        rank: 2,
        username: "StockMaster",
        portfolioValue: "$2,123,456",
        return: "+25.3%",
        trades: 142,
        avatar: "👑",
        streak: "🔥 28 days"
      },
      {
        rank: 3,
        username: "TechTrader",
        portfolioValue: "$1,987,654",
        return: "+22.1%",
        trades: 138,
        avatar: "💻",
        streak: "🔥 25 days"
      },
      {
        rank: 4,
        username: "CryptoKing",
        portfolioValue: "$1,876,543",
        return: "+20.8%",
        trades: 135,
        avatar: "🚀",
        streak: "🔥 22 days"
      },
      {
        rank: 5,
        username: "DayTraderPro",
        portfolioValue: "$1,765,432",
        return: "+19.5%",
        trades: 145,
        avatar: "⚡",
        streak: "🔥 20 days"
      }
    ],
    allTime: [
      {
        rank: 1,
        username: "StockMaster",
        portfolioValue: "$5,678,901",
        return: "+156.8%",
        trades: 456,
        avatar: "👑",
        streak: "🔥 365 days"
      },
      {
        rank: 2,
        username: "ValueInvestor",
        portfolioValue: "$4,987,654",
        return: "+142.3%",
        trades: 423,
        avatar: "📈",
        streak: "🔥 340 days"
      },
      {
        rank: 3,
        username: "TechTrader",
        portfolioValue: "$4,876,543",
        return: "+138.5%",
        trades: 412,
        avatar: "💻",
        streak: "🔥 325 days"
      },
      {
        rank: 4,
        username: "CryptoKing",
        portfolioValue: "$4,765,432",
        return: "+132.1%",
        trades: 398,
        avatar: "🚀",
        streak: "🔥 310 days"
      },
      {
        rank: 5,
        username: "DayTraderPro",
        portfolioValue: "$4,654,321",
        return: "+128.7%",
        trades: 445,
        avatar: "⚡",
        streak: "🔥 300 days"
      }
    ]
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return "#FFD700"; // Gold
      case 2: return "#C0C0C0"; // Silver
      case 3: return "#CD7F32"; // Bronze
      default: return "#38bdf8";
    }
  };

  return (
    <div className="leaderboard-container">
      <h2>Top Traders Leaderboard</h2>
      <div className="timeframe-tabs">
        <button 
          className={`tab-button ${timeFrame === 'weekly' ? 'active' : ''}`}
          onClick={() => setTimeFrame('weekly')}
        >
          Weekly
        </button>
        <button 
          className={`tab-button ${timeFrame === 'monthly' ? 'active' : ''}`}
          onClick={() => setTimeFrame('monthly')}
        >
          Monthly
        </button>
        <button 
          className={`tab-button ${timeFrame === 'allTime' ? 'active' : ''}`}
          onClick={() => setTimeFrame('allTime')}
        >
          All Time
        </button>
      </div>
      <div className="leaderboard-list">
        {leaderboardData[timeFrame].map((user) => (
          <div key={user.rank} className="leaderboard-item">
            <div className="rank-badge" style={{ backgroundColor: getRankColor(user.rank) }}>
              {user.rank}
            </div>
            <div className="user-info">
              <div className="user-header">
                <span className="user-avatar">{user.avatar}</span>
                <span className="username">{user.username}</span>
                <span className="streak">{user.streak}</span>
              </div>
              <div className="user-stats">
                <div className="stat">
                  <span className="label">Portfolio</span>
                  <span className="value">{user.portfolioValue}</span>
                </div>
                <div className="stat">
                  <span className="label">Return</span>
                  <span className="value positive">{user.return}</span>
                </div>
                <div className="stat">
                  <span className="label">Trades</span>
                  <span className="value">{user.trades}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard; 