import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import './InvestmentStyleQuiz.css';

const InvestmentStyleQuiz = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showResult, setShowResult] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const recommendationRef = useRef(null);

  const questions = [
    {
      question: "How long do you plan to invest your money?",
      options: [
        { text: "Less than 1 year", score: 1 },
        { text: "1-3 years", score: 2 },
        { text: "3-5 years", score: 3 },
        { text: "More than 5 years", score: 4 }
      ]
    },
    {
      question: "How would you react if your investment lost 20% in one month?",
      options: [
        { text: "Sell everything immediately", score: 1 },
        { text: "Sell some investments", score: 2 },
        { text: "Hold and wait", score: 3 },
        { text: "Buy more at lower prices", score: 4 }
      ]
    },
    {
      question: "What's your primary investment goal?",
      options: [
        { text: "Preserve capital", score: 1 },
        { text: "Generate steady income", score: 2 },
        { text: "Balanced growth and income", score: 3 },
        { text: "Maximum growth potential", score: 4 }
      ]
    },
    {
      question: "What's your investment knowledge level?",
      options: [
        { text: "Beginner", score: 1 },
        { text: "Some knowledge", score: 2 },
        { text: "Good understanding", score: 3 },
        { text: "Expert", score: 4 }
      ]
    },
    {
      question: "Which investment type interests you most?",
      options: [
        { text: "Safe, guaranteed returns", score: 1 },
        { text: "Mostly safe with some growth", score: 2 },
        { text: "Mix of safe and risky investments", score: 3 },
        { text: "High-risk, high-reward opportunities", score: 4 }
      ]
    }
  ];

  const handleAnswer = (value) => {
    setAnswers({ ...answers, [currentQuestion]: parseInt(value) });
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResult();
    }
  };

  const calculateResult = () => {
    const totalScore = Object.values(answers).reduce((sum, score) => sum + score, 0);
    setShowResult(true);
  };

  const getInvestmentStyle = (totalScore) => {
    const score = Object.values(answers).reduce((sum, score) => sum + score, 0);
    
    if (score <= 7) {
      return {
        style: "Conservative Investor",
        description: "You prefer stability and are most comfortable with low-risk investments. Consider bonds, blue-chip stocks, and fixed deposits. Focus on capital preservation with steady, modest returns.",
        recommendations: [
          "Government Bonds",
          "High-grade Corporate Bonds",
          "Blue-chip Dividend Stocks",
          "Fixed Deposits"
        ]
      };
    } else if (score <= 12) {
      return {
        style: "Moderate-Conservative Investor",
        description: "You seek balance between growth and safety. A mix of stable investments with some growth opportunities suits you best.",
        recommendations: [
          "Balanced Mutual Funds",
          "Quality Dividend Stocks",
          "Investment-grade Bonds",
          "Some Growth Stocks"
        ]
      };
    } else if (score <= 16) {
      return {
        style: "Balanced Investor",
        description: "You're comfortable with moderate risk for better returns. A diversified portfolio across different asset classes would suit your style.",
        recommendations: [
          "Growth Stocks",
          "Real Estate Investment Trusts",
          "Corporate Bonds",
          "International Funds"
        ]
      };
    } else {
      return {
        style: "Aggressive Growth Investor",
        description: "You're willing to accept higher risk for potentially higher returns. Focus on growth opportunities and emerging markets.",
        recommendations: [
          "Small-cap Stocks",
          "Emerging Market Funds",
          "Technology Stocks",
          "High-yield Bonds"
        ]
      };
    }
  };

  const startQuiz = () => {
    setQuizStarted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers({});
    setShowResult(false);
    setQuizStarted(false);
  };

  useEffect(() => {
    if (showResult && recommendationRef.current) {
      recommendationRef.current.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [showResult]);

  return (
    <Card className="quiz-card">
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Investment Style Quiz
        </Typography>

        {!quizStarted && !showResult && (
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body1" gutterBottom>
              Discover your investment style by taking this quick quiz!
            </Typography>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={startQuiz}
              sx={{ mt: 2 }}
            >
              Start Quiz
            </Button>
          </Box>
        )}

        {quizStarted && !showResult && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Question {currentQuestion + 1} of {questions.length}
            </Typography>
            <Typography variant="body1" gutterBottom>
              {questions[currentQuestion].question}
            </Typography>

            <FormControl component="fieldset">
              <RadioGroup
                value={answers[currentQuestion] || ''}
                onChange={(e) => handleAnswer(e.target.value)}
              >
                {questions[currentQuestion].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option.score}
                    control={<Radio />}
                    label={option.text}
                  />
                ))}
              </RadioGroup>
            </FormControl>

            <Button
              variant="contained"
              color="primary"
              onClick={handleNext}
              disabled={answers[currentQuestion] === undefined}
              sx={{ mt: 2 }}
            >
              {currentQuestion === questions.length - 1 ? 'See Results' : 'Next Question'}
            </Button>
          </Box>
        )}

        {showResult && (
          <Box className="result-container" ref={recommendationRef}>
            <Typography variant="h6" gutterBottom>
              Your Investment Style: {getInvestmentStyle().style}
            </Typography>
            
            <Typography variant="body1" paragraph>
              {getInvestmentStyle().description}
            </Typography>

            <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
              Recommended Investments:
            </Typography>
            <ul>
              {getInvestmentStyle().recommendations.map((rec, index) => (
                <li key={index}>
                  <Typography variant="body1">{rec}</Typography>
                </li>
              ))}
            </ul>

            <Button 
              variant="outlined" 
              color="primary" 
              onClick={resetQuiz}
              sx={{ mt: 3 }}
            >
              Take Quiz Again
            </Button>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default InvestmentStyleQuiz; 