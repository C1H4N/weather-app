import axios from 'axios';
import { WeatherData, ForecastData, WeatherError, GeoLocation, SearchQuery } from '../types/weather';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const GEO_URL = 'https://api.openweathermap.org/geo/1.0';

if (!API_KEY) {
    console.warn('VITE_OPENWEATHER_API_KEY tanımlı değil. .env.example dosyasını .env olarak kopyalayıp API anahtarınızı ekleyin.');
}

// API hata kodlarını kullanıcıya gösterilecek Türkçe mesajlara çevir
const getErrorMessage = (status: number | undefined, fallback: string): string => {
    switch (status) {
        case undefined:
            return 'Sunucuya ulaşılamadı. Lütfen internet bağlantınızı kontrol edin.';
        case 401:
            return 'API anahtarı geçersiz veya eksik.';
        case 404:
            return 'Şehir bulunamadı. Lütfen şehir adını kontrol edin.';
        case 429:
            return 'Çok fazla istek gönderildi. Lütfen biraz sonra tekrar deneyin.';
        default:
            return fallback;
    }
};

// Şehir adı veya koordinata göre sorgu parametreleri
const locationParams = (query: SearchQuery) =>
    typeof query === 'string' ? { q: query } : { lat: query.lat, lon: query.lon };

export const getWeather = async (query: SearchQuery, signal?: AbortSignal): Promise<WeatherData> => {
    try {
        const response = await axios.get(`${BASE_URL}/weather`, {
            params: {
                ...locationParams(query),
                appid: API_KEY,
                units: 'metric',
                lang: 'tr'
            },
            signal
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) throw error;
        if (axios.isAxiosError(error)) {
            const weatherError: WeatherError = {
                message: getErrorMessage(error.response?.status, 'Hava durumu bilgisi alınamadı'),
                code: error.response?.status
            };
            throw weatherError;
        }
        throw new Error('Beklenmeyen bir hata oluştu');
    }
};

export const getForecast = async (query: SearchQuery, signal?: AbortSignal): Promise<ForecastData> => {
    try {
        const response = await axios.get(`${BASE_URL}/forecast`, {
            params: {
                ...locationParams(query),
                appid: API_KEY,
                units: 'metric',
                lang: 'tr',
                cnt: 40 // 5 günlük tahmin (3 saatlik aralıklarla)
            },
            signal
        });
        return response.data;
    } catch (error) {
        if (axios.isCancel(error)) throw error;
        if (axios.isAxiosError(error)) {
            const weatherError: WeatherError = {
                message: getErrorMessage(error.response?.status, '5 günlük tahmin alınamadı'),
                code: error.response?.status
            };
            throw weatherError;
        }
        throw new Error('Beklenmeyen bir hata oluştu');
    }
};

// Şehir önerileri için OpenWeather Geocoding API
export const searchCities = async (query: string, signal?: AbortSignal): Promise<GeoLocation[]> => {
    const response = await axios.get<GeoLocation[]>(`${GEO_URL}/direct`, {
        params: {
            q: query,
            limit: 5,
            appid: API_KEY
        },
        signal
    });
    return response.data;
};

// Hava durumu ikonunu almak için yardımcı fonksiyon
export const getWeatherIcon = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Sıcaklık birimini dönüştürmek için yardımcı fonksiyonlar
export const celsiusToFahrenheit = (celsius: number): number => {
    return (celsius * 9/5) + 32;
};

// API'den Celsius olarak gelen sıcaklığı seçili birimde göster
export const formatTemperature = (celsius: number, isCelsius: boolean): string => {
    const value = isCelsius ? celsius : celsiusToFahrenheit(celsius);
    return `${Math.round(value)}°${isCelsius ? 'C' : 'F'}`;
};

export const fahrenheitToCelsius = (fahrenheit: number): number => {
    return (fahrenheit - 32) * 5/9;
}; 