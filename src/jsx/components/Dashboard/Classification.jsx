import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Grid } from '@mui/material';

const ClassificationComponent = () => {
  const [ingredients, setIngredients] = useState('');
  const [result, setResult] = useState([]); // Initialize as empty array
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setResult([]); // Reset result before new request
    try {
      const response = await axios.post('http://localhost:5001/api/classification', { ingredients });
      console.log('API Response:', response.data); // Debug: Check the response
      setResult(response.data); // Should be an array of up to 3 dishes
    } catch (error) {
      console.error('Error in classification:', error);
      setError('Failed to fetch dish recommendations. Please try again.');
    }
  };

  return (
    <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Dish Classification
      </Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
        <TextField
          label="Enter ingredients (e.g., chicken, rice, tomato)"
          variant="outlined"
          fullWidth
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{ marginBottom: '20px', width: '80%', maxWidth: '600px' }}
        />
        <Button variant="contained" color="primary" type="submit">
          Classify Dish
        </Button>
      </form>

      {error && (
        <Typography color="error" align="center" style={{ marginBottom: '20px' }}>
          {error}
        </Typography>
      )}

      {result.length > 0 && (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          {result.map((dish, index) => (
            <Card key={dish['Dish Name'] || index} variant="outlined" style={{ marginBottom: '20px' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recommended Dish {index + 1}:
                </Typography>
                <Typography>
                  <strong>Dish Name:</strong> {dish['Dish Name'] || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Ingredients:</strong> {dish['Ingredients'] || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Category:</strong> {dish['Category'] || 'N/A'}
                </Typography>
                <Typography>
                  <strong>Calories:</strong> {dish['Calories'] || 'N/A'}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {result.length === 0 && ingredients && !error && (
        <Typography align="center" style={{ marginTop: '20px' }}>
          No dishes found for the given ingredients.
        </Typography>
      )}
    </div>
  );
};

export default ClassificationComponent;