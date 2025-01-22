import { useState, useCallback, useRef } from 'react';
import { Container, Box, Alert, CircularProgress, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import SearchBar from './components/SearchBar';
import WeatherCard from './components/WeatherCard';
import Forecast from './components/Forecast';
import { getWeather, getForecast } from './services/weatherApi';
import { WeatherData, ForecastData, WeatherError, SearchQuery } from './types/weather';

const theme = createTheme({
  palette: {
    mode: 'light',
  },
});

function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isCelsius, setIsCelsius] = useState(true);
  const requestRef = useRef<AbortController | null>(null);

  const handleSearch = useCallback(async (query: SearchQuery) => {
    // Önceki isteği iptal et, geç gelen eski yanıt yenisinin üzerine yazmasın
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;

    setLoading(true);
    setError(null);
    try {
      const [weatherData, forecastData] = await Promise.all([
        getWeather(query, controller.signal),
        getForecast(query, controller.signal)
      ]);
      if (controller.signal.aborted) return;
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      if (controller.signal.aborted) return;
      const error = err as WeatherError;
      setError(error.message || 'Bir hata oluştu');
      setWeather(null);
      setForecast(null);
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
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
      (position) => {
        const { latitude, longitude } = position.coords;
        console.log('Konum alındı:', { latitude, longitude });
        // Şehir adına çevirmeden doğrudan koordinatla ara
        handleSearch({ lat: latitude, lon: longitude });
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
