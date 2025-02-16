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
import { getWeatherIcon, formatTemperature } from '../services/weatherApi';

interface ForecastProps {
    data: ForecastData;
    isCelsius?: boolean;
}

const Forecast: React.FC<ForecastProps> = ({ data, isCelsius = true }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    // Günlük tahminleri grupla (her gün için öğlene en yakın tahmin)
    const today = new Date().toLocaleDateString('tr-TR');
    const middayDistance = (dt: number) => Math.abs(new Date(dt * 1000).getHours() - 12);
    const dailyForecasts = data.list.reduce((acc: ForecastData['list'], forecast) => {
        const date = new Date(forecast.dt * 1000).toLocaleDateString('tr-TR');
        if (date === today) return acc; // Bugünü atla
        const index = acc.findIndex(f => new Date(f.dt * 1000).toLocaleDateString('tr-TR') === date);
        if (index === -1) {
            acc.push(forecast);
        } else if (middayDistance(forecast.dt) < middayDistance(acc[index].dt)) {
            acc[index] = forecast;
        }
        return acc;
    }, []).slice(0, 5); // Sonraki 5 günü al

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
                                    {formatTemperature(forecast.main.temp, isCelsius)}
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