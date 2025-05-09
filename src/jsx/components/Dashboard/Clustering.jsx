import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Box } from '@mui/material';

const ClusteringComponent = () => {
  const [dishName, setDishName] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5001/api/clustering', { dish_name: dishName });
      setResult(response.data);
    } catch (error) {
      console.error('Error in clustering:', error);
      setError('Failed to predict dish category. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ padding: '40px 20px', minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: '#F48FB1', fontWeight: 'bold', mb: 4, fontFamily: 'Poppins, sans-serif' }}
      >
        AI Dish Category Prediction
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Enter dish name (e.g., Grilled Balsamic Lemon Pepper Shrimp Tacos)"
          variant="outlined"
          value={dishName}
          onChange={(e) => setDishName(e.target.value)}
          sx={{
            width: { xs: '90%', sm: '500px' },
            mb: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: '15px',
              padding: '12px',
              '& fieldset': { borderColor: '#F48FB1' },
              '&:hover fieldset': { borderColor: '#F06292' },
            },
            '& .MuiInputLabel-root': { color: '#F48FB1' },
            '& .MuiInputBase-input': {
              fontSize: '16px',
              padding: '10px',
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            backgroundColor: '#F48FB1',
            color: '#fff',
            borderRadius: '30px',
            padding: '12px 24px',
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
            '&:hover': { backgroundColor: '#F06292' },
            '&.Mui-disabled': { backgroundColor: '#F48FB1', opacity: 0.6 },
          }}
        >
          {loading ? 'Predicting...' : 'Predict Category'}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <Typography sx={{ fontSize: '14px', color: '#F48FB1', fontStyle: 'italic' }}>
          Powered by AI
        </Typography>
      </Box>

      {error && (
        <Typography align="center" sx={{ color: '#F06292', mb: 4 }}>
          {error}
        </Typography>
      )}

      {result && (
        <Box sx={{ maxWidth: '500px', margin: '0 auto' }}>
          <Card
            sx={{
              borderRadius: '15px',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
              background: 'linear-gradient(145deg, #ffffff, #f4f4f9)',
              padding: '20px',
              textAlign: 'center',
              '&:hover': {
                transform: 'scale(1.05)',
                transition: '0.3s ease-in-out',
              },
            }}
          >
            <CardContent>
              <Typography
                variant="h6"
                sx={{ color: '#F48FB1', fontWeight: 'bold', mb: 1 }}
              >
                Dish Category
              </Typography>
              <Typography sx={{ fontSize: '16px', color: '#424242', mb: 1 }}>
                <strong>Dish Name:</strong> {result.dish_name || 'N/A'}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                <strong>Category:</strong> {result.category || 'N/A'}
              </Typography>
              <Typography sx={{ fontSize: '14px', color: '#424242' }}>
                <strong>Cluster:</strong> {result.cluster ?? 'N/A'}
              </Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {dishName && !result && !error && !loading && (
        <Typography align="center" sx={{ mt: 4, color: '#757575' }}>
          No category predicted for the given dish name.
        </Typography>
      )}
    </Box>
  );
};

export default ClusteringComponent;