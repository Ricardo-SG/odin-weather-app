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
    cleanCanvas(); // We delete all childs of weatherCanvas if it has from a previous set
    weatherCanvas.classList.remove('invisible');
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
    imgMaxTemp.src = _img_high_temp_png__WEBPACK_IMPORTED_MODULE_0__;
    const txtMaxTemp = document.createElement('div');
    txtMaxTemp.id = 'txt-max-temp';
    txtMaxTemp.textContent = data.main.temp_max + sign;

    /* Min temp icon and text */
    const imgMinTemp = document.createElement('img');
    imgMinTemp.id = 'img-min-temp';
    imgMinTemp.src = _img_low_temp_png__WEBPACK_IMPORTED_MODULE_1__;
    const txtMinTemp = document.createElement('div');
    txtMinTemp.id = 'txt-min-temp';
    txtMinTemp.textContent = data.main.temp_min + sign;

    /* Humidity icon and text */
    const imgHumidity = document.createElement('img');
    imgHumidity.id = 'img-humidity';
    imgHumidity.src = _img_humidity_png__WEBPACK_IMPORTED_MODULE_2__;
    const txtHumidity = document.createElement('div');
    txtHumidity.id = 'txt-humidity';
    txtHumidity.textContent = data.main.humidity + '%';

    /* Wind speed icon and text */
    const imgWindSpeed = document.createElement('img');
    imgWindSpeed.id = 'img-Wind-speed';
    imgWindSpeed.src = _img_windSpeed_png__WEBPACK_IMPORTED_MODULE_3__;
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
___CSS_LOADER_EXPORT___.push([module.id, "/* font families */\n/*\nfont-family: 'Comic Neue', cursive;\nfont-family: 'K2D', sans-serif;\nfont-family: 'Kreon', serif;\nfont-family: 'Montserrat', sans-serif;\nfont-family: 'Reenie Beanie', cursive;*/\nbody {\n  position: relative;\n  background: url(" + ___CSS_LOADER_URL_REPLACEMENT_0___ + ") no-repeat center fixed;\n  text-align: center;\n  margin: auto;\n  max-width: 800px;\n  height: 100vh;\n}\n\n.invisible {\n  display: none;\n}\n\n.visible-block {\n  display: block;\n}\n\n#search-div {\n  text-align: center;\n  margin-bottom: 20px;\n}\n#search-div #input-city {\n  font-family: \"Kreon\", serif;\n  text-align: center;\n  width: 100%;\n  box-sizing: border-box;\n  padding: 12px 20px;\n  margin: 8px 0;\n  background-color: lightblue;\n  font-size: 22px;\n}\n#search-div #input-city:focus {\n  border: 3px solid #555;\n}\n#search-div #input-feedback {\n  box-sizing: border-box;\n  padding: 12px 20px;\n  margin: 8px 0;\n  font-size: 20px;\n  border: 3px solid rgb(192, 118, 118);\n  background-color: whitesmoke;\n  color: red;\n}\n#search-div #units-container {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 10px;\n  align-items: center;\n  justify-items: center;\n}\n#search-div #units-container #metric,\n#search-div #units-container #imperial,\n#search-div #units-container #standard {\n  aspect-ratio: 1;\n  display: grid;\n  align-items: center;\n  justify-items: baseline;\n  border: 3px solid #555;\n  height: 100px;\n  font-size: 80px;\n  background: whitesmoke;\n  cursor: pointer;\n}\n#search-div #units-container .selected {\n  background: rgb(0, 0, 99) !important;\n  color: white !important;\n  border: 3px solid rgb(191, 201, 255) !important;\n  outline: 1px solid rgb(242, 242, 255) !important;\n}\n\n#weather-canvas {\n  margin: 10px auto;\n  padding: 5px;\n  max-width: 500px;\n  background: rgba(0, 0, 0, 0.404);\n  color: whitesmoke;\n}\n#weather-canvas #wlocation {\n  font-size: 70px;\n  margin: 0;\n  padding: 0;\n  font-family: \"Kreon\", serif;\n}\n#weather-canvas #wdesc {\n  font-size: 60px;\n  margin: 0;\n  padding: 0;\n  font-family: \"Montserrat\", sans-serif;\n}\n#weather-canvas #wimag {\n  margin: 0;\n  padding: 0;\n}\n#weather-canvas #wtemp {\n  font-size: 40px;\n  margin: 0;\n  padding: 0;\n  font-family: \"Montserrat\", sans-serif;\n}\n#weather-canvas #wthermal {\n  font-size: 40px;\n  margin: 0;\n  padding: 0;\n  color: rgb(98, 248, 98);\n  font-family: \"Montserrat\", sans-serif;\n}\n#weather-canvas #foot-weather-data {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  font-family: \"Kreon\", serif;\n}\n#weather-canvas #foot-weather-data #left-container {\n  justify-self: start;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  justify-items: left;\n  align-items: center;\n}\n#weather-canvas #foot-weather-data #right-container {\n  justify-self: end;\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  grid-template-rows: 1fr 1fr;\n  justify-items: right;\n  align-items: center;\n}\n#weather-canvas #foot-weather-data img {\n  height: 50px;\n}\n\n#credits {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 128, 0.267);\n  font-size: 22px;\n  color: navy;\n  font-family: \"K2D\", sans-serif;\n}\n#credits a {\n  text-align: left;\n  font-size: 18px;\n  display: block;\n  color: navy;\n}\n\n@media (max-width: 350px) {\n  #search-div #input-city {\n    width: 300px;\n    font-size: 15px;\n  }\n  #search-div #units-container #metric,\n  #search-div #units-container #imperial,\n  #search-div #units-container #standard {\n    height: 60px;\n    font-size: 50px;\n  }\n  #weather-canvas #wlocation {\n    font-size: 60px;\n  }\n  #weather-canvas #wdesc {\n    font-size: 40px;\n  }\n  #weather-canvas #wtemp {\n    font-size: 20px;\n  }\n  #weather-canvas #wthermal {\n    font-size: 20px;\n  }\n  #credits a {\n    font-size: 13px;\n  }\n}", "",{"version":3,"sources":["webpack://./src/css/styles.scss"],"names":[],"mappings":"AAAA,kBAAA;AAEA;;;;;uCAAA;AAMA;EACE,kBAAA;EACA,0EAAA;EACA,kBAAA;EACA,YAAA;EACA,gBAAA;EACA,aAAA;AACF;;AACA;EACE,aAAA;AAEF;;AACA;EACE,cAAA;AAEF;;AACA;EACE,kBAAA;EACA,mBAAA;AAEF;AAAE;EAME,2BAAA;EAEA,kBAAA;EACA,WAAA;EACA,sBAAA;EACA,kBAAA;EACA,aAAA;EAEA,2BAAA;EACA,eAAA;AALJ;AAMI;EACE,sBAAA;AAJN;AAQE;EACE,sBAAA;EACA,kBAAA;EACA,aAAA;EACA,eAAA;EACA,oCAAA;EACA,4BAAA;EACA,UAAA;AANJ;AASE;EACE,aAAA;EACA,kCAAA;EACA,SAAA;EACA,mBAAA;EACA,qBAAA;AAPJ;AASI;;;EAGE,eAAA;EACA,aAAA;EACA,mBAAA;EACA,uBAAA;EACA,sBAAA;EACA,aAAA;EACA,eAAA;EACA,sBAAA;EAEA,eAAA;AARN;AAUI;EACE,oCAAA;EACA,uBAAA;EACA,+CAAA;EACA,gDAAA;AARN;;AAaA;EACE,iBAAA;EACA,YAAA;EACA,gBAAA;EACA,gCAAA;EACA,iBAAA;AAVF;AAYE;EACE,eAAA;EACA,SAAA;EACA,UAAA;EACA,2BAAA;AAVJ;AAaE;EACE,eAAA;EACA,SAAA;EACA,UAAA;EACA,qCAAA;AAXJ;AAaE;EACE,SAAA;EACA,UAAA;AAXJ;AAaE;EACE,eAAA;EACA,SAAA;EACA,UAAA;EACA,qCAAA;AAXJ;AAcE;EACE,eAAA;EACA,SAAA;EACA,UAAA;EACA,uBAAA;EACA,qCAAA;AAZJ;AAeE;EACE,aAAA;EACA,8BAAA;EACA,2BAAA;AAbJ;AAeI;EACE,mBAAA;EACA,aAAA;EACA,8BAAA;EACA,2BAAA;EACA,mBAAA;EACA,mBAAA;AAbN;AAeI;EACE,iBAAA;EACA,aAAA;EACA,8BAAA;EACA,2BAAA;EACA,oBAAA;EACA,mBAAA;AAbN;AAeI;EACE,YAAA;AAbN;;AAkBA;EACE,kBAAA;EACA,SAAA;EACA,WAAA;EACA,wCAAA;EACA,eAAA;EACA,WAAA;EAEA,8BAAA;AAhBF;AAkBE;EACE,gBAAA;EACA,eAAA;EACA,cAAA;EACA,WAAA;AAhBJ;;AAoBA;EAEI;IACE,YAAA;IACA,eAAA;EAlBJ;EAqBI;;;IAGE,YAAA;IACA,eAAA;EAnBN;EAyBE;IACE,eAAA;EAvBJ;EA0BE;IACE,eAAA;EAxBJ;EA2BE;IACE,eAAA;EAzBJ;EA4BE;IACE,eAAA;EA1BJ;EA+BE;IACE,eAAA;EA7BJ;AACF","sourcesContent":["/* font families */\n@import url('https://fonts.googleapis.com/css2?family=Comic+Neue&family=K2D:ital,wght@1,300&family=Kreon:wght@500&family=Montserrat:wght@300&family=Reenie+Beanie&display=swap');\n/*\nfont-family: 'Comic Neue', cursive;\nfont-family: 'K2D', sans-serif;\nfont-family: 'Kreon', serif;\nfont-family: 'Montserrat', sans-serif;\nfont-family: 'Reenie Beanie', cursive;*/\nbody {\n  position: relative;\n  background: url('../img/clearcloudy.jpg') no-repeat center fixed;\n  text-align: center;\n  margin: auto;\n  max-width: 800px;\n  height: 100vh;\n}\n.invisible {\n  display: none;\n}\n\n.visible-block {\n  display: block;\n}\n\n#search-div {\n  text-align: center;\n  margin-bottom: 20px;\n\n  #input-city {\n    // background-image: url('../img/magnifyingglass.png');\n    // background-position: 10px 10px;\n    // background-size: 31px;\n    // background-repeat: no-repeat;\n\n    font-family: 'Kreon', serif;\n\n    text-align: center;\n    width: 100%;\n    box-sizing: border-box;\n    padding: 12px 20px;\n    margin: 8px 0;\n\n    background-color: lightblue;\n    font-size: 22px;\n    &:focus {\n      border: 3px solid #555;\n    }\n  }\n\n  #input-feedback {\n    box-sizing: border-box;\n    padding: 12px 20px;\n    margin: 8px 0;\n    font-size: 20px;\n    border: 3px solid rgb(192, 118, 118);\n    background-color: whitesmoke;\n    color: red;\n  }\n\n  #units-container {\n    display: grid;\n    grid-template-columns: 1fr 1fr 1fr;\n    gap: 10px;\n    align-items: center;\n    justify-items: center;\n\n    #metric,\n    #imperial,\n    #standard {\n      aspect-ratio: 1;\n      display: grid;\n      align-items: center;\n      justify-items: baseline;\n      border: 3px solid #555;\n      height: 100px;\n      font-size: 80px;\n      background: whitesmoke;\n\n      cursor: pointer;\n    }\n    .selected {\n      background: rgb(0, 0, 99) !important;\n      color: white !important;\n      border: 3px solid rgb(191, 201, 255) !important;\n      outline: 1px solid rgb(242, 242, 255) !important;\n    }\n  }\n}\n\n#weather-canvas {\n  margin: 10px auto;\n  padding: 5px;\n  max-width: 500px;\n  background: rgba(0, 0, 0, 0.404);\n  color: whitesmoke;\n\n  #wlocation {\n    font-size: 70px;\n    margin: 0;\n    padding: 0;\n    font-family: 'Kreon', serif;\n  }\n\n  #wdesc {\n    font-size: 60px;\n    margin: 0;\n    padding: 0;\n    font-family: 'Montserrat', sans-serif;\n  }\n  #wimag {\n    margin: 0;\n    padding: 0;\n  }\n  #wtemp {\n    font-size: 40px;\n    margin: 0;\n    padding: 0;\n    font-family: 'Montserrat', sans-serif;\n  }\n\n  #wthermal {\n    font-size: 40px;\n    margin: 0;\n    padding: 0;\n    color: rgb(98, 248, 98);\n    font-family: 'Montserrat', sans-serif;\n  }\n\n  #foot-weather-data {\n    display: grid;\n    grid-template-columns: 1fr 1fr;\n    font-family: 'Kreon', serif;\n\n    #left-container {\n      justify-self: start;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: 1fr 1fr;\n      justify-items: left;\n      align-items: center;\n    }\n    #right-container {\n      justify-self: end;\n      display: grid;\n      grid-template-columns: 1fr 1fr;\n      grid-template-rows: 1fr 1fr;\n      justify-items: right;\n      align-items: center;\n    }\n    img {\n      height: 50px;\n    }\n  }\n}\n\n#credits {\n  position: absolute;\n  bottom: 0;\n  width: 100%;\n  background-color: rgba(0, 0, 128, 0.267);\n  font-size: 22px;\n  color: navy;\n\n  font-family: 'K2D', sans-serif;\n\n  a {\n    text-align: left;\n    font-size: 18px;\n    display: block;\n    color: navy;\n  }\n}\n\n@media (max-width: 350px) {\n  #search-div {\n    #input-city {\n      width: 300px;\n      font-size: 15px;\n    }\n    #units-container {\n      #metric,\n      #imperial,\n      #standard {\n        height: 60px;\n        font-size: 50px;\n      }\n    }\n  }\n\n  #weather-canvas {\n    #wlocation {\n      font-size: 60px;\n    }\n\n    #wdesc {\n      font-size: 40px;\n    }\n\n    #wtemp {\n      font-size: 20px;\n    }\n\n    #wthermal {\n      font-size: 20px;\n    }\n  }\n\n  #credits {\n    a {\n      font-size: 13px;\n    }\n  }\n}\n"],"sourceRoot":""}]);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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Oi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9qcy9mZXRjaERhdGEuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9qcy9tYW5hZ2VET00uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL3NyYy9jc3Mvc3R5bGVzLnNjc3MiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9zb3VyY2VNYXBzLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvY3NzL3N0eWxlcy5zY3NzPzdiMmYiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0U3R5bGVFbGVtZW50LmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2NvbXBhdCBnZXQgZGVmYXVsdCBleHBvcnQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZGVmaW5lIHByb3BlcnR5IGdldHRlcnMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvZ2xvYmFsIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2hhc093blByb3BlcnR5IHNob3J0aGFuZCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9tYWtlIG5hbWVzcGFjZSBvYmplY3QiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvcHVibGljUGF0aCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9qc29ucCBjaHVuayBsb2FkaW5nIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL25vbmNlIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvaW5kZXguanMiXSwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWVuYWJsZSAqL1xuXG4vLyBXZSB1c2UgYSBtb2R1bGUgUGF0dGVybiB0byBkZWZpbmUgYSBzaW5nbGUgb2JqZWN0IHRoYXQgd2lsbCBoYW5kbGUgdGhlIGZldGNocy5cbi8vIHRoaXMgb2JqZWN0IHdpbGwgY29udGFpbiB0aGUgYXBpIGtleXMgYXMgYSBwcml2YXRlIHZhcmlhYmxlIGFuZCB0aGUgZnVuY3Rpb25zIHRvIGRvIHRoZSByZXF1ZXN0cy5cbmNvbnN0IG1hbmFnZUZldGNocyA9IChmdW5jdGlvbiAoKSB7XG4gIGNvbnN0IHdBcGlLZXkgPSAnMDU4MDQ1Y2NjNjQ1NDZiYjM5M2FmY2Y2N2M5Zjg2NGYnOyAvLyBpdCdzIGEgcHVibGljIEFQSVxuICBjb25zdCBtb2RlID0geyBtb2RlOiAnY29ycycgfTtcbiAgY29uc3QgZmV0Y2hlZERhdGEgPSB7XG4gICAgZGF0YToge30sXG4gICAgZmVlZGJhY2s6IHtcbiAgICAgIC8qIFxuICAgICAgICBMaXN0IG9mIHBvc3NpYmxlIHZhbHVlcyBmb3IgY29kZTpcbiAgICAgICAgMCAtPiBubyBlcnJvciwgdGhlIGZldGNoIHdlbnQgb2theVxuICAgICAgICAyIC0+IHRoZSBhcmd1bWVudCAnY2l0eScgZm9yICd3ZWF0aGVyJyBmZXRjaCB3YXMgaW5jb3JyZWN0XG4gICAgICAgIDMgLT4gYW4gZXJyb3Igb2N1cnJlZCB3aGlsZSBmZXRjaGluZ1xuICAgICAgKi9cbiAgICAgIGNvZGU6IDAsXG4gICAgICByZWFzb246ICcnLFxuICAgIH0sXG4gIH07XG5cbiAgLy8gZGF0YSAtLT4gVGVsbHMgdXMgd2hhdCB3ZSBnb25uYSBmZXRjaFxuICAvLyAuLi5hcmdzIC0tPiByZWNlaXZlIHRoZSBhcmd1bWVudHMgZm9yIHRoZSBjYWxsLlxuICBhc3luYyBmdW5jdGlvbiBvYnRhaW4oZGF0YSwgYXJncykge1xuICAgIGFzc2lnbkZlZWRiYWNrKDApOyAvLyBieSBkZWZhdWx0IHdlJ3ZlIHdvcmtlZCBmaW5lXG5cbiAgICBzd2l0Y2ggKGRhdGEudG9Mb3dlckNhc2UoKSkge1xuICAgICAgY2FzZSAnd2VhdGhlcic6IHtcbiAgICAgICAgY29uc3QgY2l0eSA9IFN0cmluZyhhcmdzWzBdKTtcbiAgICAgICAgY29uc3QgdW5pdHMgPSBTdHJpbmcoYXJnc1sxXSk7IC8vIEl0IGNhbiBvbmx5IGJlICdtZXRyaWNzJywgaW1wZXJpYWwsIG9yIHN0YW5kYXJkXG4gICAgICAgIGlmICh2YWxpZGF0ZUNpdHkoY2l0eSkpIHtcbiAgICAgICAgICBmZXRjaGVkRGF0YS5kYXRhID0gYXdhaXQgZ2V0V2VhdGhlckRhdGEoXG4gICAgICAgICAgICBjaXR5LnRvTG93ZXJDYXNlKCksXG4gICAgICAgICAgICB1bml0c1xuICAgICAgICAgICkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgICAgIGFzc2lnbkZlZWRiYWNrKDEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIENpdHkgYXJndW1lbnQgaXMgd3JvbmdcbiAgICAgICAgICBhc3NpZ25GZWVkYmFjaygyKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIC8vIHRoZSBkYXRhIGFyZ3VtZW50IGlzIHdyb25nXG4gICAgICAgIGFzc2lnbkZlZWRiYWNrKDMpO1xuICAgICAgICBicmVhaztcbiAgICB9XG5cbiAgICByZXR1cm4gZmV0Y2hlZERhdGE7XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZUNpdHkoY2l0eSkge1xuICAgIC8vIEknbSBzb3JyeSBpZiBzb21lIHJhcmUgbmFtZXMgd2l0aCBwdW5jdHVhdGlvbnMgc2lnbiBkb2Vzbid0IHdvcmsuXG4gICAgLy8gSWYgdGhpcyB3YXMgcHJvZmVzc2lvbmFsIEknZCBzZWFyY2ggYmV0dGVyIGhvdyB0byB2YWxpZCBuYW1lcyBvciB3b3VsZCB1c2VcbiAgICAvLyBhIGxpc3Qgb2YgdmFsaWQgbWF0Y2hlc1xuICAgIGNvbnN0IHJlZ2V4ID0gLyhbYS16QS1aXSt8W2EtekEtWl0rXFxzW2EtekEtWl0rKS87XG4gICAgcmV0dXJuIHJlZ2V4LnRlc3QoY2l0eSk7XG4gIH1cblxuICBhc3luYyBmdW5jdGlvbiBnZXRXZWF0aGVyRGF0YShjaXR5LCB1bml0cykge1xuICAgIC8vIFdlIGRvIHR3byBBUEkgZmV0Y2hcbiAgICAvLyAxKSBGaXJzdCBHZW9jb2RpbmcgYXBpIHRvIG9idGFpbiBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlXG4gICAgLy8gMikgVGhlbiBPcGVuV2VhdGhlciB0byBvYnRhaW4gdGhlIHdlYXRoZXIgaW5mb3JtYXRpb25cblxuICAgIC8vIDEpIEdlb2NvZGluZyBmZXRjaFxuICAgIGNvbnN0IGNvb3JkcyA9IGF3YWl0IGdldENvb3Jkc0J5Q2l0eShjaXR5KS5jYXRjaCgoZSkgPT4ge1xuICAgICAgYXNzaWduRmVlZGJhY2soNCk7XG4gICAgfSk7XG5cbiAgICBpZiAoY29vcmRzWzBdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIC8vIDIpIE9wZW53ZWF0aGVyIGZldGNoXG4gICAgICBjb25zdCB3ZWF0aGVyRGF0YSA9IGF3YWl0IGdldFdlYXRoZXJCeUNvb3JkcyhcbiAgICAgICAgY29vcmRzWzBdLmxhdCxcbiAgICAgICAgY29vcmRzWzBdLmxvbixcbiAgICAgICAgdW5pdHNcbiAgICAgICkuY2F0Y2goKGUpID0+IHtcbiAgICAgICAgYXNzaWduRmVlZGJhY2soNSk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB3ZWF0aGVyRGF0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXNzaWduRmVlZGJhY2soNik7XG4gICAgfVxuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0Q29vcmRzQnlDaXR5KGNpdHkpIHtcbiAgICAvLyBUaGUgVVJMIGZvciBHRU9DT0RJTkcgYXBpXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9nZW8vMS4wL2RpcmVjdD9xPSR7Y2l0eX0mYXBwaWQ9JHt3QXBpS2V5fWA7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgbW9kZSk7XG4gICAgY29uc3QgZGF0YUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIGRhdGFKc29uO1xuICB9XG5cbiAgLyogVGhpcyBmdW5jdGlvbiBnZXQncyB0aGUgd2VhdGhlciBGb3JlY2FzdCBieSB1c2luZyBsYXRpdHVkZSBhbmQgbG9uZ2l0dWRlIHBhcmFtZXR0ZXJzICovXG4gIC8qIFRoZSB1c2VyIGNhbiBhbHNvIGluZm9ybSB1bml0cyBhcyBtZXRyaWMgKENlbHNpdXMpLCBpbXBlcmlhbCAoRmFyZW5oZWl0KSBvciBzdGFuZGFyZCAoS2VsdmluKSAqL1xuICAvKiBJZiBubyB1bml0IGhhcyBiZWVuIHByb3ZpZGVkLCB3ZSB3aWxsIGdvbm5hIHVzZSBtZXRyaWMsIGlmIHRoZSB1cmwgZG9lc24ndCBoYXZlIHVuaXQgZGVmaW5lZC8qICAgaXQgd2lsbCB0YWtlIGJ5IGRlZmF1bHQgXCJzdGFuZGFyZFwiIGFuZCByZXR1cm4gS2VsdmluLiAqL1xuICAvKiBMaXN0IG9mIGFsbCBBUEkgcGFyYW1ldGVycyB3aXRoIHVuaXRzIG9wZW53ZWF0aGVybWFwLm9yZy93ZWF0aGVyLWRhdGEgKi9cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0V2VhdGhlckJ5Q29vcmRzKGxhdCwgbG9uLCB1bml0cykge1xuICAgIGlmICh1bml0cyA9PT0gbnVsbCB8fCB1bml0cyA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICB1bml0cyA9ICdtZXRyaWMnO1xuICAgIH1cblxuICAgIC8vIFRoZSBVUkwgZm9yIFdlYXRoZXIgYXBpXG4gICAgY29uc3QgdXJsID0gYGh0dHBzOi8vYXBpLm9wZW53ZWF0aGVybWFwLm9yZy9kYXRhLzIuNS93ZWF0aGVyP2xhdD0ke2xhdH0mbG9uPSR7bG9ufSZ1bml0cz0ke3VuaXRzfSZhcHBpZD0ke3dBcGlLZXl9YDtcblxuICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2godXJsLCBtb2RlKTtcbiAgICBjb25zdCBkYXRhSnNvbiA9IGF3YWl0IHJlc3BvbnNlLmpzb24oKTtcbiAgICByZXR1cm4gZGF0YUpzb247XG4gIH1cblxuICBmdW5jdGlvbiBhc3NpZ25GZWVkYmFjayhjb2RlKSB7XG4gICAgZmV0Y2hlZERhdGEuZmVlZGJhY2suY29kZSA9IGNvZGU7XG4gICAgLy8gbGV0cyBhc3NpZ24gYSByZWFzb25cbiAgICBzd2l0Y2ggKGNvZGUpIHtcbiAgICAgIGNhc2UgMDoge1xuICAgICAgICAvLyBhbGwgd2VudCBva2F5XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdvayc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAxOiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdFcnJvciBkdXJpbmcgZmV0Y2hpbmcgZGF0YSc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAyOiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9IFwiQ2l0eSBhcmd1bWVudCBkb2Vzbid0IGNvbXBseSBmb3JtYXRcIjtcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDM6IHtcbiAgICAgICAgZmV0Y2hlZERhdGEuZmVlZGJhY2sucmVhc29uID0gJ0ZldGNoIHR5cGUgbm90IGNvZGlmaWVkLic7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSA0OiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdFcnJvciBmZXRjaGluZyBHZW9Db2RpbmcnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgNToge1xuICAgICAgICBmZXRjaGVkRGF0YS5mZWVkYmFjay5yZWFzb24gPSAnRXJyb3IgZmV0Y2hpbmcgb3BlbndlYXRoZXIgYnkgY29vcmRzJztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDY6IHtcbiAgICAgICAgZmV0Y2hlZERhdGEuZmVlZGJhY2sucmVhc29uID0gJ0xvY2F0aW9uIG5vdCBmb3VuZCc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB7IG9idGFpbiB9O1xufSkoKTtcblxuZXhwb3J0IHsgbWFuYWdlRmV0Y2hzIH07XG4iLCIvKiBlc2xpbnQtZW5hYmxlICovXG5pbXBvcnQgbWF4VGVtcCBmcm9tICcuLi9pbWcvaGlnaC10ZW1wLnBuZyc7XG5pbXBvcnQgbWluVGVtcCBmcm9tICcuLi9pbWcvbG93LXRlbXAucG5nJztcbmltcG9ydCBodW1pZGl0eSBmcm9tICcuLi9pbWcvaHVtaWRpdHkucG5nJztcbmltcG9ydCB3aW5kU3BlZWQgZnJvbSAnLi4vaW1nL3dpbmRTcGVlZC5wbmcnO1xuXG4vLyBUaGlzIG1vZHVsZSBwYXR0ZXJuIHdpbGwgbWFuYWdlIHRoZSBkb20gbW9kaWZpY2F0aW9ucyBvZiBvdXIgd2ViXG5jb25zdCBtYW5hZ2VET00gPSAoZnVuY3Rpb24gKCkge1xuICAvLyBBbGwgdGhlIHdlYiBlbGVtZW50cyB3ZSB3YW50IHRvIHdvcmsgd2l0aFxuICBjb25zdCB3ZWF0aGVyQ2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlYXRoZXItY2FudmFzJyk7XG5cbiAgY29uc3Qgc2V0V2VhdGhlciA9IGZ1bmN0aW9uIChkYXRhKSB7XG4gICAgY2xlYW5DYW52YXMoKTsgLy8gV2UgZGVsZXRlIGFsbCBjaGlsZHMgb2Ygd2VhdGhlckNhbnZhcyBpZiBpdCBoYXMgZnJvbSBhIHByZXZpb3VzIHNldFxuICAgIHdlYXRoZXJDYW52YXMuY2xhc3NMaXN0LnJlbW92ZSgnaW52aXNpYmxlJyk7XG4gICAgY29uc3Qgc2lnbiA9IGdldFRlbXBTaWduKCk7XG4gICAgLy8gY29uc3Qgc2lnbiA9ICcgwrBDJztcblxuICAgIGNvbnN0IGxvY2F0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGxvY2F0aW9uLmlkID0gJ3dsb2NhdGlvbic7XG4gICAgbG9jYXRpb24udGV4dENvbnRlbnQgPSBkYXRhLm5hbWU7XG5cbiAgICBjb25zdCBkZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIGRlc2MuaWQgPSAnd2Rlc2MnO1xuICAgIGRlc2MudGV4dENvbnRlbnQgPSBkYXRhLndlYXRoZXJbMF0uZGVzY3JpcHRpb247XG5cbiAgICBjb25zdCBpbWFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1hZy5pZCA9ICd3aW1hZyc7XG4gICAgaW1hZy5zcmMgPSBgaHR0cHM6Ly9vcGVud2VhdGhlcm1hcC5vcmcvaW1nL3duLyR7ZGF0YS53ZWF0aGVyWzBdLmljb259QDJ4LnBuZ2A7XG5cbiAgICBjb25zdCB0ZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpO1xuICAgIHRlbXAuaWQgPSAnd3RlbXAnO1xuICAgIHRlbXAudGV4dENvbnRlbnQgPSBkYXRhLm1haW4udGVtcCArIHNpZ247XG5cbiAgICBjb25zdCB0aGVybWFsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgncCcpOyAvLyB0aGVybWFsIFNlbnNhdGlvblxuICAgIHRoZXJtYWwuaWQgPSAnd3RoZXJtYWwnO1xuICAgIHRoZXJtYWwudGV4dENvbnRlbnQgPSAnRmVlbHMgbGlrZTogJyArIGRhdGEubWFpbi5mZWVsc19saWtlICsgc2lnbjtcblxuICAgIGNvbnN0IGZvb3RXRGF0YSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGZvb3RXRGF0YS5pZCA9ICdmb290LXdlYXRoZXItZGF0YSc7XG4gICAgY29uc3QgbGVmdENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGxlZnRDb250YWluZXIuaWQgPSAnbGVmdC1jb250YWluZXInO1xuICAgIGNvbnN0IHJpZ2h0Q29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgcmlnaHRDb250YWluZXIuaWQgPSAncmlnaHQtY29udGFpbmVyJztcblxuICAgIC8qIE1heCB0ZW1wIGljb24gYW5kIHRleHQgKi9cbiAgICBjb25zdCBpbWdNYXhUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nTWF4VGVtcC5pZCA9ICdpbWctbWF4LXRlbXAnO1xuICAgIGltZ01heFRlbXAuc3JjID0gbWF4VGVtcDtcbiAgICBjb25zdCB0eHRNYXhUZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdHh0TWF4VGVtcC5pZCA9ICd0eHQtbWF4LXRlbXAnO1xuICAgIHR4dE1heFRlbXAudGV4dENvbnRlbnQgPSBkYXRhLm1haW4udGVtcF9tYXggKyBzaWduO1xuXG4gICAgLyogTWluIHRlbXAgaWNvbiBhbmQgdGV4dCAqL1xuICAgIGNvbnN0IGltZ01pblRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWdNaW5UZW1wLmlkID0gJ2ltZy1taW4tdGVtcCc7XG4gICAgaW1nTWluVGVtcC5zcmMgPSBtaW5UZW1wO1xuICAgIGNvbnN0IHR4dE1pblRlbXAgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0eHRNaW5UZW1wLmlkID0gJ3R4dC1taW4tdGVtcCc7XG4gICAgdHh0TWluVGVtcC50ZXh0Q29udGVudCA9IGRhdGEubWFpbi50ZW1wX21pbiArIHNpZ247XG5cbiAgICAvKiBIdW1pZGl0eSBpY29uIGFuZCB0ZXh0ICovXG4gICAgY29uc3QgaW1nSHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbWcnKTtcbiAgICBpbWdIdW1pZGl0eS5pZCA9ICdpbWctaHVtaWRpdHknO1xuICAgIGltZ0h1bWlkaXR5LnNyYyA9IGh1bWlkaXR5O1xuXG4gICAgY29uc3QgdHh0SHVtaWRpdHkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0eHRIdW1pZGl0eS5pZCA9ICd0eHQtaHVtaWRpdHknO1xuICAgIHR4dEh1bWlkaXR5LnRleHRDb250ZW50ID0gZGF0YS5tYWluLmh1bWlkaXR5ICsgJyUnO1xuXG4gICAgLyogV2luZCBzcGVlZCBpY29uIGFuZCB0ZXh0ICovXG4gICAgY29uc3QgaW1nV2luZFNwZWVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nV2luZFNwZWVkLmlkID0gJ2ltZy1XaW5kLXNwZWVkJztcbiAgICBpbWdXaW5kU3BlZWQuc3JjID0gd2luZFNwZWVkO1xuXG4gICAgY29uc3QgdHh0V2luZFNwZWVkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdHh0V2luZFNwZWVkLmlkID0gJ3R4dC13aW5kLXNwZWVkJztcbiAgICB0eHRXaW5kU3BlZWQudGV4dENvbnRlbnQgPSBkYXRhLndpbmQuc3BlZWQgKyAnIGttL2gnO1xuXG4gICAgbGVmdENvbnRhaW5lci5hcHBlbmQoaW1nTWF4VGVtcCwgdHh0TWF4VGVtcCwgaW1nTWluVGVtcCwgdHh0TWluVGVtcCk7XG4gICAgcmlnaHRDb250YWluZXIuYXBwZW5kKHR4dEh1bWlkaXR5LCBpbWdIdW1pZGl0eSwgdHh0V2luZFNwZWVkLCBpbWdXaW5kU3BlZWQpO1xuICAgIGZvb3RXRGF0YS5hcHBlbmQobGVmdENvbnRhaW5lciwgcmlnaHRDb250YWluZXIpO1xuXG4gICAgd2VhdGhlckNhbnZhcy5hcHBlbmQobG9jYXRpb24sIGRlc2MsIGltYWcsIHRlbXAsIHRoZXJtYWwsIGZvb3RXRGF0YSk7XG4gIH07XG5cbiAgZnVuY3Rpb24gZ2V0VGVtcFNpZ24oKSB7XG4gICAgY29uc3QgZGl2V2l0aFNpZ24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VsZWN0ZWQnKTtcblxuICAgIHJldHVybiAnICcgKyBkaXZXaXRoU2lnbi50ZXh0Q29udGVudDtcbiAgfVxuXG4gIGNvbnN0IGNsZWFuQ2FudmFzID0gZnVuY3Rpb24gKCkge1xuICAgIHdoaWxlICh3ZWF0aGVyQ2FudmFzLmZpcnN0Q2hpbGQpIHtcbiAgICAgIHdlYXRoZXJDYW52YXMucmVtb3ZlQ2hpbGQod2VhdGhlckNhbnZhcy5maXJzdENoaWxkKTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIHsgc2V0V2VhdGhlciB9O1xufSkoKTtcblxuZXhwb3J0IHsgbWFuYWdlRE9NIH07XG4iLCIvLyBJbXBvcnRzXG5pbXBvcnQgX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL3NvdXJjZU1hcHMuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9hcGkuanNcIjtcbmltcG9ydCBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzXCI7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18gPSBuZXcgVVJMKFwiLi4vaW1nL2NsZWFyY2xvdWR5LmpwZ1wiLCBpbXBvcnQubWV0YS51cmwpO1xudmFyIF9fX0NTU19MT0FERVJfRVhQT1JUX19fID0gX19fQ1NTX0xPQURFUl9BUElfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfQVBJX1NPVVJDRU1BUF9JTVBPUlRfX18pO1xuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIkBpbXBvcnQgdXJsKGh0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Q29taWMrTmV1ZSZmYW1pbHk9SzJEOml0YWwsd2dodEAxLDMwMCZmYW1pbHk9S3Jlb246d2dodEA1MDAmZmFtaWx5PU1vbnRzZXJyYXQ6d2dodEAzMDAmZmFtaWx5PVJlZW5pZStCZWFuaWUmZGlzcGxheT1zd2FwKTtcIl0pO1xudmFyIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gPSBfX19DU1NfTE9BREVSX0dFVF9VUkxfSU1QT1JUX19fKF9fX0NTU19MT0FERVJfVVJMX0lNUE9SVF8wX19fKTtcbi8vIE1vZHVsZVxuX19fQ1NTX0xPQURFUl9FWFBPUlRfX18ucHVzaChbbW9kdWxlLmlkLCBcIi8qIGZvbnQgZmFtaWxpZXMgKi9cXG4vKlxcbmZvbnQtZmFtaWx5OiAnQ29taWMgTmV1ZScsIGN1cnNpdmU7XFxuZm9udC1mYW1pbHk6ICdLMkQnLCBzYW5zLXNlcmlmO1xcbmZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG5mb250LWZhbWlseTogJ01vbnRzZXJyYXQnLCBzYW5zLXNlcmlmO1xcbmZvbnQtZmFtaWx5OiAnUmVlbmllIEJlYW5pZScsIGN1cnNpdmU7Ki9cXG5ib2R5IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJhY2tncm91bmQ6IHVybChcIiArIF9fX0NTU19MT0FERVJfVVJMX1JFUExBQ0VNRU5UXzBfX18gKyBcIikgbm8tcmVwZWF0IGNlbnRlciBmaXhlZDtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbjogYXV0bztcXG4gIG1heC13aWR0aDogODAwcHg7XFxuICBoZWlnaHQ6IDEwMHZoO1xcbn1cXG5cXG4uaW52aXNpYmxlIHtcXG4gIGRpc3BsYXk6IG5vbmU7XFxufVxcblxcbi52aXNpYmxlLWJsb2NrIHtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbn1cXG5cXG4jc2VhcmNoLWRpdiB7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtYXJnaW4tYm90dG9tOiAyMHB4O1xcbn1cXG4jc2VhcmNoLWRpdiAjaW5wdXQtY2l0eSB7XFxuICBmb250LWZhbWlseTogXFxcIktyZW9uXFxcIiwgc2VyaWY7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XFxuICBwYWRkaW5nOiAxMnB4IDIwcHg7XFxuICBtYXJnaW46IDhweCAwO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogbGlnaHRibHVlO1xcbiAgZm9udC1zaXplOiAyMnB4O1xcbn1cXG4jc2VhcmNoLWRpdiAjaW5wdXQtY2l0eTpmb2N1cyB7XFxuICBib3JkZXI6IDNweCBzb2xpZCAjNTU1O1xcbn1cXG4jc2VhcmNoLWRpdiAjaW5wdXQtZmVlZGJhY2sge1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHBhZGRpbmc6IDEycHggMjBweDtcXG4gIG1hcmdpbjogOHB4IDA7XFxuICBmb250LXNpemU6IDIwcHg7XFxuICBib3JkZXI6IDNweCBzb2xpZCByZ2IoMTkyLCAxMTgsIDExOCk7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZXNtb2tlO1xcbiAgY29sb3I6IHJlZDtcXG59XFxuI3NlYXJjaC1kaXYgI3VuaXRzLWNvbnRhaW5lciB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyIDFmcjtcXG4gIGdhcDogMTBweDtcXG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICBqdXN0aWZ5LWl0ZW1zOiBjZW50ZXI7XFxufVxcbiNzZWFyY2gtZGl2ICN1bml0cy1jb250YWluZXIgI21ldHJpYyxcXG4jc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyICNpbXBlcmlhbCxcXG4jc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyICNzdGFuZGFyZCB7XFxuICBhc3BlY3QtcmF0aW86IDE7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktaXRlbXM6IGJhc2VsaW5lO1xcbiAgYm9yZGVyOiAzcHggc29saWQgIzU1NTtcXG4gIGhlaWdodDogMTAwcHg7XFxuICBmb250LXNpemU6IDgwcHg7XFxuICBiYWNrZ3JvdW5kOiB3aGl0ZXNtb2tlO1xcbiAgY3Vyc29yOiBwb2ludGVyO1xcbn1cXG4jc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyIC5zZWxlY3RlZCB7XFxuICBiYWNrZ3JvdW5kOiByZ2IoMCwgMCwgOTkpICFpbXBvcnRhbnQ7XFxuICBjb2xvcjogd2hpdGUgIWltcG9ydGFudDtcXG4gIGJvcmRlcjogM3B4IHNvbGlkIHJnYigxOTEsIDIwMSwgMjU1KSAhaW1wb3J0YW50O1xcbiAgb3V0bGluZTogMXB4IHNvbGlkIHJnYigyNDIsIDI0MiwgMjU1KSAhaW1wb3J0YW50O1xcbn1cXG5cXG4jd2VhdGhlci1jYW52YXMge1xcbiAgbWFyZ2luOiAxMHB4IGF1dG87XFxuICBwYWRkaW5nOiA1cHg7XFxuICBtYXgtd2lkdGg6IDUwMHB4O1xcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjQwNCk7XFxuICBjb2xvcjogd2hpdGVzbW9rZTtcXG59XFxuI3dlYXRoZXItY2FudmFzICN3bG9jYXRpb24ge1xcbiAgZm9udC1zaXplOiA3MHB4O1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiS3Jlb25cXFwiLCBzZXJpZjtcXG59XFxuI3dlYXRoZXItY2FudmFzICN3ZGVzYyB7XFxuICBmb250LXNpemU6IDYwcHg7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJNb250c2VycmF0XFxcIiwgc2Fucy1zZXJpZjtcXG59XFxuI3dlYXRoZXItY2FudmFzICN3aW1hZyB7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI3d0ZW1wIHtcXG4gIGZvbnQtc2l6ZTogNDBweDtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LWZhbWlseTogXFxcIk1vbnRzZXJyYXRcXFwiLCBzYW5zLXNlcmlmO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI3d0aGVybWFsIHtcXG4gIGZvbnQtc2l6ZTogNDBweDtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBjb2xvcjogcmdiKDk4LCAyNDgsIDk4KTtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiTW9udHNlcnJhdFxcXCIsIHNhbnMtc2VyaWY7XFxufVxcbiN3ZWF0aGVyLWNhbnZhcyAjZm9vdC13ZWF0aGVyLWRhdGEge1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiS3Jlb25cXFwiLCBzZXJpZjtcXG59XFxuI3dlYXRoZXItY2FudmFzICNmb290LXdlYXRoZXItZGF0YSAjbGVmdC1jb250YWluZXIge1xcbiAganVzdGlmeS1zZWxmOiBzdGFydDtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxZnI7XFxuICBqdXN0aWZ5LWl0ZW1zOiBsZWZ0O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuI3dlYXRoZXItY2FudmFzICNmb290LXdlYXRoZXItZGF0YSAjcmlnaHQtY29udGFpbmVyIHtcXG4gIGp1c3RpZnktc2VsZjogZW5kO1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmcjtcXG4gIGp1c3RpZnktaXRlbXM6IHJpZ2h0O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG59XFxuI3dlYXRoZXItY2FudmFzICNmb290LXdlYXRoZXItZGF0YSBpbWcge1xcbiAgaGVpZ2h0OiA1MHB4O1xcbn1cXG5cXG4jY3JlZGl0cyB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDA7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMTI4LCAwLjI2Nyk7XFxuICBmb250LXNpemU6IDIycHg7XFxuICBjb2xvcjogbmF2eTtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiSzJEXFxcIiwgc2Fucy1zZXJpZjtcXG59XFxuI2NyZWRpdHMgYSB7XFxuICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgZm9udC1zaXplOiAxOHB4O1xcbiAgZGlzcGxheTogYmxvY2s7XFxuICBjb2xvcjogbmF2eTtcXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDM1MHB4KSB7XFxuICAjc2VhcmNoLWRpdiAjaW5wdXQtY2l0eSB7XFxuICAgIHdpZHRoOiAzMDBweDtcXG4gICAgZm9udC1zaXplOiAxNXB4O1xcbiAgfVxcbiAgI3NlYXJjaC1kaXYgI3VuaXRzLWNvbnRhaW5lciAjbWV0cmljLFxcbiAgI3NlYXJjaC1kaXYgI3VuaXRzLWNvbnRhaW5lciAjaW1wZXJpYWwsXFxuICAjc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyICNzdGFuZGFyZCB7XFxuICAgIGhlaWdodDogNjBweDtcXG4gICAgZm9udC1zaXplOiA1MHB4O1xcbiAgfVxcbiAgI3dlYXRoZXItY2FudmFzICN3bG9jYXRpb24ge1xcbiAgICBmb250LXNpemU6IDYwcHg7XFxuICB9XFxuICAjd2VhdGhlci1jYW52YXMgI3dkZXNjIHtcXG4gICAgZm9udC1zaXplOiA0MHB4O1xcbiAgfVxcbiAgI3dlYXRoZXItY2FudmFzICN3dGVtcCB7XFxuICAgIGZvbnQtc2l6ZTogMjBweDtcXG4gIH1cXG4gICN3ZWF0aGVyLWNhbnZhcyAjd3RoZXJtYWwge1xcbiAgICBmb250LXNpemU6IDIwcHg7XFxuICB9XFxuICAjY3JlZGl0cyBhIHtcXG4gICAgZm9udC1zaXplOiAxM3B4O1xcbiAgfVxcbn1cIiwgXCJcIix7XCJ2ZXJzaW9uXCI6MyxcInNvdXJjZXNcIjpbXCJ3ZWJwYWNrOi8vLi9zcmMvY3NzL3N0eWxlcy5zY3NzXCJdLFwibmFtZXNcIjpbXSxcIm1hcHBpbmdzXCI6XCJBQUFBLGtCQUFBO0FBRUE7Ozs7O3VDQUFBO0FBTUE7RUFDRSxrQkFBQTtFQUNBLDBFQUFBO0VBQ0Esa0JBQUE7RUFDQSxZQUFBO0VBQ0EsZ0JBQUE7RUFDQSxhQUFBO0FBQ0Y7O0FBQ0E7RUFDRSxhQUFBO0FBRUY7O0FBQ0E7RUFDRSxjQUFBO0FBRUY7O0FBQ0E7RUFDRSxrQkFBQTtFQUNBLG1CQUFBO0FBRUY7QUFBRTtFQU1FLDJCQUFBO0VBRUEsa0JBQUE7RUFDQSxXQUFBO0VBQ0Esc0JBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFFQSwyQkFBQTtFQUNBLGVBQUE7QUFMSjtBQU1JO0VBQ0Usc0JBQUE7QUFKTjtBQVFFO0VBQ0Usc0JBQUE7RUFDQSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0VBQ0Esb0NBQUE7RUFDQSw0QkFBQTtFQUNBLFVBQUE7QUFOSjtBQVNFO0VBQ0UsYUFBQTtFQUNBLGtDQUFBO0VBQ0EsU0FBQTtFQUNBLG1CQUFBO0VBQ0EscUJBQUE7QUFQSjtBQVNJOzs7RUFHRSxlQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxzQkFBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0VBQ0Esc0JBQUE7RUFFQSxlQUFBO0FBUk47QUFVSTtFQUNFLG9DQUFBO0VBQ0EsdUJBQUE7RUFDQSwrQ0FBQTtFQUNBLGdEQUFBO0FBUk47O0FBYUE7RUFDRSxpQkFBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGdDQUFBO0VBQ0EsaUJBQUE7QUFWRjtBQVlFO0VBQ0UsZUFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsMkJBQUE7QUFWSjtBQWFFO0VBQ0UsZUFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EscUNBQUE7QUFYSjtBQWFFO0VBQ0UsU0FBQTtFQUNBLFVBQUE7QUFYSjtBQWFFO0VBQ0UsZUFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EscUNBQUE7QUFYSjtBQWNFO0VBQ0UsZUFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsdUJBQUE7RUFDQSxxQ0FBQTtBQVpKO0FBZUU7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSwyQkFBQTtBQWJKO0FBZUk7RUFDRSxtQkFBQTtFQUNBLGFBQUE7RUFDQSw4QkFBQTtFQUNBLDJCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtBQWJOO0FBZUk7RUFDRSxpQkFBQTtFQUNBLGFBQUE7RUFDQSw4QkFBQTtFQUNBLDJCQUFBO0VBQ0Esb0JBQUE7RUFDQSxtQkFBQTtBQWJOO0FBZUk7RUFDRSxZQUFBO0FBYk47O0FBa0JBO0VBQ0Usa0JBQUE7RUFDQSxTQUFBO0VBQ0EsV0FBQTtFQUNBLHdDQUFBO0VBQ0EsZUFBQTtFQUNBLFdBQUE7RUFFQSw4QkFBQTtBQWhCRjtBQWtCRTtFQUNFLGdCQUFBO0VBQ0EsZUFBQTtFQUNBLGNBQUE7RUFDQSxXQUFBO0FBaEJKOztBQW9CQTtFQUVJO0lBQ0UsWUFBQTtJQUNBLGVBQUE7RUFsQko7RUFxQkk7OztJQUdFLFlBQUE7SUFDQSxlQUFBO0VBbkJOO0VBeUJFO0lBQ0UsZUFBQTtFQXZCSjtFQTBCRTtJQUNFLGVBQUE7RUF4Qko7RUEyQkU7SUFDRSxlQUFBO0VBekJKO0VBNEJFO0lBQ0UsZUFBQTtFQTFCSjtFQStCRTtJQUNFLGVBQUE7RUE3Qko7QUFDRlwiLFwic291cmNlc0NvbnRlbnRcIjpbXCIvKiBmb250IGZhbWlsaWVzICovXFxuQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9Q29taWMrTmV1ZSZmYW1pbHk9SzJEOml0YWwsd2dodEAxLDMwMCZmYW1pbHk9S3Jlb246d2dodEA1MDAmZmFtaWx5PU1vbnRzZXJyYXQ6d2dodEAzMDAmZmFtaWx5PVJlZW5pZStCZWFuaWUmZGlzcGxheT1zd2FwJyk7XFxuLypcXG5mb250LWZhbWlseTogJ0NvbWljIE5ldWUnLCBjdXJzaXZlO1xcbmZvbnQtZmFtaWx5OiAnSzJEJywgc2Fucy1zZXJpZjtcXG5mb250LWZhbWlseTogJ0tyZW9uJywgc2VyaWY7XFxuZm9udC1mYW1pbHk6ICdNb250c2VycmF0Jywgc2Fucy1zZXJpZjtcXG5mb250LWZhbWlseTogJ1JlZW5pZSBCZWFuaWUnLCBjdXJzaXZlOyovXFxuYm9keSB7XFxuICBwb3NpdGlvbjogcmVsYXRpdmU7XFxuICBiYWNrZ3JvdW5kOiB1cmwoJy4uL2ltZy9jbGVhcmNsb3VkeS5qcGcnKSBuby1yZXBlYXQgY2VudGVyIGZpeGVkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgbWF4LXdpZHRoOiA4MDBweDtcXG4gIGhlaWdodDogMTAwdmg7XFxufVxcbi5pbnZpc2libGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLnZpc2libGUtYmxvY2sge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbiNzZWFyY2gtZGl2IHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxuXFxuICAjaW5wdXQtY2l0eSB7XFxuICAgIC8vIGJhY2tncm91bmQtaW1hZ2U6IHVybCgnLi4vaW1nL21hZ25pZnlpbmdnbGFzcy5wbmcnKTtcXG4gICAgLy8gYmFja2dyb3VuZC1wb3NpdGlvbjogMTBweCAxMHB4O1xcbiAgICAvLyBiYWNrZ3JvdW5kLXNpemU6IDMxcHg7XFxuICAgIC8vIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XFxuXFxuICAgIGZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG5cXG4gICAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgICB3aWR0aDogMTAwJTtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgcGFkZGluZzogMTJweCAyMHB4O1xcbiAgICBtYXJnaW46IDhweCAwO1xcblxcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XFxuICAgIGZvbnQtc2l6ZTogMjJweDtcXG4gICAgJjpmb2N1cyB7XFxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzU1NTtcXG4gICAgfVxcbiAgfVxcblxcbiAgI2lucHV0LWZlZWRiYWNrIHtcXG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gICAgcGFkZGluZzogMTJweCAyMHB4O1xcbiAgICBtYXJnaW46IDhweCAwO1xcbiAgICBmb250LXNpemU6IDIwcHg7XFxuICAgIGJvcmRlcjogM3B4IHNvbGlkIHJnYigxOTIsIDExOCwgMTE4KTtcXG4gICAgYmFja2dyb3VuZC1jb2xvcjogd2hpdGVzbW9rZTtcXG4gICAgY29sb3I6IHJlZDtcXG4gIH1cXG5cXG4gICN1bml0cy1jb250YWluZXIge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyO1xcbiAgICBnYXA6IDEwcHg7XFxuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG5cXG4gICAgI21ldHJpYyxcXG4gICAgI2ltcGVyaWFsLFxcbiAgICAjc3RhbmRhcmQge1xcbiAgICAgIGFzcGVjdC1yYXRpbzogMTtcXG4gICAgICBkaXNwbGF5OiBncmlkO1xcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgICAganVzdGlmeS1pdGVtczogYmFzZWxpbmU7XFxuICAgICAgYm9yZGVyOiAzcHggc29saWQgIzU1NTtcXG4gICAgICBoZWlnaHQ6IDEwMHB4O1xcbiAgICAgIGZvbnQtc2l6ZTogODBweDtcXG4gICAgICBiYWNrZ3JvdW5kOiB3aGl0ZXNtb2tlO1xcblxcbiAgICAgIGN1cnNvcjogcG9pbnRlcjtcXG4gICAgfVxcbiAgICAuc2VsZWN0ZWQge1xcbiAgICAgIGJhY2tncm91bmQ6IHJnYigwLCAwLCA5OSkgIWltcG9ydGFudDtcXG4gICAgICBjb2xvcjogd2hpdGUgIWltcG9ydGFudDtcXG4gICAgICBib3JkZXI6IDNweCBzb2xpZCByZ2IoMTkxLCAyMDEsIDI1NSkgIWltcG9ydGFudDtcXG4gICAgICBvdXRsaW5lOiAxcHggc29saWQgcmdiKDI0MiwgMjQyLCAyNTUpICFpbXBvcnRhbnQ7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuI3dlYXRoZXItY2FudmFzIHtcXG4gIG1hcmdpbjogMTBweCBhdXRvO1xcbiAgcGFkZGluZzogNXB4O1xcbiAgbWF4LXdpZHRoOiA1MDBweDtcXG4gIGJhY2tncm91bmQ6IHJnYmEoMCwgMCwgMCwgMC40MDQpO1xcbiAgY29sb3I6IHdoaXRlc21va2U7XFxuXFxuICAjd2xvY2F0aW9uIHtcXG4gICAgZm9udC1zaXplOiA3MHB4O1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG4gIH1cXG5cXG4gICN3ZGVzYyB7XFxuICAgIGZvbnQtc2l6ZTogNjBweDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBmb250LWZhbWlseTogJ01vbnRzZXJyYXQnLCBzYW5zLXNlcmlmO1xcbiAgfVxcbiAgI3dpbWFnIHtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgfVxcbiAgI3d0ZW1wIHtcXG4gICAgZm9udC1zaXplOiA0MHB4O1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGZvbnQtZmFtaWx5OiAnTW9udHNlcnJhdCcsIHNhbnMtc2VyaWY7XFxuICB9XFxuXFxuICAjd3RoZXJtYWwge1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgY29sb3I6IHJnYig5OCwgMjQ4LCA5OCk7XFxuICAgIGZvbnQtZmFtaWx5OiAnTW9udHNlcnJhdCcsIHNhbnMtc2VyaWY7XFxuICB9XFxuXFxuICAjZm9vdC13ZWF0aGVyLWRhdGEge1xcbiAgICBkaXNwbGF5OiBncmlkO1xcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICAgIGZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG5cXG4gICAgI2xlZnQtY29udGFpbmVyIHtcXG4gICAgICBqdXN0aWZ5LXNlbGY6IHN0YXJ0O1xcbiAgICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcbiAgICAgIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmcjtcXG4gICAgICBqdXN0aWZ5LWl0ZW1zOiBsZWZ0O1xcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIH1cXG4gICAgI3JpZ2h0LWNvbnRhaW5lciB7XFxuICAgICAganVzdGlmeS1zZWxmOiBlbmQ7XFxuICAgICAgZGlzcGxheTogZ3JpZDtcXG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyO1xcbiAgICAgIGp1c3RpZnktaXRlbXM6IHJpZ2h0O1xcbiAgICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XFxuICAgIH1cXG4gICAgaW1nIHtcXG4gICAgICBoZWlnaHQ6IDUwcHg7XFxuICAgIH1cXG4gIH1cXG59XFxuXFxuI2NyZWRpdHMge1xcbiAgcG9zaXRpb246IGFic29sdXRlO1xcbiAgYm90dG9tOiAwO1xcbiAgd2lkdGg6IDEwMCU7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDAsIDAsIDEyOCwgMC4yNjcpO1xcbiAgZm9udC1zaXplOiAyMnB4O1xcbiAgY29sb3I6IG5hdnk7XFxuXFxuICBmb250LWZhbWlseTogJ0syRCcsIHNhbnMtc2VyaWY7XFxuXFxuICBhIHtcXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcXG4gICAgZm9udC1zaXplOiAxOHB4O1xcbiAgICBkaXNwbGF5OiBibG9jaztcXG4gICAgY29sb3I6IG5hdnk7XFxuICB9XFxufVxcblxcbkBtZWRpYSAobWF4LXdpZHRoOiAzNTBweCkge1xcbiAgI3NlYXJjaC1kaXYge1xcbiAgICAjaW5wdXQtY2l0eSB7XFxuICAgICAgd2lkdGg6IDMwMHB4O1xcbiAgICAgIGZvbnQtc2l6ZTogMTVweDtcXG4gICAgfVxcbiAgICAjdW5pdHMtY29udGFpbmVyIHtcXG4gICAgICAjbWV0cmljLFxcbiAgICAgICNpbXBlcmlhbCxcXG4gICAgICAjc3RhbmRhcmQge1xcbiAgICAgICAgaGVpZ2h0OiA2MHB4O1xcbiAgICAgICAgZm9udC1zaXplOiA1MHB4O1xcbiAgICAgIH1cXG4gICAgfVxcbiAgfVxcblxcbiAgI3dlYXRoZXItY2FudmFzIHtcXG4gICAgI3dsb2NhdGlvbiB7XFxuICAgICAgZm9udC1zaXplOiA2MHB4O1xcbiAgICB9XFxuXFxuICAgICN3ZGVzYyB7XFxuICAgICAgZm9udC1zaXplOiA0MHB4O1xcbiAgICB9XFxuXFxuICAgICN3dGVtcCB7XFxuICAgICAgZm9udC1zaXplOiAyMHB4O1xcbiAgICB9XFxuXFxuICAgICN3dGhlcm1hbCB7XFxuICAgICAgZm9udC1zaXplOiAyMHB4O1xcbiAgICB9XFxuICB9XFxuXFxuICAjY3JlZGl0cyB7XFxuICAgIGEge1xcbiAgICAgIGZvbnQtc2l6ZTogMTNweDtcXG4gICAgfVxcbiAgfVxcbn1cXG5cIl0sXCJzb3VyY2VSb290XCI6XCJcIn1dKTtcbi8vIEV4cG9ydHNcbmV4cG9ydCBkZWZhdWx0IF9fX0NTU19MT0FERVJfRVhQT1JUX19fO1xuIiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qXG4gIE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG4gIEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKSB7XG4gIHZhciBsaXN0ID0gW107XG5cbiAgLy8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuICBsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgcmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICB2YXIgY29udGVudCA9IFwiXCI7XG4gICAgICB2YXIgbmVlZExheWVyID0gdHlwZW9mIGl0ZW1bNV0gIT09IFwidW5kZWZpbmVkXCI7XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpO1xuICAgICAgfVxuICAgICAgaWYgKG5lZWRMYXllcikge1xuICAgICAgICBjb250ZW50ICs9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBjb250ZW50ICs9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSk7XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVsyXSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgaWYgKGl0ZW1bNF0pIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIHJldHVybiBjb250ZW50O1xuICAgIH0pLmpvaW4oXCJcIik7XG4gIH07XG5cbiAgLy8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3RcbiAgbGlzdC5pID0gZnVuY3Rpb24gaShtb2R1bGVzLCBtZWRpYSwgZGVkdXBlLCBzdXBwb3J0cywgbGF5ZXIpIHtcbiAgICBpZiAodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpIHtcbiAgICAgIG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIHVuZGVmaW5lZF1dO1xuICAgIH1cbiAgICB2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuICAgIGlmIChkZWR1cGUpIHtcbiAgICAgIGZvciAodmFyIGsgPSAwOyBrIDwgdGhpcy5sZW5ndGg7IGsrKykge1xuICAgICAgICB2YXIgaWQgPSB0aGlzW2tdWzBdO1xuICAgICAgICBpZiAoaWQgIT0gbnVsbCkge1xuICAgICAgICAgIGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBmb3IgKHZhciBfayA9IDA7IF9rIDwgbW9kdWxlcy5sZW5ndGg7IF9rKyspIHtcbiAgICAgIHZhciBpdGVtID0gW10uY29uY2F0KG1vZHVsZXNbX2tdKTtcbiAgICAgIGlmIChkZWR1cGUgJiYgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIGlmICh0eXBlb2YgbGF5ZXIgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgaWYgKHR5cGVvZiBpdGVtWzVdID09PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBsYXllclwiLmNvbmNhdChpdGVtWzVdLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQoaXRlbVs1XSkgOiBcIlwiLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVs1XSA9IGxheWVyO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAobWVkaWEpIHtcbiAgICAgICAgaWYgKCFpdGVtWzJdKSB7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGl0ZW1bMV0gPSBcIkBtZWRpYSBcIi5jb25jYXQoaXRlbVsyXSwgXCIge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bMl0gPSBtZWRpYTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHN1cHBvcnRzKSB7XG4gICAgICAgIGlmICghaXRlbVs0XSkge1xuICAgICAgICAgIGl0ZW1bNF0gPSBcIlwiLmNvbmNhdChzdXBwb3J0cyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQoaXRlbVs0XSwgXCIpIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzRdID0gc3VwcG9ydHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGxpc3QucHVzaChpdGVtKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsaXN0O1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXJsLCBvcHRpb25zKSB7XG4gIGlmICghb3B0aW9ucykge1xuICAgIG9wdGlvbnMgPSB7fTtcbiAgfVxuICBpZiAoIXVybCkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgdXJsID0gU3RyaW5nKHVybC5fX2VzTW9kdWxlID8gdXJsLmRlZmF1bHQgOiB1cmwpO1xuXG4gIC8vIElmIHVybCBpcyBhbHJlYWR5IHdyYXBwZWQgaW4gcXVvdGVzLCByZW1vdmUgdGhlbVxuICBpZiAoL15bJ1wiXS4qWydcIl0kLy50ZXN0KHVybCkpIHtcbiAgICB1cmwgPSB1cmwuc2xpY2UoMSwgLTEpO1xuICB9XG4gIGlmIChvcHRpb25zLmhhc2gpIHtcbiAgICB1cmwgKz0gb3B0aW9ucy5oYXNoO1xuICB9XG5cbiAgLy8gU2hvdWxkIHVybCBiZSB3cmFwcGVkP1xuICAvLyBTZWUgaHR0cHM6Ly9kcmFmdHMuY3Nzd2cub3JnL2Nzcy12YWx1ZXMtMy8jdXJsc1xuICBpZiAoL1tcIicoKSBcXHRcXG5dfCglMjApLy50ZXN0KHVybCkgfHwgb3B0aW9ucy5uZWVkUXVvdGVzKSB7XG4gICAgcmV0dXJuIFwiXFxcIlwiLmNvbmNhdCh1cmwucmVwbGFjZSgvXCIvZywgJ1xcXFxcIicpLnJlcGxhY2UoL1xcbi9nLCBcIlxcXFxuXCIpLCBcIlxcXCJcIik7XG4gIH1cbiAgcmV0dXJuIHVybDtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGl0ZW0pIHtcbiAgdmFyIGNvbnRlbnQgPSBpdGVtWzFdO1xuICB2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG4gIGlmICghY3NzTWFwcGluZykge1xuICAgIHJldHVybiBjb250ZW50O1xuICB9XG4gIGlmICh0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgdmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KGNzc01hcHBpbmcpKSkpO1xuICAgIHZhciBkYXRhID0gXCJzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCxcIi5jb25jYXQoYmFzZTY0KTtcbiAgICB2YXIgc291cmNlTWFwcGluZyA9IFwiLyojIFwiLmNvbmNhdChkYXRhLCBcIiAqL1wiKTtcbiAgICB2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuICAgICAgcmV0dXJuIFwiLyojIHNvdXJjZVVSTD1cIi5jb25jYXQoY3NzTWFwcGluZy5zb3VyY2VSb290IHx8IFwiXCIpLmNvbmNhdChzb3VyY2UsIFwiICovXCIpO1xuICAgIH0pO1xuICAgIHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oXCJcXG5cIik7XG4gIH1cbiAgcmV0dXJuIFtjb250ZW50XS5qb2luKFwiXFxuXCIpO1xufTsiLCJcbiAgICAgIGltcG9ydCBBUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanNcIjtcbiAgICAgIGltcG9ydCBkb21BUEkgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydEZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvaW5zZXJ0QnlTZWxlY3Rvci5qc1wiO1xuICAgICAgaW1wb3J0IHNldEF0dHJpYnV0ZXMgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMuanNcIjtcbiAgICAgIGltcG9ydCBpbnNlcnRTdHlsZUVsZW1lbnQgZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRTdHlsZUVsZW1lbnQuanNcIjtcbiAgICAgIGltcG9ydCBzdHlsZVRhZ1RyYW5zZm9ybUZuIGZyb20gXCIhLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanNcIjtcbiAgICAgIGltcG9ydCBjb250ZW50LCAqIGFzIG5hbWVkRXhwb3J0IGZyb20gXCIhIS4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4uLy4uL25vZGVfbW9kdWxlcy9zYXNzLWxvYWRlci9kaXN0L2Nqcy5qcyEuL3N0eWxlcy5zY3NzXCI7XG4gICAgICBcbiAgICAgIFxuXG52YXIgb3B0aW9ucyA9IHt9O1xuXG5vcHRpb25zLnN0eWxlVGFnVHJhbnNmb3JtID0gc3R5bGVUYWdUcmFuc2Zvcm1Gbjtcbm9wdGlvbnMuc2V0QXR0cmlidXRlcyA9IHNldEF0dHJpYnV0ZXM7XG5cbiAgICAgIG9wdGlvbnMuaW5zZXJ0ID0gaW5zZXJ0Rm4uYmluZChudWxsLCBcImhlYWRcIik7XG4gICAgXG5vcHRpb25zLmRvbUFQSSA9IGRvbUFQSTtcbm9wdGlvbnMuaW5zZXJ0U3R5bGVFbGVtZW50ID0gaW5zZXJ0U3R5bGVFbGVtZW50O1xuXG52YXIgdXBkYXRlID0gQVBJKGNvbnRlbnQsIG9wdGlvbnMpO1xuXG5cblxuZXhwb3J0ICogZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLnNjc3NcIjtcbiAgICAgICBleHBvcnQgZGVmYXVsdCBjb250ZW50ICYmIGNvbnRlbnQubG9jYWxzID8gY29udGVudC5sb2NhbHMgOiB1bmRlZmluZWQ7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxudmFyIHN0eWxlc0luRE9NID0gW107XG5cbmZ1bmN0aW9uIGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpIHtcbiAgdmFyIHJlc3VsdCA9IC0xO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3R5bGVzSW5ET00ubGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoc3R5bGVzSW5ET01baV0uaWRlbnRpZmllciA9PT0gaWRlbnRpZmllcikge1xuICAgICAgcmVzdWx0ID0gaTtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbmZ1bmN0aW9uIG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKSB7XG4gIHZhciBpZENvdW50TWFwID0ge307XG4gIHZhciBpZGVudGlmaWVycyA9IFtdO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXTtcbiAgICB2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcbiAgICB2YXIgY291bnQgPSBpZENvdW50TWFwW2lkXSB8fCAwO1xuICAgIHZhciBpZGVudGlmaWVyID0gXCJcIi5jb25jYXQoaWQsIFwiIFwiKS5jb25jYXQoY291bnQpO1xuICAgIGlkQ291bnRNYXBbaWRdID0gY291bnQgKyAxO1xuICAgIHZhciBpbmRleEJ5SWRlbnRpZmllciA9IGdldEluZGV4QnlJZGVudGlmaWVyKGlkZW50aWZpZXIpO1xuICAgIHZhciBvYmogPSB7XG4gICAgICBjc3M6IGl0ZW1bMV0sXG4gICAgICBtZWRpYTogaXRlbVsyXSxcbiAgICAgIHNvdXJjZU1hcDogaXRlbVszXSxcbiAgICAgIHN1cHBvcnRzOiBpdGVtWzRdLFxuICAgICAgbGF5ZXI6IGl0ZW1bNV1cbiAgICB9O1xuXG4gICAgaWYgKGluZGV4QnlJZGVudGlmaWVyICE9PSAtMSkge1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnJlZmVyZW5jZXMrKztcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4QnlJZGVudGlmaWVyXS51cGRhdGVyKG9iaik7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciB1cGRhdGVyID0gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucyk7XG4gICAgICBvcHRpb25zLmJ5SW5kZXggPSBpO1xuICAgICAgc3R5bGVzSW5ET00uc3BsaWNlKGksIDAsIHtcbiAgICAgICAgaWRlbnRpZmllcjogaWRlbnRpZmllcixcbiAgICAgICAgdXBkYXRlcjogdXBkYXRlcixcbiAgICAgICAgcmVmZXJlbmNlczogMVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWRlbnRpZmllcnMucHVzaChpZGVudGlmaWVyKTtcbiAgfVxuXG4gIHJldHVybiBpZGVudGlmaWVycztcbn1cblxuZnVuY3Rpb24gYWRkRWxlbWVudFN0eWxlKG9iaiwgb3B0aW9ucykge1xuICB2YXIgYXBpID0gb3B0aW9ucy5kb21BUEkob3B0aW9ucyk7XG4gIGFwaS51cGRhdGUob2JqKTtcblxuICB2YXIgdXBkYXRlciA9IGZ1bmN0aW9uIHVwZGF0ZXIobmV3T2JqKSB7XG4gICAgaWYgKG5ld09iaikge1xuICAgICAgaWYgKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcCAmJiBuZXdPYmouc3VwcG9ydHMgPT09IG9iai5zdXBwb3J0cyAmJiBuZXdPYmoubGF5ZXIgPT09IG9iai5sYXllcikge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGFwaS51cGRhdGUob2JqID0gbmV3T2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgYXBpLnJlbW92ZSgpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gdXBkYXRlcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGlzdCwgb3B0aW9ucykge1xuICBvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcbiAgbGlzdCA9IGxpc3QgfHwgW107XG4gIHZhciBsYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obGlzdCwgb3B0aW9ucyk7XG4gIHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuICAgIG5ld0xpc3QgPSBuZXdMaXN0IHx8IFtdO1xuXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBpZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW2ldO1xuICAgICAgdmFyIGluZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleF0ucmVmZXJlbmNlcy0tO1xuICAgIH1cblxuICAgIHZhciBuZXdMYXN0SWRlbnRpZmllcnMgPSBtb2R1bGVzVG9Eb20obmV3TGlzdCwgb3B0aW9ucyk7XG5cbiAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgbGFzdElkZW50aWZpZXJzLmxlbmd0aDsgX2krKykge1xuICAgICAgdmFyIF9pZGVudGlmaWVyID0gbGFzdElkZW50aWZpZXJzW19pXTtcblxuICAgICAgdmFyIF9pbmRleCA9IGdldEluZGV4QnlJZGVudGlmaWVyKF9pZGVudGlmaWVyKTtcblxuICAgICAgaWYgKHN0eWxlc0luRE9NW19pbmRleF0ucmVmZXJlbmNlcyA9PT0gMCkge1xuICAgICAgICBzdHlsZXNJbkRPTVtfaW5kZXhdLnVwZGF0ZXIoKTtcblxuICAgICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoX2luZGV4LCAxKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsYXN0SWRlbnRpZmllcnMgPSBuZXdMYXN0SWRlbnRpZmllcnM7XG4gIH07XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgbWVtbyA9IHt9O1xuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cbmZ1bmN0aW9uIGdldFRhcmdldCh0YXJnZXQpIHtcbiAgaWYgKHR5cGVvZiBtZW1vW3RhcmdldF0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICB2YXIgc3R5bGVUYXJnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCk7IC8vIFNwZWNpYWwgY2FzZSB0byByZXR1cm4gaGVhZCBvZiBpZnJhbWUgaW5zdGVhZCBvZiBpZnJhbWUgaXRzZWxmXG5cbiAgICBpZiAod2luZG93LkhUTUxJRnJhbWVFbGVtZW50ICYmIHN0eWxlVGFyZ2V0IGluc3RhbmNlb2Ygd2luZG93LkhUTUxJRnJhbWVFbGVtZW50KSB7XG4gICAgICB0cnkge1xuICAgICAgICAvLyBUaGlzIHdpbGwgdGhyb3cgYW4gZXhjZXB0aW9uIGlmIGFjY2VzcyB0byBpZnJhbWUgaXMgYmxvY2tlZFxuICAgICAgICAvLyBkdWUgdG8gY3Jvc3Mtb3JpZ2luIHJlc3RyaWN0aW9uc1xuICAgICAgICBzdHlsZVRhcmdldCA9IHN0eWxlVGFyZ2V0LmNvbnRlbnREb2N1bWVudC5oZWFkO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAvLyBpc3RhbmJ1bCBpZ25vcmUgbmV4dFxuICAgICAgICBzdHlsZVRhcmdldCA9IG51bGw7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWVtb1t0YXJnZXRdID0gc3R5bGVUYXJnZXQ7XG4gIH1cblxuICByZXR1cm4gbWVtb1t0YXJnZXRdO1xufVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5cblxuZnVuY3Rpb24gaW5zZXJ0QnlTZWxlY3RvcihpbnNlcnQsIHN0eWxlKSB7XG4gIHZhciB0YXJnZXQgPSBnZXRUYXJnZXQoaW5zZXJ0KTtcblxuICBpZiAoIXRhcmdldCkge1xuICAgIHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0JyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG4gIH1cblxuICB0YXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydEJ5U2VsZWN0b3I7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcbiAgdmFyIGVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG4gIG9wdGlvbnMuc2V0QXR0cmlidXRlcyhlbGVtZW50LCBvcHRpb25zLmF0dHJpYnV0ZXMpO1xuICBvcHRpb25zLmluc2VydChlbGVtZW50LCBvcHRpb25zLm9wdGlvbnMpO1xuICByZXR1cm4gZWxlbWVudDtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzKHN0eWxlRWxlbWVudCkge1xuICB2YXIgbm9uY2UgPSB0eXBlb2YgX193ZWJwYWNrX25vbmNlX18gIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfbm9uY2VfXyA6IG51bGw7XG5cbiAgaWYgKG5vbmNlKSB7XG4gICAgc3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIG5vbmNlKTtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlczsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuICB2YXIgY3NzID0gXCJcIjtcblxuICBpZiAob2JqLnN1cHBvcnRzKSB7XG4gICAgY3NzICs9IFwiQHN1cHBvcnRzIChcIi5jb25jYXQob2JqLnN1cHBvcnRzLCBcIikge1wiKTtcbiAgfVxuXG4gIGlmIChvYmoubWVkaWEpIHtcbiAgICBjc3MgKz0gXCJAbWVkaWEgXCIuY29uY2F0KG9iai5tZWRpYSwgXCIge1wiKTtcbiAgfVxuXG4gIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2Ygb2JqLmxheWVyICE9PSBcInVuZGVmaW5lZFwiO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJAbGF5ZXJcIi5jb25jYXQob2JqLmxheWVyLmxlbmd0aCA+IDAgPyBcIiBcIi5jb25jYXQob2JqLmxheWVyKSA6IFwiXCIsIFwiIHtcIik7XG4gIH1cblxuICBjc3MgKz0gb2JqLmNzcztcblxuICBpZiAobmVlZExheWVyKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICB2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuICBpZiAoc291cmNlTWFwICYmIHR5cGVvZiBidG9hICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gICAgY3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIi5jb25jYXQoYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSwgXCIgKi9cIik7XG4gIH0gLy8gRm9yIG9sZCBJRVxuXG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBpZiAgKi9cblxuXG4gIG9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcbiAgLy8gaXN0YW5idWwgaWdub3JlIGlmXG4gIGlmIChzdHlsZUVsZW1lbnQucGFyZW50Tm9kZSA9PT0gbnVsbCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuXG4gIHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBkb21BUEkob3B0aW9ucykge1xuICB2YXIgc3R5bGVFbGVtZW50ID0gb3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG4gIHJldHVybiB7XG4gICAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUob2JqKSB7XG4gICAgICBhcHBseShzdHlsZUVsZW1lbnQsIG9wdGlvbnMsIG9iaik7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuICAgIH1cbiAgfTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBkb21BUEk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuZnVuY3Rpb24gc3R5bGVUYWdUcmFuc2Zvcm0oY3NzLCBzdHlsZUVsZW1lbnQpIHtcbiAgaWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG4gICAgc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcbiAgfSBlbHNlIHtcbiAgICB3aGlsZSAoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuXG4gICAgc3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc3R5bGVUYWdUcmFuc2Zvcm07IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0dmFyIGNhY2hlZE1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF07XG5cdGlmIChjYWNoZWRNb2R1bGUgIT09IHVuZGVmaW5lZCkge1xuXHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcblx0fVxuXHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuXHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcblx0XHRpZDogbW9kdWxlSWQsXG5cdFx0Ly8gbm8gbW9kdWxlLmxvYWRlZCBuZWVkZWRcblx0XHRleHBvcnRzOiB7fVxuXHR9O1xuXG5cdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuXHRfX3dlYnBhY2tfbW9kdWxlc19fW21vZHVsZUlkXShtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuXHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuXHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG59XG5cbi8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBfX3dlYnBhY2tfbW9kdWxlc19fO1xuXG4iLCIvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuX193ZWJwYWNrX3JlcXVpcmVfXy5uID0gKG1vZHVsZSkgPT4ge1xuXHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cblx0XHQoKSA9PiAobW9kdWxlWydkZWZhdWx0J10pIDpcblx0XHQoKSA9PiAobW9kdWxlKTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZyA9IChmdW5jdGlvbigpIHtcblx0aWYgKHR5cGVvZiBnbG9iYWxUaGlzID09PSAnb2JqZWN0JykgcmV0dXJuIGdsb2JhbFRoaXM7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIHRoaXMgfHwgbmV3IEZ1bmN0aW9uKCdyZXR1cm4gdGhpcycpKCk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ29iamVjdCcpIHJldHVybiB3aW5kb3c7XG5cdH1cbn0pKCk7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5vID0gKG9iaiwgcHJvcCkgPT4gKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmosIHByb3ApKSIsIi8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uciA9IChleHBvcnRzKSA9PiB7XG5cdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuXHR9XG5cdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG59OyIsInZhciBzY3JpcHRVcmw7XG5pZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5nLmltcG9ydFNjcmlwdHMpIHNjcmlwdFVybCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5sb2NhdGlvbiArIFwiXCI7XG52YXIgZG9jdW1lbnQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLmcuZG9jdW1lbnQ7XG5pZiAoIXNjcmlwdFVybCAmJiBkb2N1bWVudCkge1xuXHRpZiAoZG9jdW1lbnQuY3VycmVudFNjcmlwdClcblx0XHRzY3JpcHRVcmwgPSBkb2N1bWVudC5jdXJyZW50U2NyaXB0LnNyY1xuXHRpZiAoIXNjcmlwdFVybCkge1xuXHRcdHZhciBzY3JpcHRzID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoXCJzY3JpcHRcIik7XG5cdFx0aWYoc2NyaXB0cy5sZW5ndGgpIHNjcmlwdFVybCA9IHNjcmlwdHNbc2NyaXB0cy5sZW5ndGggLSAxXS5zcmNcblx0fVxufVxuLy8gV2hlbiBzdXBwb3J0aW5nIGJyb3dzZXJzIHdoZXJlIGFuIGF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgeW91IG11c3Qgc3BlY2lmeSBhbiBvdXRwdXQucHVibGljUGF0aCBtYW51YWxseSB2aWEgY29uZmlndXJhdGlvblxuLy8gb3IgcGFzcyBhbiBlbXB0eSBzdHJpbmcgKFwiXCIpIGFuZCBzZXQgdGhlIF9fd2VicGFja19wdWJsaWNfcGF0aF9fIHZhcmlhYmxlIGZyb20geW91ciBjb2RlIHRvIHVzZSB5b3VyIG93biBsb2dpYy5cbmlmICghc2NyaXB0VXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJBdXRvbWF0aWMgcHVibGljUGF0aCBpcyBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlclwiKTtcbnNjcmlwdFVybCA9IHNjcmlwdFVybC5yZXBsYWNlKC8jLiokLywgXCJcIikucmVwbGFjZSgvXFw/LiokLywgXCJcIikucmVwbGFjZSgvXFwvW15cXC9dKyQvLCBcIi9cIik7XG5fX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBzY3JpcHRVcmw7IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5iID0gZG9jdW1lbnQuYmFzZVVSSSB8fCBzZWxmLmxvY2F0aW9uLmhyZWY7XG5cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgYW5kIGxvYWRpbmcgY2h1bmtzXG4vLyB1bmRlZmluZWQgPSBjaHVuayBub3QgbG9hZGVkLCBudWxsID0gY2h1bmsgcHJlbG9hZGVkL3ByZWZldGNoZWRcbi8vIFtyZXNvbHZlLCByZWplY3QsIFByb21pc2VdID0gY2h1bmsgbG9hZGluZywgMCA9IGNodW5rIGxvYWRlZFxudmFyIGluc3RhbGxlZENodW5rcyA9IHtcblx0XCJtYWluXCI6IDBcbn07XG5cbi8vIG5vIGNodW5rIG9uIGRlbWFuZCBsb2FkaW5nXG5cbi8vIG5vIHByZWZldGNoaW5nXG5cbi8vIG5vIHByZWxvYWRlZFxuXG4vLyBubyBITVJcblxuLy8gbm8gSE1SIG1hbmlmZXN0XG5cbi8vIG5vIG9uIGNodW5rcyBsb2FkZWRcblxuLy8gbm8ganNvbnAgZnVuY3Rpb24iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm5jID0gdW5kZWZpbmVkOyIsIi8qIGVzbGludC1lbmFibGUgKi9cbmltcG9ydCAnLi9jc3Mvc3R5bGVzLnNjc3MnO1xuaW1wb3J0IHsgbWFuYWdlRmV0Y2hzIH0gZnJvbSAnLi9qcy9mZXRjaERhdGEuanMnO1xuaW1wb3J0IHsgbWFuYWdlRE9NIH0gZnJvbSAnLi9qcy9tYW5hZ2VET00uanMnO1xuLyogZGVmaW5pdGlvbnMgaGVyZSB0byBiZSBhYmxlIHRvIHVzZSBlbSBpbnNpZGUgZnVuY3Rpb25zLiBpc24ndCBhIGJldHRlciB3YXk/ICovXG5jb25zdCBmZWVkYmFjayA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC1mZWVkYmFjaycpO1xuY29uc3QgaUNpdHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW5wdXQtY2l0eScpO1xuY29uc3QgbWV0cmljID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ21ldHJpYycpO1xuY29uc3QgaW1wZXJpYWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnaW1wZXJpYWwnKTtcbmNvbnN0IHN0YW5kYXJkID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3N0YW5kYXJkJyk7XG5sZXQgY3VycmVudFVuaXQgPSAnbWV0cmljJzsgLy8gYnkgZGVmYXVsdFxubGV0IGN1cnJlbnRDaXR5ID0gJyc7XG5cbmxvYWQoKTtcblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgc2V0TGlzdGVuZXJzKCk7XG59XG5cbmZ1bmN0aW9uIHNldExpc3RlbmVycygpIHtcbiAgaUNpdHkuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgc2V0Q2l0eSk7XG4gIG1ldHJpYy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNldFVuaXRTZWxlY3RlZCk7XG4gIGltcGVyaWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2V0VW5pdFNlbGVjdGVkKTtcbiAgc3RhbmRhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZXRVbml0U2VsZWN0ZWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkV2VhdGhlcigpIHtcbiAgaWYgKGN1cnJlbnRDaXR5ID09PSAnJyB8fCBjdXJyZW50Q2l0eSA9PT0gbnVsbCB8fCBjdXJyZW50Q2l0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gSWYgbm8gaW5wdXQgd2UgZG8gbm90aGluZywgYnV0IHJlbW92ZSB0aGUgZXJyb3IgbXNnXG4gICAgZmVlZGJhY2suY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XG4gICAgZmVlZGJhY2suY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgb2J0YWluKCd3ZWF0aGVyJywgY3VycmVudENpdHksIGN1cnJlbnRVbml0KTtcblxuICBpZiAod2VhdGhlckRhdGEgIT0gbnVsbCkge1xuICAgIG1hbmFnZURPTS5zZXRXZWF0aGVyKHdlYXRoZXJEYXRhKTtcbiAgICBmZWVkYmFjay50ZXh0Q29udGVudCA9ICcnO1xuICAgIGZlZWRiYWNrLmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgIGZlZWRiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgfSBlbHNlIHtcbiAgICBmZWVkYmFjay50ZXh0Q29udGVudCA9IFwiV2UgY291bGRuJ3QgZmluZCB0aGUgY2l0eSB5b3UncmUgbG9va2luZyBmb3JcIjtcbiAgICBmZWVkYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgICBmZWVkYmFjay5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gb2J0YWluKHR5cGUsIC4uLmFyZ3MpIHtcbiAgY29uc3QgZmV0Y2hlZERhdGEgPSBhd2FpdCBtYW5hZ2VGZXRjaHMub2J0YWluKHR5cGUsIGFyZ3MpLmNhdGNoKChlKSA9PiB7fSk7XG5cbiAgaWYgKGZldGNoZWREYXRhLmZlZWRiYWNrLmNvZGUgPT09IDApIHtcbiAgICByZXR1cm4gZmV0Y2hlZERhdGEuZGF0YTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVbml0U2VsZWN0ZWQoZSkge1xuICBjb25zdCBzZWxlY3RlZCA9IGUudGFyZ2V0O1xuXG4gIG1ldHJpYy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICBpbXBlcmlhbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICBzdGFuZGFyZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICBzZWxlY3RlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICBjdXJyZW50VW5pdCA9IFN0cmluZyhzZWxlY3RlZC5pZCk7XG4gIGxvYWRXZWF0aGVyKCk7XG59XG5cbmZ1bmN0aW9uIHNldENpdHkoZSkge1xuICBjdXJyZW50Q2l0eSA9IFN0cmluZyhpQ2l0eS52YWx1ZSk7XG4gIGxvYWRXZWF0aGVyKCk7XG59XG4iXSwibmFtZXMiOlsibWFuYWdlRmV0Y2hzIiwid0FwaUtleSIsIm1vZGUiLCJmZXRjaGVkRGF0YSIsImRhdGEiLCJmZWVkYmFjayIsImNvZGUiLCJyZWFzb24iLCJvYnRhaW4iLCJhcmdzIiwiYXNzaWduRmVlZGJhY2siLCJ0b0xvd2VyQ2FzZSIsImNpdHkiLCJTdHJpbmciLCJ1bml0cyIsInZhbGlkYXRlQ2l0eSIsImdldFdlYXRoZXJEYXRhIiwiY2F0Y2giLCJlIiwicmVnZXgiLCJ0ZXN0IiwiY29vcmRzIiwiZ2V0Q29vcmRzQnlDaXR5IiwidW5kZWZpbmVkIiwid2VhdGhlckRhdGEiLCJnZXRXZWF0aGVyQnlDb29yZHMiLCJsYXQiLCJsb24iLCJ1cmwiLCJyZXNwb25zZSIsImZldGNoIiwiZGF0YUpzb24iLCJqc29uIiwibWF4VGVtcCIsIm1pblRlbXAiLCJodW1pZGl0eSIsIndpbmRTcGVlZCIsIm1hbmFnZURPTSIsIndlYXRoZXJDYW52YXMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic2V0V2VhdGhlciIsImNsZWFuQ2FudmFzIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwic2lnbiIsImdldFRlbXBTaWduIiwibG9jYXRpb24iLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJkZXNjIiwid2VhdGhlciIsImRlc2NyaXB0aW9uIiwiaW1hZyIsInNyYyIsImljb24iLCJ0ZW1wIiwibWFpbiIsInRoZXJtYWwiLCJmZWVsc19saWtlIiwiZm9vdFdEYXRhIiwibGVmdENvbnRhaW5lciIsInJpZ2h0Q29udGFpbmVyIiwiaW1nTWF4VGVtcCIsInR4dE1heFRlbXAiLCJ0ZW1wX21heCIsImltZ01pblRlbXAiLCJ0eHRNaW5UZW1wIiwidGVtcF9taW4iLCJpbWdIdW1pZGl0eSIsInR4dEh1bWlkaXR5IiwiaW1nV2luZFNwZWVkIiwidHh0V2luZFNwZWVkIiwid2luZCIsInNwZWVkIiwiYXBwZW5kIiwiZGl2V2l0aFNpZ24iLCJxdWVyeVNlbGVjdG9yIiwiZmlyc3RDaGlsZCIsInJlbW92ZUNoaWxkIiwiaUNpdHkiLCJtZXRyaWMiLCJpbXBlcmlhbCIsInN0YW5kYXJkIiwiY3VycmVudFVuaXQiLCJjdXJyZW50Q2l0eSIsImxvYWQiLCJzZXRMaXN0ZW5lcnMiLCJhZGRFdmVudExpc3RlbmVyIiwic2V0Q2l0eSIsInNldFVuaXRTZWxlY3RlZCIsImxvYWRXZWF0aGVyIiwiYWRkIiwidHlwZSIsInNlbGVjdGVkIiwidGFyZ2V0IiwidmFsdWUiXSwic291cmNlUm9vdCI6IiJ9