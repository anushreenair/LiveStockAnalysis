export const mockStockData = {
  'AAPL': {
    prices: Array.from({length: 365}, (_, i) => 150 + Math.sin(i/30) * 20 + Math.random() * 5),
    currentPrice: 170.25,
    change: 1.5
  },
  'GOOGL': {
    prices: Array.from({length: 365}, (_, i) => 140 + Math.sin(i/30) * 15 + Math.random() * 4),
    currentPrice: 141.18,
    change: -0.8
  }
};

export const generateSyntheticData = (symbol) => {
  const basePrice = symbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % 100 + 100;
  return {
    prices: Array.from({length: 365}, (_, i) => basePrice + Math.sin(i/30) * (basePrice * 0.1) + Math.random() * 5),
    currentPrice: basePrice + Math.random() * 10,
    change: (Math.random() * 4) - 2
  };
};

export const mockNewsData = [
  {
    datetime: Date.now(),
    headline: "Market Rally Continues as Tech Stocks Surge",
    summary: "Major tech companies lead the market rally with strong earnings reports and positive outlook.",
    source: "Financial Times",
    url: "https://example.com",
    category: "Markets",
    image: "https://picsum.photos/800/400?random=1"
  },
  {
    datetime: Date.now() - 3600000,
    headline: "Federal Reserve Signals Potential Rate Changes",
    summary: "Fed chairman discusses future monetary policy directions in latest meeting.",
    source: "Reuters",
    url: "https://example.com",
    category: "Economy",
    image: "https://picsum.photos/800/400?random=2"
  },
  {
    datetime: Date.now() - 7200000,
    headline: "Tech Giants Report Strong Quarterly Earnings",
    summary: "Leading technology companies exceed market expectations with robust financial results.",
    source: "Bloomberg",
    url: "https://example.com",
    category: "Technology",
    image: "https://picsum.photos/800/400?random=3"
  },
  {
    datetime: Date.now() - 10800000,
    headline: "Global Markets React to Economic Data",
    summary: "International markets show mixed reactions to latest economic indicators and trade data.",
    source: "Wall Street Journal",
    url: "https://example.com",
    category: "Global Markets",
    image: "https://picsum.photos/800/400?random=4"
  },
  {
    datetime: Date.now() - 14400000,
    headline: "Cryptocurrency Market Sees Major Movements",
    summary: "Digital currency markets experience significant price action amid regulatory news.",
    source: "CoinDesk",
    url: "https://example.com",
    category: "Crypto",
    image: "https://picsum.photos/800/400?random=5"
  }
];