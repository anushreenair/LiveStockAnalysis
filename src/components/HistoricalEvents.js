import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Grid,
  Fade
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import TimelineIcon from '@mui/icons-material/Timeline';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import './HistoricalEvents.css';

const HistoricalEvents = () => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const historicalEvents = [
    {
      date: "October 19, 1987",
      description: "Black Monday: The Dow Jones dropped 22.6% in a single day, the largest one-day percentage drop in history.",
      impact: "Led to the implementation of trading curbs and circuit breakers."
    },
    {
      date: "March 10, 2000",
      description: "Dot-com Bubble Peak: NASDAQ reached its peak before the dramatic burst of the internet bubble.",
      impact: "Tech stocks lost 78% of their value in the following 30 months."
    },
    {
      date: "September 15, 2008",
      description: "Lehman Brothers Collapse: The largest bankruptcy filing in U.S. history, marking the peak of the financial crisis.",
      impact: "Triggered a global financial crisis and led to major regulatory reforms."
    },
    {
      date: "March 23, 2020",
      description: "COVID-19 Market Bottom: Markets hit their lowest point during the pandemic before a historic recovery.",
      impact: "Marked the end of the shortest bear market in history."
    },
    {
      date: "January 28, 2021",
      description: "GameStop Short Squeeze: Retail traders caused a massive surge in GameStop stock price.",
      impact: "Changed the dynamics between retail investors and Wall Street."
    },
    {
      date: "March 10, 2023",
      description: "Silicon Valley Bank Collapse: The second-largest bank failure in U.S. history.",
      impact: "Led to increased scrutiny of regional banks and banking regulations."
    },
    {
      date: "November 10, 2021",
      description: "Bitcoin All-Time High: Bitcoin reached nearly $69,000, marking cryptocurrency's peak.",
      impact: "Demonstrated crypto's potential and volatility in mainstream finance."
    },
    {
      date: "May 6, 2010",
      description: "Flash Crash: The Dow Jones dropped 9% in minutes before quickly recovering.",
      impact: "Led to new regulations on high-frequency trading."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentEventIndex((prevIndex) => 
          prevIndex === historicalEvents.length - 1 ? 0 : prevIndex + 1
        );
        setIsTransitioning(false);
      }, 500);
    }, 5000); // Change event every 5 seconds

    return () => clearInterval(timer);
  }, []);

  const currentEvent = historicalEvents[currentEventIndex];

  return (
    <Card className="historical-events-card">
      <CardContent>
        <Box className="events-header">
          <TimelineIcon className="timeline-icon" />
          <Typography variant="h5" component="h2">
            Historical Market Events
          </Typography>
        </Box>

        <Typography variant="body2" color="textSecondary" className="events-subtitle">
          Learn from significant events that shaped the financial markets
        </Typography>

        <div className={`event-display ${isTransitioning ? 'fade-out' : 'fade-in'}`}>
          <div className="event-card">
            <div className="event-date">{currentEvent.date}</div>
            <div className="event-description">
              <p className="event-title">{currentEvent.description}</p>
              <p className="event-impact">{currentEvent.impact}</p>
            </div>
          </div>
          <div className="event-navigation">
            <div className="event-dots">
              {historicalEvents.map((_, index) => (
                <span 
                  key={index} 
                  className={`event-dot ${index === currentEventIndex ? 'active' : ''}`}
                  onClick={() => {
                    setIsTransitioning(true);
                    setTimeout(() => {
                      setCurrentEventIndex(index);
                      setIsTransitioning(false);
                    }, 500);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoricalEvents; 