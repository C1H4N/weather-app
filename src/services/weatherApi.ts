import axios from 'axios';
import { WeatherData, ForecastData, WeatherError } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export const getWeather = async (city: string): Promise<WeatherData> => {
    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
                lang: 'tr'
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const weatherError: WeatherError = {
                message: error.response?.data.message || 'Hava durumu bilgisi alınamadı',
                code: error.response?.status
            };
            throw weatherError;
        }
        throw new Error('Beklenmeyen bir hata oluştu');
    }
};

export const getForecast = async (city: string): Promise<ForecastData> => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: {
                q: city,
                appid: API_KEY,
                units: 'metric',
                lang: 'tr',
                cnt: 40 // 5 günlük tahmin (3 saatlik aralıklarla)
            }
        });
        return response.data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const weatherError: WeatherError = {
                message: error.response?.data.message || '5 günlük tahmin alınamadı',
                code: error.response?.status
            };
            throw weatherError;
        }
        throw new Error('Beklenmeyen bir hata oluştu');
    }
};

// Hava durumu ikonunu almak için yardımcı fonksiyon
export const getWeatherIcon = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Sıcaklık birimini dönüştürmek için yardımcı fonksiyonlar
export const celsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9/5) + 32;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
    return (fahrenheit - 32) * 5/9;
}; 