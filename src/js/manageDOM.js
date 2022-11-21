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
    let aux = '';
    cleanCanvas(); // We delete all childs of weatherCanvas if it has from a previous set

    weatherCanvas.classList.remove('invisible');
    const sign = getTempSign();
    const location = createHtml('p', 'wlocation', data.name, null, null);
    const desc = createHtml('p', 'wdesc', data.weather[0].description);
    aux = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    const imag = createHtml('img', 'wimag', null, null, aux);
    const temp = createHtml('p', 'wtemp', data.main.temp + sign);
    aux = 'Feels like: ' + data.main.feels_like + sign;
    const thermal = createHtml('p', 'wthermal', aux);
    const footWData = createHtml('div', 'foot-weather-data');
    const leftContainer = createHtml('div', 'left-container');
    const rightContainer = createHtml('div', 'right-container');
    const imgMaxTemp = createHtml('img', 'img-max-temp', null, null, maxTemp);
    aux = data.main.temp_max + sign;
    const txtMaxTemp = createHtml('div', 'txt-max-temp', aux);
    const imgMinTemp = createHtml('img', 'img-min-temp', null, null, minTemp);
    aux = data.main.temp_min + sign;
    const txtMinTemp = createHtml('div', 'txt-min-temp', aux);
    const imgHumidity = createHtml('img', 'img-humidity', null, null, humidity);
    aux = data.main.humidity + ' %';
    const txtHumidity = createHtml('div', 'txt-humidity', aux);
    aux = windSpeed;
    const imgWindSpeed = createHtml('img', 'img-wind-speed', null, null, aux);
    aux = data.wind.speed + ' km/h';
    const txtWindSpeed = createHtml('div', 'txt-wind-speed', aux);

    leftContainer.append(imgMaxTemp, txtMaxTemp, imgMinTemp, txtMinTemp);
    rightContainer.append(txtHumidity, imgHumidity, txtWindSpeed, imgWindSpeed);
    footWData.append(leftContainer, rightContainer);

    weatherCanvas.append(location, desc, imag, temp, thermal, footWData);
  };

  function createHtml(htmlTag, htmlId, txtContent, htmlClass, htmlSrc) {
    const aux = document.createElement(htmlTag);
    if (htmlId !== null && htmlId !== undefined) {
      aux.id = htmlId;
    }

    if (txtContent !== null && txtContent !== undefined) {
      aux.textContent = txtContent;
    }

    if (htmlClass !== null && htmlClass !== undefined) {
      aux.className = htmlClass;
    }

    if (htmlSrc !== null && htmlSrc !== undefined) {
      aux.src = htmlSrc;
    }

    return aux;
  }

  function getTempSign() {
    const divWithSign = document.querySelector('.selected');

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
