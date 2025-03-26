import React, { useState, useEffect } from "react";
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  Alert,
  MenuItem,
  Tooltip,
  Chip
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import InfoIcon from '@mui/icons-material/Info';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import './Portfolio.css';
import { db, auth } from '../firebase/config';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc } from 'firebase/firestore';

const Portfolio = () => {
  const [stocks, setStocks] = useState([]);
  const [open, setOpen] = useState(false);
  const [newStock, setNewStock] = useState({
    symbol: '',
    shares: '',
    purchasePrice: '',
    purchaseDate: '',
    transactionType: 'buy'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch user's stocks on component mount
  useEffect(() => {
    fetchUserStocks();
  }, []);

  // Fetch stocks from Firebase
  const fetchUserStocks = async () => {
    try {
      setLoading(true);
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const q = query(
        collection(db, 'portfolios'), 
        where('userId', '==', userId)
      );
      
      const querySnapshot = await getDocs(q);
      const stocksData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setStocks(stocksData);
    } catch (err) {
      setError('Failed to fetch stocks');
      console.error('Error fetching stocks:', err);
    } finally {
      setLoading(false);
    }
  };

  // Add new stock to Firebase
  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      // Validate input
      if (!newStock.symbol || !newStock.shares || !newStock.purchasePrice || !newStock.transactionType) {
        throw new Error('Please fill in all required fields');
      }

      // Add to Firebase
      const stockData = {
        ...newStock,
        userId,
        shares: Number(newStock.shares),
        purchasePrice: Number(newStock.purchasePrice),
        addedAt: new Date().toISOString(),
      };

      const docRef = await addDoc(collection(db, 'portfolios'), stockData);

      // Update local state
      setStocks(prevStocks => [...prevStocks, { id: docRef.id, ...stockData }]);

      // Reset form
      setNewStock({
        symbol: '',
        shares: '',
        purchasePrice: '',
        purchaseDate: '',
        transactionType: 'buy'
      });

      // Close dialog
      setOpen(false);

      // Show success message
      setSuccess(`Stock ${stockData.transactionType === 'buy' ? 'purchased' : 'sold'} successfully!`);

    } catch (err) {
      setError(err.message);
      console.error('Error adding stock:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete stock from Firebase
  const handleDeleteStock = async (stockId) => {
    try {
      setLoading(true);
      await deleteDoc(doc(db, 'portfolios', stockId));
      setStocks(prevStocks => prevStocks.filter(stock => stock.id !== stockId));
      setSuccess('Stock deleted successfully!');
    } catch (err) {
      setError('Failed to delete stock');
      console.error('Error deleting stock:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="portfolio-container">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        mb: 4 
      }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontFamily: '"Times New Roman", Times, serif',
            fontWeight: 'bold',
            mb: 3,
            color: '#1976d2',
            textAlign: 'center'
          }}
        >
          My Stock Investment
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            px: 3,
            py: 1.5,
            fontSize: '1.1rem'
          }}
        >
          Add Stock
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

      <Grid container spacing={3}>
        {stocks.map((stock) => (
          <Grid item xs={12} sm={6} md={4} key={stock.id}>
            <Card className="stock-card">
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="h6" className="stock-symbol">
                    {stock.symbol}
                    <Tooltip title="Click for more information" placement="top">
                      <InfoIcon 
                        sx={{ 
                          ml: 1, 
                          fontSize: '1rem', 
                          cursor: 'pointer',
                          color: 'primary.main'
                        }} 
                        onClick={() => window.open(`https://finance.yahoo.com/quote/${stock.symbol}`, '_blank')}
                      />
                    </Tooltip>
                  </Typography>
                  <Chip 
                    label={stock.transactionType === 'buy' ? 'Bought' : 'Sold'}
                    color={stock.transactionType === 'buy' ? 'success' : 'error'}
                    size="small"
                    sx={{ 
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}
                  />
                </Box>

                <Box className="stock-info-container">
                  <div className="stock-detail-row">
                    <span>Number of Shares</span>
                    <span className="value">{stock.shares}</span>
                  </div>
                  <div className="stock-detail-row">
                    <span>{stock.transactionType === 'buy' ? 'Buy Price' : 'Sell Price'}</span>
                    <span className="value">
                      ${stock.purchasePrice}
                    </span>
                  </div>
                  <div className="stock-detail-row">
                    <span>Purchase Date</span>
                    <span className="value">{new Date(stock.purchaseDate).toLocaleDateString()}</span>
                  </div>
                  <div className="stock-detail-row total-value">
                    <span>Total {stock.transactionType === 'buy' ? 'Investment' : 'Return'}</span>
                    <span className="value">
                      ${(stock.shares * stock.purchasePrice).toFixed(2)}
                    </span>
                  </div>
                </Box>

                <Box className="stock-actions">
                  <Button
                    variant="contained"
                    color="error"
                    onClick={() => {
                      if (window.confirm(`Are you sure you want to delete ${stock.symbol} stock investment?`)) {
                        handleDeleteStock(stock.id);
                      }
                    }}
                    sx={{ 
                      minWidth: '40px',
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      padding: 0,
                      mt: 2,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(211, 47, 47, 0.2)'
                      }
                    }}
                  >
                    <DeleteIcon />
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          Add Stock Transaction
        </DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            margin="normal"
            label="Transaction Type"
            value={newStock.transactionType}
            onChange={(e) => setNewStock({ ...newStock, transactionType: e.target.value })}
            sx={{ mb: 2 }}
          >
            <MenuItem value="buy">Buy</MenuItem>
            <MenuItem value="sell">Sell</MenuItem>
          </TextField>

          <TextField
            fullWidth
            margin="normal"
            label="Stock Symbol"
            value={newStock.symbol}
            onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value.toUpperCase() })}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Number of Shares"
            type="number"
            value={newStock.shares}
            onChange={(e) => setNewStock({ ...newStock, shares: e.target.value })}
          />

          <TextField
            fullWidth
            margin="normal"
            label={`${newStock.transactionType === 'buy' ? 'Buy' : 'Sell'} Price`}
            type="number"
            step="0.01"
            value={newStock.purchasePrice}
            onChange={(e) => setNewStock({ ...newStock, purchasePrice: e.target.value })}
          />

          <TextField
            fullWidth
            margin="normal"
            label={`${newStock.transactionType === 'buy' ? 'Purchase' : 'Selling'} Date`}
            type="date"
            InputLabelProps={{ shrink: true }}
            value={newStock.purchaseDate}
            onChange={(e) => setNewStock({ ...newStock, purchaseDate: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleAddStock} 
            variant="contained"
            color={newStock.transactionType === 'buy' ? 'primary' : 'error'}
            disabled={loading}
          >
            {loading ? 'Processing...' : `${newStock.transactionType === 'buy' ? 'Buy' : 'Sell'} Stock`}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Portfolio;
