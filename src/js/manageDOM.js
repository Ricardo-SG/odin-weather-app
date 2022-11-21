/* eslint-enable */
import maxTemp from '../img/high-temp.png';
import minTemp from '../img/low-temp.png';
import humidity from '../img/humidity.png';
import windSpeed from '../img/windSpeed.png';

// This module pattern will manage the dom modifications of our web
const manageDOM = (function () {
  // All the web elements we want to work with
  const weatherCanvas = document.getElementById('weather-canvas');

  const setWeather = function (data) {
    cleanCanvas(); // We delete all childs of weatherCanvas if it has from a previous set
    const sign = getTempSign();
    // const sign = ' °C';

    const location = document.createElement('p');
    location.id = 'wlocation';
    location.textContent = data.name;

    const desc = document.createElement('p');
    desc.id = 'wdesc';
    desc.textContent = data.weather[0].description;

    const imag = document.createElement('img');
    imag.id = 'wimag';
    imag.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    const temp = document.createElement('p');
    temp.id = 'wtemp';
    temp.textContent = data.main.temp + sign;

    const thermal = document.createElement('p'); // thermal Sensation
    thermal.id = 'wthermal';
    thermal.textContent = 'Feels like: ' + data.main.feels_like + sign;

    const footWData = document.createElement('div');
    footWData.id = 'foot-weather-data';
    const leftContainer = document.createElement('div');
    leftContainer.id = 'left-container';
    const rightContainer = document.createElement('div');
    rightContainer.id = 'right-container';

    /* Max temp icon and text */
    const imgMaxTemp = document.createElement('img');
    imgMaxTemp.id = 'img-max-temp';
    imgMaxTemp.src = maxTemp;
    const txtMaxTemp = document.createElement('div');
    txtMaxTemp.id = 'txt-max-temp';
    txtMaxTemp.textContent = data.main.temp_max + sign;

    /* Min temp icon and text */
    const imgMinTemp = document.createElement('img');
    imgMinTemp.id = 'img-min-temp';
    imgMinTemp.src = minTemp;
    const txtMinTemp = document.createElement('div');
    txtMinTemp.id = 'txt-min-temp';
    txtMinTemp.textContent = data.main.temp_min + sign;

    /* Humidity icon and text */
    const imgHumidity = document.createElement('img');
    imgHumidity.id = 'img-humidity';
    imgHumidity.src = humidity;

    const txtHumidity = document.createElement('div');
    txtHumidity.id = 'txt-humidity';
    txtHumidity.textContent = data.main.humidity + '%';

    /* Wind speed icon and text */
    const imgWindSpeed = document.createElement('img');
    imgWindSpeed.id = 'img-Wind-speed';
    imgWindSpeed.src = windSpeed;

    const txtWindSpeed = document.createElement('div');
    txtWindSpeed.id = 'txt-wind-speed';
    txtWindSpeed.textContent = data.wind.speed + ' km/h';

    leftContainer.append(imgMaxTemp, txtMaxTemp, imgMinTemp, txtMinTemp);
    rightContainer.append(txtHumidity, imgHumidity, txtWindSpeed, imgWindSpeed);
    footWData.append(leftContainer, rightContainer);

    weatherCanvas.append(location, desc, imag, temp, thermal, footWData);
  };

  function getTempSign() {
    const divWithSign = document.querySelector('.selected');
    console.log('<getTempSign>' + divWithSign);
    console.log('divWithSign.textcontent:' + divWithSign.textContent);

    return ' ' + divWithSign.textContent;
  }

  const cleanCanvas = function () {
    while (weatherCanvas.firstChild) {
      weatherCanvas.removeChild(weatherCanvas.firstChild);
    }
  };

  return { setWeather };
})();

export { manageDOM };
