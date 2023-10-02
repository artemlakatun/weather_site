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



document.addEventListener("DOMContentLoaded", function() {
    // Находим кнопку по её классу
    const checkWeatherButton = document.querySelector('.check_weather_button');

    // Находим блок, к которому хотим прокрутить страницу
    const findWeatherContainer = document.querySelector('.find_weather_container');

    // Добавляем обработчик события для кнопки
    checkWeatherButton.addEventListener('click', function() {
        // Используем метод scrollIntoView для плавной прокрутки к блоку
        findWeatherContainer.scrollIntoView({ behavior: 'smooth' });
    });
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
        const apiKey = '102011b26e2de4198d214301d1c5b866';
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`);
        const data = await response.json();

        if (data.cod === 200) {
            const temperature = data.main.temp;
            const description = data.weather[0].description;
            const weatherIcon = data.weather[0].icon; // Получаем код иконки погоды
            const windSpeed = data.wind.speed; // Получаем скорость ветра

            const weatherInfoElement = document.querySelector('.weather-info');
            weatherInfoElement.innerHTML = `
                <div class="weather-line">
                    <span class="temperature">Temperature:</span> ${temperature}°C
                </div>
                <div class="weather-line">
                    <span class="description">Description:</span> ${description}
                </div>
                <div class="weather-line">
                    <span class="wind_speed">Wind Speed:</span> ${windSpeed} m/s
                </div>
                <div class="weather-line">
                    <span class="date">Date:</span> ${getCurrentDate()}
                </div>
                <div class="weather-line">
                <img class="weather-icon" src="" alt="Погода">
                </div>
            `;

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

function getCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
}

async function getUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(async function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {
                const apiKey = '77184f11a0c84b4a882273944f3c1e07';
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



let isWeatherCleared = false; // Флаг для отслеживания очистки погоды

async function getWeatherForecast() {
    const apiKey = '102011b26e2de4198d214301d1c5b866';
    const city = document.querySelector('.input_search').value;

    // Если флаг isWeatherCleared установлен в true и строка поиска пустая, просто выходим
    if (isWeatherCleared && city === '') {
        return;
    }

    const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.status === 200) {
            const forecast = data.list;
            const findWeatherInfo = document.querySelector('.find_weather_info');
            findWeatherInfo.innerHTML = '';

            for (let i = 0; i < 5; i++) { // Отображаем прогноз на 5 дней
                const day = forecast[i * 8]; // Получаем данные для каждого следующего дня (каждые 8 записей)

                const infoDiv = document.createElement('div');
                infoDiv.classList.add('info');
                infoDiv.innerHTML = `
                    <h2>${getDayOfWeekAndDate(day.dt)}</h2>
                    <p>Temperature: ${day.main.temp}°C</p>
                    <p>Description: ${day.weather[0].description}</p>
                    <p>Wind Speed: ${day.wind.speed} m/s</p>
                    <p>Precipitation Probability: ${day.pop * 100}%</p> <!-- Вероятность осадков -->
                `;

                const iconUrl = `https://openweathermap.org/img/w/${day.weather[0].icon}.png`;
                const iconImg = document.createElement('img');
                iconImg.src = iconUrl;
                iconImg.alt = day.weather[0].description;

                infoDiv.appendChild(iconImg); // Помещаем иконку внутрь карточки
                findWeatherInfo.appendChild(infoDiv);
            }

            // Сброс флага isWeatherCleared при успешном получении погоды
            isWeatherCleared = false;

            // Добавляем город в список сохраненных городов
            saveCity(city);
        } else {
            console.log('Данные о погоде не найдены.');
        }
    } catch (error) {
        console.error('Ошибка при получении данных о погоде:', error);
    }
}

function getDayOfWeekAndDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    return `${dayOfWeek}, ${dayOfMonth}`;
}

function clearWeatherInfo() {
    const inputSearch = document.querySelector('.input_search');
    const findWeatherInfo = document.querySelector('.find_weather_info');

    if (inputSearch.value === '' && !isWeatherCleared) {
        // Если строка поиска пустая и погода не была очищена ранее, устанавливаем флаг
        isWeatherCleared = true;
    }

    inputSearch.value = ''; // Очищаем строку поиска
    findWeatherInfo.innerHTML = ''; // Убираем информацию о погоде
}

// Функция для сохранения города в Local Storage
function saveCity(city) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

    // Проверяем, чтобы город не дублировался
    if (!savedCities.includes(city)) {
        savedCities.push(city);

        // Ограничиваем количество сохраненных городов до 10
        if (savedCities.length > 10) {
            savedCities = savedCities.slice(-10);
        }

        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        loadSavedCities();
    }
}

// Функция для загрузки сохраненных городов из Local Storage
// Функция для загрузки сохраненных городов из Local Storage
function loadSavedCities() {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    const savedFindWeather = document.querySelector('.saved_find_weather');

    savedFindWeather.innerHTML = ''; // Очищаем список сохраненных городов



    savedCities.forEach((city) => {
        const savedCityDiv = document.createElement('div');
        savedCityDiv.classList.add('saved_city');

        // Создаем кнопку удаления города
        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete_button');
        deleteButton.innerHTML = 'Удалить';

        savedCityDiv.textContent = city;

        // Добавляем обработчик события для удаления города
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Остановить всплытие события, чтобы не вызывался click на родительском элементе
            deleteCity(city);
            loadSavedCities();
        });

        savedCityDiv.appendChild(deleteButton);
        savedCityDiv.addEventListener('click', () => {
            document.querySelector('.input_search').value = city; // Заполняем строку поиска
            getWeatherForecast(); // Вызываем функцию получения погоды
        });

        savedFindWeather.appendChild(savedCityDiv);
    });

    // Устанавливаем минимальную высоту блока saved_find_weather
    if (savedCities.length === 0) {
        savedFindWeather.style.minHeight = '200px';
    } else {
        savedFindWeather.style.minHeight = 'auto';
    }
}

// Функция для удаления города из сохраненных
function deleteCity(city) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

    if (savedCities.includes(city)) {
        savedCities = savedCities.filter((savedCity) => savedCity !== city);
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
    }
}

// Вызываем функцию загрузки сохраненных городов при загрузке страницы
window.addEventListener('load', loadSavedCities);

// Получаем элементы
const findWeatherContainer = document.querySelector('.find_weather_container');
const findWeatherInfo = document.querySelector('.find_weather_info');

// Функция для автоматического скрытия/отображения блока find_weather_info
function toggleFindWeatherInfo() {
    if (findWeatherInfo.children.length === 0) {
        // Если внутри findWeatherInfo нет дочерних элементов, скрываем его
        findWeatherInfo.style.display = 'none';
        findWeatherContainer.style.maxHeight = '200px'; // Уменьшаем максимальную высоту
    } else {
        // Иначе отображаем блок findWeatherInfo
        findWeatherInfo.style.display = 'flex';
        findWeatherContainer.style.maxHeight = '700px'; // Восстанавливаем максимальную высоту
    }
}

// Вызываем toggleFindWeatherInfo() при загрузке страницы и при каждом изменении в блоке findWeatherInfo
window.addEventListener('DOMContentLoaded', toggleFindWeatherInfo);
findWeatherInfo.addEventListener('DOMSubtreeModified', toggleFindWeatherInfo);

