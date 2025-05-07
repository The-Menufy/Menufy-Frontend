import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Button, TextField, Card, CardContent, Typography, Box, Grid, Paper, CircularProgress } from '@mui/material';

const RecommendationComponent = () => {
  const { t } = useTranslation();  // Use translation hook
  const [ingredients, setIngredients] = useState('');
  const [recommendations, setRecommendations] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      // Get recommended dishes from Flask API
      const response = await axios.post('http://localhost:5001/api/recommendation', { ingredients });
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error in recommendation:', error);
      setError(t('Failed to fetch recommendations. Please try again later.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        padding: '50px 30px',
        minHeight: '100vh',
        background: 'linear-gradient(to right, #F9F9F9, #F1F1F1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h4"
        align="center"
        sx={{
          color: '#F48FB1',
          fontWeight: 'bold',
          mb: 4,
          fontFamily: 'Poppins, sans-serif',
          textTransform: 'uppercase',
        }}
      >
        {t('AI_Meal_Recommendation')}
      </Typography>

      {/* Form Section */}
      <Paper
        elevation={3}
        sx={{
          padding: '30px 20px',
          width: '100%',
          maxWidth: '600px',
          borderRadius: '10px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#fff',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <TextField
            label={t('search_placeholder')}
            variant="outlined"
            fullWidth
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            error={!!error}
            helperText={error}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '15px',
                padding: '12px',
                '& fieldset': { borderColor: '#F48FB1' },
                '&:hover fieldset': { borderColor: '#F06292' },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
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
            {loading ? <CircularProgress size={24} color="secondary" /> : t('get_dishes')}
          </Button>
        </form>
      </Paper>

      {/* Recommendations Section */}
      {recommendations && (
        <Box sx={{ marginTop: '50px' }}>
          <Typography variant="h6" align="center" sx={{ color: '#424242', mb: 4 }}>
            {t('recommended_dishes')}:
          </Typography>
          <Grid container spacing={4} sx={{ justifyContent: 'center' }}>
            {recommendations.map((dish, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Card
                  sx={{
                    borderRadius: '15px',
                    boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                    background: 'linear-gradient(145deg, #ffffff, #f4f4f9)',
                    padding: '20px',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      transition: '0.3s ease-in-out',
                    },
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" sx={{ color: '#F48FB1', fontWeight: 'bold', mb: 1 }}>
                      {dish['Dish Name']}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                      <strong>{t('ingredients')}:</strong> {dish['Ingredients']}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                      <strong>{t('number_of_ingredients')}:</strong> {dish['Num_Ingredients']}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                      <strong>{t('average_ingredient_calorie')}:</strong> {dish['Average_Ingredient_Calorie']}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                      <strong>{t('preparation_time')}:</strong> {dish['Preparation_Time_Minutes']} minutes
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                      <strong>{t('cooking_time')}:</strong> {dish['Cooking_Time_Minutes']} minutes
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                      <strong>{t('calories')}:</strong> {dish['Calories']}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                      <strong>{t('category')}:</strong> {dish['Category']}
                    </Typography>
                    <Typography sx={{ fontSize: '14px', color: '#424242', mb: 1 }}>
                      <strong>{t('instructions')}:</strong> {dish['Instructions']}
                    </Typography>
                    <Button
                      variant="contained"
                      color="secondary"
                      sx={{ marginTop: '10px' }}
                      onClick={() => handleAddToProduct(dish)}
                    >
                      {t('add_to_products')}
                    </Button>
                    <Button
                      variant="contained"
                      color="success"
                      sx={{ marginTop: '10px', marginLeft: '10px' }}
                    >
                      {t('add_to_dish_of_the_day')}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      {/* Error Message */}
      {error && (
        <Typography color="error" align="center" sx={{ marginTop: '20px' }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default RecommendationComponent;
