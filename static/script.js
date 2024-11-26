// Ініціалізація карти
const map = L.map('map-container').setView([46.4825, 30.7233], 13); // Координати Одеси

// Базові шари карти
const baseLayers = {
    "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }),
    "Satellite": L.tileLayer('https://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
        attribution: '&copy; Google Satellite'
    })
};

// Встановлюємо базовий шар
baseLayers.OpenStreetMap.addTo(map);

// Мітки для демонстрації заторів
const trafficMarkers = [
    { lat: 46.4825, lng: 30.7233, description: "Центральна вулиця, затор!" },
    { lat: 46.4900, lng: 30.7300, description: "Затор біля парку Шевченка." }
];

// Група для міток заторів
const trafficLayer = L.layerGroup(
    trafficMarkers.map(marker => {
        const trafficMarker = L.marker([marker.lat, marker.lng]);
        trafficMarker.bindPopup(marker.description);
        return trafficMarker;
    })
).addTo(map);

// Логіка для кнопки "Пошук"
document.getElementById('search-button').addEventListener('click', () => {
    const searchQuery = prompt("Введіть адресу або місце для пошуку:");
    if (!searchQuery) return;

    // Використовуємо Nominatim API для геокодування
    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`)
        .then(response => response.json())
        .then(data => {
            if (data.length === 0) {
                alert("Місце не знайдено. Спробуйте ще раз.");
                return;
            }

            const { lat, lon } = data[0];
            map.setView([lat, lon], 15); // Переміщення карти
            L.marker([lat, lon]).addTo(map).bindPopup(`Знайдено: ${searchQuery}`).openPopup();
        })
        .catch(err => {
            alert("Помилка при пошуку. Перевірте підключення до інтернету.");
            console.error(err);
        });
});

// Логіка для кнопки "Фільтри"
document.getElementById('filter-button').addEventListener('click', () => {
    const action = prompt("Оберіть дію:\n1 - Змінити стиль карти\n2 - Увімкнути/вимкнути затори");
    if (action === "1") {
        const style = prompt("Оберіть стиль:\n1 - OpenStreetMap\n2 - Satellite");
        if (style === "1") {
            map.removeLayer(baseLayers.Satellite);
            baseLayers.OpenStreetMap.addTo(map);
        } else if (style === "2") {
            map.removeLayer(baseLayers.OpenStreetMap);
            baseLayers.Satellite.addTo(map);
        } else {
            alert("Невірний вибір.");
        }
    } else if (action === "2") {
        if (map.hasLayer(trafficLayer)) {
            map.removeLayer(trafficLayer);
            alert("Затори вимкнено.");
        } else {
            map.addLayer(trafficLayer);
            alert("Затори увімкнено.");
        }
    } else {
        alert("Невірний вибір.");
    }
});

