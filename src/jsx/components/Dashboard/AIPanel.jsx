import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent } from '@mui/material';


import chatai from '../../../assets/images/ai/chatai.png';
import recommandation from '../../../assets/images/ai/image.jpg'; 
import regression from '../../../assets/images/ai/regression.png'; 
import classification from '../../../assets/images/ai/classification.png';
const AIPanel = () => {
    const navigate = useNavigate();

    const aiTools = [
        {
            name: 'Recommendation',
            path: '/recommendation',
            description: 'Get dish recommendations based on ingredients.',
            image: classification,
        },
        {
            name: 'Classification',
            path: '/classification',
            description: 'Classify dishes using ingredients.',
            image: recommandation,
        },
        {
            name: 'Chat',
            path: '/Chat',
            description: 'Chat with an AI assistant for restaurant ideas.',
            image: chatai,
        },
        {
            name: 'Regression',
            path: '/regression',
            description: 'Predict dish calories using regression.',
            image: regression,
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
                AI Tools
            </Typography>

            <Grid container spacing={4} sx={{ maxWidth: '1200px', mx: 'auto' }}>
                {aiTools.map((tool) => (
                    <Grid item xs={12} sm={6} md={3} key={tool.name}>
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
                            onClick={() => navigate(tool.path)}
                        >
                            <CardContent>
                                {tool.image && (
                                    <img
                                        src={tool.image}
                                        alt={tool.name}
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
                                    {tool.name}
                                </Typography>
                                <Typography sx={{ fontSize: '14px', color: '#424242' }}>
                                    {tool.description}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Typography sx={{ fontSize: '14px', color: '#F48FB1', fontStyle: 'italic' }}>
                    Powered by AI
                </Typography>
            </Box>
        </Box>
    );
};

export default AIPanel;
