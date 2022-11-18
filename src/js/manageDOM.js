/* eslint-enable */

// This module pattern will manage the dom modifications of our web
const manageDOM = (function () {
  // All the web elements we want to work with
  const weatherCanvas = document.getElementById('weather-canvas');

  const setWeather = function (data) {
    cleanCanvas(); // We delete all childs of weatherCanvas if it has from a previous set
    const sign = ' °C';

    const location = document.createElement('p');
    location.id = 'wlocation';
    location.textContent = data.name;

    const title = document.createElement('p');
    title.id = 'wtitle';
    title.textContent = data.weather[0].main;

    const desc = document.createElement('p');
    desc.id = 'wdesc';
    desc.textContent = data.weather[0].description;

    const imag = document.createElement('img');
    imag.id = 'wimag';
    imag.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    //    `http://openweathermap.org/img/wn/10d@2x.png`
    //    https://openweathermap.org/img/wn/01d@2x.png
    //    http ://openweathermap.org/img/w/01n@2x.png
    //    https://openweathermap.org/img/wn/01n@2x.png
    const temp = document.createElement('p');
    temp.id = 'wtemp';
    temp.textContent = 'Temperature: ' + data.main.temp + sign;

    const tempMax = document.createElement('p');
    tempMax.id = 'wtemp-max';
    tempMax.textContent = 'Max Temperature: ' + data.main.temp_max + sign;

    const tempMin = document.createElement('p');
    tempMin.id = 'wtemp-min';
    tempMin.textContent = 'Min Temperature: ' + data.main.temp_min + sign;

    const termic = document.createElement('p'); // Termic Sensation
    termic.id = 'wtermic';
    termic.textContent = 'Termic sensation: ' + data.main.feels_like + sign;

    const pressure = document.createElement('p');
    pressure.id = 'wpressure';
    pressure.textContent = 'Pressure: ' + data.main.pressure + ' hPa';

    const humidity = document.createElement('p');
    humidity.id = 'whumidity';
    humidity.textContent = 'Humidity: ' + data.main.humidity + ' %';

    const windSpeed = document.createElement('p');
    windSpeed.id = 'wwind-speed';
    windSpeed.textContent = 'Wind Speed: ' + data.wind.speed + ' km/h';

    weatherCanvas.append(
      location,
      title,
      desc,
      imag,
      temp,
      tempMax,
      tempMin,
      termic,
      pressure,
      humidity,
      windSpeed
    );
  };

  const cleanCanvas = function () {
    while (weatherCanvas.firstChild) {
      weatherCanvas.removeChild(weatherCanvas.firstChild);
    }
  };

  return { setWeather };
})();

export { manageDOM };
