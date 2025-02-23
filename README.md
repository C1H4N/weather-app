# Hava Durumu Uygulaması

Bu proje, React ve TypeScript kullanılarak geliştirilmiş modern bir hava durumu uygulamasıdır.

## Özellikler

- 🌍 Dünya genelinde şehir bazlı hava durumu bilgisi
- 📍 Konum bazlı hava durumu (tarayıcı konumu ile)
- 🔍 Akıllı şehir arama: 81 il için anında öneri, diğer şehirler için OpenWeather Geocoding (Türkçe karakter desteği)
- 📅 5 günlük hava durumu tahmini (her gün için öğle saatine en yakın tahmin)
- 🌡️ Sıcaklık birimi değiştirme (Celsius/Fahrenheit, sıcaklık değerine tıklayarak)
- 📱 Responsive tasarım
- ✨ Modern ve kullanıcı dostu arayüz

## Kurulum

1. Projeyi klonlayın:
```powershell
# Windows için
git clone https://github.com/C1H4N/weather-app.git
cd weather-app
```

2. Bağımlılıkları yükleyin:
```powershell
npm install
```

3. OpenWeatherMap API anahtarını ayarlayın:
   - [OpenWeatherMap](https://openweathermap.org/api) üzerinden bir API anahtarı alın
   - `.env.example` dosyasını kopyalayıp `.env` olarak yeniden adlandırın
   - `.env` dosyasındaki `VITE_OPENWEATHER_API_KEY` değerini kendi API anahtarınızla değiştirin

4. Uygulamayı başlatın:
```powershell
npm run dev
```

## API Anahtarı Hakkında Not

`VITE_` ile başlayan ortam değişkenleri derleme sırasında JavaScript paketine gömülür. `.env` dosyası Git'e eklenmez, ancak yayınlanan sürümde API anahtarı tarayıcının geliştirici araçlarından görülebilir. Bu yüzden ücretli plana bağlı olmayan, ücretsiz bir anahtar kullanın; anahtarın tamamen gizli kalması gerekiyorsa istekleri kendi sunucunuz veya bir serverless fonksiyon üzerinden yönlendirin.

## Kullanılan Teknolojiler

- React
- TypeScript
- Material-UI
- Axios
- OpenWeatherMap API
- Vite

## Katkıda Bulunma

1. Bu depoyu fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/yeniOzellik`)
3. Değişikliklerinizi commit edin (`git commit -am 'Yeni özellik: Açıklama'`)
4. Branch'inizi push edin (`git push origin feature/yeniOzellik`)
5. Bir Pull Request oluşturun

## Lisans

MIT
