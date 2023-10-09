// логика для loader
document.addEventListener("DOMContentLoaded", function () {
    window.addEventListener("load", function () {
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
    });
});

//burger menu
const menuContainer = document.createElement('div');
const body = document.body;
const html = document.documentElement;
const overlay = document.querySelector('.overlay');
const burger = document.querySelector('.burger');
const navLinks = document.querySelectorAll('.nav_menu .link');

menuContainer.className = 'menu_container';
document.body.appendChild(menuContainer);

// Перемещаем меню в созданный контейнер
const navMenu = document.querySelector('.nav_menu');

// Устанавливаем начальное состояние блока
menuContainer.style.transform = 'translateX(-50%)';

document.querySelector('.burger').addEventListener('click', function () {
    this.classList.toggle('active');
    menuContainer.classList.toggle('active');

    if (menuContainer.classList.contains('active')) {
        menuContainer.appendChild(navMenu);
        menuContainer.style.transform = 'translateX(200%)';
        navMenu.style.display = 'flex';
        disableScroll();
        showOverlay()
    } else {
        menuContainer.removeChild(navMenu);
        menuContainer.style.transform = 'translateX(-200%)';
        enableScroll()
        hideOverlay()
        event.preventDefault();
    }
});

function disableScroll() {
    body.style.overflow = 'hidden';
    html.style.overflow = 'hidden';
}

function enableScroll() {
    body.style.overflow = 'auto';
    html.style.overflow = 'auto';
}

function showOverlay() {
    overlay.style.display = 'block';
}

function hideOverlay() {
    overlay.style.display = 'none';
}

// Закрываем меню при клике на ссылку внутри меню
navLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
        event.preventDefault();
        burger.classList.remove('active');
        menuContainer.classList.remove('active');
        menuContainer.style.transform = 'translateX(-100%)';
        hideOverlay();
        enableScroll();
    });
});

// Закрываем меню при выборе ссылки
document.querySelectorAll('.nav_menu .link').forEach(function (link) {
    link.addEventListener('click', function () {
        document.querySelector('.burger').classList.remove('active');
        menuContainer.classList.remove('active');
        menuContainer.style.transform = 'translateX(-100%)'; // Скрываем блок
    });
});


// при нажатии на кнопку в главном меню ссылаемся на пойск
document.addEventListener("DOMContentLoaded", function() {
    const checkWeatherButton = document.querySelector('.check_weather_button');
    const userWeather = document.querySelector('.user_weather');

    checkWeatherButton.addEventListener('click', function() {
        userWeather.scrollIntoView({ behavior: 'smooth' });
    });
});

//функция определения времени
function displayCurrentTime() {
    const timeElement = document.querySelector('.time');
    const currentTime = new Date();
    const hours = currentTime.getHours();
    const minutes = currentTime.getMinutes();
    timeElement.textContent = `${hours}:${minutes}`;
}
setInterval(displayCurrentTime, 1000);

// Функция для получения города и страны пользователя
async function getWeatherByCity(cityName) {
    try {
        const apiKey = '922e0d82e8fdfd6a5824cf5186795b62';
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
            const weatherInfoElement = document.querySelector('.weather-info');
            weatherInfoElement.textContent = "Sorry, the weather in your city was not found, try again later!";
        }
    } catch (error) {
        console.error("Ошибка при получении данных о погоде:", error);
    }
}

// функция которая получает дату
function getCurrentDate() {
    const currentDate = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return currentDate.toLocaleDateString('en-US', options);
}

// функция которая получает местоположение
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
                    await getWeatherByCity(city);
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
getUserLocation();

// функция для получения погоды
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
                    <h3>${getDayOfWeekAndDate(day.dt)}</h3>
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

// усовершенствование функции выше(получает сегодняшний день недели)
function getDayOfWeekAndDate(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const daysOfWeek = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    const dayOfWeek = daysOfWeek[date.getDay()];
    const dayOfMonth = date.getDate();
    return `${dayOfWeek}, ${dayOfMonth}`;
}

// функция которая чистит строку пойска и убирает блочки с погодой
function clearWeatherInfo() {
    const inputSearch = document.querySelector('.input_search');
    const findWeatherInfo = document.querySelector('.find_weather_info');

    if (inputSearch.value === '' && !isWeatherCleared) {
        // Если строка поиска пустая и погода не была очищена ранее, устанавливаем флаг
        isWeatherCleared = true;
    }
    inputSearch.value = '';
    findWeatherInfo.innerHTML = '';
}

// Функция для сохранения города в Local Storage
function saveCity(city) {
    let savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];

    // Проверяем, чтобы город не дублировался
    if (!savedCities.includes(city)) {
        savedCities.push(city);
        if (savedCities.length > 10) {
            savedCities = savedCities.slice(-10);
        }
        localStorage.setItem('savedCities', JSON.stringify(savedCities));
        loadSavedCities();
    }
}


// Функция для загрузки сохраненных городов из Local Storage
function loadSavedCities() {
    const savedCities = JSON.parse(localStorage.getItem('savedCities')) || [];
    const savedFindWeather = document.querySelector('.saved_find_weather');

    savedFindWeather.innerHTML = '';
    savedCities.forEach((city) => {
        const savedCityDiv = document.createElement('div');
        savedCityDiv.classList.add('saved_city');

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete_button');
        deleteButton.innerHTML = 'Удалить';

        savedCityDiv.textContent = city;

        // Добавляем обработчик события для удаления города
        deleteButton.addEventListener('click', (event) => {
            event.stopPropagation();
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
        findWeatherContainer.style.maxHeight = '905px'; // Восстанавливаем максимальную высоту
    }
}

// Вызываем toggleFindWeatherInfo() при загрузке страницы и при каждом изменении в блоке findWeatherInfo
window.addEventListener('DOMContentLoaded', toggleFindWeatherInfo);
findWeatherInfo.addEventListener('DOMSubtreeModified', toggleFindWeatherInfo);

document.addEventListener("DOMContentLoaded", function () {
    const slides = document.querySelectorAll(".slide");
    const indicator = document.querySelector(".carousel-indicator");
    const dots = [];

    let currentIndex = 0;

    function updateIndicator() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.add("active");
            } else {
                dot.classList.remove("active");
            }
        });
    }

    //функция для карусели
    function showSlide(index) {
        slides.forEach((slide, i) => {
            if (i === index) {
                slide.classList.add("active-slide");
            } else {
                slide.classList.remove("active-slide");
            }
        });
        currentIndex = index;
        updateIndicator();
    }

    slides.forEach((slide, index) => {
        const dot = document.createElement("div");
        dot.classList.add("indicator-dot");
        dot.addEventListener("click", () => {
            showSlide(index);
        });
        indicator.appendChild(dot);
        dots.push(dot);
    });

    function nextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        showSlide(nextIndex);
    }

    setInterval(nextSlide, 3000); // Автоматическое перелистывание каждые 3 секунды

    showSlide(currentIndex); // Показать первый слайд по умолчанию
});

//плавный якорь навигации
const anchors = document.querySelectorAll('a[href*="#"]')

for(let anchor of anchors) {
    anchor.addEventListener("click", function (e) {
        event.preventDefault();
        const blockID = anchor.getAttribute('href')
        document.querySelector('' + blockID).scrollIntoView({
            behavior: "smooth",
            block: "start"
        })
    })
}