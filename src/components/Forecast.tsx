import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    useTheme,
    useMediaQuery
} from '@mui/material';
import { ForecastData } from '../types/weather';
import { getWeatherIcon } from '../services/weatherApi';

interface ForecastProps {
    data: ForecastData;
    isCelsius?: boolean;
}

const Forecast: React.FC<ForecastProps> = ({ data, isCelsius = true }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Günlük tahminleri grupla (her gün için ilk tahmin)
    const dailyForecasts = data.list.reduce((acc: any[], forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('tr-TR');
        if (!acc.find(f => new Date(f.dt * 1000).toLocaleDateString('tr-TR') === date)) {
            acc.push(forecast);
        }
        return acc;
    }, []).slice(1, 6); // İlk günü atla ve sonraki 5 günü al

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp * 1000);
        return new Intl.DateTimeFormat('tr-TR', {
            weekday: isMobile ? 'short' : 'long',
            month: 'short',
            day: 'numeric'
        }).format(date);
    };

    return (
        <Card elevation={5} sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ textAlign: 'center' }}>
                    5 Günlük Tahmin
                </Typography>
                <Grid container spacing={2}>
                    {dailyForecasts.map((forecast, index) => (
                        <Grid item xs={12} sm={2.4} key={index}>
                            <Box sx={{ 
                                textAlign: 'center',
                                p: 1,
                                borderRadius: 1,
                                '&:hover': {
                                    bgcolor: 'action.hover'
                                }
                            }}>
                                <Typography variant="subtitle2">
                                    {formatDate(forecast.dt)}
                                </Typography>
                                <img
                                    src={getWeatherIcon(forecast.weather[0].icon)}
                                    alt={forecast.weather[0].description}
                                    style={{ width: 50, height: 50 }}
                                />
                                <Typography variant="body2">
                                    {Math.round(forecast.main.temp)}°{isCelsius ? 'C' : 'F'}
                                </Typography>
                                <Typography variant="caption" display="block" color="text.secondary">
                                    {forecast.weather[0].description}
                                </Typography>
                                <Typography variant="caption" display="block">
                                    Nem: {forecast.main.humidity}%
                                </Typography>
                                <Typography variant="caption" display="block">
                                    Rüzgar: {forecast.wind.speed} m/s
                                </Typography>
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    );
};

export default Forecast; 