/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/fetchData.js":
/*!*****************************!*\
  !*** ./src/js/fetchData.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "manageFetchs": () => (/* binding */ manageFetchs)
/* harmony export */ });
/* eslint-enable */

// We use a module Pattern to define a single object that will handle the fetchs.
// this object will contain the api keys as a private variable and the functions to do the requests.
const manageFetchs = function () {
  const wApiKey = '058045ccc64546bb393afcf67c9f864f'; // it's a public API
  const mode = {
    mode: 'cors'
  };
  const fetchedData = {
    data: {},
    feedback: {
      /* 
        List of possible values for code:
        0 -> no error, the fetch went okay
        2 -> the argument 'city' for 'weather' fetch was incorrect
        3 -> an error ocurred while fetching
      */
      code: 0,
      reason: ''
    }
  };

  // data --> Tells us what we gonna fetch
  // ...args --> receive the arguments for the call.
  async function obtain(data) {
    assignFeedback(0); // by default we've worked fine

    switch (data.toLowerCase()) {
      case 'weather':
        {
          const city = String(arguments.length <= 1 ? undefined : arguments[1]);
          if (validateCity(city)) {
            fetchedData.data = await getWeatherData(city.toLowerCase()).catch(e => {
              assignFeedback(1);
            });
          } else {
            // City argument is wrong
            assignFeedback(2);
          }
          break;
        }
      default:
        // the data argument is wrong
        assignFeedback(3);
        break;
    }
    return fetchedData;
  }
  function validateCity(city) {
    // I'm sorry if some rare names with punctuations sign doesn't work.
    // If this was professional I'd search better how to valid names or would use
    // a list of valid matches
    const regex = /([a-zA-Z]+|[a-zA-Z]+\s[a-zA-Z]+)/;
    return regex.test(city);
  }
  async function getWeatherData(city) {
    // We do two API fetch
    // 1) First Geocoding api to obtain latitude and longitude
    // 2) Then OpenWeather to obtain the weather information

    // 1) Geocoding fetch
    const coords = await getCoordsByCity(city).catch(e => {
      assignFeedback(4);
    });
    if (coords[0] !== undefined) {
      // 2) Openweather fetch
      const weatherData = await getWeatherByCoords(coords[0].lat, coords[0].lon, 'metric').catch(e => {
        assignFeedback(5);
      });
      return weatherData;
    } else {
      assignFeedback(6);
    }
  }
  async function getCoordsByCity(city) {
    // The URL for GEOCODING api
    const url = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${wApiKey}`;
    const response = await fetch(url, mode);
    const dataJson = await response.json();
    return dataJson;
  }

  /* This function get's the weather Forecast by using latitude and longitude parametters */
  /* The user can also inform units as metric (Celsius), imperial (Farenheit) or standard (Kelvin) */
  /* If no unit has been provided, we will gonna use metric, if the url doesn't have unit defined/*   it will take by default "standard" and return Kelvin. */
  /* List of all API parameters with units openweathermap.org/weather-data */
  async function getWeatherByCoords(lat, lon, units) {
    if (units === null || units === undefined) {
      units = 'metric';
    }

    // The URL for Weather api
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${units}&appid=${wApiKey}`;
    const response = await fetch(url, mode);
    const dataJson = await response.json();
    return dataJson;
  }
  function assignFeedback(code) {
    console.log('<assignFeeedback> ' + code);
    fetchedData.feedback.code = code;
    // lets assign a reason
    switch (code) {
      case 0:
        {
          // all went okay
          fetchedData.feedback.reason = 'ok';
          break;
        }
      case 1:
        {
          fetchedData.feedback.reason = 'Error during fetching data';
          break;
        }
      case 2:
        {
          fetchedData.feedback.reason = "City argument doesn't comply format";
          break;
        }
      case 3:
        {
          fetchedData.feedback.reason = 'Fetch type not codified.';
          break;
        }
      case 4:
        {
          fetchedData.feedback.reason = 'Error fetching GeoCoding';
          break;
        }
      case 5:
        {
          fetchedData.feedback.reason = 'Error fetching openweather by coords';
          break;
        }
      case 6:
        {
          fetchedData.feedback.reason = 'Location not found';
          break;
        }
    }
  }
  return {
    obtain
  };
}();


/***/ }),

/***/ "./src/js/manageDOM.js":
/*!*****************************!*\
  !*** ./src/js/manageDOM.js ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "manageDOM": () => (/* binding */ manageDOM)
/* harmony export */ });
/* eslint-enable */

// This module pattern will manage the dom modifications of our web
const manageDOM = function () {
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
    weatherCanvas.append(location, title, desc, imag, temp, tempMax, tempMin, termic, pressure, humidity, windSpeed);
  };
  const cleanCanvas = function () {
    while (weatherCanvas.firstChild) {
      weatherCanvas.removeChild(weatherCanvas.firstChild);
    }
  };
  return {
    setWeather
  };
}();


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _js_fetchData_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./js/fetchData.js */ "./src/js/fetchData.js");
/* harmony import */ var _js_manageDOM_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/manageDOM.js */ "./src/js/manageDOM.js");
/* eslint-enable */




// const canvas = document.getElementById('test-canvas');
const iCity = document.getElementById('input-city');
iCity.addEventListener('change', test);
async function test() {
  console.log('<test> ' + iCity.value);
  const weatherData = await obtain('weather', iCity.value);
  if (weatherData != null) {
    _js_manageDOM_js__WEBPACK_IMPORTED_MODULE_1__.manageDOM.setWeather(weatherData);
    console.log('--------- weatherData ---------');
    console.log(weatherData);
    // console.log('--------- clouds -------------');
    // console.table(weatherData.clouds);
    // console.log('--------- coord ---------------');
    // console.table(weatherData.coord);
    console.log('--------- main ----------------');
    console.table(weatherData.main);
    // console.log('--------- sys -----------------');
    // console.table(weatherData.sys);
    // console.log('--------- weather -------------');
    // console.table(weatherData.weather);
    // console.log('--------- wind ----------------');
    // console.table(weatherData.wind);
  }
}

async function obtain(type) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  const fetchedData = await _js_fetchData_js__WEBPACK_IMPORTED_MODULE_0__.manageFetchs.obtain(type, args).catch(e => {
    console.log("couldn't find the city");
  });
  if (fetchedData.feedback.code === 0) {
    return fetchedData.data;
  } else {
    console.log('General error');
    console.log('code: ' + fetchedData.feedback.code);
    console.log('reason: ' + fetchedData.feedback.reason);
    return null;
  }
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUMsTUFBTTtJQUNMNEIsT0FBTyxDQUFDQyxHQUFHLENBQUMsZUFBZSxDQUFDO0lBQzVCRCxPQUFPLENBQUNDLEdBQUcsQ0FBQyxRQUFRLEdBQUc5QixXQUFXLENBQUNFLFFBQVEsQ0FBQ0MsSUFBSSxDQUFDO0lBQ2pEMEIsT0FBTyxDQUFDQyxHQUFHLENBQUMsVUFBVSxHQUFHOUIsV0FBVyxDQUFDRSxRQUFRLENBQUNFLE1BQU0sQ0FBQztJQUNyRCxPQUFPLElBQUk7RUFDYjtBQUNGLEMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2pzL2ZldGNoRGF0YS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2pzL21hbmFnZURPTS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9pbmRleC5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZW5hYmxlICovXG5cbi8vIFdlIHVzZSBhIG1vZHVsZSBQYXR0ZXJuIHRvIGRlZmluZSBhIHNpbmdsZSBvYmplY3QgdGhhdCB3aWxsIGhhbmRsZSB0aGUgZmV0Y2hzLlxuLy8gdGhpcyBvYmplY3Qgd2lsbCBjb250YWluIHRoZSBhcGkga2V5cyBhcyBhIHByaXZhdGUgdmFyaWFibGUgYW5kIHRoZSBmdW5jdGlvbnMgdG8gZG8gdGhlIHJlcXVlc3RzLlxuY29uc3QgbWFuYWdlRmV0Y2hzID0gKGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgd0FwaUtleSA9ICcwNTgwNDVjY2M2NDU0NmJiMzkzYWZjZjY3YzlmODY0Zic7IC8vIGl0J3MgYSBwdWJsaWMgQVBJXG4gIGNvbnN0IG1vZGUgPSB7IG1vZGU6ICdjb3JzJyB9O1xuICBjb25zdCBmZXRjaGVkRGF0YSA9IHtcbiAgICBkYXRhOiB7fSxcbiAgICBmZWVkYmFjazoge1xuICAgICAgLyogXG4gICAgICAgIExpc3Qgb2YgcG9zc2libGUgdmFsdWVzIGZvciBjb2RlOlxuICAgICAgICAwIC0+IG5vIGVycm9yLCB0aGUgZmV0Y2ggd2VudCBva2F5XG4gICAgICAgIDIgLT4gdGhlIGFyZ3VtZW50ICdjaXR5JyBmb3IgJ3dlYXRoZXInIGZldGNoIHdhcyBpbmNvcnJlY3RcbiAgICAgICAgMyAtPiBhbiBlcnJvciBvY3VycmVkIHdoaWxlIGZldGNoaW5nXG4gICAgICAqL1xuICAgICAgY29kZTogMCxcbiAgICAgIHJlYXNvbjogJycsXG4gICAgfSxcbiAgfTtcblxuICAvLyBkYXRhIC0tPiBUZWxscyB1cyB3aGF0IHdlIGdvbm5hIGZldGNoXG4gIC8vIC4uLmFyZ3MgLS0+IHJlY2VpdmUgdGhlIGFyZ3VtZW50cyBmb3IgdGhlIGNhbGwuXG4gIGFzeW5jIGZ1bmN0aW9uIG9idGFpbihkYXRhLCAuLi5hcmdzKSB7XG4gICAgYXNzaWduRmVlZGJhY2soMCk7IC8vIGJ5IGRlZmF1bHQgd2UndmUgd29ya2VkIGZpbmVcblxuICAgIHN3aXRjaCAoZGF0YS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICd3ZWF0aGVyJzoge1xuICAgICAgICBjb25zdCBjaXR5ID0gU3RyaW5nKGFyZ3NbMF0pO1xuICAgICAgICBpZiAodmFsaWRhdGVDaXR5KGNpdHkpKSB7XG4gICAgICAgICAgZmV0Y2hlZERhdGEuZGF0YSA9IGF3YWl0IGdldFdlYXRoZXJEYXRhKGNpdHkudG9Mb3dlckNhc2UoKSkuY2F0Y2goXG4gICAgICAgICAgICAoZSkgPT4ge1xuICAgICAgICAgICAgICBhc3NpZ25GZWVkYmFjaygxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENpdHkgYXJndW1lbnQgaXMgd3JvbmdcbiAgICAgICAgICBhc3NpZ25GZWVkYmFjaygyKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIHRoZSBkYXRhIGFyZ3VtZW50IGlzIHdyb25nXG4gICAgICAgIGFzc2lnbkZlZWRiYWNrKDMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZmV0Y2hlZERhdGE7XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUNpdHkoY2l0eSkge1xuICAgIC8vIEknbSBzb3JyeSBpZiBzb21lIHJhcmUgbmFtZXMgd2l0aCBwdW5jdHVhdGlvbnMgc2lnbiBkb2Vzbid0IHdvcmsuXG4gICAgLy8gSWYgdGhpcyB3YXMgcHJvZmVzc2lvbmFsIEknZCBzZWFyY2ggYmV0dGVyIGhvdyB0byB2YWxpZCBuYW1lcyBvciB3b3VsZCB1c2VcbiAgICAvLyBhIGxpc3Qgb2YgdmFsaWQgbWF0Y2hlc1xuICAgIGNvbnN0IHJlZ2V4ID0gLyhbYS16QS1aXSt8W2EtekEtWl0rXFxzW2EtekEtWl0rKS87XG4gICAgcmV0dXJuIHJlZ2V4LnRlc3QoY2l0eSk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBnZXRXZWF0aGVyRGF0YShjaXR5KSB7XG4gICAgLy8gV2UgZG8gdHdvIEFQSSBmZXRjaFxuICAgIC8vIDEpIEZpcnN0IEdlb2NvZGluZyBhcGkgdG8gb2J0YWluIGxhdGl0dWRlIGFuZCBsb25naXR1ZGVcbiAgICAvLyAyKSBUaGVuIE9wZW5XZWF0aGVyIHRvIG9idGFpbiB0aGUgd2VhdGhlciBpbmZvcm1hdGlvblxuXG4gICAgLy8gMSkgR2VvY29kaW5nIGZldGNoXG4gICAgY29uc3QgY29vcmRzID0gYXdhaXQgZ2V0Q29vcmRzQnlDaXR5KGNpdHkpLmNhdGNoKChlKSA9PiB7XG4gICAgICBhc3NpZ25GZWVkYmFjayg0KTtcbiAgICB9KTtcblxuICAgIGlmIChjb29yZHNbMF0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgLy8gMikgT3BlbndlYXRoZXIgZmV0Y2hcbiAgICAgIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgZ2V0V2VhdGhlckJ5Q29vcmRzKFxuICAgICAgICBjb29yZHNbMF0ubGF0LFxuICAgICAgICBjb29yZHNbMF0ubG9uLFxuICAgICAgICAnbWV0cmljJ1xuICAgICAgKS5jYXRjaCgoZSkgPT4ge1xuICAgICAgICBhc3NpZ25GZWVkYmFjayg1KTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHdlYXRoZXJEYXRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBhc3NpZ25GZWVkYmFjayg2KTtcbiAgICB9XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBnZXRDb29yZHNCeUNpdHkoY2l0eSkge1xuICAgIC8vIFRoZSBVUkwgZm9yIEdFT0NPRElORyBhcGlcbiAgICBjb25zdCB1cmwgPSBgaHR0cDovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZ2VvLzEuMC9kaXJlY3Q/cT0ke2NpdHl9JmFwcGlkPSR7d0FwaUtleX1gO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIG1vZGUpO1xuICAgIGNvbnN0IGRhdGFKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiBkYXRhSnNvbjtcbiAgfVxuXG4gIC8qIFRoaXMgZnVuY3Rpb24gZ2V0J3MgdGhlIHdlYXRoZXIgRm9yZWNhc3QgYnkgdXNpbmcgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSBwYXJhbWV0dGVycyAqL1xuICAvKiBUaGUgdXNlciBjYW4gYWxzbyBpbmZvcm0gdW5pdHMgYXMgbWV0cmljIChDZWxzaXVzKSwgaW1wZXJpYWwgKEZhcmVuaGVpdCkgb3Igc3RhbmRhcmQgKEtlbHZpbikgKi9cbiAgLyogSWYgbm8gdW5pdCBoYXMgYmVlbiBwcm92aWRlZCwgd2Ugd2lsbCBnb25uYSB1c2UgbWV0cmljLCBpZiB0aGUgdXJsIGRvZXNuJ3QgaGF2ZSB1bml0IGRlZmluZWQvKiAgIGl0IHdpbGwgdGFrZSBieSBkZWZhdWx0IFwic3RhbmRhcmRcIiBhbmQgcmV0dXJuIEtlbHZpbi4gKi9cbiAgLyogTGlzdCBvZiBhbGwgQVBJIHBhcmFtZXRlcnMgd2l0aCB1bml0cyBvcGVud2VhdGhlcm1hcC5vcmcvd2VhdGhlci1kYXRhICovXG4gIGFzeW5jIGZ1bmN0aW9uIGdldFdlYXRoZXJCeUNvb3JkcyhsYXQsIGxvbiwgdW5pdHMpIHtcbiAgICBpZiAodW5pdHMgPT09IG51bGwgfHwgdW5pdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdW5pdHMgPSAnbWV0cmljJztcbiAgICB9XG5cbiAgICAvLyBUaGUgVVJMIGZvciBXZWF0aGVyIGFwaVxuICAgIGNvbnN0IHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mdW5pdHM9JHt1bml0c30mYXBwaWQ9JHt3QXBpS2V5fWA7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgbW9kZSk7XG4gICAgY29uc3QgZGF0YUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIGRhdGFKc29uO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNzaWduRmVlZGJhY2soY29kZSkge1xuICAgIGNvbnNvbGUubG9nKCc8YXNzaWduRmVlZWRiYWNrPiAnICsgY29kZSk7XG4gICAgZmV0Y2hlZERhdGEuZmVlZGJhY2suY29kZSA9IGNvZGU7XG4gICAgLy8gbGV0cyBhc3NpZ24gYSByZWFzb25cbiAgICBzd2l0Y2ggKGNvZGUpIHtcbiAgICAgIGNhc2UgMDoge1xuICAgICAgICAvLyBhbGwgd2VudCBva2F5XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdvayc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAxOiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdFcnJvciBkdXJpbmcgZmV0Y2hpbmcgZGF0YSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAyOiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9IFwiQ2l0eSBhcmd1bWVudCBkb2Vzbid0IGNvbXBseSBmb3JtYXRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDM6IHtcbiAgICAgICAgZmV0Y2hlZERhdGEuZmVlZGJhY2sucmVhc29uID0gJ0ZldGNoIHR5cGUgbm90IGNvZGlmaWVkLic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSA0OiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdFcnJvciBmZXRjaGluZyBHZW9Db2RpbmcnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgNToge1xuICAgICAgICBmZXRjaGVkRGF0YS5mZWVkYmFjay5yZWFzb24gPSAnRXJyb3IgZmV0Y2hpbmcgb3BlbndlYXRoZXIgYnkgY29vcmRzJztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDY6IHtcbiAgICAgICAgZmV0Y2hlZERhdGEuZmVlZGJhY2sucmVhc29uID0gJ0xvY2F0aW9uIG5vdCBmb3VuZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IG9idGFpbiB9O1xufSkoKTtcblxuZXhwb3J0IHsgbWFuYWdlRmV0Y2hzIH07XG4iLCIvKiBlc2xpbnQtZW5hYmxlICovXG5cbi8vIFRoaXMgbW9kdWxlIHBhdHRlcm4gd2lsbCBtYW5hZ2UgdGhlIGRvbSBtb2RpZmljYXRpb25zIG9mIG91ciB3ZWJcbmNvbnN0IG1hbmFnZURPTSA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIEFsbCB0aGUgd2ViIGVsZW1lbnRzIHdlIHdhbnQgdG8gd29yayB3aXRoXG4gIGNvbnN0IHdlYXRoZXJDYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnd2VhdGhlci1jYW52YXMnKTtcblxuICBjb25zdCBzZXRXZWF0aGVyID0gZnVuY3Rpb24gKGRhdGEpIHtcbiAgICBjbGVhbkNhbnZhcygpOyAvLyBXZSBkZWxldGUgYWxsIGNoaWxkcyBvZiB3ZWF0aGVyQ2FudmFzIGlmIGl0IGhhcyBmcm9tIGEgcHJldmlvdXMgc2V0XG4gICAgY29uc3Qgc2lnbiA9ICcgwrBDJztcblxuICAgIGNvbnN0IGxvY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGxvY2F0aW9uLmlkID0gJ3dsb2NhdGlvbic7XG4gICAgbG9jYXRpb24udGV4dENvbnRlbnQgPSBkYXRhLm5hbWU7XG5cbiAgICBjb25zdCB0aXRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB0aXRsZS5pZCA9ICd3dGl0bGUnO1xuICAgIHRpdGxlLnRleHRDb250ZW50ID0gZGF0YS53ZWF0aGVyWzBdLm1haW47XG5cbiAgICBjb25zdCBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGRlc2MuaWQgPSAnd2Rlc2MnO1xuICAgIGRlc2MudGV4dENvbnRlbnQgPSBkYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XG5cbiAgICBjb25zdCBpbWFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1hZy5pZCA9ICd3aW1hZyc7XG4gICAgaW1hZy5zcmMgPSBgaHR0cHM6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLyR7ZGF0YS53ZWF0aGVyWzBdLmljb259QDJ4LnBuZ2A7XG4gICAgLy8gICAgYGh0dHA6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLzEwZEAyeC5wbmdgXG4gICAgLy8gICAgaHR0cHM6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLzAxZEAyeC5wbmdcbiAgICAvLyAgICBodHRwIDovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvdy8wMW5AMngucG5nXG4gICAgLy8gICAgaHR0cHM6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLzAxbkAyeC5wbmdcbiAgICBjb25zdCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHRlbXAuaWQgPSAnd3RlbXAnO1xuICAgIHRlbXAudGV4dENvbnRlbnQgPSAnVGVtcGVyYXR1cmU6ICcgKyBkYXRhLm1haW4udGVtcCArIHNpZ247XG5cbiAgICBjb25zdCB0ZW1wTWF4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHRlbXBNYXguaWQgPSAnd3RlbXAtbWF4JztcbiAgICB0ZW1wTWF4LnRleHRDb250ZW50ID0gJ01heCBUZW1wZXJhdHVyZTogJyArIGRhdGEubWFpbi50ZW1wX21heCArIHNpZ247XG5cbiAgICBjb25zdCB0ZW1wTWluID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHRlbXBNaW4uaWQgPSAnd3RlbXAtbWluJztcbiAgICB0ZW1wTWluLnRleHRDb250ZW50ID0gJ01pbiBUZW1wZXJhdHVyZTogJyArIGRhdGEubWFpbi50ZW1wX21pbiArIHNpZ247XG5cbiAgICBjb25zdCB0ZXJtaWMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7IC8vIFRlcm1pYyBTZW5zYXRpb25cbiAgICB0ZXJtaWMuaWQgPSAnd3Rlcm1pYyc7XG4gICAgdGVybWljLnRleHRDb250ZW50ID0gJ1Rlcm1pYyBzZW5zYXRpb246ICcgKyBkYXRhLm1haW4uZmVlbHNfbGlrZSArIHNpZ247XG5cbiAgICBjb25zdCBwcmVzc3VyZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBwcmVzc3VyZS5pZCA9ICd3cHJlc3N1cmUnO1xuICAgIHByZXNzdXJlLnRleHRDb250ZW50ID0gJ1ByZXNzdXJlOiAnICsgZGF0YS5tYWluLnByZXNzdXJlICsgJyBoUGEnO1xuXG4gICAgY29uc3QgaHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgaHVtaWRpdHkuaWQgPSAnd2h1bWlkaXR5JztcbiAgICBodW1pZGl0eS50ZXh0Q29udGVudCA9ICdIdW1pZGl0eTogJyArIGRhdGEubWFpbi5odW1pZGl0eSArICcgJSc7XG5cbiAgICBjb25zdCB3aW5kU3BlZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdwJyk7XG4gICAgd2luZFNwZWVkLmlkID0gJ3d3aW5kLXNwZWVkJztcbiAgICB3aW5kU3BlZWQudGV4dENvbnRlbnQgPSAnV2luZCBTcGVlZDogJyArIGRhdGEud2luZC5zcGVlZCArICcga20vaCc7XG5cbiAgICB3ZWF0aGVyQ2FudmFzLmFwcGVuZChcbiAgICAgIGxvY2F0aW9uLFxuICAgICAgdGl0bGUsXG4gICAgICBkZXNjLFxuICAgICAgaW1hZyxcbiAgICAgIHRlbXAsXG4gICAgICB0ZW1wTWF4LFxuICAgICAgdGVtcE1pbixcbiAgICAgIHRlcm1pYyxcbiAgICAgIHByZXNzdXJlLFxuICAgICAgaHVtaWRpdHksXG4gICAgICB3aW5kU3BlZWRcbiAgICApO1xuICB9O1xuXG4gIGNvbnN0IGNsZWFuQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgIHdoaWxlICh3ZWF0aGVyQ2FudmFzLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHdlYXRoZXJDYW52YXMucmVtb3ZlQ2hpbGQod2VhdGhlckNhbnZhcy5maXJzdENoaWxkKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHsgc2V0V2VhdGhlciB9O1xufSkoKTtcblxuZXhwb3J0IHsgbWFuYWdlRE9NIH07XG4iLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuIiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsIi8qIGVzbGludC1lbmFibGUgKi9cblxuaW1wb3J0IHsgbWFuYWdlRmV0Y2hzIH0gZnJvbSAnLi9qcy9mZXRjaERhdGEuanMnO1xuaW1wb3J0IHsgbWFuYWdlRE9NIH0gZnJvbSAnLi9qcy9tYW5hZ2VET00uanMnO1xuXG4vLyBjb25zdCBjYW52YXMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgndGVzdC1jYW52YXMnKTtcbmNvbnN0IGlDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LWNpdHknKTtcbmlDaXR5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHRlc3QpO1xuXG5hc3luYyBmdW5jdGlvbiB0ZXN0KCkge1xuICBjb25zb2xlLmxvZygnPHRlc3Q+ICcgKyBpQ2l0eS52YWx1ZSk7XG4gIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgb2J0YWluKCd3ZWF0aGVyJywgaUNpdHkudmFsdWUpO1xuXG4gIGlmICh3ZWF0aGVyRGF0YSAhPSBudWxsKSB7XG4gICAgbWFuYWdlRE9NLnNldFdlYXRoZXIod2VhdGhlckRhdGEpO1xuICAgIGNvbnNvbGUubG9nKCctLS0tLS0tLS0gd2VhdGhlckRhdGEgLS0tLS0tLS0tJyk7XG4gICAgY29uc29sZS5sb2cod2VhdGhlckRhdGEpO1xuICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0gY2xvdWRzIC0tLS0tLS0tLS0tLS0nKTtcbiAgICAvLyBjb25zb2xlLnRhYmxlKHdlYXRoZXJEYXRhLmNsb3Vkcyk7XG4gICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLSBjb29yZCAtLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAvLyBjb25zb2xlLnRhYmxlKHdlYXRoZXJEYXRhLmNvb3JkKTtcbiAgICBjb25zb2xlLmxvZygnLS0tLS0tLS0tIG1haW4gLS0tLS0tLS0tLS0tLS0tLScpO1xuICAgIGNvbnNvbGUudGFibGUod2VhdGhlckRhdGEubWFpbik7XG4gICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLSBzeXMgLS0tLS0tLS0tLS0tLS0tLS0nKTtcbiAgICAvLyBjb25zb2xlLnRhYmxlKHdlYXRoZXJEYXRhLnN5cyk7XG4gICAgLy8gY29uc29sZS5sb2coJy0tLS0tLS0tLSB3ZWF0aGVyIC0tLS0tLS0tLS0tLS0nKTtcbiAgICAvLyBjb25zb2xlLnRhYmxlKHdlYXRoZXJEYXRhLndlYXRoZXIpO1xuICAgIC8vIGNvbnNvbGUubG9nKCctLS0tLS0tLS0gd2luZCAtLS0tLS0tLS0tLS0tLS0tJyk7XG4gICAgLy8gY29uc29sZS50YWJsZSh3ZWF0aGVyRGF0YS53aW5kKTtcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBvYnRhaW4odHlwZSwgLi4uYXJncykge1xuICBjb25zdCBmZXRjaGVkRGF0YSA9IGF3YWl0IG1hbmFnZUZldGNocy5vYnRhaW4odHlwZSwgYXJncykuY2F0Y2goKGUpID0+IHtcbiAgICBjb25zb2xlLmxvZyhcImNvdWxkbid0IGZpbmQgdGhlIGNpdHlcIik7XG4gIH0pO1xuXG4gIGlmIChmZXRjaGVkRGF0YS5mZWVkYmFjay5jb2RlID09PSAwKSB7XG4gICAgcmV0dXJuIGZldGNoZWREYXRhLmRhdGE7XG4gIH0gZWxzZSB7XG4gICAgY29uc29sZS5sb2coJ0dlbmVyYWwgZXJyb3InKTtcbiAgICBjb25zb2xlLmxvZygnY29kZTogJyArIGZldGNoZWREYXRhLmZlZWRiYWNrLmNvZGUpO1xuICAgIGNvbnNvbGUubG9nKCdyZWFzb246ICcgKyBmZXRjaGVkRGF0YS5mZWVkYmFjay5yZWFzb24pO1xuICAgIHJldHVybiBudWxsO1xuICB9XG59XG4iXSwibmFtZXMiOlsibWFuYWdlRmV0Y2hzIiwid0FwaUtleSIsIm1vZGUiLCJmZXRjaGVkRGF0YSIsImRhdGEiLCJmZWVkYmFjayIsImNvZGUiLCJyZWFzb24iLCJvYnRhaW4iLCJhc3NpZ25GZWVkYmFjayIsInRvTG93ZXJDYXNlIiwiY2l0eSIsIlN0cmluZyIsInZhbGlkYXRlQ2l0eSIsImdldFdlYXRoZXJEYXRhIiwiY2F0Y2giLCJlIiwicmVnZXgiLCJ0ZXN0IiwiY29vcmRzIiwiZ2V0Q29vcmRzQnlDaXR5IiwidW5kZWZpbmVkIiwid2VhdGhlckRhdGEiLCJnZXRXZWF0aGVyQnlDb29yZHMiLCJsYXQiLCJsb24iLCJ1cmwiLCJyZXNwb25zZSIsImZldGNoIiwiZGF0YUpzb24iLCJqc29uIiwidW5pdHMiLCJjb25zb2xlIiwibG9nIiwibWFuYWdlRE9NIiwid2VhdGhlckNhbnZhcyIsImRvY3VtZW50IiwiZ2V0RWxlbWVudEJ5SWQiLCJzZXRXZWF0aGVyIiwiY2xlYW5DYW52YXMiLCJzaWduIiwibG9jYXRpb24iLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJ0aXRsZSIsIndlYXRoZXIiLCJtYWluIiwiZGVzYyIsImRlc2NyaXB0aW9uIiwiaW1hZyIsInNyYyIsImljb24iLCJ0ZW1wIiwidGVtcE1heCIsInRlbXBfbWF4IiwidGVtcE1pbiIsInRlbXBfbWluIiwidGVybWljIiwiZmVlbHNfbGlrZSIsInByZXNzdXJlIiwiaHVtaWRpdHkiLCJ3aW5kU3BlZWQiLCJ3aW5kIiwic3BlZWQiLCJhcHBlbmQiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJpQ2l0eSIsImFkZEV2ZW50TGlzdGVuZXIiLCJ2YWx1ZSIsInRhYmxlIiwidHlwZSIsImFyZ3MiXSwic291cmNlUm9vdCI6IiJ9