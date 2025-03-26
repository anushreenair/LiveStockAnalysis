import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { mockNewsData } from '../utils/mockData';

const News = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // You might want to move this to an environment variable
  const API_KEY = 'cvdcrq1r01qm9khk2rdgcvdcrq1r01qm9khk2re0';

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // First try the Finnhub API
        const response = await axios.get(
          `https://finnhub.io/api/v1/news?category=general&token=${API_KEY}`
        );
        
        if (response.data && response.data.length > 0) {
          setArticles(response.data);
        } else {
          // If no data from Finnhub, try alternative news API
          const alternativeResponse = await axios.get(
            'https://newsapi.org/v2/everything?' +
            'q=stock+market+finance&' +
            'sortBy=publishedAt&' +
            'apiKey=YOUR_NEWS_API_KEY' // Replace with your News API key
          );
          
          if (alternativeResponse.data && alternativeResponse.data.articles) {
            const formattedArticles = alternativeResponse.data.articles.map(article => ({
              datetime: new Date(article.publishedAt).getTime(),
              headline: article.title,
              summary: article.description,
              source: article.source.name,
              url: article.url,
              image: article.urlToImage,
              category: 'Markets'
            }));
            setArticles(formattedArticles);
          } else {
            // If both APIs fail, use mock data
            console.warn('Using mock data as APIs failed');
            setArticles(mockNewsData);
          }
        }
      } catch (err) {
        console.error('Error fetching news:', err);
        // Fallback to mock data
        console.warn('Using mock data due to API error');
        setArticles(mockNewsData);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="news-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading latest market news...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="news-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="news-container">
      <h2>Latest Market News</h2>
      <div className="news-grid">
        {articles.map((article, index) => (
          <div key={index} className="news-card">
            {article.image && (
              <div className="news-image-container">
                <img 
                  src={article.image} 
                  alt={article.headline} 
                  className="news-image"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/400x200?text=Market+News';
                  }}
                />
              </div>
            )}
            <div className="news-content">
              <span className="news-category">
                {article.category || 'General'}
              </span>
              <h3 className="news-title">{article.headline}</h3>
              <p className="news-excerpt">{article.summary}</p>
              <div className="news-footer">
                <div className="news-meta">
                  <span className="news-source">{article.source}</span>
                  <span className="news-date">
                    {new Date(article.datetime * 1000).toLocaleDateString()}
                  </span>
                </div>
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="read-more-link"
                >
                  Read More →
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;