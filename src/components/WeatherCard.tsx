import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    Box,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    WbSunny as SunIcon,
    Opacity as HumidityIcon,
    Speed as WindIcon,
    CompareArrows as PressureIcon
} from '@mui/icons-material';
import { WeatherData } from '../types/weather';
import { getWeatherIcon } from '../services/weatherApi';

interface WeatherCardProps {
    data: WeatherData;
    onTemperatureUnitChange?: () => void;
    isCelsius?: boolean;
}

const WeatherCard: React.FC<WeatherCardProps> = ({ 
    data, 
    onTemperatureUnitChange,
    isCelsius = true 
}) => {
    const formatTime = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleTimeString('tr-TR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Card elevation={5} sx={{ maxWidth: 600, mx: 'auto', mt: 2 }}>
            <CardContent>
                <Box sx={{ textAlign: 'center', mb: 2 }}>
                    <Typography variant="h4" component="div">
                        {data.name}, {data.sys.country}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                        <img 
                            src={getWeatherIcon(data.weather[0].icon)}
                            alt={data.weather[0].description}
                            style={{ width: 100, height: 100 }}
                        />
                        <Typography 
                            variant="h2" 
                            component="div" 
                            sx={{ cursor: 'pointer' }}
                            onClick={onTemperatureUnitChange}
                        >
                            {Math.round(data.main.temp)}°{isCelsius ? 'C' : 'F'}
                        </Typography>
                    </Box>
                    <Typography variant="h6" color="text.secondary">
                        {data.weather[0].description}
                    </Typography>
                    <Typography variant="body1">
                        Hissedilen: {Math.round(data.main.feels_like)}°{isCelsius ? 'C' : 'F'}
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6} sm={3}>
                        <Tooltip title="Nem">
                            <Box sx={{ textAlign: 'center' }}>
                                <IconButton color="primary">
                                    <HumidityIcon />
                                </IconButton>
                                <Typography variant="body2">
                                    {data.main.humidity}%
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Tooltip title="Rüzgar Hızı">
                            <Box sx={{ textAlign: 'center' }}>
                                <IconButton color="primary">
                                    <WindIcon />
                                </IconButton>
                                <Typography variant="body2">
                                    {data.wind.speed} m/s
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Tooltip title="Basınç">
                            <Box sx={{ textAlign: 'center' }}>
                                <IconButton color="primary">
                                    <PressureIcon />
                                </IconButton>
                                <Typography variant="body2">
                                    {data.main.pressure} hPa
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Tooltip title="Gün Doğumu/Batımı">
                            <Box sx={{ textAlign: 'center' }}>
                                <IconButton color="primary">
                                    <SunIcon />
                                </IconButton>
                                <Typography variant="body2">
                                    {formatTime(data.sys.sunrise)} / {formatTime(data.sys.sunset)}
                                </Typography>
                            </Box>
                        </Tooltip>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};

export default WeatherCard; 