import React, { useState, useCallback, useEffect } from 'react';
import { 
    TextField, 
    IconButton, 
    Paper,
    InputAdornment,
    Box,
    Autocomplete,
    CircularProgress
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { turkishCities } from '../services/cityData';
import { searchCities } from '../services/weatherApi';
import { SearchQuery } from '../types/weather';

interface SearchBarProps {
    onSearch: (query: SearchQuery) => void;
    onLocationSearch?: () => void;
}

interface CityOption {
    name: string;
    country: string;
    state?: string;
    normalizedName?: string;
    lat?: number;
    lon?: number;
}

// Öneriden arama sorgusu oluştur: koordinat varsa onu, yoksa "şehir,ülke" kullan
const toSearchQuery = (option: CityOption): SearchQuery =>
    option.lat !== undefined && option.lon !== undefined
        ? { lat: option.lat, lon: option.lon }
        : `${option.name},${option.country}`;

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onLocationSearch }) => {
    const [open, setOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<CityOption[]>([]);
    const [loading, setLoading] = useState(false);
    
    const fetchCities = useCallback(async (input: string, signal: AbortSignal) => {
        if (input.length < 2) return;
        
        setLoading(true);
        try {
            // Önce Türkiye şehirlerini kontrol et
            const normalizedInput = input.toLowerCase().replace(/[ğüşıöçİĞÜŞÖÇ]/g, c => 
                ({ 'ğ': 'g', 'ü': 'u', 'ş': 's', 'ı': 'i', 'ö': 'o', 'ç': 'c',
                   'İ': 'i', 'Ğ': 'g', 'Ü': 'u', 'Ş': 's', 'Ö': 'o', 'Ç': 'c' }[c] || c));
            
            const turkishMatches = turkishCities.filter(city => 
                city.name.toLowerCase().includes(input.toLowerCase()) ||
                city.normalizedName.includes(normalizedInput)
            );

            if (turkishMatches.length > 0) {
                setOptions(turkishMatches);
                setLoading(false);
                return;
            }

            // Türkiye şehri bulunamazsa, global arama yap
            const data = await searchCities(input, signal);
            if (signal.aborted) return;

            const uniqueCities = data.reduce((acc: CityOption[], city) => {
                const exists = acc.some(
                    c => c.name.toLowerCase() === city.name.toLowerCase() && 
                    c.country === city.country
                );
                if (!exists) {
                    acc.push({
                        name: city.name,
                        country: city.country,
                        state: city.state,
                        lat: city.lat,
                        lon: city.lon
                    });
                }
                return acc;
            }, []);
            
            setOptions(uniqueCities);
        } catch (error) {
            if (signal.aborted) return;
            console.error('Şehir arama hatası:', error);
            setOptions([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (inputValue.trim()) {
            // Giriş değişince bekleyen aramayı ve devam eden isteği iptal et
            const controller = new AbortController();
            const timer = setTimeout(() => {
                fetchCities(inputValue, controller.signal);
            }, 300);
            return () => {
                clearTimeout(timer);
                controller.abort();
            };
        } else {
            setOptions([]);
        }
    }, [inputValue, fetchCities]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();
        if (inputValue.trim()) {
            onSearch(inputValue.trim());
        }
    }, [inputValue, onSearch]);

    return (
        <Box sx={{ width: '100%', maxWidth: 600, margin: '20px auto' }}>
            <Paper 
                component="form" 
                onSubmit={handleSubmit}
                elevation={3}
                sx={{
                    p: '2px 4px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <Autocomplete
                    fullWidth
                    open={open}
                    onOpen={() => setOpen(true)}
                    onClose={() => setOpen(false)}
                    inputValue={inputValue}
                    onInputChange={(_, newValue) => setInputValue(newValue)}
                    options={options}
                    loading={loading}
                    getOptionLabel={(option) => 
                        typeof option === 'string' 
                            ? option 
                            : `${option.name}${option.state ? ', ' + option.state : ''}, ${option.country}`
                    }
                    filterOptions={(x) => x}
                    onChange={(_, newValue) => {
                        if (newValue) {
                            onSearch(typeof newValue === 'string' ? newValue : toSearchQuery(newValue));
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            placeholder="Şehir adı girin..."
                            sx={{ ml: 1, flex: 1 }}
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <InputAdornment position="end">
                                        {loading ? (
                                            <CircularProgress color="inherit" size={20} />
                                        ) : (
                                            <>
                                                <IconButton 
                                                    type="submit"
                                                    sx={{ p: '10px' }} 
                                                    aria-label="search"
                                                >
                                                    <SearchIcon />
                                                </IconButton>
                                                {onLocationSearch && (
                                                    <IconButton
                                                        sx={{ p: '10px' }}
                                                        aria-label="use current location"
                                                        onClick={onLocationSearch}
                                                    >
                                                        <LocationOnIcon />
                                                    </IconButton>
                                                )}
                                            </>
                                        )}
                                    </InputAdornment>
                                ),
                            }}
                        />
                    )}
                />
            </Paper>
        </Box>
    );
};

export default SearchBar; 