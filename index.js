document.addEventListener("DOMContentLoaded", function () {
    setTimeout(() => {
        const loader = document.querySelector('.loader');
        loader.style.animation = "none"; // Отменяем анимацию loader

        // Запускаем анимацию закрытия снизу вверх
        setTimeout(() => {
            loader.style.animation = "slideUp 0.5s forwards";

            // Добавляем класс к элементам, которые должны появиться
            const elementsToAnimate = document.querySelectorAll('.welcome_content');
            elementsToAnimate.forEach((element) => {
                element.classList.add('fadeInUp');
            });

            // Запускаем анимацию для текста в .welcome_preview
            const welcomePreviewText = document.querySelector('.welcome_preview');
            welcomePreviewText.style.animation = "slideInUp 0.5s forwards";
        }, 600); // Половина времени анимации loader (600 миллисекунд из 1200)
    }, 0);
});

function displayCurrentTime() {
    const timeElement = document.querySelector('.time');
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    const formattedTime = `${hours}:${minutes}`;
    timeElement.textContent = formattedTime;
}
setInterval(displayCurrentTime, 1000); // Обновляем время каждую секунду
// Функция для получения города и страны пользователя

async function getWeatherByCity(cityName) {
    try {
        const apiKey = '102011b26e2de4198d214301d1c5b866'; // Вставьте ваш API-ключ для погоды
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const cityName = data.name;
            const weatherIcon = data.weather[0].icon; // Получаем код иконки погоды

            const weatherInfoElement = document.querySelector('.weather-info');
            weatherInfoElement.textContent = `City: ${cityName}, Temperature: ${temperature}°C, Description: ${description}`;

            // Обновляем элемент с классом "get_weather" для вывода погоды
            const getWeatherElement = document.querySelector('.get_weather');
            getWeatherElement.textContent = `Погода: City: ${cityName}, Temperature: ${temperature}°C, Description: ${description}`;

            // Обновляем элемент с классом "weather-icon" для отображения иконки погоды
            const weatherIconElement = document.querySelector('.weather-icon');
            weatherIconElement.src = `https://openweathermap.org/img/w/${weatherIcon}.png`;
            weatherIconElement.alt = `Погода: ${description}`;
        } else {
            console.log("Данные о погоде не найдены.");
        }
    } catch (error) {
        console.error("Ошибка при получении данных о погоде:", error);
    }
}

async function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                // Выполняем обратное геокодирование с использованием OpenCage Geocoding API
                const apiKey = '77184f11a0c84b4a882273944f3c1e07'; // Замените на свой API ключ
                const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&language=en&pretty=1`);
                const data = await response.json();

                if (data.results.length > 0) {
                    const city = data.results[0].components.city || data.results[0].components.town;
                    const country = data.results[0].components.country;
                    const locationElement = document.querySelector('.location');
                    locationElement.textContent = `City: ${city}, Country: ${country}`;

                    // Вызываем функцию для получения данных о погоде по городу
                    getWeatherByCity(city);
                } else {
                    console.log("Данные о местоположении не найдены.");
                }
            } catch (error) {
                console.error("Ошибка при выполнении обратного геокодирования:", error);
            }
        });
    } else {
        console.log("Geolocation не поддерживается в вашем браузере.");
    }
}
// Вызываем функцию для получения города и страны пользователя


// Функция для отображения текущего времени

// Вызываем функции для получения местоположения и отображения времени
getUserLocation();