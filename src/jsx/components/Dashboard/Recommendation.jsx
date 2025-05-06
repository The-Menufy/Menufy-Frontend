import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography } from '@mui/material';

const RecommendationComponent = () => {
  const [ingredients, setIngredients] = useState('');
  const [recommendations, setRecommendations] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5001/api/recommendation', { ingredients });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error in recommendation:', error);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" color="primary">AI Meal Recommendation</Typography>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
        <TextField
          label="Enter Ingredients"
          variant="outlined"
          fullWidth
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          style={{ marginBottom: '20px', width: '80%' }}
        />
        <Button variant="contained" color="primary" type="submit" style={{ marginBottom: '20px' }}>
          Get Dishes
        </Button>
      </form>

      {recommendations && (
  <div>
    <Typography variant="h6" gutterBottom>Recommended Dishes:</Typography>
    {recommendations.map((dish, index) => (
      <Card key={index} variant="outlined" style={{ marginBottom: '20px' }}>
        <CardContent>
          <Typography variant="h6">{dish['Dish Name']}</Typography>
          <Typography><strong>Ingredients:</strong> {dish['Ingredients']}</Typography>
          <Typography><strong>Number of Ingredients:</strong> {dish['Num_Ingredients']}</Typography>
          <Typography><strong>Average Ingredient Calorie:</strong> {dish['Average_Ingredient_Calorie']}</Typography>
          <Typography><strong>Preparation Time (Minutes):</strong> {dish['Preparation_Time_Minutes']}</Typography>
          <Typography><strong>Cooking Time (Minutes):</strong> {dish['Cooking_Time_Minutes']}</Typography>
          <Typography><strong>Calories:</strong> {dish['Calories']}</Typography>
          <Typography><strong>Category:</strong> {dish['Category']}</Typography>
          <Typography><strong>Instructions:</strong> {dish['Instructions']}</Typography>

          <Button variant="contained" color="secondary" style={{ marginTop: '10px' }}>Add to Products</Button>
          <Button variant="contained" color="success" style={{ marginTop: '10px', marginLeft: '10px' }}>Add to Dish of the Day</Button>
        </CardContent>
      </Card>
    ))}
  </div>
)}

    </div>
  );
};

export default RecommendationComponent;
