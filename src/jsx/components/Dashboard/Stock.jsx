import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';

import ingredientImg from '../../../assets/images/ai/ingridient.png';
import utensilsImg from '../../../assets/images/ai/utensilss.png';
import variantsImg from '../../../assets/images/ai/variants.png';

const StockPanel = () => {
    const navigate = useNavigate();

    const stockItems = [
        {
            name: 'Ingredients',
            path: '/ingredient',
            description: 'Manage all your stock ingredients efficiently.',
            image: ingredientImg,
        },
        {
            name: 'Utensils',
            path: '/Ustensile',
            description: 'Track and organize your kitchen utensils.',
            image: utensilsImg,
        },
        {
            name: 'Variants',
            path: '/manage-variants',
            description: 'Handle dish variants and recipe versions.',
            image: variantsImg,
        },
    ];

    return (
        <Box sx={{ padding: '40px 20px', minHeight: '100vh', background: 'linear-gradient(to right, #F9F9F9, #F1F1F1)' }}>
            <Typography
                variant="h4"
                align="center"
                sx={{
                    color: '#F48FB1',
                    fontWeight: 'bold',
                    mb: 8,
                    fontFamily: 'Poppins, sans-serif',
                    textTransform: 'uppercase',
                }}
            >
                Stock Management
            </Typography>

            <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
                {stockItems.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.name}>
                        <Card
                            sx={{
                                borderRadius: '15px',
                                boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)',
                                    backgroundColor: '#F48FB1',
                                    '& .MuiTypography-root': { color: '#fff' },
                                },
                            }}
                            onClick={() => navigate(item.path)}
                        >
                            <CardContent>
                                {item.image && (
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        style={{
                                            width: '100%',
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                            marginBottom: '15px',
                                        }}
                                    />
                                )}
                                <Typography variant="h6" sx={{ color: '#F48FB1', fontWeight: 'bold', mb: 2 }}>
                                    {item.name}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#424242' }}>
                                    {item.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Typography sx={{ fontSize: '14px', color: '#F48FB1', fontStyle: 'italic' }}>
                    Keep your kitchen organized
                </Typography>
            </Box>
        </Box>
    );
};

export default StockPanel;
