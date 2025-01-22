export interface WeatherData {
    main: {
        temp: number;
        feels_like: number;
        humidity: number;
        pressure: number;
    };
    weather: Array<{
        main: string;
        description: string;
        icon: string;
    }>;
    wind: {
        speed: number;
    };
    sys: {
        sunrise: number;
        sunset: number;
        country: string;
    };
    name: string;
}

export interface ForecastData {
    list: Array<{
        dt: number;
        main: {
            temp: number;
            humidity: number;
        };
        weather: Array<{
            main: string;
            description: string;
            icon: string;
        }>;
        wind: {
            speed: number;
        };
        dt_txt: string;
    }>;
    city: {
        name: string;
        country: string;
    };
}

export interface Coordinates {
    lat: number;
    lon: number;
}

// Şehir adı veya koordinat ile arama
export type SearchQuery = string | Coordinates;

export interface GeoLocation extends Coordinates {
    name: string;
    country: string;
    state?: string;
}

export interface WeatherError {
    message: string;
    code?: number;
} 