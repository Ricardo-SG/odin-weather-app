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
  async function obtain(data, args) {
    assignFeedback(0); // by default we've worked fine

    switch (data.toLowerCase()) {
      case 'weather':
        {
          const city = String(args[0]);
          const units = String(args[1]); // It can only be 'metrics', imperial, or standard
          if (validateCity(city)) {
            fetchedData.data = await getWeatherData(city.toLowerCase(), units).catch(e => {
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
  async function getWeatherData(city, units) {
    // We do two API fetch
    // 1) First Geocoding api to obtain latitude and longitude
    // 2) Then OpenWeather to obtain the weather information

    // 1) Geocoding fetch
    const coords = await getCoordsByCity(city).catch(e => {
      assignFeedback(4);
    });
    if (coords[0] !== undefined) {
      // 2) Openweather fetch
      const weatherData = await getWeatherByCoords(coords[0].lat, coords[0].lon, units).catch(e => {
        assignFeedback(5);
      });
      return weatherData;
    } else {
      assignFeedback(6);
    }
  }
  async function getCoordsByCity(city) {
    // The URL for GEOCODING api
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${wApiKey}`;
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
/* harmony import */ var _img_high_temp_png__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../img/high-temp.png */ "./src/img/high-temp.png");
/* harmony import */ var _img_low_temp_png__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../img/low-temp.png */ "./src/img/low-temp.png");
/* harmony import */ var _img_humidity_png__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../img/humidity.png */ "./src/img/humidity.png");
/* harmony import */ var _img_windSpeed_png__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../img/windSpeed.png */ "./src/img/windSpeed.png");
/* eslint-enable */





// This module pattern will manage the dom modifications of our web
const manageDOM = function () {
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
    const imgMaxTemp = createHtml('img', 'img-max-temp', null, null, _img_high_temp_png__WEBPACK_IMPORTED_MODULE_0__);
    aux = data.main.temp_max + sign;
    const txtMaxTemp = createHtml('div', 'txt-max-temp', aux);
    const imgMinTemp = createHtml('img', 'img-min-temp', null, null, _img_low_temp_png__WEBPACK_IMPORTED_MODULE_1__);
    aux = data.main.temp_min + sign;
    const txtMinTemp = createHtml('div', 'txt-min-temp', aux);
    const imgHumidity = createHtml('img', 'img-humidity', null, null, _img_humidity_png__WEBPACK_IMPORTED_MODULE_2__);
    aux = data.main.humidity + ' %';
    const txtHumidity = createHtml('div', 'txt-humidity', aux);
    aux = _img_windSpeed_png__WEBPACK_IMPORTED_MODULE_3__;
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
  return {
    setWeather
  };
}();


/***/ }),

/***/ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/css/styles.scss":
/*!**********************************************************************************************************!*\
  !*** ./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/css/styles.scss ***!
  \**********************************************************************************************************/
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/sourceMaps.js */ "./node_modules/css-loader/dist/runtime/sourceMaps.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/api.js */ "./node_modules/css-loader/dist/runtime/api.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../node_modules/css-loader/dist/runtime/getUrl.js */ "./node_modules/css-loader/dist/runtime/getUrl.js");
/* harmony import */ var _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2__);
// Imports



var ___CSS_LOADER_URL_IMPORT_0___ = new URL(/* asset import */ __webpack_require__(/*! ../img/clearcloudy.jpg */ "./src/img/clearcloudy.jpg"), __webpack_require__.b);
var ___CSS_LOADER_EXPORT___ = _node_modules_css_loader_dist_runtime_api_js__WEBPACK_IMPORTED_MODULE_1___default()((_node_modules_css_loader_dist_runtime_sourceMaps_js__WEBPACK_IMPORTED_MODULE_0___default()));
___CSS_LOADER_EXPORT___.push([module.id, "@import url(https://fonts.googleapis.com/css2?family=Comic+Neue&family=K2D:ital,wght@1,300&family=Kreon:wght@500&family=Montserrat:wght@300&family=Reenie+Beanie&display=swap);"]);
var ___CSS_LOADER_URL_REPLACEMENT_0___ = _node_modules_css_loader_dist_runtime_getUrl_js__WEBPACK_IMPORTED_MODULE_2___default()(___CSS_LOADER_URL_IMPORT_0___);
// Module
___CSS_LOADER_EXPORT___.push([module.id, "/* font families */\n/*\nfont-family: 'Comic Neue', cursive;\nfont-family: 'K2D', sans-serif;\nfont-family: 'Kreon', serif;\nfont-family: 'Montserrat', sans-serif;\nfont-family: 'Reenie Beanie', cursive;*/\nbody {\n  position: relative;\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") no-repeat center fixed;\n  text-align: center;\n  margin: auto;\n  max-width: 800px;\n  height: 100vh;\n}\n\n.invisible {\n  display: none;\n}\n\n.visible-block {\n  display: block;\n}\n\n#search-div {\n  text-align: center;\n  margin-bottom: 20px;\n}\n#search-div #input-city {\n  font-family: \"Kreon\", serif;\n  text-align: center;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 12px 20px;\n  margin: 8px 0;\n  background-color: lightblue;\n  font-size: 22px;\n}\n#search-div #input-city:focus {\n  border: 3px solid #555;\n}\n#search-div #input-feedback {\n  box-sizing: border-box;\n  padding: 12px 20px;\n  margin: 8px 0;\n  font-size: 20px;\n  border: 3px solid rgb(192, 118, 118);\n  background-color: whitesmoke;\n  color: red;\n}\n#search-div #units-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 10px;\n  align-items: center;\n  justify-items: center;\n}\n#search-div #units-container #metric,\n#search-div #units-container #imperial,\n#search-div #units-container #standard {\n  aspect-ratio: 1;\n  display: grid;\n  align-items: center;\n  justify-items: baseline;\n  border: 3px solid #555;\n  height: 100px;\n  font-size: 80px;\n  background: whitesmoke;\n  cursor: pointer;\n}\n#search-div #units-container .selected {\n  background: rgb(0, 0, 99) !important;\n  color: white !important;\n  border: 3px solid rgb(191, 201, 255) !important;\n  outline: 1px solid rgb(242, 242, 255) !important;\n}\n\n#weather-canvas {\n  margin: 10px auto;\n  padding: 5px;\n  max-width: 500px;\n  background: rgba(0, 0, 0, 0.404);\n  color: whitesmoke;\n}\n#weather-canvas #wlocation {\n  font-size: 70px;\n  margin: 0;\n  padding: 0;\n  font-family: \"Kreon\", serif;\n}\n#weather-canvas #wdesc {\n  font-size: 60px;\n  margin: 0;\n  padding: 0;\n  font-family: \"Montserrat\", sans-serif;\n}\n#weather-canvas #wimag {\n  margin: 0;\n  padding: 0;\n}\n#weather-canvas #wtemp {\n  font-size: 40px;\n  margin: 0;\n  padding: 0;\n  font-family: \"Montserrat\", sans-serif;\n}\n#weather-canvas #wthermal {\n  font-size: 40px;\n  margin: 0;\n  padding: 0;\n  color: rgb(98, 248, 98);\n  font-family: \"Montserrat\", sans-serif;\n}\n#weather-canvas #foot-weather-data {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  font-family: \"Kreon\", serif;\n}\n#weather-canvas #foot-weather-data #left-container {\n  justify-self: start;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  justify-items: left;\n  align-items: center;\n}\n#weather-canvas #foot-weather-data #right-container {\n  justify-self: end;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  justify-items: right;\n  align-items: center;\n}\n#weather-canvas #foot-weather-data img {\n  height: 50px;\n}\n\n#credits {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 128, 0.267);\n  font-size: 22px;\n  color: navy;\n  font-family: \"K2D\", sans-serif;\n}\n#credits a {\n  text-align: left;\n  font-size: 18px;\n  display: block;\n  color: navy;\n}\n\n@media (max-width: 600px) {\n  #search-div #input-city {\n    width: 300px;\n    font-size: 15px;\n  }\n  #search-div #units-container #metric,\n  #search-div #units-container #imperial,\n  #search-div #units-container #standard {\n    height: 60px;\n    font-size: 50px;\n  }\n  #weather-canvas #wlocation {\n    font-size: 2rem;\n  }\n  #weather-canvas #wdesc {\n    font-size: 1.5rem;\n  }\n  #weather-canvas #wtemp {\n    font-size: 1.5rem;\n  }\n  #weather-canvas #wthermal {\n    font-size: 1rem;\n  }\n  #credits a {\n    font-size: 13px;\n  }\n}", "",{"version":3,"sources":["webpack://./src/css/styles.scss"],"names":[],"mappings":"AAAA,kBAAA;AAEA;;;;;uCAAA;AAMA;EACE,kBAAA;EACA,0EAAA;EACA,kBAAA;EACA,YAAA;EACA,gBAAA;EACA,aAAA;AACF;;AACA;EACE,aAAA;AAEF;;AACA;EACE,cAAA;AAEF;;AACA;EACE,kBAAA;EACA,mBAAA;AAEF;AAAE;EAME,2BAAA;EAEA,kBAAA;EACA,WAAA;EACA,sBAAA;EACA,kBAAA;EACA,aAAA;EAEA,2BAAA;EACA,eAAA;AALJ;AAMI;EACE,sBAAA;AAJN;AAQE;EACE,sBAAA;EACA,kBAAA;EACA,aAAA;EACA,eAAA;EACA,oCAAA;EACA,4BAAA;EACA,UAAA;AANJ;AASE;EACE,aAAA;EACA,kCAAA;EACA,SAAA;EACA,mBAAA;EACA,qBAAA;AAPJ;AASI;;;EAGE,eAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,sBAAA;EACA,aAAA;EACA,eAAA;EACA,sBAAA;EAEA,eAAA;AARN;AAUI;EACE,oCAAA;EACA,uBAAA;EACA,+CAAA;EACA,gDAAA;AARN;;AAaA;EACE,iBAAA;EACA,YAAA;EACA,gBAAA;EACA,gCAAA;EACA,iBAAA;AAVF;AAYE;EACE,eAAA;EACA,SAAA;EACA,UAAA;EACA,2BAAA;AAVJ;AAaE;EACE,eAAA;EACA,SAAA;EACA,UAAA;EACA,qCAAA;AAXJ;AAaE;EACE,SAAA;EACA,UAAA;AAXJ;AAaE;EACE,eAAA;EACA,SAAA;EACA,UAAA;EACA,qCAAA;AAXJ;AAcE;EACE,eAAA;EACA,SAAA;EACA,UAAA;EACA,uBAAA;EACA,qCAAA;AAZJ;AAeE;EACE,aAAA;EACA,8BAAA;EACA,2BAAA;AAbJ;AAeI;EACE,mBAAA;EACA,aAAA;EACA,8BAAA;EACA,2BAAA;EACA,mBAAA;EACA,mBAAA;AAbN;AAeI;EACE,iBAAA;EACA,aAAA;EACA,8BAAA;EACA,2BAAA;EACA,oBAAA;EACA,mBAAA;AAbN;AAeI;EACE,YAAA;AAbN;;AAkBA;EACE,kBAAA;EACA,SAAA;EACA,WAAA;EACA,wCAAA;EACA,eAAA;EACA,WAAA;EAEA,8BAAA;AAhBF;AAkBE;EACE,gBAAA;EACA,eAAA;EACA,cAAA;EACA,WAAA;AAhBJ;;AAoBA;EAEI;IACE,YAAA;IACA,eAAA;EAlBJ;EAqBI;;;IAGE,YAAA;IACA,eAAA;EAnBN;EAyBE;IACE,eAAA;EAvBJ;EA0BE;IACE,iBAAA;EAxBJ;EA2BE;IACE,iBAAA;EAzBJ;EA4BE;IACE,eAAA;EA1BJ;EA+BE;IACE,eAAA;EA7BJ;AACF","sourcesContent":["/* font families */\n@import url('https://fonts.googleapis.com/css2?family=Comic+Neue&family=K2D:ital,wght@1,300&family=Kreon:wght@500&family=Montserrat:wght@300&family=Reenie+Beanie&display=swap');\n/*\nfont-family: 'Comic Neue', cursive;\nfont-family: 'K2D', sans-serif;\nfont-family: 'Kreon', serif;\nfont-family: 'Montserrat', sans-serif;\nfont-family: 'Reenie Beanie', cursive;*/\nbody {\n  position: relative;\n  background: url('../img/clearcloudy.jpg') no-repeat center fixed;\n  text-align: center;\n  margin: auto;\n  max-width: 800px;\n  height: 100vh;\n}\n.invisible {\n  display: none;\n}\n\n.visible-block {\n  display: block;\n}\n\n#search-div {\n  text-align: center;\n  margin-bottom: 20px;\n\n  #input-city {\n    // background-image: url('../img/magnifyingglass.png');\n    // background-position: 10px 10px;\n    // background-size: 31px;\n    // background-repeat: no-repeat;\n\n    font-family: 'Kreon', serif;\n\n    text-align: center;\n    width: 100%;\n    box-sizing: border-box;\n    padding: 12px 20px;\n    margin: 8px 0;\n\n    background-color: lightblue;\n    font-size: 22px;\n    &:focus {\n      border: 3px solid #555;\n    }\n  }\n\n  #input-feedback {\n    box-sizing: border-box;\n    padding: 12px 20px;\n    margin: 8px 0;\n    font-size: 20px;\n    border: 3px solid rgb(192, 118, 118);\n    background-color: whitesmoke;\n    color: red;\n  }\n\n  #units-container {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 10px;\n    align-items: center;\n    justify-items: center;\n\n    #metric,\n    #imperial,\n    #standard {\n      aspect-ratio: 1;\n      display: grid;\n      align-items: center;\n      justify-items: baseline;\n      border: 3px solid #555;\n      height: 100px;\n      font-size: 80px;\n      background: whitesmoke;\n\n      cursor: pointer;\n    }\n    .selected {\n      background: rgb(0, 0, 99) !important;\n      color: white !important;\n      border: 3px solid rgb(191, 201, 255) !important;\n      outline: 1px solid rgb(242, 242, 255) !important;\n    }\n  }\n}\n\n#weather-canvas {\n  margin: 10px auto;\n  padding: 5px;\n  max-width: 500px;\n  background: rgba(0, 0, 0, 0.404);\n  color: whitesmoke;\n\n  #wlocation {\n    font-size: 70px;\n    margin: 0;\n    padding: 0;\n    font-family: 'Kreon', serif;\n  }\n\n  #wdesc {\n    font-size: 60px;\n    margin: 0;\n    padding: 0;\n    font-family: 'Montserrat', sans-serif;\n  }\n  #wimag {\n    margin: 0;\n    padding: 0;\n  }\n  #wtemp {\n    font-size: 40px;\n    margin: 0;\n    padding: 0;\n    font-family: 'Montserrat', sans-serif;\n  }\n\n  #wthermal {\n    font-size: 40px;\n    margin: 0;\n    padding: 0;\n    color: rgb(98, 248, 98);\n    font-family: 'Montserrat', sans-serif;\n  }\n\n  #foot-weather-data {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    font-family: 'Kreon', serif;\n\n    #left-container {\n      justify-self: start;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: 1fr 1fr;\n      justify-items: left;\n      align-items: center;\n    }\n    #right-container {\n      justify-self: end;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: 1fr 1fr;\n      justify-items: right;\n      align-items: center;\n    }\n    img {\n      height: 50px;\n    }\n  }\n}\n\n#credits {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 128, 0.267);\n  font-size: 22px;\n  color: navy;\n\n  font-family: 'K2D', sans-serif;\n\n  a {\n    text-align: left;\n    font-size: 18px;\n    display: block;\n    color: navy;\n  }\n}\n\n@media (max-width: 600px) {\n  #search-div {\n    #input-city {\n      width: 300px;\n      font-size: 15px;\n    }\n    #units-container {\n      #metric,\n      #imperial,\n      #standard {\n        height: 60px;\n        font-size: 50px;\n      }\n    }\n  }\n\n  #weather-canvas {\n    #wlocation {\n      font-size: 2rem;\n    }\n\n    #wdesc {\n      font-size: 1.5rem;\n    }\n\n    #wtemp {\n      font-size: 1.5rem;\n    }\n\n    #wthermal {\n      font-size: 1rem;\n    }\n  }\n\n  #credits {\n    a {\n      font-size: 13px;\n    }\n  }\n}\n"],"sourceRoot":""}]);
// Exports
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (___CSS_LOADER_EXPORT___);


/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/api.js":
/*!*****************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/api.js ***!
  \*****************************************************/
/***/ ((module) => {



/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
module.exports = function (cssWithMappingToString) {
  var list = [];

  // return the list of modules as css string
  list.toString = function toString() {
    return this.map(function (item) {
      var content = "";
      var needLayer = typeof item[5] !== "undefined";
      if (item[4]) {
        content += "@supports (".concat(item[4], ") {");
      }
      if (item[2]) {
        content += "@media ".concat(item[2], " {");
      }
      if (needLayer) {
        content += "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {");
      }
      content += cssWithMappingToString(item);
      if (needLayer) {
        content += "}";
      }
      if (item[2]) {
        content += "}";
      }
      if (item[4]) {
        content += "}";
      }
      return content;
    }).join("");
  };

  // import a list of modules into the list
  list.i = function i(modules, media, dedupe, supports, layer) {
    if (typeof modules === "string") {
      modules = [[null, modules, undefined]];
    }
    var alreadyImportedModules = {};
    if (dedupe) {
      for (var k = 0; k < this.length; k++) {
        var id = this[k][0];
        if (id != null) {
          alreadyImportedModules[id] = true;
        }
      }
    }
    for (var _k = 0; _k < modules.length; _k++) {
      var item = [].concat(modules[_k]);
      if (dedupe && alreadyImportedModules[item[0]]) {
        continue;
      }
      if (typeof layer !== "undefined") {
        if (typeof item[5] === "undefined") {
          item[5] = layer;
        } else {
          item[1] = "@layer".concat(item[5].length > 0 ? " ".concat(item[5]) : "", " {").concat(item[1], "}");
          item[5] = layer;
        }
      }
      if (media) {
        if (!item[2]) {
          item[2] = media;
        } else {
          item[1] = "@media ".concat(item[2], " {").concat(item[1], "}");
          item[2] = media;
        }
      }
      if (supports) {
        if (!item[4]) {
          item[4] = "".concat(supports);
        } else {
          item[1] = "@supports (".concat(item[4], ") {").concat(item[1], "}");
          item[4] = supports;
        }
      }
      list.push(item);
    }
  };
  return list;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/getUrl.js":
/*!********************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/getUrl.js ***!
  \********************************************************/
/***/ ((module) => {



module.exports = function (url, options) {
  if (!options) {
    options = {};
  }
  if (!url) {
    return url;
  }
  url = String(url.__esModule ? url.default : url);

  // If url is already wrapped in quotes, remove them
  if (/^['"].*['"]$/.test(url)) {
    url = url.slice(1, -1);
  }
  if (options.hash) {
    url += options.hash;
  }

  // Should url be wrapped?
  // See https://drafts.csswg.org/css-values-3/#urls
  if (/["'() \t\n]|(%20)/.test(url) || options.needQuotes) {
    return "\"".concat(url.replace(/"/g, '\\"').replace(/\n/g, "\\n"), "\"");
  }
  return url;
};

/***/ }),

/***/ "./node_modules/css-loader/dist/runtime/sourceMaps.js":
/*!************************************************************!*\
  !*** ./node_modules/css-loader/dist/runtime/sourceMaps.js ***!
  \************************************************************/
/***/ ((module) => {



module.exports = function (item) {
  var content = item[1];
  var cssMapping = item[3];
  if (!cssMapping) {
    return content;
  }
  if (typeof btoa === "function") {
    var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(cssMapping))));
    var data = "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(base64);
    var sourceMapping = "/*# ".concat(data, " */");
    var sourceURLs = cssMapping.sources.map(function (source) {
      return "/*# sourceURL=".concat(cssMapping.sourceRoot || "").concat(source, " */");
    });
    return [content].concat(sourceURLs).concat([sourceMapping]).join("\n");
  }
  return [content].join("\n");
};

/***/ }),

/***/ "./src/css/styles.scss":
/*!*****************************!*\
  !*** ./src/css/styles.scss ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js */ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleDomAPI.js */ "./node_modules/style-loader/dist/runtime/styleDomAPI.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertBySelector.js */ "./node_modules/style-loader/dist/runtime/insertBySelector.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js */ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/insertStyleElement.js */ "./node_modules/style-loader/dist/runtime/insertStyleElement.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! !../../node_modules/style-loader/dist/runtime/styleTagTransform.js */ "./node_modules/style-loader/dist/runtime/styleTagTransform.js");
/* harmony import */ var _node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! !!../../node_modules/css-loader/dist/cjs.js!../../node_modules/sass-loader/dist/cjs.js!./styles.scss */ "./node_modules/css-loader/dist/cjs.js!./node_modules/sass-loader/dist/cjs.js!./src/css/styles.scss");

      
      
      
      
      
      
      
      
      

var options = {};

options.styleTagTransform = (_node_modules_style_loader_dist_runtime_styleTagTransform_js__WEBPACK_IMPORTED_MODULE_5___default());
options.setAttributes = (_node_modules_style_loader_dist_runtime_setAttributesWithoutAttributes_js__WEBPACK_IMPORTED_MODULE_3___default());

      options.insert = _node_modules_style_loader_dist_runtime_insertBySelector_js__WEBPACK_IMPORTED_MODULE_2___default().bind(null, "head");
    
options.domAPI = (_node_modules_style_loader_dist_runtime_styleDomAPI_js__WEBPACK_IMPORTED_MODULE_1___default());
options.insertStyleElement = (_node_modules_style_loader_dist_runtime_insertStyleElement_js__WEBPACK_IMPORTED_MODULE_4___default());

var update = _node_modules_style_loader_dist_runtime_injectStylesIntoStyleTag_js__WEBPACK_IMPORTED_MODULE_0___default()(_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"], options);




       /* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (_node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"] && _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals ? _node_modules_css_loader_dist_cjs_js_node_modules_sass_loader_dist_cjs_js_styles_scss__WEBPACK_IMPORTED_MODULE_6__["default"].locals : undefined);


/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js":
/*!****************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js ***!
  \****************************************************************************/
/***/ ((module) => {



var stylesInDOM = [];

function getIndexByIdentifier(identifier) {
  var result = -1;

  for (var i = 0; i < stylesInDOM.length; i++) {
    if (stylesInDOM[i].identifier === identifier) {
      result = i;
      break;
    }
  }

  return result;
}

function modulesToDom(list, options) {
  var idCountMap = {};
  var identifiers = [];

  for (var i = 0; i < list.length; i++) {
    var item = list[i];
    var id = options.base ? item[0] + options.base : item[0];
    var count = idCountMap[id] || 0;
    var identifier = "".concat(id, " ").concat(count);
    idCountMap[id] = count + 1;
    var indexByIdentifier = getIndexByIdentifier(identifier);
    var obj = {
      css: item[1],
      media: item[2],
      sourceMap: item[3],
      supports: item[4],
      layer: item[5]
    };

    if (indexByIdentifier !== -1) {
      stylesInDOM[indexByIdentifier].references++;
      stylesInDOM[indexByIdentifier].updater(obj);
    } else {
      var updater = addElementStyle(obj, options);
      options.byIndex = i;
      stylesInDOM.splice(i, 0, {
        identifier: identifier,
        updater: updater,
        references: 1
      });
    }

    identifiers.push(identifier);
  }

  return identifiers;
}

function addElementStyle(obj, options) {
  var api = options.domAPI(options);
  api.update(obj);

  var updater = function updater(newObj) {
    if (newObj) {
      if (newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap && newObj.supports === obj.supports && newObj.layer === obj.layer) {
        return;
      }

      api.update(obj = newObj);
    } else {
      api.remove();
    }
  };

  return updater;
}

module.exports = function (list, options) {
  options = options || {};
  list = list || [];
  var lastIdentifiers = modulesToDom(list, options);
  return function update(newList) {
    newList = newList || [];

    for (var i = 0; i < lastIdentifiers.length; i++) {
      var identifier = lastIdentifiers[i];
      var index = getIndexByIdentifier(identifier);
      stylesInDOM[index].references--;
    }

    var newLastIdentifiers = modulesToDom(newList, options);

    for (var _i = 0; _i < lastIdentifiers.length; _i++) {
      var _identifier = lastIdentifiers[_i];

      var _index = getIndexByIdentifier(_identifier);

      if (stylesInDOM[_index].references === 0) {
        stylesInDOM[_index].updater();

        stylesInDOM.splice(_index, 1);
      }
    }

    lastIdentifiers = newLastIdentifiers;
  };
};

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertBySelector.js":
/*!********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertBySelector.js ***!
  \********************************************************************/
/***/ ((module) => {



var memo = {};
/* istanbul ignore next  */

function getTarget(target) {
  if (typeof memo[target] === "undefined") {
    var styleTarget = document.querySelector(target); // Special case to return head of iframe instead of iframe itself

    if (window.HTMLIFrameElement && styleTarget instanceof window.HTMLIFrameElement) {
      try {
        // This will throw an exception if access to iframe is blocked
        // due to cross-origin restrictions
        styleTarget = styleTarget.contentDocument.head;
      } catch (e) {
        // istanbul ignore next
        styleTarget = null;
      }
    }

    memo[target] = styleTarget;
  }

  return memo[target];
}
/* istanbul ignore next  */


function insertBySelector(insert, style) {
  var target = getTarget(insert);

  if (!target) {
    throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
  }

  target.appendChild(style);
}

module.exports = insertBySelector;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/insertStyleElement.js":
/*!**********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/insertStyleElement.js ***!
  \**********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function insertStyleElement(options) {
  var element = document.createElement("style");
  options.setAttributes(element, options.attributes);
  options.insert(element, options.options);
  return element;
}

module.exports = insertStyleElement;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/setAttributesWithoutAttributes.js ***!
  \**********************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {



/* istanbul ignore next  */
function setAttributesWithoutAttributes(styleElement) {
  var nonce =  true ? __webpack_require__.nc : 0;

  if (nonce) {
    styleElement.setAttribute("nonce", nonce);
  }
}

module.exports = setAttributesWithoutAttributes;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleDomAPI.js":
/*!***************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleDomAPI.js ***!
  \***************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function apply(styleElement, options, obj) {
  var css = "";

  if (obj.supports) {
    css += "@supports (".concat(obj.supports, ") {");
  }

  if (obj.media) {
    css += "@media ".concat(obj.media, " {");
  }

  var needLayer = typeof obj.layer !== "undefined";

  if (needLayer) {
    css += "@layer".concat(obj.layer.length > 0 ? " ".concat(obj.layer) : "", " {");
  }

  css += obj.css;

  if (needLayer) {
    css += "}";
  }

  if (obj.media) {
    css += "}";
  }

  if (obj.supports) {
    css += "}";
  }

  var sourceMap = obj.sourceMap;

  if (sourceMap && typeof btoa !== "undefined") {
    css += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))), " */");
  } // For old IE

  /* istanbul ignore if  */


  options.styleTagTransform(css, styleElement, options.options);
}

function removeStyleElement(styleElement) {
  // istanbul ignore if
  if (styleElement.parentNode === null) {
    return false;
  }

  styleElement.parentNode.removeChild(styleElement);
}
/* istanbul ignore next  */


function domAPI(options) {
  var styleElement = options.insertStyleElement(options);
  return {
    update: function update(obj) {
      apply(styleElement, options, obj);
    },
    remove: function remove() {
      removeStyleElement(styleElement);
    }
  };
}

module.exports = domAPI;

/***/ }),

/***/ "./node_modules/style-loader/dist/runtime/styleTagTransform.js":
/*!*********************************************************************!*\
  !*** ./node_modules/style-loader/dist/runtime/styleTagTransform.js ***!
  \*********************************************************************/
/***/ ((module) => {



/* istanbul ignore next  */
function styleTagTransform(css, styleElement) {
  if (styleElement.styleSheet) {
    styleElement.styleSheet.cssText = css;
  } else {
    while (styleElement.firstChild) {
      styleElement.removeChild(styleElement.firstChild);
    }

    styleElement.appendChild(document.createTextNode(css));
  }
}

module.exports = styleTagTransform;

/***/ }),

/***/ "./src/img/clearcloudy.jpg":
/*!*********************************!*\
  !*** ./src/img/clearcloudy.jpg ***!
  \*********************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "21a0936f11b7708b7043.jpg";

/***/ }),

/***/ "./src/img/high-temp.png":
/*!*******************************!*\
  !*** ./src/img/high-temp.png ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "0632048525f091c4cb92.png";

/***/ }),

/***/ "./src/img/humidity.png":
/*!******************************!*\
  !*** ./src/img/humidity.png ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "a4ee10f7dd0ddef2cb08.png";

/***/ }),

/***/ "./src/img/low-temp.png":
/*!******************************!*\
  !*** ./src/img/low-temp.png ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "88611579612623eb13eb.png";

/***/ }),

/***/ "./src/img/windSpeed.png":
/*!*******************************!*\
  !*** ./src/img/windSpeed.png ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

module.exports = __webpack_require__.p + "840a0c6f708097980ed6.png";

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
/******/ 			id: moduleId,
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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
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
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		var scriptUrl;
/******/ 		if (__webpack_require__.g.importScripts) scriptUrl = __webpack_require__.g.location + "";
/******/ 		var document = __webpack_require__.g.document;
/******/ 		if (!scriptUrl && document) {
/******/ 			if (document.currentScript)
/******/ 				scriptUrl = document.currentScript.src
/******/ 			if (!scriptUrl) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				if(scripts.length) scriptUrl = scripts[scripts.length - 1].src
/******/ 			}
/******/ 		}
/******/ 		// When supporting browsers where an automatic publicPath is not supported you must specify an output.publicPath manually via configuration
/******/ 		// or pass an empty string ("") and set the __webpack_public_path__ variable from your code to use your own logic.
/******/ 		if (!scriptUrl) throw new Error("Automatic publicPath is not supported in this browser");
/******/ 		scriptUrl = scriptUrl.replace(/#.*$/, "").replace(/\?.*$/, "").replace(/\/[^\/]+$/, "/");
/******/ 		__webpack_require__.p = scriptUrl;
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		__webpack_require__.b = document.baseURI || self.location.href;
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"main": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		// no on chunks loaded
/******/ 		
/******/ 		// no jsonp function
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/nonce */
/******/ 	(() => {
/******/ 		__webpack_require__.nc = undefined;
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
/* harmony import */ var _css_styles_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./css/styles.scss */ "./src/css/styles.scss");
/* harmony import */ var _js_fetchData_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./js/fetchData.js */ "./src/js/fetchData.js");
/* harmony import */ var _js_manageDOM_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./js/manageDOM.js */ "./src/js/manageDOM.js");
/* eslint-enable */



/* definitions here to be able to use em inside functions. isn't a better way? */
const feedback = document.getElementById('input-feedback');
const iCity = document.getElementById('input-city');
const metric = document.getElementById('metric');
const imperial = document.getElementById('imperial');
const standard = document.getElementById('standard');
let currentUnit = 'metric'; // by default
let currentCity = '';
load();
function load() {
  setListeners();
}
function setListeners() {
  iCity.addEventListener('change', setCity);
  metric.addEventListener('click', setUnitSelected);
  imperial.addEventListener('click', setUnitSelected);
  standard.addEventListener('click', setUnitSelected);
}
async function loadWeather() {
  if (currentCity === '' || currentCity === null || currentCity === undefined) {
    // If no input we do nothing, but remove the error msg
    feedback.classList.add('invisible');
    feedback.classList.remove('visible');
    return;
  }
  const weatherData = await obtain('weather', currentCity, currentUnit);
  if (weatherData != null) {
    _js_manageDOM_js__WEBPACK_IMPORTED_MODULE_2__.manageDOM.setWeather(weatherData);
    feedback.textContent = '';
    feedback.classList.add('invisible');
    feedback.classList.remove('visible');
  } else {
    feedback.textContent = "We couldn't find the city you're looking for";
    feedback.classList.remove('invisible');
    feedback.classList.add('visible');
  }
}
async function obtain(type) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  const fetchedData = await _js_fetchData_js__WEBPACK_IMPORTED_MODULE_1__.manageFetchs.obtain(type, args).catch(e => {});
  if (fetchedData.feedback.code === 0) {
    return fetchedData.data;
  } else {
    return null;
  }
}
function setUnitSelected(e) {
  const selected = e.target;
  metric.classList.remove('selected');
  imperial.classList.remove('selected');
  standard.classList.remove('selected');
  selected.classList.add('selected');
  currentUnit = String(selected.id);
  loadWeather();
}
function setCity(e) {
  currentCity = String(iCity.value);
  loadWeather();
}
})();

/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7OztBQUFBOztBQUVBO0FBQ0E7QUFDQSxNQUFNQSxZQUFZLEdBQUksWUFBWTtFQUNoQyxNQUFNQyxPQUFPLEdBQUcsa0NBQWtDLENBQUMsQ0FBQztFQUNwRCxNQUFNQyxJQUFJLEdBQUc7SUFBRUEsSUFBSSxFQUFFO0VBQU8sQ0FBQztFQUM3QixNQUFNQyxXQUFXLEdBQUc7SUFDbEJDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDUkMsUUFBUSxFQUFFO01BQ1I7QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO01BQ01DLElBQUksRUFBRSxDQUFDO01BQ1BDLE1BQU0sRUFBRTtJQUNWO0VBQ0YsQ0FBQzs7RUFFRDtFQUNBO0VBQ0EsZUFBZUMsTUFBTSxDQUFDSixJQUFJLEVBQUVLLElBQUksRUFBRTtJQUNoQ0MsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O0lBRW5CLFFBQVFOLElBQUksQ0FBQ08sV0FBVyxFQUFFO01BQ3hCLEtBQUssU0FBUztRQUFFO1VBQ2QsTUFBTUMsSUFBSSxHQUFHQyxNQUFNLENBQUNKLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUM1QixNQUFNSyxLQUFLLEdBQUdELE1BQU0sQ0FBQ0osSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztVQUMvQixJQUFJTSxZQUFZLENBQUNILElBQUksQ0FBQyxFQUFFO1lBQ3RCVCxXQUFXLENBQUNDLElBQUksR0FBRyxNQUFNWSxjQUFjLENBQ3JDSixJQUFJLENBQUNELFdBQVcsRUFBRSxFQUNsQkcsS0FBSyxDQUNOLENBQUNHLEtBQUssQ0FBRUMsQ0FBQyxJQUFLO2NBQ2JSLGNBQWMsQ0FBQyxDQUFDLENBQUM7WUFDbkIsQ0FBQyxDQUFDO1VBQ0osQ0FBQyxNQUFNO1lBQ0w7WUFDQUEsY0FBYyxDQUFDLENBQUMsQ0FBQztVQUNuQjtVQUNBO1FBQ0Y7TUFDQTtRQUNFO1FBQ0FBLGNBQWMsQ0FBQyxDQUFDLENBQUM7UUFDakI7SUFBTTtJQUdWLE9BQU9QLFdBQVc7RUFDcEI7RUFFQSxTQUFTWSxZQUFZLENBQUNILElBQUksRUFBRTtJQUMxQjtJQUNBO0lBQ0E7SUFDQSxNQUFNTyxLQUFLLEdBQUcsa0NBQWtDO0lBQ2hELE9BQU9BLEtBQUssQ0FBQ0MsSUFBSSxDQUFDUixJQUFJLENBQUM7RUFDekI7RUFFQSxlQUFlSSxjQUFjLENBQUNKLElBQUksRUFBRUUsS0FBSyxFQUFFO0lBQ3pDO0lBQ0E7SUFDQTs7SUFFQTtJQUNBLE1BQU1PLE1BQU0sR0FBRyxNQUFNQyxlQUFlLENBQUNWLElBQUksQ0FBQyxDQUFDSyxLQUFLLENBQUVDLENBQUMsSUFBSztNQUN0RFIsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNuQixDQUFDLENBQUM7SUFFRixJQUFJVyxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUtFLFNBQVMsRUFBRTtNQUMzQjtNQUNBLE1BQU1DLFdBQVcsR0FBRyxNQUFNQyxrQkFBa0IsQ0FDMUNKLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQ0ssR0FBRyxFQUNiTCxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUNNLEdBQUcsRUFDYmIsS0FBSyxDQUNOLENBQUNHLEtBQUssQ0FBRUMsQ0FBQyxJQUFLO1FBQ2JSLGNBQWMsQ0FBQyxDQUFDLENBQUM7TUFDbkIsQ0FBQyxDQUFDO01BQ0YsT0FBT2MsV0FBVztJQUNwQixDQUFDLE1BQU07TUFDTGQsY0FBYyxDQUFDLENBQUMsQ0FBQztJQUNuQjtFQUNGO0VBRUEsZUFBZVksZUFBZSxDQUFDVixJQUFJLEVBQUU7SUFDbkM7SUFDQSxNQUFNZ0IsR0FBRyxHQUFJLG1EQUFrRGhCLElBQUssVUFBU1gsT0FBUSxFQUFDO0lBRXRGLE1BQU00QixRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDRixHQUFHLEVBQUUxQixJQUFJLENBQUM7SUFDdkMsTUFBTTZCLFFBQVEsR0FBRyxNQUFNRixRQUFRLENBQUNHLElBQUksRUFBRTtJQUN0QyxPQUFPRCxRQUFRO0VBQ2pCOztFQUVBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsZUFBZU4sa0JBQWtCLENBQUNDLEdBQUcsRUFBRUMsR0FBRyxFQUFFYixLQUFLLEVBQUU7SUFDakQsSUFBSUEsS0FBSyxLQUFLLElBQUksSUFBSUEsS0FBSyxLQUFLUyxTQUFTLEVBQUU7TUFDekNULEtBQUssR0FBRyxRQUFRO0lBQ2xCOztJQUVBO0lBQ0EsTUFBTWMsR0FBRyxHQUFJLHVEQUFzREYsR0FBSSxRQUFPQyxHQUFJLFVBQVNiLEtBQU0sVUFBU2IsT0FBUSxFQUFDO0lBRW5ILE1BQU00QixRQUFRLEdBQUcsTUFBTUMsS0FBSyxDQUFDRixHQUFHLEVBQUUxQixJQUFJLENBQUM7SUFDdkMsTUFBTTZCLFFBQVEsR0FBRyxNQUFNRixRQUFRLENBQUNHLElBQUksRUFBRTtJQUN0QyxPQUFPRCxRQUFRO0VBQ2pCO0VBRUEsU0FBU3JCLGNBQWMsQ0FBQ0osSUFBSSxFQUFFO0lBQzVCSCxXQUFXLENBQUNFLFFBQVEsQ0FBQ0MsSUFBSSxHQUFHQSxJQUFJO0lBQ2hDO0lBQ0EsUUFBUUEsSUFBSTtNQUNWLEtBQUssQ0FBQztRQUFFO1VBQ047VUFDQUgsV0FBVyxDQUFDRSxRQUFRLENBQUNFLE1BQU0sR0FBRyxJQUFJO1VBQ2xDO1FBQ0Y7TUFDQSxLQUFLLENBQUM7UUFBRTtVQUNOSixXQUFXLENBQUNFLFFBQVEsQ0FBQ0UsTUFBTSxHQUFHLDRCQUE0QjtVQUMxRDtRQUNGO01BQ0EsS0FBSyxDQUFDO1FBQUU7VUFDTkosV0FBVyxDQUFDRSxRQUFRLENBQUNFLE1BQU0sR0FBRyxxQ0FBcUM7VUFDbkU7UUFDRjtNQUNBLEtBQUssQ0FBQztRQUFFO1VBQ05KLFdBQVcsQ0FBQ0UsUUFBUSxDQUFDRSxNQUFNLEdBQUcsMEJBQTBCO1VBQ3hEO1FBQ0Y7TUFDQSxLQUFLLENBQUM7UUFBRTtVQUNOSixXQUFXLENBQUNFLFFBQVEsQ0FBQ0UsTUFBTSxHQUFHLDBCQUEwQjtVQUN4RDtRQUNGO01BQ0EsS0FBSyxDQUFDO1FBQUU7VUFDTkosV0FBVyxDQUFDRSxRQUFRLENBQUNFLE1BQU0sR0FBRyxzQ0FBc0M7VUFDcEU7UUFDRjtNQUNBLEtBQUssQ0FBQztRQUFFO1VBQ05KLFdBQVcsQ0FBQ0UsUUFBUSxDQUFDRSxNQUFNLEdBQUcsb0JBQW9CO1VBQ2xEO1FBQ0Y7SUFBQztFQUVMO0VBRUEsT0FBTztJQUFFQztFQUFPLENBQUM7QUFDbkIsQ0FBQyxFQUFHOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcEpKO0FBQzJDO0FBQ0Q7QUFDQztBQUNFOztBQUU3QztBQUNBLE1BQU02QixTQUFTLEdBQUksWUFBWTtFQUM3QjtFQUNBLE1BQU1DLGFBQWEsR0FBR0MsUUFBUSxDQUFDQyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7RUFFL0QsTUFBTUMsVUFBVSxHQUFHLFVBQVVyQyxJQUFJLEVBQUU7SUFDakMsSUFBSXNDLEdBQUcsR0FBRyxFQUFFO0lBQ1pDLFdBQVcsRUFBRSxDQUFDLENBQUM7O0lBRWZMLGFBQWEsQ0FBQ00sU0FBUyxDQUFDQyxNQUFNLENBQUMsV0FBVyxDQUFDO0lBQzNDLE1BQU1DLElBQUksR0FBR0MsV0FBVyxFQUFFO0lBQzFCLE1BQU1DLFFBQVEsR0FBR0MsVUFBVSxDQUFDLEdBQUcsRUFBRSxXQUFXLEVBQUU3QyxJQUFJLENBQUM4QyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQztJQUNwRSxNQUFNQyxJQUFJLEdBQUdGLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFN0MsSUFBSSxDQUFDZ0QsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDQyxXQUFXLENBQUM7SUFDbEVYLEdBQUcsR0FBSSxxQ0FBb0N0QyxJQUFJLENBQUNnRCxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUNFLElBQUssU0FBUTtJQUN4RSxNQUFNQyxJQUFJLEdBQUdOLFVBQVUsQ0FBQyxLQUFLLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUVQLEdBQUcsQ0FBQztJQUN4RCxNQUFNYyxJQUFJLEdBQUdQLFVBQVUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFN0MsSUFBSSxDQUFDcUQsSUFBSSxDQUFDRCxJQUFJLEdBQUdWLElBQUksQ0FBQztJQUM1REosR0FBRyxHQUFHLGNBQWMsR0FBR3RDLElBQUksQ0FBQ3FELElBQUksQ0FBQ0MsVUFBVSxHQUFHWixJQUFJO0lBQ2xELE1BQU1hLE9BQU8sR0FBR1YsVUFBVSxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUVQLEdBQUcsQ0FBQztJQUNoRCxNQUFNa0IsU0FBUyxHQUFHWCxVQUFVLENBQUMsS0FBSyxFQUFFLG1CQUFtQixDQUFDO0lBQ3hELE1BQU1ZLGFBQWEsR0FBR1osVUFBVSxDQUFDLEtBQUssRUFBRSxnQkFBZ0IsQ0FBQztJQUN6RCxNQUFNYSxjQUFjLEdBQUdiLFVBQVUsQ0FBQyxLQUFLLEVBQUUsaUJBQWlCLENBQUM7SUFDM0QsTUFBTWMsVUFBVSxHQUFHZCxVQUFVLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFaEIsK0NBQU8sQ0FBQztJQUN6RVMsR0FBRyxHQUFHdEMsSUFBSSxDQUFDcUQsSUFBSSxDQUFDTyxRQUFRLEdBQUdsQixJQUFJO0lBQy9CLE1BQU1tQixVQUFVLEdBQUdoQixVQUFVLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRVAsR0FBRyxDQUFDO0lBQ3pELE1BQU13QixVQUFVLEdBQUdqQixVQUFVLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFZiw4Q0FBTyxDQUFDO0lBQ3pFUSxHQUFHLEdBQUd0QyxJQUFJLENBQUNxRCxJQUFJLENBQUNVLFFBQVEsR0FBR3JCLElBQUk7SUFDL0IsTUFBTXNCLFVBQVUsR0FBR25CLFVBQVUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFUCxHQUFHLENBQUM7SUFDekQsTUFBTTJCLFdBQVcsR0FBR3BCLFVBQVUsQ0FBQyxLQUFLLEVBQUUsY0FBYyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUVkLDhDQUFRLENBQUM7SUFDM0VPLEdBQUcsR0FBR3RDLElBQUksQ0FBQ3FELElBQUksQ0FBQ3RCLFFBQVEsR0FBRyxJQUFJO0lBQy9CLE1BQU1tQyxXQUFXLEdBQUdyQixVQUFVLENBQUMsS0FBSyxFQUFFLGNBQWMsRUFBRVAsR0FBRyxDQUFDO0lBQzFEQSxHQUFHLEdBQUdOLCtDQUFTO0lBQ2YsTUFBTW1DLFlBQVksR0FBR3RCLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRVAsR0FBRyxDQUFDO0lBQ3pFQSxHQUFHLEdBQUd0QyxJQUFJLENBQUNvRSxJQUFJLENBQUNDLEtBQUssR0FBRyxPQUFPO0lBQy9CLE1BQU1DLFlBQVksR0FBR3pCLFVBQVUsQ0FBQyxLQUFLLEVBQUUsZ0JBQWdCLEVBQUVQLEdBQUcsQ0FBQztJQUU3RG1CLGFBQWEsQ0FBQ2MsTUFBTSxDQUFDWixVQUFVLEVBQUVFLFVBQVUsRUFBRUMsVUFBVSxFQUFFRSxVQUFVLENBQUM7SUFDcEVOLGNBQWMsQ0FBQ2EsTUFBTSxDQUFDTCxXQUFXLEVBQUVELFdBQVcsRUFBRUssWUFBWSxFQUFFSCxZQUFZLENBQUM7SUFDM0VYLFNBQVMsQ0FBQ2UsTUFBTSxDQUFDZCxhQUFhLEVBQUVDLGNBQWMsQ0FBQztJQUUvQ3hCLGFBQWEsQ0FBQ3FDLE1BQU0sQ0FBQzNCLFFBQVEsRUFBRUcsSUFBSSxFQUFFSSxJQUFJLEVBQUVDLElBQUksRUFBRUcsT0FBTyxFQUFFQyxTQUFTLENBQUM7RUFDdEUsQ0FBQztFQUVELFNBQVNYLFVBQVUsQ0FBQzJCLE9BQU8sRUFBRUMsTUFBTSxFQUFFQyxVQUFVLEVBQUVDLFNBQVMsRUFBRUMsT0FBTyxFQUFFO0lBQ25FLE1BQU10QyxHQUFHLEdBQUdILFFBQVEsQ0FBQzBDLGFBQWEsQ0FBQ0wsT0FBTyxDQUFDO0lBQzNDLElBQUlDLE1BQU0sS0FBSyxJQUFJLElBQUlBLE1BQU0sS0FBS3RELFNBQVMsRUFBRTtNQUMzQ21CLEdBQUcsQ0FBQ3dDLEVBQUUsR0FBR0wsTUFBTTtJQUNqQjtJQUVBLElBQUlDLFVBQVUsS0FBSyxJQUFJLElBQUlBLFVBQVUsS0FBS3ZELFNBQVMsRUFBRTtNQUNuRG1CLEdBQUcsQ0FBQ3lDLFdBQVcsR0FBR0wsVUFBVTtJQUM5QjtJQUVBLElBQUlDLFNBQVMsS0FBSyxJQUFJLElBQUlBLFNBQVMsS0FBS3hELFNBQVMsRUFBRTtNQUNqRG1CLEdBQUcsQ0FBQzBDLFNBQVMsR0FBR0wsU0FBUztJQUMzQjtJQUVBLElBQUlDLE9BQU8sS0FBSyxJQUFJLElBQUlBLE9BQU8sS0FBS3pELFNBQVMsRUFBRTtNQUM3Q21CLEdBQUcsQ0FBQzJDLEdBQUcsR0FBR0wsT0FBTztJQUNuQjtJQUVBLE9BQU90QyxHQUFHO0VBQ1o7RUFFQSxTQUFTSyxXQUFXLEdBQUc7SUFDckIsTUFBTXVDLFdBQVcsR0FBRy9DLFFBQVEsQ0FBQ2dELGFBQWEsQ0FBQyxXQUFXLENBQUM7SUFFdkQsT0FBTyxHQUFHLEdBQUdELFdBQVcsQ0FBQ0gsV0FBVztFQUN0QztFQUVBLE1BQU14QyxXQUFXLEdBQUcsWUFBWTtJQUM5QixPQUFPTCxhQUFhLENBQUNrRCxVQUFVLEVBQUU7TUFDL0JsRCxhQUFhLENBQUNtRCxXQUFXLENBQUNuRCxhQUFhLENBQUNrRCxVQUFVLENBQUM7SUFDckQ7RUFDRixDQUFDO0VBRUQsT0FBTztJQUFFL0M7RUFBVyxDQUFDO0FBQ3ZCLENBQUMsRUFBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDbEZKO0FBQzZHO0FBQ2pCO0FBQ087QUFDbkcsNENBQTRDLHdIQUF5QztBQUNyRiw4QkFBOEIsbUZBQTJCLENBQUMsNEZBQXFDO0FBQy9GLHlOQUF5TjtBQUN6Tix5Q0FBeUMsc0ZBQStCO0FBQ3hFO0FBQ0Esc0dBQXNHLGlDQUFpQyw4QkFBOEIsd0NBQXdDLHdDQUF3QyxVQUFVLHVCQUF1Qix1RkFBdUYsdUJBQXVCLGlCQUFpQixxQkFBcUIsa0JBQWtCLEdBQUcsZ0JBQWdCLGtCQUFrQixHQUFHLG9CQUFvQixtQkFBbUIsR0FBRyxpQkFBaUIsdUJBQXVCLHdCQUF3QixHQUFHLDJCQUEyQixrQ0FBa0MsdUJBQXVCLGdCQUFnQiwyQkFBMkIsdUJBQXVCLGtCQUFrQixnQ0FBZ0Msb0JBQW9CLEdBQUcsaUNBQWlDLDJCQUEyQixHQUFHLCtCQUErQiwyQkFBMkIsdUJBQXVCLGtCQUFrQixvQkFBb0IseUNBQXlDLGlDQUFpQyxlQUFlLEdBQUcsZ0NBQWdDLGtCQUFrQix1Q0FBdUMsY0FBYyx3QkFBd0IsMEJBQTBCLEdBQUcsMEhBQTBILG9CQUFvQixrQkFBa0Isd0JBQXdCLDRCQUE0QiwyQkFBMkIsa0JBQWtCLG9CQUFvQiwyQkFBMkIsb0JBQW9CLEdBQUcsMENBQTBDLHlDQUF5Qyw0QkFBNEIsb0RBQW9ELHFEQUFxRCxHQUFHLHFCQUFxQixzQkFBc0IsaUJBQWlCLHFCQUFxQixxQ0FBcUMsc0JBQXNCLEdBQUcsOEJBQThCLG9CQUFvQixjQUFjLGVBQWUsa0NBQWtDLEdBQUcsMEJBQTBCLG9CQUFvQixjQUFjLGVBQWUsNENBQTRDLEdBQUcsMEJBQTBCLGNBQWMsZUFBZSxHQUFHLDBCQUEwQixvQkFBb0IsY0FBYyxlQUFlLDRDQUE0QyxHQUFHLDZCQUE2QixvQkFBb0IsY0FBYyxlQUFlLDRCQUE0Qiw0Q0FBNEMsR0FBRyxzQ0FBc0Msa0JBQWtCLG1DQUFtQyxrQ0FBa0MsR0FBRyxzREFBc0Qsd0JBQXdCLGtCQUFrQixtQ0FBbUMsZ0NBQWdDLHdCQUF3Qix3QkFBd0IsR0FBRyx1REFBdUQsc0JBQXNCLGtCQUFrQixtQ0FBbUMsZ0NBQWdDLHlCQUF5Qix3QkFBd0IsR0FBRywwQ0FBMEMsaUJBQWlCLEdBQUcsY0FBYyx1QkFBdUIsY0FBYyxnQkFBZ0IsNkNBQTZDLG9CQUFvQixnQkFBZ0IscUNBQXFDLEdBQUcsY0FBYyxxQkFBcUIsb0JBQW9CLG1CQUFtQixnQkFBZ0IsR0FBRywrQkFBK0IsNkJBQTZCLG1CQUFtQixzQkFBc0IsS0FBSyxnSUFBZ0ksbUJBQW1CLHNCQUFzQixLQUFLLGdDQUFnQyxzQkFBc0IsS0FBSyw0QkFBNEIsd0JBQXdCLEtBQUssNEJBQTRCLHdCQUF3QixLQUFLLCtCQUErQixzQkFBc0IsS0FBSyxnQkFBZ0Isc0JBQXNCLEtBQUssR0FBRyxPQUFPLDRGQUE0RixTQUFTLE1BQU0sS0FBSyxXQUFXLFdBQVcsV0FBVyxVQUFVLFdBQVcsVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssVUFBVSxNQUFNLEtBQUssV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFdBQVcsVUFBVSxXQUFXLFdBQVcsVUFBVSxXQUFXLFVBQVUsS0FBSyxLQUFLLFdBQVcsS0FBSyxLQUFLLFdBQVcsV0FBVyxVQUFVLFVBQVUsV0FBVyxXQUFXLFVBQVUsS0FBSyxLQUFLLFVBQVUsV0FBVyxVQUFVLFdBQVcsV0FBVyxLQUFLLE9BQU8sVUFBVSxVQUFVLFdBQVcsV0FBVyxXQUFXLFVBQVUsVUFBVSxXQUFXLFVBQVUsS0FBSyxLQUFLLFdBQVcsV0FBVyxXQUFXLFdBQVcsTUFBTSxLQUFLLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssVUFBVSxVQUFVLFVBQVUsV0FBVyxLQUFLLEtBQUssVUFBVSxVQUFVLFVBQVUsV0FBVyxLQUFLLEtBQUssVUFBVSxVQUFVLEtBQUssS0FBSyxVQUFVLFVBQVUsVUFBVSxXQUFXLEtBQUssS0FBSyxVQUFVLFVBQVUsVUFBVSxXQUFXLFdBQVcsS0FBSyxLQUFLLFVBQVUsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLFdBQVcsS0FBSyxLQUFLLFVBQVUsTUFBTSxNQUFNLFdBQVcsVUFBVSxVQUFVLFdBQVcsVUFBVSxVQUFVLFdBQVcsTUFBTSxNQUFNLFdBQVcsVUFBVSxVQUFVLFVBQVUsT0FBTyxNQUFNLEtBQUssVUFBVSxVQUFVLE1BQU0sUUFBUSxVQUFVLFVBQVUsTUFBTSxNQUFNLFVBQVUsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFdBQVcsTUFBTSxNQUFNLFVBQVUsTUFBTSxNQUFNLFVBQVUsTUFBTSwrTkFBK04seUNBQXlDLGlDQUFpQyw4QkFBOEIsd0NBQXdDLHdDQUF3QyxVQUFVLHVCQUF1QixxRUFBcUUsdUJBQXVCLGlCQUFpQixxQkFBcUIsa0JBQWtCLEdBQUcsY0FBYyxrQkFBa0IsR0FBRyxvQkFBb0IsbUJBQW1CLEdBQUcsaUJBQWlCLHVCQUF1Qix3QkFBd0IsbUJBQW1CLDZEQUE2RCx3Q0FBd0MsK0JBQStCLHNDQUFzQyxvQ0FBb0MsMkJBQTJCLGtCQUFrQiw2QkFBNkIseUJBQXlCLG9CQUFvQixvQ0FBb0Msc0JBQXNCLGVBQWUsK0JBQStCLE9BQU8sS0FBSyx1QkFBdUIsNkJBQTZCLHlCQUF5QixvQkFBb0Isc0JBQXNCLDJDQUEyQyxtQ0FBbUMsaUJBQWlCLEtBQUssd0JBQXdCLG9CQUFvQix5Q0FBeUMsZ0JBQWdCLDBCQUEwQiw0QkFBNEIsaURBQWlELHdCQUF3QixzQkFBc0IsNEJBQTRCLGdDQUFnQywrQkFBK0Isc0JBQXNCLHdCQUF3QiwrQkFBK0IsMEJBQTBCLE9BQU8saUJBQWlCLDZDQUE2QyxnQ0FBZ0Msd0RBQXdELHlEQUF5RCxPQUFPLEtBQUssR0FBRyxxQkFBcUIsc0JBQXNCLGlCQUFpQixxQkFBcUIscUNBQXFDLHNCQUFzQixrQkFBa0Isc0JBQXNCLGdCQUFnQixpQkFBaUIsa0NBQWtDLEtBQUssY0FBYyxzQkFBc0IsZ0JBQWdCLGlCQUFpQiw0Q0FBNEMsS0FBSyxZQUFZLGdCQUFnQixpQkFBaUIsS0FBSyxZQUFZLHNCQUFzQixnQkFBZ0IsaUJBQWlCLDRDQUE0QyxLQUFLLGlCQUFpQixzQkFBc0IsZ0JBQWdCLGlCQUFpQiw4QkFBOEIsNENBQTRDLEtBQUssMEJBQTBCLG9CQUFvQixxQ0FBcUMsa0NBQWtDLHlCQUF5Qiw0QkFBNEIsc0JBQXNCLHVDQUF1QyxvQ0FBb0MsNEJBQTRCLDRCQUE0QixPQUFPLHdCQUF3QiwwQkFBMEIsc0JBQXNCLHVDQUF1QyxvQ0FBb0MsNkJBQTZCLDRCQUE0QixPQUFPLFdBQVcscUJBQXFCLE9BQU8sS0FBSyxHQUFHLGNBQWMsdUJBQXVCLGNBQWMsZ0JBQWdCLDZDQUE2QyxvQkFBb0IsZ0JBQWdCLHFDQUFxQyxTQUFTLHVCQUF1QixzQkFBc0IscUJBQXFCLGtCQUFrQixLQUFLLEdBQUcsK0JBQStCLGlCQUFpQixtQkFBbUIscUJBQXFCLHdCQUF3QixPQUFPLHdCQUF3QixxREFBcUQsdUJBQXVCLDBCQUEwQixTQUFTLE9BQU8sS0FBSyx1QkFBdUIsa0JBQWtCLHdCQUF3QixPQUFPLGdCQUFnQiwwQkFBMEIsT0FBTyxnQkFBZ0IsMEJBQTBCLE9BQU8sbUJBQW1CLHdCQUF3QixPQUFPLEtBQUssZ0JBQWdCLFNBQVMsd0JBQXdCLE9BQU8sS0FBSyxHQUFHLHFCQUFxQjtBQUNsL1M7QUFDQSxpRUFBZSx1QkFBdUIsRUFBQzs7Ozs7Ozs7Ozs7QUNYMUI7O0FBRWI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFEQUFxRDtBQUNyRDtBQUNBO0FBQ0EsZ0RBQWdEO0FBQ2hEO0FBQ0E7QUFDQSxxRkFBcUY7QUFDckY7QUFDQTtBQUNBO0FBQ0EscUJBQXFCO0FBQ3JCO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0EsS0FBSztBQUNMOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esc0JBQXNCLGlCQUFpQjtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIscUJBQXFCO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNGQUFzRixxQkFBcUI7QUFDM0c7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLGlEQUFpRCxxQkFBcUI7QUFDdEU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWLHNEQUFzRCxxQkFBcUI7QUFDM0U7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7OztBQ3BGYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDekJhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1REFBdUQsY0FBYztBQUNyRTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQkEsTUFBa0c7QUFDbEcsTUFBd0Y7QUFDeEYsTUFBK0Y7QUFDL0YsTUFBa0g7QUFDbEgsTUFBMkc7QUFDM0csTUFBMkc7QUFDM0csTUFBbUo7QUFDbko7QUFDQTs7QUFFQTs7QUFFQSw0QkFBNEIscUdBQW1CO0FBQy9DLHdCQUF3QixrSEFBYTs7QUFFckMsdUJBQXVCLHVHQUFhO0FBQ3BDO0FBQ0EsaUJBQWlCLCtGQUFNO0FBQ3ZCLDZCQUE2QixzR0FBa0I7O0FBRS9DLGFBQWEsMEdBQUcsQ0FBQyw2SEFBTzs7OztBQUk2RjtBQUNySCxPQUFPLGlFQUFlLDZIQUFPLElBQUksb0lBQWMsR0FBRyxvSUFBYyxZQUFZLEVBQUM7Ozs7Ozs7Ozs7O0FDMUJoRTs7QUFFYjs7QUFFQTtBQUNBOztBQUVBLGtCQUFrQix3QkFBd0I7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQSxrQkFBa0IsaUJBQWlCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLE1BQU07QUFDTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1A7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxvQkFBb0IsNEJBQTRCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBLHFCQUFxQiw2QkFBNkI7QUFDbEQ7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOzs7Ozs7Ozs7O0FDdkdhOztBQUViO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHNEQUFzRDs7QUFFdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ3RDYTs7QUFFYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7OztBQ1ZhOztBQUViO0FBQ0E7QUFDQSxjQUFjLEtBQXdDLEdBQUcsc0JBQWlCLEdBQUcsQ0FBSTs7QUFFakY7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7QUNYYTs7QUFFYjtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxrREFBa0Q7QUFDbEQ7O0FBRUE7QUFDQSwwQ0FBMEM7QUFDMUM7O0FBRUE7O0FBRUE7QUFDQSxpRkFBaUY7QUFDakY7O0FBRUE7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7O0FBRUE7O0FBRUE7QUFDQSx5REFBeUQ7QUFDekQsSUFBSTs7QUFFSjs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7Ozs7O0FDckVhOztBQUViO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1VDZkE7VUFDQTs7VUFFQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTs7VUFFQTtVQUNBOzs7OztXQ3pCQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsaUNBQWlDLFdBQVc7V0FDNUM7V0FDQTs7Ozs7V0NQQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLHlDQUF5Qyx3Q0FBd0M7V0FDakY7V0FDQTtXQUNBOzs7OztXQ1BBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsR0FBRztXQUNIO1dBQ0E7V0FDQSxDQUFDOzs7OztXQ1BEOzs7OztXQ0FBO1dBQ0E7V0FDQTtXQUNBLHVEQUF1RCxpQkFBaUI7V0FDeEU7V0FDQSxnREFBZ0QsYUFBYTtXQUM3RDs7Ozs7V0NOQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7Ozs7V0NmQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7O1dBRUE7Ozs7O1dDckJBOzs7Ozs7Ozs7Ozs7OztBQ0FBO0FBQzJCO0FBQ3NCO0FBQ0g7QUFDOUM7QUFDQSxNQUFNcEMsUUFBUSxHQUFHa0MsUUFBUSxDQUFDQyxjQUFjLENBQUMsZ0JBQWdCLENBQUM7QUFDMUQsTUFBTWtELEtBQUssR0FBR25ELFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLFlBQVksQ0FBQztBQUNuRCxNQUFNbUQsTUFBTSxHQUFHcEQsUUFBUSxDQUFDQyxjQUFjLENBQUMsUUFBUSxDQUFDO0FBQ2hELE1BQU1vRCxRQUFRLEdBQUdyRCxRQUFRLENBQUNDLGNBQWMsQ0FBQyxVQUFVLENBQUM7QUFDcEQsTUFBTXFELFFBQVEsR0FBR3RELFFBQVEsQ0FBQ0MsY0FBYyxDQUFDLFVBQVUsQ0FBQztBQUNwRCxJQUFJc0QsV0FBVyxHQUFHLFFBQVEsQ0FBQyxDQUFDO0FBQzVCLElBQUlDLFdBQVcsR0FBRyxFQUFFO0FBRXBCQyxJQUFJLEVBQUU7QUFFTixTQUFTQSxJQUFJLEdBQUc7RUFDZEMsWUFBWSxFQUFFO0FBQ2hCO0FBRUEsU0FBU0EsWUFBWSxHQUFHO0VBQ3RCUCxLQUFLLENBQUNRLGdCQUFnQixDQUFDLFFBQVEsRUFBRUMsT0FBTyxDQUFDO0VBQ3pDUixNQUFNLENBQUNPLGdCQUFnQixDQUFDLE9BQU8sRUFBRUUsZUFBZSxDQUFDO0VBQ2pEUixRQUFRLENBQUNNLGdCQUFnQixDQUFDLE9BQU8sRUFBRUUsZUFBZSxDQUFDO0VBQ25EUCxRQUFRLENBQUNLLGdCQUFnQixDQUFDLE9BQU8sRUFBRUUsZUFBZSxDQUFDO0FBQ3JEO0FBRUEsZUFBZUMsV0FBVyxHQUFHO0VBQzNCLElBQUlOLFdBQVcsS0FBSyxFQUFFLElBQUlBLFdBQVcsS0FBSyxJQUFJLElBQUlBLFdBQVcsS0FBS3hFLFNBQVMsRUFBRTtJQUMzRTtJQUNBbEIsUUFBUSxDQUFDdUMsU0FBUyxDQUFDMEQsR0FBRyxDQUFDLFdBQVcsQ0FBQztJQUNuQ2pHLFFBQVEsQ0FBQ3VDLFNBQVMsQ0FBQ0MsTUFBTSxDQUFDLFNBQVMsQ0FBQztJQUNwQztFQUNGO0VBRUEsTUFBTXJCLFdBQVcsR0FBRyxNQUFNaEIsTUFBTSxDQUFDLFNBQVMsRUFBRXVGLFdBQVcsRUFBRUQsV0FBVyxDQUFDO0VBRXJFLElBQUl0RSxXQUFXLElBQUksSUFBSSxFQUFFO0lBQ3ZCYSxrRUFBb0IsQ0FBQ2IsV0FBVyxDQUFDO0lBQ2pDbkIsUUFBUSxDQUFDOEUsV0FBVyxHQUFHLEVBQUU7SUFDekI5RSxRQUFRLENBQUN1QyxTQUFTLENBQUMwRCxHQUFHLENBQUMsV0FBVyxDQUFDO0lBQ25DakcsUUFBUSxDQUFDdUMsU0FBUyxDQUFDQyxNQUFNLENBQUMsU0FBUyxDQUFDO0VBQ3RDLENBQUMsTUFBTTtJQUNMeEMsUUFBUSxDQUFDOEUsV0FBVyxHQUFHLDhDQUE4QztJQUNyRTlFLFFBQVEsQ0FBQ3VDLFNBQVMsQ0FBQ0MsTUFBTSxDQUFDLFdBQVcsQ0FBQztJQUN0Q3hDLFFBQVEsQ0FBQ3VDLFNBQVMsQ0FBQzBELEdBQUcsQ0FBQyxTQUFTLENBQUM7RUFDbkM7QUFDRjtBQUVBLGVBQWU5RixNQUFNLENBQUMrRixJQUFJLEVBQVc7RUFBQSxrQ0FBTjlGLElBQUk7SUFBSkEsSUFBSTtFQUFBO0VBQ2pDLE1BQU1OLFdBQVcsR0FBRyxNQUFNSCxpRUFBbUIsQ0FBQ3VHLElBQUksRUFBRTlGLElBQUksQ0FBQyxDQUFDUSxLQUFLLENBQUVDLENBQUMsSUFBSyxDQUFDLENBQUMsQ0FBQztFQUUxRSxJQUFJZixXQUFXLENBQUNFLFFBQVEsQ0FBQ0MsSUFBSSxLQUFLLENBQUMsRUFBRTtJQUNuQyxPQUFPSCxXQUFXLENBQUNDLElBQUk7RUFDekIsQ0FBQyxNQUFNO0lBQ0wsT0FBTyxJQUFJO0VBQ2I7QUFDRjtBQUVBLFNBQVNnRyxlQUFlLENBQUNsRixDQUFDLEVBQUU7RUFDMUIsTUFBTXNGLFFBQVEsR0FBR3RGLENBQUMsQ0FBQ3VGLE1BQU07RUFFekJkLE1BQU0sQ0FBQy9DLFNBQVMsQ0FBQ0MsTUFBTSxDQUFDLFVBQVUsQ0FBQztFQUNuQytDLFFBQVEsQ0FBQ2hELFNBQVMsQ0FBQ0MsTUFBTSxDQUFDLFVBQVUsQ0FBQztFQUNyQ2dELFFBQVEsQ0FBQ2pELFNBQVMsQ0FBQ0MsTUFBTSxDQUFDLFVBQVUsQ0FBQztFQUNyQzJELFFBQVEsQ0FBQzVELFNBQVMsQ0FBQzBELEdBQUcsQ0FBQyxVQUFVLENBQUM7RUFDbENSLFdBQVcsR0FBR2pGLE1BQU0sQ0FBQzJGLFFBQVEsQ0FBQ3RCLEVBQUUsQ0FBQztFQUNqQ21CLFdBQVcsRUFBRTtBQUNmO0FBRUEsU0FBU0YsT0FBTyxDQUFDakYsQ0FBQyxFQUFFO0VBQ2xCNkUsV0FBVyxHQUFHbEYsTUFBTSxDQUFDNkUsS0FBSyxDQUFDZ0IsS0FBSyxDQUFDO0VBQ2pDTCxXQUFXLEVBQUU7QUFDZixDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9qcy9mZXRjaERhdGEuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9qcy9tYW5hZ2VET00uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9jc3Mvc3R5bGVzLnNjc3MiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvY3NzL3N0eWxlcy5zY3NzPzdiMmYiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVuYWJsZSAqL1xuXG4vLyBXZSB1c2UgYSBtb2R1bGUgUGF0dGVybiB0byBkZWZpbmUgYSBzaW5nbGUgb2JqZWN0IHRoYXQgd2lsbCBoYW5kbGUgdGhlIGZldGNocy5cbi8vIHRoaXMgb2JqZWN0IHdpbGwgY29udGFpbiB0aGUgYXBpIGtleXMgYXMgYSBwcml2YXRlIHZhcmlhYmxlIGFuZCB0aGUgZnVuY3Rpb25zIHRvIGRvIHRoZSByZXF1ZXN0cy5cbmNvbnN0IG1hbmFnZUZldGNocyA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHdBcGlLZXkgPSAnMDU4MDQ1Y2NjNjQ1NDZiYjM5M2FmY2Y2N2M5Zjg2NGYnOyAvLyBpdCdzIGEgcHVibGljIEFQSVxuICBjb25zdCBtb2RlID0geyBtb2RlOiAnY29ycycgfTtcbiAgY29uc3QgZmV0Y2hlZERhdGEgPSB7XG4gICAgZGF0YToge30sXG4gICAgZmVlZGJhY2s6IHtcbiAgICAgIC8qIFxuICAgICAgICBMaXN0IG9mIHBvc3NpYmxlIHZhbHVlcyBmb3IgY29kZTpcbiAgICAgICAgMCAtPiBubyBlcnJvciwgdGhlIGZldGNoIHdlbnQgb2theVxuICAgICAgICAyIC0+IHRoZSBhcmd1bWVudCAnY2l0eScgZm9yICd3ZWF0aGVyJyBmZXRjaCB3YXMgaW5jb3JyZWN0XG4gICAgICAgIDMgLT4gYW4gZXJyb3Igb2N1cnJlZCB3aGlsZSBmZXRjaGluZ1xuICAgICAgKi9cbiAgICAgIGNvZGU6IDAsXG4gICAgICByZWFzb246ICcnLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gZGF0YSAtLT4gVGVsbHMgdXMgd2hhdCB3ZSBnb25uYSBmZXRjaFxuICAvLyAuLi5hcmdzIC0tPiByZWNlaXZlIHRoZSBhcmd1bWVudHMgZm9yIHRoZSBjYWxsLlxuICBhc3luYyBmdW5jdGlvbiBvYnRhaW4oZGF0YSwgYXJncykge1xuICAgIGFzc2lnbkZlZWRiYWNrKDApOyAvLyBieSBkZWZhdWx0IHdlJ3ZlIHdvcmtlZCBmaW5lXG5cbiAgICBzd2l0Y2ggKGRhdGEudG9Mb3dlckNhc2UoKSkge1xuICAgICAgY2FzZSAnd2VhdGhlcic6IHtcbiAgICAgICAgY29uc3QgY2l0eSA9IFN0cmluZyhhcmdzWzBdKTtcbiAgICAgICAgY29uc3QgdW5pdHMgPSBTdHJpbmcoYXJnc1sxXSk7IC8vIEl0IGNhbiBvbmx5IGJlICdtZXRyaWNzJywgaW1wZXJpYWwsIG9yIHN0YW5kYXJkXG4gICAgICAgIGlmICh2YWxpZGF0ZUNpdHkoY2l0eSkpIHtcbiAgICAgICAgICBmZXRjaGVkRGF0YS5kYXRhID0gYXdhaXQgZ2V0V2VhdGhlckRhdGEoXG4gICAgICAgICAgICBjaXR5LnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICB1bml0c1xuICAgICAgICAgICkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIGFzc2lnbkZlZWRiYWNrKDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENpdHkgYXJndW1lbnQgaXMgd3JvbmdcbiAgICAgICAgICBhc3NpZ25GZWVkYmFjaygyKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIHRoZSBkYXRhIGFyZ3VtZW50IGlzIHdyb25nXG4gICAgICAgIGFzc2lnbkZlZWRiYWNrKDMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZmV0Y2hlZERhdGE7XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUNpdHkoY2l0eSkge1xuICAgIC8vIEknbSBzb3JyeSBpZiBzb21lIHJhcmUgbmFtZXMgd2l0aCBwdW5jdHVhdGlvbnMgc2lnbiBkb2Vzbid0IHdvcmsuXG4gICAgLy8gSWYgdGhpcyB3YXMgcHJvZmVzc2lvbmFsIEknZCBzZWFyY2ggYmV0dGVyIGhvdyB0byB2YWxpZCBuYW1lcyBvciB3b3VsZCB1c2VcbiAgICAvLyBhIGxpc3Qgb2YgdmFsaWQgbWF0Y2hlc1xuICAgIGNvbnN0IHJlZ2V4ID0gLyhbYS16QS1aXSt8W2EtekEtWl0rXFxzW2EtekEtWl0rKS87XG4gICAgcmV0dXJuIHJlZ2V4LnRlc3QoY2l0eSk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBnZXRXZWF0aGVyRGF0YShjaXR5LCB1bml0cykge1xuICAgIC8vIFdlIGRvIHR3byBBUEkgZmV0Y2hcbiAgICAvLyAxKSBGaXJzdCBHZW9jb2RpbmcgYXBpIHRvIG9idGFpbiBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlXG4gICAgLy8gMikgVGhlbiBPcGVuV2VhdGhlciB0byBvYnRhaW4gdGhlIHdlYXRoZXIgaW5mb3JtYXRpb25cblxuICAgIC8vIDEpIEdlb2NvZGluZyBmZXRjaFxuICAgIGNvbnN0IGNvb3JkcyA9IGF3YWl0IGdldENvb3Jkc0J5Q2l0eShjaXR5KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgYXNzaWduRmVlZGJhY2soNCk7XG4gICAgfSk7XG5cbiAgICBpZiAoY29vcmRzWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIDIpIE9wZW53ZWF0aGVyIGZldGNoXG4gICAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IGdldFdlYXRoZXJCeUNvb3JkcyhcbiAgICAgICAgY29vcmRzWzBdLmxhdCxcbiAgICAgICAgY29vcmRzWzBdLmxvbixcbiAgICAgICAgdW5pdHNcbiAgICAgICkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgYXNzaWduRmVlZGJhY2soNSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB3ZWF0aGVyRGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzaWduRmVlZGJhY2soNik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0Q29vcmRzQnlDaXR5KGNpdHkpIHtcbiAgICAvLyBUaGUgVVJMIGZvciBHRU9DT0RJTkcgYXBpXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7Y2l0eX0mYXBwaWQ9JHt3QXBpS2V5fWA7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgbW9kZSk7XG4gICAgY29uc3QgZGF0YUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIGRhdGFKc29uO1xuICB9XG5cbiAgLyogVGhpcyBmdW5jdGlvbiBnZXQncyB0aGUgd2VhdGhlciBGb3JlY2FzdCBieSB1c2luZyBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIHBhcmFtZXR0ZXJzICovXG4gIC8qIFRoZSB1c2VyIGNhbiBhbHNvIGluZm9ybSB1bml0cyBhcyBtZXRyaWMgKENlbHNpdXMpLCBpbXBlcmlhbCAoRmFyZW5oZWl0KSBvciBzdGFuZGFyZCAoS2VsdmluKSAqL1xuICAvKiBJZiBubyB1bml0IGhhcyBiZWVuIHByb3ZpZGVkLCB3ZSB3aWxsIGdvbm5hIHVzZSBtZXRyaWMsIGlmIHRoZSB1cmwgZG9lc24ndCBoYXZlIHVuaXQgZGVmaW5lZC8qICAgaXQgd2lsbCB0YWtlIGJ5IGRlZmF1bHQgXCJzdGFuZGFyZFwiIGFuZCByZXR1cm4gS2VsdmluLiAqL1xuICAvKiBMaXN0IG9mIGFsbCBBUEkgcGFyYW1ldGVycyB3aXRoIHVuaXRzIG9wZW53ZWF0aGVybWFwLm9yZy93ZWF0aGVyLWRhdGEgKi9cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0V2VhdGhlckJ5Q29vcmRzKGxhdCwgbG9uLCB1bml0cykge1xuICAgIGlmICh1bml0cyA9PT0gbnVsbCB8fCB1bml0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB1bml0cyA9ICdtZXRyaWMnO1xuICAgIH1cblxuICAgIC8vIFRoZSBVUkwgZm9yIFdlYXRoZXIgYXBpXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZ1bml0cz0ke3VuaXRzfSZhcHBpZD0ke3dBcGlLZXl9YDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBtb2RlKTtcbiAgICBjb25zdCBkYXRhSnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gZGF0YUpzb247XG4gIH1cblxuICBmdW5jdGlvbiBhc3NpZ25GZWVkYmFjayhjb2RlKSB7XG4gICAgZmV0Y2hlZERhdGEuZmVlZGJhY2suY29kZSA9IGNvZGU7XG4gICAgLy8gbGV0cyBhc3NpZ24gYSByZWFzb25cbiAgICBzd2l0Y2ggKGNvZGUpIHtcbiAgICAgIGNhc2UgMDoge1xuICAgICAgICAvLyBhbGwgd2VudCBva2F5XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdvayc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAxOiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdFcnJvciBkdXJpbmcgZmV0Y2hpbmcgZGF0YSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAyOiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9IFwiQ2l0eSBhcmd1bWVudCBkb2Vzbid0IGNvbXBseSBmb3JtYXRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDM6IHtcbiAgICAgICAgZmV0Y2hlZERhdGEuZmVlZGJhY2sucmVhc29uID0gJ0ZldGNoIHR5cGUgbm90IGNvZGlmaWVkLic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSA0OiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdFcnJvciBmZXRjaGluZyBHZW9Db2RpbmcnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgNToge1xuICAgICAgICBmZXRjaGVkRGF0YS5mZWVkYmFjay5yZWFzb24gPSAnRXJyb3IgZmV0Y2hpbmcgb3BlbndlYXRoZXIgYnkgY29vcmRzJztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDY6IHtcbiAgICAgICAgZmV0Y2hlZERhdGEuZmVlZGJhY2sucmVhc29uID0gJ0xvY2F0aW9uIG5vdCBmb3VuZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IG9idGFpbiB9O1xufSkoKTtcblxuZXhwb3J0IHsgbWFuYWdlRmV0Y2hzIH07XG4iLCIvKiBlc2xpbnQtZW5hYmxlICovXG5pbXBvcnQgbWF4VGVtcCBmcm9tICcuLi9pbWcvaGlnaC10ZW1wLnBuZyc7XG5pbXBvcnQgbWluVGVtcCBmcm9tICcuLi9pbWcvbG93LXRlbXAucG5nJztcbmltcG9ydCBodW1pZGl0eSBmcm9tICcuLi9pbWcvaHVtaWRpdHkucG5nJztcbmltcG9ydCB3aW5kU3BlZWQgZnJvbSAnLi4vaW1nL3dpbmRTcGVlZC5wbmcnO1xuXG4vLyBUaGlzIG1vZHVsZSBwYXR0ZXJuIHdpbGwgbWFuYWdlIHRoZSBkb20gbW9kaWZpY2F0aW9ucyBvZiBvdXIgd2ViXG5jb25zdCBtYW5hZ2VET00gPSAoZnVuY3Rpb24gKCkge1xuICAvLyBBbGwgdGhlIHdlYiBlbGVtZW50cyB3ZSB3YW50IHRvIHdvcmsgd2l0aFxuICBjb25zdCB3ZWF0aGVyQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlYXRoZXItY2FudmFzJyk7XG5cbiAgY29uc3Qgc2V0V2VhdGhlciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgbGV0IGF1eCA9ICcnO1xuICAgIGNsZWFuQ2FudmFzKCk7IC8vIFdlIGRlbGV0ZSBhbGwgY2hpbGRzIG9mIHdlYXRoZXJDYW52YXMgaWYgaXQgaGFzIGZyb20gYSBwcmV2aW91cyBzZXRcblxuICAgIHdlYXRoZXJDYW52YXMuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XG4gICAgY29uc3Qgc2lnbiA9IGdldFRlbXBTaWduKCk7XG4gICAgY29uc3QgbG9jYXRpb24gPSBjcmVhdGVIdG1sKCdwJywgJ3dsb2NhdGlvbicsIGRhdGEubmFtZSwgbnVsbCwgbnVsbCk7XG4gICAgY29uc3QgZGVzYyA9IGNyZWF0ZUh0bWwoJ3AnLCAnd2Rlc2MnLCBkYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb24pO1xuICAgIGF1eCA9IGBodHRwczovL29wZW53ZWF0aGVybWFwLm9yZy9pbWcvd24vJHtkYXRhLndlYXRoZXJbMF0uaWNvbn1AMngucG5nYDtcbiAgICBjb25zdCBpbWFnID0gY3JlYXRlSHRtbCgnaW1nJywgJ3dpbWFnJywgbnVsbCwgbnVsbCwgYXV4KTtcbiAgICBjb25zdCB0ZW1wID0gY3JlYXRlSHRtbCgncCcsICd3dGVtcCcsIGRhdGEubWFpbi50ZW1wICsgc2lnbik7XG4gICAgYXV4ID0gJ0ZlZWxzIGxpa2U6ICcgKyBkYXRhLm1haW4uZmVlbHNfbGlrZSArIHNpZ247XG4gICAgY29uc3QgdGhlcm1hbCA9IGNyZWF0ZUh0bWwoJ3AnLCAnd3RoZXJtYWwnLCBhdXgpO1xuICAgIGNvbnN0IGZvb3RXRGF0YSA9IGNyZWF0ZUh0bWwoJ2RpdicsICdmb290LXdlYXRoZXItZGF0YScpO1xuICAgIGNvbnN0IGxlZnRDb250YWluZXIgPSBjcmVhdGVIdG1sKCdkaXYnLCAnbGVmdC1jb250YWluZXInKTtcbiAgICBjb25zdCByaWdodENvbnRhaW5lciA9IGNyZWF0ZUh0bWwoJ2RpdicsICdyaWdodC1jb250YWluZXInKTtcbiAgICBjb25zdCBpbWdNYXhUZW1wID0gY3JlYXRlSHRtbCgnaW1nJywgJ2ltZy1tYXgtdGVtcCcsIG51bGwsIG51bGwsIG1heFRlbXApO1xuICAgIGF1eCA9IGRhdGEubWFpbi50ZW1wX21heCArIHNpZ247XG4gICAgY29uc3QgdHh0TWF4VGVtcCA9IGNyZWF0ZUh0bWwoJ2RpdicsICd0eHQtbWF4LXRlbXAnLCBhdXgpO1xuICAgIGNvbnN0IGltZ01pblRlbXAgPSBjcmVhdGVIdG1sKCdpbWcnLCAnaW1nLW1pbi10ZW1wJywgbnVsbCwgbnVsbCwgbWluVGVtcCk7XG4gICAgYXV4ID0gZGF0YS5tYWluLnRlbXBfbWluICsgc2lnbjtcbiAgICBjb25zdCB0eHRNaW5UZW1wID0gY3JlYXRlSHRtbCgnZGl2JywgJ3R4dC1taW4tdGVtcCcsIGF1eCk7XG4gICAgY29uc3QgaW1nSHVtaWRpdHkgPSBjcmVhdGVIdG1sKCdpbWcnLCAnaW1nLWh1bWlkaXR5JywgbnVsbCwgbnVsbCwgaHVtaWRpdHkpO1xuICAgIGF1eCA9IGRhdGEubWFpbi5odW1pZGl0eSArICcgJSc7XG4gICAgY29uc3QgdHh0SHVtaWRpdHkgPSBjcmVhdGVIdG1sKCdkaXYnLCAndHh0LWh1bWlkaXR5JywgYXV4KTtcbiAgICBhdXggPSB3aW5kU3BlZWQ7XG4gICAgY29uc3QgaW1nV2luZFNwZWVkID0gY3JlYXRlSHRtbCgnaW1nJywgJ2ltZy13aW5kLXNwZWVkJywgbnVsbCwgbnVsbCwgYXV4KTtcbiAgICBhdXggPSBkYXRhLndpbmQuc3BlZWQgKyAnIGttL2gnO1xuICAgIGNvbnN0IHR4dFdpbmRTcGVlZCA9IGNyZWF0ZUh0bWwoJ2RpdicsICd0eHQtd2luZC1zcGVlZCcsIGF1eCk7XG5cbiAgICBsZWZ0Q29udGFpbmVyLmFwcGVuZChpbWdNYXhUZW1wLCB0eHRNYXhUZW1wLCBpbWdNaW5UZW1wLCB0eHRNaW5UZW1wKTtcbiAgICByaWdodENvbnRhaW5lci5hcHBlbmQodHh0SHVtaWRpdHksIGltZ0h1bWlkaXR5LCB0eHRXaW5kU3BlZWQsIGltZ1dpbmRTcGVlZCk7XG4gICAgZm9vdFdEYXRhLmFwcGVuZChsZWZ0Q29udGFpbmVyLCByaWdodENvbnRhaW5lcik7XG5cbiAgICB3ZWF0aGVyQ2FudmFzLmFwcGVuZChsb2NhdGlvbiwgZGVzYywgaW1hZywgdGVtcCwgdGhlcm1hbCwgZm9vdFdEYXRhKTtcbiAgfTtcblxuICBmdW5jdGlvbiBjcmVhdGVIdG1sKGh0bWxUYWcsIGh0bWxJZCwgdHh0Q29udGVudCwgaHRtbENsYXNzLCBodG1sU3JjKSB7XG4gICAgY29uc3QgYXV4ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChodG1sVGFnKTtcbiAgICBpZiAoaHRtbElkICE9PSBudWxsICYmIGh0bWxJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhdXguaWQgPSBodG1sSWQ7XG4gICAgfVxuXG4gICAgaWYgKHR4dENvbnRlbnQgIT09IG51bGwgJiYgdHh0Q29udGVudCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhdXgudGV4dENvbnRlbnQgPSB0eHRDb250ZW50O1xuICAgIH1cblxuICAgIGlmIChodG1sQ2xhc3MgIT09IG51bGwgJiYgaHRtbENsYXNzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGF1eC5jbGFzc05hbWUgPSBodG1sQ2xhc3M7XG4gICAgfVxuXG4gICAgaWYgKGh0bWxTcmMgIT09IG51bGwgJiYgaHRtbFNyYyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBhdXguc3JjID0gaHRtbFNyYztcbiAgICB9XG5cbiAgICByZXR1cm4gYXV4O1xuICB9XG5cbiAgZnVuY3Rpb24gZ2V0VGVtcFNpZ24oKSB7XG4gICAgY29uc3QgZGl2V2l0aFNpZ24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQnKTtcblxuICAgIHJldHVybiAnICcgKyBkaXZXaXRoU2lnbi50ZXh0Q29udGVudDtcbiAgfVxuXG4gIGNvbnN0IGNsZWFuQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgIHdoaWxlICh3ZWF0aGVyQ2FudmFzLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHdlYXRoZXJDYW52YXMucmVtb3ZlQ2hpbGQod2VhdGhlckNhbnZhcy5maXJzdENoaWxkKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHsgc2V0V2VhdGhlciB9O1xufSkoKTtcblxuZXhwb3J0IHsgbWFuYWdlRE9NIH07XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi4vaW1nL2NsZWFyY2xvdWR5LmpwZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Q29taWMrTmV1ZSZmYW1pbHk9SzJEOml0YWwsd2dodEAxLDMwMCZmYW1pbHk9S3Jlb246d2dodEA1MDAmZmFtaWx5PU1vbnRzZXJyYXQ6d2dodEAzMDAmZmFtaWx5PVJlZW5pZStCZWFuaWUmZGlzcGxheT1zd2FwKTtcIl0pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi8qIGZvbnQgZmFtaWxpZXMgKi9cXG4vKlxcbmZvbnQtZmFtaWx5OiAnQ29taWMgTmV1ZScsIGN1cnNpdmU7XFxuZm9udC1mYW1pbHk6ICdLMkQnLCBzYW5zLXNlcmlmO1xcbmZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG5mb250LWZhbWlseTogJ01vbnRzZXJyYXQnLCBzYW5zLXNlcmlmO1xcbmZvbnQtZmFtaWx5OiAnUmVlbmllIEJlYW5pZScsIGN1cnNpdmU7Ki9cXG5ib2R5IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJhY2tncm91bmQ6IHVybChcIiArIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gKyBcIikgbm8tcmVwZWF0IGNlbnRlciBmaXhlZDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogYXV0bztcXG4gIG1heC13aWR0aDogODAwcHg7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4uaW52aXNpYmxlIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi52aXNpYmxlLWJsb2NrIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4jc2VhcmNoLWRpdiB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcbn1cXG4jc2VhcmNoLWRpdiAjaW5wdXQtY2l0eSB7XFxuICBmb250LWZhbWlseTogXFxcIktyZW9uXFxcIiwgc2VyaWY7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwYWRkaW5nOiAxMnB4IDIwcHg7XFxuICBtYXJnaW46IDhweCAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRibHVlO1xcbiAgZm9udC1zaXplOiAyMnB4O1xcbn1cXG4jc2VhcmNoLWRpdiAjaW5wdXQtY2l0eTpmb2N1cyB7XFxuICBib3JkZXI6IDNweCBzb2xpZCAjNTU1O1xcbn1cXG4jc2VhcmNoLWRpdiAjaW5wdXQtZmVlZGJhY2sge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHBhZGRpbmc6IDEycHggMjBweDtcXG4gIG1hcmdpbjogOHB4IDA7XFxuICBmb250LXNpemU6IDIwcHg7XFxuICBib3JkZXI6IDNweCBzb2xpZCByZ2IoMTkyLCAxMTgsIDExOCk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZXNtb2tlO1xcbiAgY29sb3I6IHJlZDtcXG59XFxuI3NlYXJjaC1kaXYgI3VuaXRzLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcXG4gIGdhcDogMTBweDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxufVxcbiNzZWFyY2gtZGl2ICN1bml0cy1jb250YWluZXIgI21ldHJpYyxcXG4jc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyICNpbXBlcmlhbCxcXG4jc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyICNzdGFuZGFyZCB7XFxuICBhc3BlY3QtcmF0aW86IDE7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktaXRlbXM6IGJhc2VsaW5lO1xcbiAgYm9yZGVyOiAzcHggc29saWQgIzU1NTtcXG4gIGhlaWdodDogMTAwcHg7XFxuICBmb250LXNpemU6IDgwcHg7XFxuICBiYWNrZ3JvdW5kOiB3aGl0ZXNtb2tlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4jc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyIC5zZWxlY3RlZCB7XFxuICBiYWNrZ3JvdW5kOiByZ2IoMCwgMCwgOTkpICFpbXBvcnRhbnQ7XFxuICBjb2xvcjogd2hpdGUgIWltcG9ydGFudDtcXG4gIGJvcmRlcjogM3B4IHNvbGlkIHJnYigxOTEsIDIwMSwgMjU1KSAhaW1wb3J0YW50O1xcbiAgb3V0bGluZTogMXB4IHNvbGlkIHJnYigyNDIsIDI0MiwgMjU1KSAhaW1wb3J0YW50O1xcbn1cXG5cXG4jd2VhdGhlci1jYW52YXMge1xcbiAgbWFyZ2luOiAxMHB4IGF1dG87XFxuICBwYWRkaW5nOiA1cHg7XFxuICBtYXgtd2lkdGg6IDUwMHB4O1xcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjQwNCk7XFxuICBjb2xvcjogd2hpdGVzbW9rZTtcXG59XFxuI3dlYXRoZXItY2FudmFzICN3bG9jYXRpb24ge1xcbiAgZm9udC1zaXplOiA3MHB4O1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiS3Jlb25cXFwiLCBzZXJpZjtcXG59XFxuI3dlYXRoZXItY2FudmFzICN3ZGVzYyB7XFxuICBmb250LXNpemU6IDYwcHg7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJNb250c2VycmF0XFxcIiwgc2Fucy1zZXJpZjtcXG59XFxuI3dlYXRoZXItY2FudmFzICN3aW1hZyB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI3d0ZW1wIHtcXG4gIGZvbnQtc2l6ZTogNDBweDtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LWZhbWlseTogXFxcIk1vbnRzZXJyYXRcXFwiLCBzYW5zLXNlcmlmO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI3d0aGVybWFsIHtcXG4gIGZvbnQtc2l6ZTogNDBweDtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBjb2xvcjogcmdiKDk4LCAyNDgsIDk4KTtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiTW9udHNlcnJhdFxcXCIsIHNhbnMtc2VyaWY7XFxufVxcbiN3ZWF0aGVyLWNhbnZhcyAjZm9vdC13ZWF0aGVyLWRhdGEge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiS3Jlb25cXFwiLCBzZXJpZjtcXG59XFxuI3dlYXRoZXItY2FudmFzICNmb290LXdlYXRoZXItZGF0YSAjbGVmdC1jb250YWluZXIge1xcbiAganVzdGlmeS1zZWxmOiBzdGFydDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxZnI7XFxuICBqdXN0aWZ5LWl0ZW1zOiBsZWZ0O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuI3dlYXRoZXItY2FudmFzICNmb290LXdlYXRoZXItZGF0YSAjcmlnaHQtY29udGFpbmVyIHtcXG4gIGp1c3RpZnktc2VsZjogZW5kO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmcjtcXG4gIGp1c3RpZnktaXRlbXM6IHJpZ2h0O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuI3dlYXRoZXItY2FudmFzICNmb290LXdlYXRoZXItZGF0YSBpbWcge1xcbiAgaGVpZ2h0OiA1MHB4O1xcbn1cXG5cXG4jY3JlZGl0cyB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDA7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMTI4LCAwLjI2Nyk7XFxuICBmb250LXNpemU6IDIycHg7XFxuICBjb2xvcjogbmF2eTtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiSzJEXFxcIiwgc2Fucy1zZXJpZjtcXG59XFxuI2NyZWRpdHMgYSB7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgZm9udC1zaXplOiAxOHB4O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBjb2xvcjogbmF2eTtcXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDYwMHB4KSB7XFxuICAjc2VhcmNoLWRpdiAjaW5wdXQtY2l0eSB7XFxuICAgIHdpZHRoOiAzMDBweDtcXG4gICAgZm9udC1zaXplOiAxNXB4O1xcbiAgfVxcbiAgI3NlYXJjaC1kaXYgI3VuaXRzLWNvbnRhaW5lciAjbWV0cmljLFxcbiAgI3NlYXJjaC1kaXYgI3VuaXRzLWNvbnRhaW5lciAjaW1wZXJpYWwsXFxuICAjc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyICNzdGFuZGFyZCB7XFxuICAgIGhlaWdodDogNjBweDtcXG4gICAgZm9udC1zaXplOiA1MHB4O1xcbiAgfVxcbiAgI3dlYXRoZXItY2FudmFzICN3bG9jYXRpb24ge1xcbiAgICBmb250LXNpemU6IDJyZW07XFxuICB9XFxuICAjd2VhdGhlci1jYW52YXMgI3dkZXNjIHtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxuICB9XFxuICAjd2VhdGhlci1jYW52YXMgI3d0ZW1wIHtcXG4gICAgZm9udC1zaXplOiAxLjVyZW07XFxuICB9XFxuICAjd2VhdGhlci1jYW52YXMgI3d0aGVybWFsIHtcXG4gICAgZm9udC1zaXplOiAxcmVtO1xcbiAgfVxcbiAgI2NyZWRpdHMgYSB7XFxuICAgIGZvbnQtc2l6ZTogMTNweDtcXG4gIH1cXG59XCIsIFwiXCIse1widmVyc2lvblwiOjMsXCJzb3VyY2VzXCI6W1wid2VicGFjazovLy4vc3JjL2Nzcy9zdHlsZXMuc2Nzc1wiXSxcIm5hbWVzXCI6W10sXCJtYXBwaW5nc1wiOlwiQUFBQSxrQkFBQTtBQUVBOzs7Ozt1Q0FBQTtBQU1BO0VBQ0Usa0JBQUE7RUFDQSwwRUFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsYUFBQTtBQUNGOztBQUNBO0VBQ0UsYUFBQTtBQUVGOztBQUNBO0VBQ0UsY0FBQTtBQUVGOztBQUNBO0VBQ0Usa0JBQUE7RUFDQSxtQkFBQTtBQUVGO0FBQUU7RUFNRSwyQkFBQTtFQUVBLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBRUEsMkJBQUE7RUFDQSxlQUFBO0FBTEo7QUFNSTtFQUNFLHNCQUFBO0FBSk47QUFRRTtFQUNFLHNCQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsZUFBQTtFQUNBLG9DQUFBO0VBQ0EsNEJBQUE7RUFDQSxVQUFBO0FBTko7QUFTRTtFQUNFLGFBQUE7RUFDQSxrQ0FBQTtFQUNBLFNBQUE7RUFDQSxtQkFBQTtFQUNBLHFCQUFBO0FBUEo7QUFTSTs7O0VBR0UsZUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0Esc0JBQUE7RUFDQSxhQUFBO0VBQ0EsZUFBQTtFQUNBLHNCQUFBO0VBRUEsZUFBQTtBQVJOO0FBVUk7RUFDRSxvQ0FBQTtFQUNBLHVCQUFBO0VBQ0EsK0NBQUE7RUFDQSxnREFBQTtBQVJOOztBQWFBO0VBQ0UsaUJBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQ0FBQTtFQUNBLGlCQUFBO0FBVkY7QUFZRTtFQUNFLGVBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLDJCQUFBO0FBVko7QUFhRTtFQUNFLGVBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLHFDQUFBO0FBWEo7QUFhRTtFQUNFLFNBQUE7RUFDQSxVQUFBO0FBWEo7QUFhRTtFQUNFLGVBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLHFDQUFBO0FBWEo7QUFjRTtFQUNFLGVBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLHVCQUFBO0VBQ0EscUNBQUE7QUFaSjtBQWVFO0VBQ0UsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsMkJBQUE7QUFiSjtBQWVJO0VBQ0UsbUJBQUE7RUFDQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSwyQkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7QUFiTjtBQWVJO0VBQ0UsaUJBQUE7RUFDQSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSwyQkFBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7QUFiTjtBQWVJO0VBQ0UsWUFBQTtBQWJOOztBQWtCQTtFQUNFLGtCQUFBO0VBQ0EsU0FBQTtFQUNBLFdBQUE7RUFDQSx3Q0FBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBRUEsOEJBQUE7QUFoQkY7QUFrQkU7RUFDRSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxjQUFBO0VBQ0EsV0FBQTtBQWhCSjs7QUFvQkE7RUFFSTtJQUNFLFlBQUE7SUFDQSxlQUFBO0VBbEJKO0VBcUJJOzs7SUFHRSxZQUFBO0lBQ0EsZUFBQTtFQW5CTjtFQXlCRTtJQUNFLGVBQUE7RUF2Qko7RUEwQkU7SUFDRSxpQkFBQTtFQXhCSjtFQTJCRTtJQUNFLGlCQUFBO0VBekJKO0VBNEJFO0lBQ0UsZUFBQTtFQTFCSjtFQStCRTtJQUNFLGVBQUE7RUE3Qko7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBmb250IGZhbWlsaWVzICovXFxuQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Q29taWMrTmV1ZSZmYW1pbHk9SzJEOml0YWwsd2dodEAxLDMwMCZmYW1pbHk9S3Jlb246d2dodEA1MDAmZmFtaWx5PU1vbnRzZXJyYXQ6d2dodEAzMDAmZmFtaWx5PVJlZW5pZStCZWFuaWUmZGlzcGxheT1zd2FwJyk7XFxuLypcXG5mb250LWZhbWlseTogJ0NvbWljIE5ldWUnLCBjdXJzaXZlO1xcbmZvbnQtZmFtaWx5OiAnSzJEJywgc2Fucy1zZXJpZjtcXG5mb250LWZhbWlseTogJ0tyZW9uJywgc2VyaWY7XFxuZm9udC1mYW1pbHk6ICdNb250c2VycmF0Jywgc2Fucy1zZXJpZjtcXG5mb250LWZhbWlseTogJ1JlZW5pZSBCZWFuaWUnLCBjdXJzaXZlOyovXFxuYm9keSB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBiYWNrZ3JvdW5kOiB1cmwoJy4uL2ltZy9jbGVhcmNsb3VkeS5qcGcnKSBuby1yZXBlYXQgY2VudGVyIGZpeGVkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgbWF4LXdpZHRoOiA4MDBweDtcXG4gIGhlaWdodDogMTAwdmg7XFxufVxcbi5pbnZpc2libGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLnZpc2libGUtYmxvY2sge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbiNzZWFyY2gtZGl2IHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxuXFxuICAjaW5wdXQtY2l0eSB7XFxuICAgIC8vIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vaW1nL21hZ25pZnlpbmdnbGFzcy5wbmcnKTtcXG4gICAgLy8gYmFja2dyb3VuZC1wb3NpdGlvbjogMTBweCAxMHB4O1xcbiAgICAvLyBiYWNrZ3JvdW5kLXNpemU6IDMxcHg7XFxuICAgIC8vIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuXFxuICAgIGZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG5cXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgcGFkZGluZzogMTJweCAyMHB4O1xcbiAgICBtYXJnaW46IDhweCAwO1xcblxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XFxuICAgIGZvbnQtc2l6ZTogMjJweDtcXG4gICAgJjpmb2N1cyB7XFxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzU1NTtcXG4gICAgfVxcbiAgfVxcblxcbiAgI2lucHV0LWZlZWRiYWNrIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgcGFkZGluZzogMTJweCAyMHB4O1xcbiAgICBtYXJnaW46IDhweCAwO1xcbiAgICBmb250LXNpemU6IDIwcHg7XFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIHJnYigxOTIsIDExOCwgMTE4KTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGVzbW9rZTtcXG4gICAgY29sb3I6IHJlZDtcXG4gIH1cXG5cXG4gICN1bml0cy1jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyO1xcbiAgICBnYXA6IDEwcHg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG5cXG4gICAgI21ldHJpYyxcXG4gICAgI2ltcGVyaWFsLFxcbiAgICAjc3RhbmRhcmQge1xcbiAgICAgIGFzcGVjdC1yYXRpbzogMTtcXG4gICAgICBkaXNwbGF5OiBncmlkO1xcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgICAganVzdGlmeS1pdGVtczogYmFzZWxpbmU7XFxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzU1NTtcXG4gICAgICBoZWlnaHQ6IDEwMHB4O1xcbiAgICAgIGZvbnQtc2l6ZTogODBweDtcXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZXNtb2tlO1xcblxcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgfVxcbiAgICAuc2VsZWN0ZWQge1xcbiAgICAgIGJhY2tncm91bmQ6IHJnYigwLCAwLCA5OSkgIWltcG9ydGFudDtcXG4gICAgICBjb2xvcjogd2hpdGUgIWltcG9ydGFudDtcXG4gICAgICBib3JkZXI6IDNweCBzb2xpZCByZ2IoMTkxLCAyMDEsIDI1NSkgIWltcG9ydGFudDtcXG4gICAgICBvdXRsaW5lOiAxcHggc29saWQgcmdiKDI0MiwgMjQyLCAyNTUpICFpbXBvcnRhbnQ7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuI3dlYXRoZXItY2FudmFzIHtcXG4gIG1hcmdpbjogMTBweCBhdXRvO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgbWF4LXdpZHRoOiA1MDBweDtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC40MDQpO1xcbiAgY29sb3I6IHdoaXRlc21va2U7XFxuXFxuICAjd2xvY2F0aW9uIHtcXG4gICAgZm9udC1zaXplOiA3MHB4O1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG4gIH1cXG5cXG4gICN3ZGVzYyB7XFxuICAgIGZvbnQtc2l6ZTogNjBweDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBmb250LWZhbWlseTogJ01vbnRzZXJyYXQnLCBzYW5zLXNlcmlmO1xcbiAgfVxcbiAgI3dpbWFnIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgfVxcbiAgI3d0ZW1wIHtcXG4gICAgZm9udC1zaXplOiA0MHB4O1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGZvbnQtZmFtaWx5OiAnTW9udHNlcnJhdCcsIHNhbnMtc2VyaWY7XFxuICB9XFxuXFxuICAjd3RoZXJtYWwge1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgY29sb3I6IHJnYig5OCwgMjQ4LCA5OCk7XFxuICAgIGZvbnQtZmFtaWx5OiAnTW9udHNlcnJhdCcsIHNhbnMtc2VyaWY7XFxuICB9XFxuXFxuICAjZm9vdC13ZWF0aGVyLWRhdGEge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICAgIGZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG5cXG4gICAgI2xlZnQtY29udGFpbmVyIHtcXG4gICAgICBqdXN0aWZ5LXNlbGY6IHN0YXJ0O1xcbiAgICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcbiAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmcjtcXG4gICAgICBqdXN0aWZ5LWl0ZW1zOiBsZWZ0O1xcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIH1cXG4gICAgI3JpZ2h0LWNvbnRhaW5lciB7XFxuICAgICAganVzdGlmeS1zZWxmOiBlbmQ7XFxuICAgICAgZGlzcGxheTogZ3JpZDtcXG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyO1xcbiAgICAgIGp1c3RpZnktaXRlbXM6IHJpZ2h0O1xcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIH1cXG4gICAgaW1nIHtcXG4gICAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuI2NyZWRpdHMge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm90dG9tOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDEyOCwgMC4yNjcpO1xcbiAgZm9udC1zaXplOiAyMnB4O1xcbiAgY29sb3I6IG5hdnk7XFxuXFxuICBmb250LWZhbWlseTogJ0syRCcsIHNhbnMtc2VyaWY7XFxuXFxuICBhIHtcXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcXG4gICAgZm9udC1zaXplOiAxOHB4O1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgY29sb3I6IG5hdnk7XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiA2MDBweCkge1xcbiAgI3NlYXJjaC1kaXYge1xcbiAgICAjaW5wdXQtY2l0eSB7XFxuICAgICAgd2lkdGg6IDMwMHB4O1xcbiAgICAgIGZvbnQtc2l6ZTogMTVweDtcXG4gICAgfVxcbiAgICAjdW5pdHMtY29udGFpbmVyIHtcXG4gICAgICAjbWV0cmljLFxcbiAgICAgICNpbXBlcmlhbCxcXG4gICAgICAjc3RhbmRhcmQge1xcbiAgICAgICAgaGVpZ2h0OiA2MHB4O1xcbiAgICAgICAgZm9udC1zaXplOiA1MHB4O1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcblxcbiAgI3dlYXRoZXItY2FudmFzIHtcXG4gICAgI3dsb2NhdGlvbiB7XFxuICAgICAgZm9udC1zaXplOiAycmVtO1xcbiAgICB9XFxuXFxuICAgICN3ZGVzYyB7XFxuICAgICAgZm9udC1zaXplOiAxLjVyZW07XFxuICAgIH1cXG5cXG4gICAgI3d0ZW1wIHtcXG4gICAgICBmb250LXNpemU6IDEuNXJlbTtcXG4gICAgfVxcblxcbiAgICAjd3RoZXJtYWwge1xcbiAgICAgIGZvbnQtc2l6ZTogMXJlbTtcXG4gICAgfVxcbiAgfVxcblxcbiAgI2NyZWRpdHMge1xcbiAgICBhIHtcXG4gICAgICBmb250LXNpemU6IDEzcHg7XFxuICAgIH1cXG4gIH1cXG59XFxuXCJdLFwic291cmNlUm9vdFwiOlwiXCJ9XSk7XG4vLyBFeHBvcnRzXG5leHBvcnQgZGVmYXVsdCBfX19DU1NfTE9BREVSX0VYUE9SVF9fXztcbiIsIlwidXNlIHN0cmljdFwiO1xuXG4vKlxuICBNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuICBBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzV2l0aE1hcHBpbmdUb1N0cmluZykge1xuICB2YXIgbGlzdCA9IFtdO1xuXG4gIC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcbiAgbGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuICAgIHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgdmFyIGNvbnRlbnQgPSBcIlwiO1xuICAgICAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBpdGVtWzVdICE9PSBcInVuZGVmaW5lZFwiO1xuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgY29udGVudCArPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0pO1xuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bMl0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICByZXR1cm4gY29udGVudDtcbiAgICB9KS5qb2luKFwiXCIpO1xuICB9O1xuXG4gIC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG4gIGxpc3QuaSA9IGZ1bmN0aW9uIGkobW9kdWxlcywgbWVkaWEsIGRlZHVwZSwgc3VwcG9ydHMsIGxheWVyKSB7XG4gICAgaWYgKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKSB7XG4gICAgICBtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCB1bmRlZmluZWRdXTtcbiAgICB9XG4gICAgdmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcbiAgICBpZiAoZGVkdXBlKSB7XG4gICAgICBmb3IgKHZhciBrID0gMDsgayA8IHRoaXMubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgdmFyIGlkID0gdGhpc1trXVswXTtcbiAgICAgICAgaWYgKGlkICE9IG51bGwpIHtcbiAgICAgICAgICBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgZm9yICh2YXIgX2sgPSAwOyBfayA8IG1vZHVsZXMubGVuZ3RoOyBfaysrKSB7XG4gICAgICB2YXIgaXRlbSA9IFtdLmNvbmNhdChtb2R1bGVzW19rXSk7XG4gICAgICBpZiAoZGVkdXBlICYmIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcbiAgICAgICAgY29udGludWU7XG4gICAgICB9XG4gICAgICBpZiAodHlwZW9mIGxheWVyICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgIGlmICh0eXBlb2YgaXRlbVs1XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNV0gPSBsYXllcjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKG1lZGlhKSB7XG4gICAgICAgIGlmICghaXRlbVsyXSkge1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChzdXBwb3J0cykge1xuICAgICAgICBpZiAoIWl0ZW1bNF0pIHtcbiAgICAgICAgICBpdGVtWzRdID0gXCJcIi5jb25jYXQoc3VwcG9ydHMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KGl0ZW1bNF0sIFwiKSB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs0XSA9IHN1cHBvcnRzO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBsaXN0LnB1c2goaXRlbSk7XG4gICAgfVxuICB9O1xuICByZXR1cm4gbGlzdDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHVybCwgb3B0aW9ucykge1xuICBpZiAoIW9wdGlvbnMpIHtcbiAgICBvcHRpb25zID0ge307XG4gIH1cbiAgaWYgKCF1cmwpIHtcbiAgICByZXR1cm4gdXJsO1xuICB9XG4gIHVybCA9IFN0cmluZyh1cmwuX19lc01vZHVsZSA/IHVybC5kZWZhdWx0IDogdXJsKTtcblxuICAvLyBJZiB1cmwgaXMgYWxyZWFkeSB3cmFwcGVkIGluIHF1b3RlcywgcmVtb3ZlIHRoZW1cbiAgaWYgKC9eWydcIl0uKlsnXCJdJC8udGVzdCh1cmwpKSB7XG4gICAgdXJsID0gdXJsLnNsaWNlKDEsIC0xKTtcbiAgfVxuICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgdXJsICs9IG9wdGlvbnMuaGFzaDtcbiAgfVxuXG4gIC8vIFNob3VsZCB1cmwgYmUgd3JhcHBlZD9cbiAgLy8gU2VlIGh0dHBzOi8vZHJhZnRzLmNzc3dnLm9yZy9jc3MtdmFsdWVzLTMvI3VybHNcbiAgaWYgKC9bXCInKCkgXFx0XFxuXXwoJTIwKS8udGVzdCh1cmwpIHx8IG9wdGlvbnMubmVlZFF1b3Rlcykge1xuICAgIHJldHVybiBcIlxcXCJcIi5jb25jYXQodXJsLnJlcGxhY2UoL1wiL2csICdcXFxcXCInKS5yZXBsYWNlKC9cXG4vZywgXCJcXFxcblwiKSwgXCJcXFwiXCIpO1xuICB9XG4gIHJldHVybiB1cmw7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChpdGVtKSB7XG4gIHZhciBjb250ZW50ID0gaXRlbVsxXTtcbiAgdmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuICBpZiAoIWNzc01hcHBpbmcpIHtcbiAgICByZXR1cm4gY29udGVudDtcbiAgfVxuICBpZiAodHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShjc3NNYXBwaW5nKSkpKTtcbiAgICB2YXIgZGF0YSA9IFwic291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsXCIuY29uY2F0KGJhc2U2NCk7XG4gICAgdmFyIHNvdXJjZU1hcHBpbmcgPSBcIi8qIyBcIi5jb25jYXQoZGF0YSwgXCIgKi9cIik7XG4gICAgdmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcbiAgICAgIHJldHVybiBcIi8qIyBzb3VyY2VVUkw9XCIuY29uY2F0KGNzc01hcHBpbmcuc291cmNlUm9vdCB8fCBcIlwiKS5jb25jYXQoc291cmNlLCBcIiAqL1wiKTtcbiAgICB9KTtcbiAgICByZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKFwiXFxuXCIpO1xuICB9XG4gIHJldHVybiBbY29udGVudF0uam9pbihcIlxcblwiKTtcbn07IiwiXG4gICAgICBpbXBvcnQgQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5qZWN0U3R5bGVzSW50b1N0eWxlVGFnLmpzXCI7XG4gICAgICBpbXBvcnQgZG9tQVBJIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVEb21BUEkuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRGbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanNcIjtcbiAgICAgIGltcG9ydCBzZXRBdHRyaWJ1dGVzIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0U3R5bGVFbGVtZW50IGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzXCI7XG4gICAgICBpbXBvcnQgc3R5bGVUYWdUcmFuc2Zvcm1GbiBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlVGFnVHJhbnNmb3JtLmpzXCI7XG4gICAgICBpbXBvcnQgY29udGVudCwgKiBhcyBuYW1lZEV4cG9ydCBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuc2Nzc1wiO1xuICAgICAgXG4gICAgICBcblxudmFyIG9wdGlvbnMgPSB7fTtcblxub3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybSA9IHN0eWxlVGFnVHJhbnNmb3JtRm47XG5vcHRpb25zLnNldEF0dHJpYnV0ZXMgPSBzZXRBdHRyaWJ1dGVzO1xuXG4gICAgICBvcHRpb25zLmluc2VydCA9IGluc2VydEZuLmJpbmQobnVsbCwgXCJoZWFkXCIpO1xuICAgIFxub3B0aW9ucy5kb21BUEkgPSBkb21BUEk7XG5vcHRpb25zLmluc2VydFN0eWxlRWxlbWVudCA9IGluc2VydFN0eWxlRWxlbWVudDtcblxudmFyIHVwZGF0ZSA9IEFQSShjb250ZW50LCBvcHRpb25zKTtcblxuXG5cbmV4cG9ydCAqIGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5zY3NzXCI7XG4gICAgICAgZXhwb3J0IGRlZmF1bHQgY29udGVudCAmJiBjb250ZW50LmxvY2FscyA/IGNvbnRlbnQubG9jYWxzIDogdW5kZWZpbmVkO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBzdHlsZXNJbkRPTSA9IFtdO1xuXG5mdW5jdGlvbiBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKSB7XG4gIHZhciByZXN1bHQgPSAtMTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0eWxlc0luRE9NLmxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKHN0eWxlc0luRE9NW2ldLmlkZW50aWZpZXIgPT09IGlkZW50aWZpZXIpIHtcbiAgICAgIHJlc3VsdCA9IGk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucykge1xuICB2YXIgaWRDb3VudE1hcCA9IHt9O1xuICB2YXIgaWRlbnRpZmllcnMgPSBbXTtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV07XG4gICAgdmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG4gICAgdmFyIGNvdW50ID0gaWRDb3VudE1hcFtpZF0gfHwgMDtcbiAgICB2YXIgaWRlbnRpZmllciA9IFwiXCIuY29uY2F0KGlkLCBcIiBcIikuY29uY2F0KGNvdW50KTtcbiAgICBpZENvdW50TWFwW2lkXSA9IGNvdW50ICsgMTtcbiAgICB2YXIgaW5kZXhCeUlkZW50aWZpZXIgPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICB2YXIgb2JqID0ge1xuICAgICAgY3NzOiBpdGVtWzFdLFxuICAgICAgbWVkaWE6IGl0ZW1bMl0sXG4gICAgICBzb3VyY2VNYXA6IGl0ZW1bM10sXG4gICAgICBzdXBwb3J0czogaXRlbVs0XSxcbiAgICAgIGxheWVyOiBpdGVtWzVdXG4gICAgfTtcblxuICAgIGlmIChpbmRleEJ5SWRlbnRpZmllciAhPT0gLTEpIHtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS5yZWZlcmVuY2VzKys7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0udXBkYXRlcihvYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgdXBkYXRlciA9IGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpO1xuICAgICAgb3B0aW9ucy5ieUluZGV4ID0gaTtcbiAgICAgIHN0eWxlc0luRE9NLnNwbGljZShpLCAwLCB7XG4gICAgICAgIGlkZW50aWZpZXI6IGlkZW50aWZpZXIsXG4gICAgICAgIHVwZGF0ZXI6IHVwZGF0ZXIsXG4gICAgICAgIHJlZmVyZW5jZXM6IDFcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGlkZW50aWZpZXJzLnB1c2goaWRlbnRpZmllcik7XG4gIH1cblxuICByZXR1cm4gaWRlbnRpZmllcnM7XG59XG5cbmZ1bmN0aW9uIGFkZEVsZW1lbnRTdHlsZShvYmosIG9wdGlvbnMpIHtcbiAgdmFyIGFwaSA9IG9wdGlvbnMuZG9tQVBJKG9wdGlvbnMpO1xuICBhcGkudXBkYXRlKG9iaik7XG5cbiAgdmFyIHVwZGF0ZXIgPSBmdW5jdGlvbiB1cGRhdGVyKG5ld09iaikge1xuICAgIGlmIChuZXdPYmopIHtcbiAgICAgIGlmIChuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXAgJiYgbmV3T2JqLnN1cHBvcnRzID09PSBvYmouc3VwcG9ydHMgJiYgbmV3T2JqLmxheWVyID09PSBvYmoubGF5ZXIpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuXG4gICAgICBhcGkudXBkYXRlKG9iaiA9IG5ld09iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFwaS5yZW1vdmUoKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHVwZGF0ZXI7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGxpc3QsIG9wdGlvbnMpIHtcbiAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gIGxpc3QgPSBsaXN0IHx8IFtdO1xuICB2YXIgbGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpO1xuICByZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcbiAgICBuZXdMaXN0ID0gbmV3TGlzdCB8fCBbXTtcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tpXTtcbiAgICAgIHZhciBpbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhdLnJlZmVyZW5jZXMtLTtcbiAgICB9XG5cbiAgICB2YXIgbmV3TGFzdElkZW50aWZpZXJzID0gbW9kdWxlc1RvRG9tKG5ld0xpc3QsIG9wdGlvbnMpO1xuXG4gICAgZm9yICh2YXIgX2kgPSAwOyBfaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IF9pKyspIHtcbiAgICAgIHZhciBfaWRlbnRpZmllciA9IGxhc3RJZGVudGlmaWVyc1tfaV07XG5cbiAgICAgIHZhciBfaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihfaWRlbnRpZmllcik7XG5cbiAgICAgIGlmIChzdHlsZXNJbkRPTVtfaW5kZXhdLnJlZmVyZW5jZXMgPT09IDApIHtcbiAgICAgICAgc3R5bGVzSW5ET01bX2luZGV4XS51cGRhdGVyKCk7XG5cbiAgICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKF9pbmRleCwgMSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbGFzdElkZW50aWZpZXJzID0gbmV3TGFzdElkZW50aWZpZXJzO1xuICB9O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIG1lbW8gPSB7fTtcbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5mdW5jdGlvbiBnZXRUYXJnZXQodGFyZ2V0KSB7XG4gIGlmICh0eXBlb2YgbWVtb1t0YXJnZXRdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgdmFyIHN0eWxlVGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0YXJnZXQpOyAvLyBTcGVjaWFsIGNhc2UgdG8gcmV0dXJuIGhlYWQgb2YgaWZyYW1lIGluc3RlYWQgb2YgaWZyYW1lIGl0c2VsZlxuXG4gICAgaWYgKHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCAmJiBzdHlsZVRhcmdldCBpbnN0YW5jZW9mIHdpbmRvdy5IVE1MSUZyYW1lRWxlbWVudCkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyB3aWxsIHRocm93IGFuIGV4Y2VwdGlvbiBpZiBhY2Nlc3MgdG8gaWZyYW1lIGlzIGJsb2NrZWRcbiAgICAgICAgLy8gZHVlIHRvIGNyb3NzLW9yaWdpbiByZXN0cmljdGlvbnNcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBzdHlsZVRhcmdldC5jb250ZW50RG9jdW1lbnQuaGVhZDtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgLy8gaXN0YW5idWwgaWdub3JlIG5leHRcbiAgICAgICAgc3R5bGVUYXJnZXQgPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIG1lbW9bdGFyZ2V0XSA9IHN0eWxlVGFyZ2V0O1xuICB9XG5cbiAgcmV0dXJuIG1lbW9bdGFyZ2V0XTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGluc2VydEJ5U2VsZWN0b3IoaW5zZXJ0LCBzdHlsZSkge1xuICB2YXIgdGFyZ2V0ID0gZ2V0VGFyZ2V0KGluc2VydCk7XG5cbiAgaWYgKCF0YXJnZXQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydCcgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuICB9XG5cbiAgdGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRCeVNlbGVjdG9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKSB7XG4gIHZhciBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuICBvcHRpb25zLnNldEF0dHJpYnV0ZXMoZWxlbWVudCwgb3B0aW9ucy5hdHRyaWJ1dGVzKTtcbiAgb3B0aW9ucy5pbnNlcnQoZWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbiAgcmV0dXJuIGVsZW1lbnQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0U3R5bGVFbGVtZW50OyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcyhzdHlsZUVsZW1lbnQpIHtcbiAgdmFyIG5vbmNlID0gdHlwZW9mIF9fd2VicGFja19ub25jZV9fICE9PSBcInVuZGVmaW5lZFwiID8gX193ZWJwYWNrX25vbmNlX18gOiBudWxsO1xuXG4gIGlmIChub25jZSkge1xuICAgIHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJub25jZVwiLCBub25jZSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXM7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcbiAgdmFyIGNzcyA9IFwiXCI7XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIkBzdXBwb3J0cyAoXCIuY29uY2F0KG9iai5zdXBwb3J0cywgXCIpIHtcIik7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwiQG1lZGlhIFwiLmNvbmNhdChvYmoubWVkaWEsIFwiIHtcIik7XG4gIH1cblxuICB2YXIgbmVlZExheWVyID0gdHlwZW9mIG9iai5sYXllciAhPT0gXCJ1bmRlZmluZWRcIjtcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwiQGxheWVyXCIuY29uY2F0KG9iai5sYXllci5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KG9iai5sYXllcikgOiBcIlwiLCBcIiB7XCIpO1xuICB9XG5cbiAgY3NzICs9IG9iai5jc3M7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgdmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cbiAgaWYgKHNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgIGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIuY29uY2F0KGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSksIFwiICovXCIpO1xuICB9IC8vIEZvciBvbGQgSUVcblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgaWYgICovXG5cblxuICBvcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG4gIC8vIGlzdGFuYnVsIGlnbm9yZSBpZlxuICBpZiAoc3R5bGVFbGVtZW50LnBhcmVudE5vZGUgPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gZG9tQVBJKG9wdGlvbnMpIHtcbiAgdmFyIHN0eWxlRWxlbWVudCA9IG9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuICByZXR1cm4ge1xuICAgIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKG9iaikge1xuICAgICAgYXBwbHkoc3R5bGVFbGVtZW50LCBvcHRpb25zLCBvYmopO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbiByZW1vdmUoKSB7XG4gICAgICByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcbiAgICB9XG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZG9tQVBJOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIHN0eWxlVGFnVHJhbnNmb3JtKGNzcywgc3R5bGVFbGVtZW50KSB7XG4gIGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuICAgIHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG4gIH0gZWxzZSB7XG4gICAgd2hpbGUgKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG4gICAgICBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuICAgIH1cblxuICAgIHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHN0eWxlVGFnVHJhbnNmb3JtOyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0aWQ6IG1vZHVsZUlkLFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0obW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gKG1vZHVsZVsnZGVmYXVsdCddKSA6XG5cdFx0KCkgPT4gKG1vZHVsZSk7XG5cdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsIHsgYTogZ2V0dGVyIH0pO1xuXHRyZXR1cm4gZ2V0dGVyO1xufTsiLCIvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9ucyBmb3IgaGFybW9ueSBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSAoZXhwb3J0cywgZGVmaW5pdGlvbikgPT4ge1xuXHRmb3IodmFyIGtleSBpbiBkZWZpbml0aW9uKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG5cdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywga2V5LCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZGVmaW5pdGlvbltrZXldIH0pO1xuXHRcdH1cblx0fVxufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmcgPSAoZnVuY3Rpb24oKSB7XG5cdGlmICh0eXBlb2YgZ2xvYmFsVGhpcyA9PT0gJ29iamVjdCcpIHJldHVybiBnbG9iYWxUaGlzO1xuXHR0cnkge1xuXHRcdHJldHVybiB0aGlzIHx8IG5ldyBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXHR9IGNhdGNoIChlKSB7XG5cdFx0aWYgKHR5cGVvZiB3aW5kb3cgPT09ICdvYmplY3QnKSByZXR1cm4gd2luZG93O1xuXHR9XG59KSgpOyIsIl9fd2VicGFja19yZXF1aXJlX18ubyA9IChvYmosIHByb3ApID0+IChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSkiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJ2YXIgc2NyaXB0VXJsO1xuaWYgKF9fd2VicGFja19yZXF1aXJlX18uZy5pbXBvcnRTY3JpcHRzKSBzY3JpcHRVcmwgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcubG9jYXRpb24gKyBcIlwiO1xudmFyIGRvY3VtZW50ID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmRvY3VtZW50O1xuaWYgKCFzY3JpcHRVcmwgJiYgZG9jdW1lbnQpIHtcblx0aWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpXG5cdFx0c2NyaXB0VXJsID0gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5zcmNcblx0aWYgKCFzY3JpcHRVcmwpIHtcblx0XHR2YXIgc2NyaXB0cyA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlUYWdOYW1lKFwic2NyaXB0XCIpO1xuXHRcdGlmKHNjcmlwdHMubGVuZ3RoKSBzY3JpcHRVcmwgPSBzY3JpcHRzW3NjcmlwdHMubGVuZ3RoIC0gMV0uc3JjXG5cdH1cbn1cbi8vIFdoZW4gc3VwcG9ydGluZyBicm93c2VycyB3aGVyZSBhbiBhdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIHlvdSBtdXN0IHNwZWNpZnkgYW4gb3V0cHV0LnB1YmxpY1BhdGggbWFudWFsbHkgdmlhIGNvbmZpZ3VyYXRpb25cbi8vIG9yIHBhc3MgYW4gZW1wdHkgc3RyaW5nIChcIlwiKSBhbmQgc2V0IHRoZSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyB2YXJpYWJsZSBmcm9tIHlvdXIgY29kZSB0byB1c2UgeW91ciBvd24gbG9naWMuXG5pZiAoIXNjcmlwdFVybCkgdGhyb3cgbmV3IEVycm9yKFwiQXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXJcIik7XG5zY3JpcHRVcmwgPSBzY3JpcHRVcmwucmVwbGFjZSgvIy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcPy4qJC8sIFwiXCIpLnJlcGxhY2UoL1xcL1teXFwvXSskLywgXCIvXCIpO1xuX193ZWJwYWNrX3JlcXVpcmVfXy5wID0gc2NyaXB0VXJsOyIsIl9fd2VicGFja19yZXF1aXJlX18uYiA9IGRvY3VtZW50LmJhc2VVUkkgfHwgc2VsZi5sb2NhdGlvbi5ocmVmO1xuXG4vLyBvYmplY3QgdG8gc3RvcmUgbG9hZGVkIGFuZCBsb2FkaW5nIGNodW5rc1xuLy8gdW5kZWZpbmVkID0gY2h1bmsgbm90IGxvYWRlZCwgbnVsbCA9IGNodW5rIHByZWxvYWRlZC9wcmVmZXRjaGVkXG4vLyBbcmVzb2x2ZSwgcmVqZWN0LCBQcm9taXNlXSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwibWFpblwiOiAwXG59O1xuXG4vLyBubyBjaHVuayBvbiBkZW1hbmQgbG9hZGluZ1xuXG4vLyBubyBwcmVmZXRjaGluZ1xuXG4vLyBubyBwcmVsb2FkZWRcblxuLy8gbm8gSE1SXG5cbi8vIG5vIEhNUiBtYW5pZmVzdFxuXG4vLyBubyBvbiBjaHVua3MgbG9hZGVkXG5cbi8vIG5vIGpzb25wIGZ1bmN0aW9uIiwiX193ZWJwYWNrX3JlcXVpcmVfXy5uYyA9IHVuZGVmaW5lZDsiLCIvKiBlc2xpbnQtZW5hYmxlICovXG5pbXBvcnQgJy4vY3NzL3N0eWxlcy5zY3NzJztcbmltcG9ydCB7IG1hbmFnZUZldGNocyB9IGZyb20gJy4vanMvZmV0Y2hEYXRhLmpzJztcbmltcG9ydCB7IG1hbmFnZURPTSB9IGZyb20gJy4vanMvbWFuYWdlRE9NLmpzJztcbi8qIGRlZmluaXRpb25zIGhlcmUgdG8gYmUgYWJsZSB0byB1c2UgZW0gaW5zaWRlIGZ1bmN0aW9ucy4gaXNuJ3QgYSBiZXR0ZXIgd2F5PyAqL1xuY29uc3QgZmVlZGJhY2sgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtZmVlZGJhY2snKTtcbmNvbnN0IGlDaXR5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LWNpdHknKTtcbmNvbnN0IG1ldHJpYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdtZXRyaWMnKTtcbmNvbnN0IGltcGVyaWFsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2ltcGVyaWFsJyk7XG5jb25zdCBzdGFuZGFyZCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdzdGFuZGFyZCcpO1xubGV0IGN1cnJlbnRVbml0ID0gJ21ldHJpYyc7IC8vIGJ5IGRlZmF1bHRcbmxldCBjdXJyZW50Q2l0eSA9ICcnO1xuXG5sb2FkKCk7XG5cbmZ1bmN0aW9uIGxvYWQoKSB7XG4gIHNldExpc3RlbmVycygpO1xufVxuXG5mdW5jdGlvbiBzZXRMaXN0ZW5lcnMoKSB7XG4gIGlDaXR5LmFkZEV2ZW50TGlzdGVuZXIoJ2NoYW5nZScsIHNldENpdHkpO1xuICBtZXRyaWMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZXRVbml0U2VsZWN0ZWQpO1xuICBpbXBlcmlhbC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNldFVuaXRTZWxlY3RlZCk7XG4gIHN0YW5kYXJkLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2V0VW5pdFNlbGVjdGVkKTtcbn1cblxuYXN5bmMgZnVuY3Rpb24gbG9hZFdlYXRoZXIoKSB7XG4gIGlmIChjdXJyZW50Q2l0eSA9PT0gJycgfHwgY3VycmVudENpdHkgPT09IG51bGwgfHwgY3VycmVudENpdHkgPT09IHVuZGVmaW5lZCkge1xuICAgIC8vIElmIG5vIGlucHV0IHdlIGRvIG5vdGhpbmcsIGJ1dCByZW1vdmUgdGhlIGVycm9yIG1zZ1xuICAgIGZlZWRiYWNrLmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgIGZlZWRiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgICByZXR1cm47XG4gIH1cblxuICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IG9idGFpbignd2VhdGhlcicsIGN1cnJlbnRDaXR5LCBjdXJyZW50VW5pdCk7XG5cbiAgaWYgKHdlYXRoZXJEYXRhICE9IG51bGwpIHtcbiAgICBtYW5hZ2VET00uc2V0V2VhdGhlcih3ZWF0aGVyRGF0YSk7XG4gICAgZmVlZGJhY2sudGV4dENvbnRlbnQgPSAnJztcbiAgICBmZWVkYmFjay5jbGFzc0xpc3QuYWRkKCdpbnZpc2libGUnKTtcbiAgICBmZWVkYmFjay5jbGFzc0xpc3QucmVtb3ZlKCd2aXNpYmxlJyk7XG4gIH0gZWxzZSB7XG4gICAgZmVlZGJhY2sudGV4dENvbnRlbnQgPSBcIldlIGNvdWxkbid0IGZpbmQgdGhlIGNpdHkgeW91J3JlIGxvb2tpbmcgZm9yXCI7XG4gICAgZmVlZGJhY2suY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XG4gICAgZmVlZGJhY2suY2xhc3NMaXN0LmFkZCgndmlzaWJsZScpO1xuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIG9idGFpbih0eXBlLCAuLi5hcmdzKSB7XG4gIGNvbnN0IGZldGNoZWREYXRhID0gYXdhaXQgbWFuYWdlRmV0Y2hzLm9idGFpbih0eXBlLCBhcmdzKS5jYXRjaCgoZSkgPT4ge30pO1xuXG4gIGlmIChmZXRjaGVkRGF0YS5mZWVkYmFjay5jb2RlID09PSAwKSB7XG4gICAgcmV0dXJuIGZldGNoZWREYXRhLmRhdGE7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbn1cblxuZnVuY3Rpb24gc2V0VW5pdFNlbGVjdGVkKGUpIHtcbiAgY29uc3Qgc2VsZWN0ZWQgPSBlLnRhcmdldDtcblxuICBtZXRyaWMuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgaW1wZXJpYWwuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgc3RhbmRhcmQuY2xhc3NMaXN0LnJlbW92ZSgnc2VsZWN0ZWQnKTtcbiAgc2VsZWN0ZWQuY2xhc3NMaXN0LmFkZCgnc2VsZWN0ZWQnKTtcbiAgY3VycmVudFVuaXQgPSBTdHJpbmcoc2VsZWN0ZWQuaWQpO1xuICBsb2FkV2VhdGhlcigpO1xufVxuXG5mdW5jdGlvbiBzZXRDaXR5KGUpIHtcbiAgY3VycmVudENpdHkgPSBTdHJpbmcoaUNpdHkudmFsdWUpO1xuICBsb2FkV2VhdGhlcigpO1xufVxuIl0sIm5hbWVzIjpbIm1hbmFnZUZldGNocyIsIndBcGlLZXkiLCJtb2RlIiwiZmV0Y2hlZERhdGEiLCJkYXRhIiwiZmVlZGJhY2siLCJjb2RlIiwicmVhc29uIiwib2J0YWluIiwiYXJncyIsImFzc2lnbkZlZWRiYWNrIiwidG9Mb3dlckNhc2UiLCJjaXR5IiwiU3RyaW5nIiwidW5pdHMiLCJ2YWxpZGF0ZUNpdHkiLCJnZXRXZWF0aGVyRGF0YSIsImNhdGNoIiwiZSIsInJlZ2V4IiwidGVzdCIsImNvb3JkcyIsImdldENvb3Jkc0J5Q2l0eSIsInVuZGVmaW5lZCIsIndlYXRoZXJEYXRhIiwiZ2V0V2VhdGhlckJ5Q29vcmRzIiwibGF0IiwibG9uIiwidXJsIiwicmVzcG9uc2UiLCJmZXRjaCIsImRhdGFKc29uIiwianNvbiIsIm1heFRlbXAiLCJtaW5UZW1wIiwiaHVtaWRpdHkiLCJ3aW5kU3BlZWQiLCJtYW5hZ2VET00iLCJ3ZWF0aGVyQ2FudmFzIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsInNldFdlYXRoZXIiLCJhdXgiLCJjbGVhbkNhbnZhcyIsImNsYXNzTGlzdCIsInJlbW92ZSIsInNpZ24iLCJnZXRUZW1wU2lnbiIsImxvY2F0aW9uIiwiY3JlYXRlSHRtbCIsIm5hbWUiLCJkZXNjIiwid2VhdGhlciIsImRlc2NyaXB0aW9uIiwiaWNvbiIsImltYWciLCJ0ZW1wIiwibWFpbiIsImZlZWxzX2xpa2UiLCJ0aGVybWFsIiwiZm9vdFdEYXRhIiwibGVmdENvbnRhaW5lciIsInJpZ2h0Q29udGFpbmVyIiwiaW1nTWF4VGVtcCIsInRlbXBfbWF4IiwidHh0TWF4VGVtcCIsImltZ01pblRlbXAiLCJ0ZW1wX21pbiIsInR4dE1pblRlbXAiLCJpbWdIdW1pZGl0eSIsInR4dEh1bWlkaXR5IiwiaW1nV2luZFNwZWVkIiwid2luZCIsInNwZWVkIiwidHh0V2luZFNwZWVkIiwiYXBwZW5kIiwiaHRtbFRhZyIsImh0bWxJZCIsInR4dENvbnRlbnQiLCJodG1sQ2xhc3MiLCJodG1sU3JjIiwiY3JlYXRlRWxlbWVudCIsImlkIiwidGV4dENvbnRlbnQiLCJjbGFzc05hbWUiLCJzcmMiLCJkaXZXaXRoU2lnbiIsInF1ZXJ5U2VsZWN0b3IiLCJmaXJzdENoaWxkIiwicmVtb3ZlQ2hpbGQiLCJpQ2l0eSIsIm1ldHJpYyIsImltcGVyaWFsIiwic3RhbmRhcmQiLCJjdXJyZW50VW5pdCIsImN1cnJlbnRDaXR5IiwibG9hZCIsInNldExpc3RlbmVycyIsImFkZEV2ZW50TGlzdGVuZXIiLCJzZXRDaXR5Iiwic2V0VW5pdFNlbGVjdGVkIiwibG9hZFdlYXRoZXIiLCJhZGQiLCJ0eXBlIiwic2VsZWN0ZWQiLCJ0YXJnZXQiLCJ2YWx1ZSJdLCJzb3VyY2VSb290IjoiIn0=