import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Grid, Box } from '@mui/material';

const ClassificationComponent = () => {
  const [ingredients, setIngredients] = useState('');
  const [result, setResult] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    setError(null);
    setResult([]);
    try {
      const response = await axios.post('http://localhost:5001/api/classification', { ingredients });
      setResult(response.data);
    } catch (error) {
      console.error('Error in classification:', error);
      setError('Failed to fetch dish recommendations. Please try again.');
    }
  };

  return (
    <Box sx={{ padding: '40px 20px', minHeight: '100vh', backgroundColor: '#F9F9F9' }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ color: '#F48FB1', fontWeight: 'bold', mb: 4, fontFamily: 'Poppins, sans-serif' }}
      >
        AI Dish Recommendations
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
        <TextField
          label="Enter ingredients (e.g., chicken, rice, tomato)"
          variant="outlined"
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
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
              fontSize: '16px', // Increase font size
              padding: '10px', // Adjust padding for larger space inside the input
            },
          }}
        />
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            backgroundColor: '#F48FB1',
            color: '#fff',
            borderRadius: '30px',
            padding: '12px 24px',
            textTransform: 'none',
            fontWeight: 'bold',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.2)',
            '&:hover': { backgroundColor: '#F06292' },
          }}
        >
          Classify Dish
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

      {result.length > 0 && (
        <Grid container spacing={4} sx={{ maxWidth: '1100px', margin: '0 auto', justifyContent: 'center' }}>
          {result.map((dish, index) => (
            <Grid item xs={12} sm={6} md={4} key={dish['Dish Name'] || index}>
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
                    Recommended Dish {index + 1}
                  </Typography>
                  <Typography sx={{ fontSize: '16px', color: '#424242', mb: 1 }}>
                    <strong>Dish Name:</strong> {dish['Dish Name'] || 'N/A'}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                    <strong>Ingredients:</strong> {dish['Ingredients'] || 'N/A'}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                    <strong>Category:</strong> {dish['Category'] || 'N/A'}
                  </Typography>
                  <Typography sx={{ fontSize: '14px', color: '#424242' }}>
                    <strong>Calories:</strong> {dish['Calories'] || 'N/A'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {result.length === 0 && ingredients && !error && (
        <Typography align="center" sx={{ mt: 4, color: '#757575' }}>
          No dishes found for the given ingredients.
        </Typography>
      )}
    </Box>
  );
};

export default ClassificationComponent;
