import { useState, useCallback } from 'react';
import { Container, Box, Alert, CircularProgress, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import { getWeather, getForecast } from './services/weatherApi';
import { WeatherData, ForecastData, WeatherError } from './types/weather';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);

  const handleSearch = useCallback(async (city: string) => {
    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeather(city),
        getForecast(city)
      ]);
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      const error = err as WeatherError;
      setError(error.message || 'Bir hata oluştu');
      setWeather(null);
      setForecast(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleLocationSearch = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Tarayıcınız konum özelliğini desteklemiyor');
      return;
    }

    setLoading(true);
    setError(null);

    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          console.log('Konum alındı:', { latitude, longitude });
          
          const response = await fetch(
            `https://api.openweathermap.org/geo/1.0/reverse?lat=${latitude}&lon=${longitude}&limit=1&appid=${API_KEY}`
          );
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          const data = await response.json();
          console.log('Konum verisi:', data);
          
          if (data && data.length > 0) {
            const locationData = data[0];
            console.log('Şehir bulundu:', locationData.name);
            await handleSearch(locationData.name);
          } else {
            setError('Bu konum için şehir bilgisi bulunamadı');
          }
        } catch (err) {
          console.error('Konum hatası:', err);
          setError('Konum bilgisi alınamadı: ' + (err instanceof Error ? err.message : 'Bilinmeyen hata'));
        } finally {
          setLoading(false);
        }
      },
      (err) => {
        console.error('Geolocation hatası:', err);
        let errorMessage = 'Konum alınamadı';
        
        switch(err.code) {
          case 1:
            errorMessage = 'Konum izni reddedildi. Lütfen tarayıcı ayarlarından konum iznini kontrol edin.';
            break;
          case 2:
            errorMessage = 'Konum bilgisi alınamıyor. Lütfen konum servislerinizin açık olduğundan emin olun.';
            break;
          case 3:
            errorMessage = 'Konum bilgisi alınamadı: Zaman aşımı.';
            break;
        }
        
        setError(errorMessage);
        setLoading(false);
      },
      options
    );
  }, [handleSearch]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ py: 4 }}>
          <SearchBar 
            onSearch={handleSearch}
            onLocationSearch={handleLocationSearch}
          />

          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {weather && (
            <WeatherCard 
              data={weather}
              isCelsius={isCelsius}
              onTemperatureUnitChange={() => setIsCelsius(!isCelsius)}
            />
          )}

          {forecast && (
            <Forecast 
              data={forecast}
              isCelsius={isCelsius}
            />
          )}
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
