# Hava Durumu Uygulaması

Bu proje, React ve TypeScript kullanılarak geliştirilmiş modern bir hava durumu uygulamasıdır.

## Özellikler

- 🌍 Dünya genelinde şehir bazlı hava durumu bilgisi
- 📍 Konum bazlı hava durumu
- 🔍 Akıllı şehir arama (Türkçe karakter desteği)
- 📅 5 günlük hava durumu tahmini
- 🌡️ Sıcaklık birimi değiştirme (Celsius/Fahrenheit)
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

## Kullanılan Teknolojiler

- React
- TypeScript
- Material-UI
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
