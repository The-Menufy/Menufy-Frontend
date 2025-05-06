import React, { useState } from 'react';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Grid, Paper, Box } from '@mui/material';

const RegressionComponent = () => {
  const [features, setFeatures] = useState({ numIngredients: '', prepTime: '', cookTime: '' });
  const [avgCalPerIngredient, setAvgCalPerIngredient] = useState('');
  const [calories, setCalories] = useState(null);
  const [matchingDishes, setMatchingDishes] = useState([]);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const numIngredients = parseInt(features.numIngredients);
    const prepTime = parseInt(features.prepTime);
    const cookTime = parseInt(features.cookTime);
    const averageCalorie = parseFloat(avgCalPerIngredient);

    if (isNaN(numIngredients) || isNaN(prepTime) || isNaN(cookTime) || isNaN(averageCalorie)) {
      setError('All fields must be valid numbers');
      setCalories(null);
      setMatchingDishes([]);
      return;
    }

    setError(null);
    try {
      const response = await axios.post('http://localhost:5001/api/regression', {
        features: [numIngredients, prepTime, cookTime],
        avg_cal_per_ingredient: averageCalorie,
      });
      setCalories(response.data.predicted_calories);
      setMatchingDishes(response.data.matching_dishes);
    } catch (error) {
      console.error('Error in regression:', error);
      setError('Failed to predict calories. Check server logs.');
      setCalories(null);
      setMatchingDishes([]);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Typography variant="h4" align="center" color="primary" gutterBottom>
        Calorie Prediction
      </Typography>

      {/* Form Section */}
      <Box sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
        <Paper elevation={3} sx={{ padding: '20px', width: '80%', maxWidth: 500 }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <TextField
              label="Number of Ingredients"
              variant="outlined"
              type="number"
              value={features.numIngredients}
              onChange={(e) => setFeatures({ ...features, numIngredients: e.target.value })}
              fullWidth
              error={!!error}
              helperText={error}
            />
            <TextField
              label="Preparation Time (minutes)"
              variant="outlined"
              type="number"
              value={features.prepTime}
              onChange={(e) => setFeatures({ ...features, prepTime: e.target.value })}
              fullWidth
              error={!!error}
              helperText={error}
            />
            <TextField
              label="Cooking Time (minutes)"
              variant="outlined"
              type="number"
              value={features.cookTime}
              onChange={(e) => setFeatures({ ...features, cookTime: e.target.value })}
              fullWidth
              error={!!error}
              helperText={error}
            />
            <TextField
              label="Average Calorie Per Ingredient"
              variant="outlined"
              type="number"
              value={avgCalPerIngredient}
              onChange={(e) => setAvgCalPerIngredient(e.target.value)}
              fullWidth
              error={!!error}
              helperText={error}
            />
            <Button variant="contained" color="primary" type="submit">
              Predict Calories
            </Button>
          </form>
        </Paper>
      </Box>

      {/* Prediction Result */}
      {calories !== null && (
        <Box sx={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Card variant="outlined" sx={{ width: '80%', maxWidth: 600, padding: '10px' }}>
            <CardContent>
              <Typography variant="h5" color="primary">Predicted Calories: {calories}</Typography>
            </CardContent>
          </Card>
        </Box>
      )}

      {/* Matching Dishes */}
      {matchingDishes.length > 0 && (
        <div style={{ marginTop: '30px' }}>
          <Typography variant="h6" gutterBottom>Matching Dishes:</Typography>
          <Grid container spacing={2}>
            {matchingDishes.map((dish, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <Card variant="outlined" sx={{ padding: '15px' }}>
                  <CardContent>
                    <Typography variant="h6">{dish['Dish Name']}</Typography>
                    <Typography><strong>Ingredients:</strong> {dish['Ingredients']}</Typography>
                    <Typography><strong>Number of Ingredients:</strong> {dish['Num_Ingredients']}</Typography>
                    <Typography><strong>Average Calorie Per Ingredient:</strong> {dish['Average_Ingredient_Calorie']}</Typography>
                    <Typography><strong>Preparation Time:</strong> {dish['Preparation_Time_Minutes']} minutes</Typography>
                    <Typography><strong>Cooking Time:</strong> {dish['Cooking_Time_Minutes']} minutes</Typography>
                    <Typography><strong>Category:</strong> {dish['Category']}</Typography>
                    <Typography><strong>Instructions:</strong> {dish['Instructions']}</Typography>
                    <Button variant="contained" color="secondary" sx={{ marginTop: '10px' }}>Add to Products</Button>
                    <Button variant="contained" color="success" sx={{ marginTop: '10px', marginLeft: '10px' }}>Add to Dish of the Day</Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      )}

      {/* Error Message */}
      {error && !calories && (
        <Typography color="error" align="center" style={{ marginTop: '20px' }}>
          {error}
        </Typography>
      )}
    </div>
  );
};

export default RegressionComponent;
