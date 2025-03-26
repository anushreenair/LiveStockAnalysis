import React, { useState, useEffect } from "react";
import { Card, CardContent, CardMedia, Typography, Grid, Button, TextField } from "@mui/material";
import { fetchLatestNews } from "../services/newsService";

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadNews = async () => {
      try {
        const newsData = await fetchLatestNews();
        setNews(newsData);
      } catch (err) {
        setError("Failed to load news. Please try again later.");
        console.error("Error loading news:", err);
      } finally {
        setLoading(false);
      }
    };
    
    loadNews();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNews = news.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", backgroundColor: "#f5f5f5" }}>
      <Typography variant="h4" gutterBottom style={{ textAlign: "center", fontWeight: "bold" }}>
        📰 Latest Stock Market News
      </Typography>
      
      <TextField
        label="Search News"
        variant="outlined"
        fullWidth
        onChange={handleSearch}
        style={{ marginBottom: "20px" }}
      />

      {loading ? (
        <Typography variant="h6" align="center">Loading news...</Typography>
      ) : error ? (
        <Typography variant="h6" align="center" color="error">{error}</Typography>
      ) : (
        <Grid container spacing={3}>
          {filteredNews.map((article, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ maxWidth: 345, boxShadow: 3, transition: "0.3s", "&:hover": { transform: "scale(1.03)" } }}>
                <CardMedia component="img" height="180" image={article.urlToImage || "https://via.placeholder.com/400x200?text=No+Image"} alt={article.title} />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {article.description.length > 100 ? `${article.description.substring(0, 100)}...` : article.description}
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    sx={{ marginTop: "10px" }}
                    href={article.url}
                    target="_blank"
                  >
                    Read More
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  );
};

export default News;
