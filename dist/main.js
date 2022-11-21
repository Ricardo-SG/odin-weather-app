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
    console.log('<getTempSign>' + divWithSign);
    console.log('divWithSign.textcontent:' + divWithSign.textContent);
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
let currentUnit = '';
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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QUFzQixLQUFLLGdJQUFnSSxtQkFBbUIsc0JBQXNCLEtBQUssZ0NBQWdDLHNCQUFzQixLQUFLLDRCQUE0QixzQkFBc0IsS0FBSyw0QkFBNEIsc0JBQXNCLEtBQUssK0JBQStCLHNCQUFzQixLQUFLLGdCQUFnQixzQkFBc0IsS0FBSyxHQUFHLE9BQU8sNEZBQTRGLFNBQVMsTUFBTSxLQUFLLFdBQVcsV0FBVyxXQUFXLFVBQVUsV0FBVyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxVQUFVLE1BQU0sS0FBSyxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsV0FBVyxVQUFVLFdBQVcsV0FBVyxVQUFVLFdBQVcsVUFBVSxLQUFLLEtBQUssV0FBVyxLQUFLLEtBQUssV0FBVyxXQUFXLFVBQVUsVUFBVSxXQUFXLFdBQVcsVUFBVSxLQUFLLEtBQUssVUFBVSxXQUFXLFVBQVUsV0FBVyxXQUFXLEtBQUssT0FBTyxVQUFVLFVBQVUsV0FBVyxXQUFXLFdBQVcsVUFBVSxVQUFVLFdBQVcsVUFBVSxLQUFLLEtBQUssV0FBVyxXQUFXLFdBQVcsV0FBVyxNQUFNLEtBQUssV0FBVyxVQUFVLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxVQUFVLFVBQVUsVUFBVSxXQUFXLEtBQUssS0FBSyxVQUFVLFVBQVUsVUFBVSxXQUFXLEtBQUssS0FBSyxVQUFVLFVBQVUsS0FBSyxLQUFLLFVBQVUsVUFBVSxVQUFVLFdBQVcsS0FBSyxLQUFLLFVBQVUsVUFBVSxVQUFVLFdBQVcsV0FBVyxLQUFLLEtBQUssVUFBVSxXQUFXLFdBQVcsS0FBSyxLQUFLLFdBQVcsVUFBVSxXQUFXLFdBQVcsV0FBVyxXQUFXLEtBQUssS0FBSyxXQUFXLFVBQVUsV0FBVyxXQUFXLFdBQVcsV0FBVyxLQUFLLEtBQUssVUFBVSxNQUFNLE1BQU0sV0FBVyxVQUFVLFVBQVUsV0FBVyxVQUFVLFVBQVUsV0FBVyxNQUFNLE1BQU0sV0FBVyxVQUFVLFVBQVUsVUFBVSxPQUFPLE1BQU0sS0FBSyxVQUFVLFVBQVUsTUFBTSxRQUFRLFVBQVUsVUFBVSxNQUFNLE1B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RUFBRTtFQUNsQnVFLFdBQVcsR0FBRzVFLE1BQU0sQ0FBQ3VFLEtBQUssQ0FBQ2dCLEtBQUssQ0FBQztFQUNqQ0wsV0FBVyxFQUFFO0FBQ2YsQyIsInNvdXJjZXMiOlsid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvanMvZmV0Y2hEYXRhLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvanMvbWFuYWdlRE9NLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9zcmMvY3NzL3N0eWxlcy5zY3NzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvYXBpLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvZ2V0VXJsLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2Nzcy9zdHlsZXMuc2Nzcz83YjJmIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbmplY3RTdHlsZXNJbnRvU3R5bGVUYWcuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydEJ5U2VsZWN0b3IuanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC8uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzLmpzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZURvbUFQSS5qcyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9kaXN0L3J1bnRpbWUvc3R5bGVUYWdUcmFuc2Zvcm0uanMiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL2Jvb3RzdHJhcCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9jb21wYXQgZ2V0IGRlZmF1bHQgZXhwb3J0Iiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL2dsb2JhbCIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvbWFrZSBuYW1lc3BhY2Ugb2JqZWN0Iiwid2VicGFjazovL29kaW4td2VhdGhlci1hcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vb2Rpbi13ZWF0aGVyLWFwcC93ZWJwYWNrL3J1bnRpbWUvanNvbnAgY2h1bmsgbG9hZGluZyIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwL3dlYnBhY2svcnVudGltZS9ub25jZSIsIndlYnBhY2s6Ly9vZGluLXdlYXRoZXItYXBwLy4vc3JjL2luZGV4LmpzIl0sInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1lbmFibGUgKi9cblxuLy8gV2UgdXNlIGEgbW9kdWxlIFBhdHRlcm4gdG8gZGVmaW5lIGEgc2luZ2xlIG9iamVjdCB0aGF0IHdpbGwgaGFuZGxlIHRoZSBmZXRjaHMuXG4vLyB0aGlzIG9iamVjdCB3aWxsIGNvbnRhaW4gdGhlIGFwaSBrZXlzIGFzIGEgcHJpdmF0ZSB2YXJpYWJsZSBhbmQgdGhlIGZ1bmN0aW9ucyB0byBkbyB0aGUgcmVxdWVzdHMuXG5jb25zdCBtYW5hZ2VGZXRjaHMgPSAoZnVuY3Rpb24gKCkge1xuICBjb25zdCB3QXBpS2V5ID0gJzA1ODA0NWNjYzY0NTQ2YmIzOTNhZmNmNjdjOWY4NjRmJzsgLy8gaXQncyBhIHB1YmxpYyBBUElcbiAgY29uc3QgbW9kZSA9IHsgbW9kZTogJ2NvcnMnIH07XG4gIGNvbnN0IGZldGNoZWREYXRhID0ge1xuICAgIGRhdGE6IHt9LFxuICAgIGZlZWRiYWNrOiB7XG4gICAgICAvKiBcbiAgICAgICAgTGlzdCBvZiBwb3NzaWJsZSB2YWx1ZXMgZm9yIGNvZGU6XG4gICAgICAgIDAgLT4gbm8gZXJyb3IsIHRoZSBmZXRjaCB3ZW50IG9rYXlcbiAgICAgICAgMiAtPiB0aGUgYXJndW1lbnQgJ2NpdHknIGZvciAnd2VhdGhlcicgZmV0Y2ggd2FzIGluY29ycmVjdFxuICAgICAgICAzIC0+IGFuIGVycm9yIG9jdXJyZWQgd2hpbGUgZmV0Y2hpbmdcbiAgICAgICovXG4gICAgICBjb2RlOiAwLFxuICAgICAgcmVhc29uOiAnJyxcbiAgICB9LFxuICB9O1xuXG4gIC8vIGRhdGEgLS0+IFRlbGxzIHVzIHdoYXQgd2UgZ29ubmEgZmV0Y2hcbiAgLy8gLi4uYXJncyAtLT4gcmVjZWl2ZSB0aGUgYXJndW1lbnRzIGZvciB0aGUgY2FsbC5cbiAgYXN5bmMgZnVuY3Rpb24gb2J0YWluKGRhdGEsIGFyZ3MpIHtcbiAgICBhc3NpZ25GZWVkYmFjaygwKTsgLy8gYnkgZGVmYXVsdCB3ZSd2ZSB3b3JrZWQgZmluZVxuXG4gICAgc3dpdGNoIChkYXRhLnRvTG93ZXJDYXNlKCkpIHtcbiAgICAgIGNhc2UgJ3dlYXRoZXInOiB7XG4gICAgICAgIGNvbnN0IGNpdHkgPSBTdHJpbmcoYXJnc1swXSk7XG4gICAgICAgIGNvbnN0IHVuaXRzID0gU3RyaW5nKGFyZ3NbMV0pOyAvLyBJdCBjYW4gb25seSBiZSAnbWV0cmljcycsIGltcGVyaWFsLCBvciBzdGFuZGFyZFxuICAgICAgICBpZiAodmFsaWRhdGVDaXR5KGNpdHkpKSB7XG4gICAgICAgICAgZmV0Y2hlZERhdGEuZGF0YSA9IGF3YWl0IGdldFdlYXRoZXJEYXRhKFxuICAgICAgICAgICAgY2l0eS50b0xvd2VyQ2FzZSgpLFxuICAgICAgICAgICAgdW5pdHNcbiAgICAgICAgICApLmNhdGNoKChlKSA9PiB7XG4gICAgICAgICAgICBhc3NpZ25GZWVkYmFjaygxKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAvLyBDaXR5IGFyZ3VtZW50IGlzIHdyb25nXG4gICAgICAgICAgYXNzaWduRmVlZGJhY2soMik7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyB0aGUgZGF0YSBhcmd1bWVudCBpcyB3cm9uZ1xuICAgICAgICBhc3NpZ25GZWVkYmFjaygzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZldGNoZWREYXRhO1xuICB9XG5cbiAgZnVuY3Rpb24gdmFsaWRhdGVDaXR5KGNpdHkpIHtcbiAgICAvLyBJJ20gc29ycnkgaWYgc29tZSByYXJlIG5hbWVzIHdpdGggcHVuY3R1YXRpb25zIHNpZ24gZG9lc24ndCB3b3JrLlxuICAgIC8vIElmIHRoaXMgd2FzIHByb2Zlc3Npb25hbCBJJ2Qgc2VhcmNoIGJldHRlciBob3cgdG8gdmFsaWQgbmFtZXMgb3Igd291bGQgdXNlXG4gICAgLy8gYSBsaXN0IG9mIHZhbGlkIG1hdGNoZXNcbiAgICBjb25zdCByZWdleCA9IC8oW2EtekEtWl0rfFthLXpBLVpdK1xcc1thLXpBLVpdKykvO1xuICAgIHJldHVybiByZWdleC50ZXN0KGNpdHkpO1xuICB9XG5cbiAgYXN5bmMgZnVuY3Rpb24gZ2V0V2VhdGhlckRhdGEoY2l0eSwgdW5pdHMpIHtcbiAgICAvLyBXZSBkbyB0d28gQVBJIGZldGNoXG4gICAgLy8gMSkgRmlyc3QgR2VvY29kaW5nIGFwaSB0byBvYnRhaW4gbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZVxuICAgIC8vIDIpIFRoZW4gT3BlbldlYXRoZXIgdG8gb2J0YWluIHRoZSB3ZWF0aGVyIGluZm9ybWF0aW9uXG5cbiAgICAvLyAxKSBHZW9jb2RpbmcgZmV0Y2hcbiAgICBjb25zdCBjb29yZHMgPSBhd2FpdCBnZXRDb29yZHNCeUNpdHkoY2l0eSkuY2F0Y2goKGUpID0+IHtcbiAgICAgIGFzc2lnbkZlZWRiYWNrKDQpO1xuICAgIH0pO1xuXG4gICAgaWYgKGNvb3Jkc1swXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAvLyAyKSBPcGVud2VhdGhlciBmZXRjaFxuICAgICAgY29uc3Qgd2VhdGhlckRhdGEgPSBhd2FpdCBnZXRXZWF0aGVyQnlDb29yZHMoXG4gICAgICAgIGNvb3Jkc1swXS5sYXQsXG4gICAgICAgIGNvb3Jkc1swXS5sb24sXG4gICAgICAgIHVuaXRzXG4gICAgICApLmNhdGNoKChlKSA9PiB7XG4gICAgICAgIGFzc2lnbkZlZWRiYWNrKDUpO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gd2VhdGhlckRhdGE7XG4gICAgfSBlbHNlIHtcbiAgICAgIGFzc2lnbkZlZWRiYWNrKDYpO1xuICAgIH1cbiAgfVxuXG4gIGFzeW5jIGZ1bmN0aW9uIGdldENvb3Jkc0J5Q2l0eShjaXR5KSB7XG4gICAgLy8gVGhlIFVSTCBmb3IgR0VPQ09ESU5HIGFwaVxuICAgIGNvbnN0IHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZ2VvLzEuMC9kaXJlY3Q/cT0ke2NpdHl9JmFwcGlkPSR7d0FwaUtleX1gO1xuXG4gICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCh1cmwsIG1vZGUpO1xuICAgIGNvbnN0IGRhdGFKc29uID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgIHJldHVybiBkYXRhSnNvbjtcbiAgfVxuXG4gIC8qIFRoaXMgZnVuY3Rpb24gZ2V0J3MgdGhlIHdlYXRoZXIgRm9yZWNhc3QgYnkgdXNpbmcgbGF0aXR1ZGUgYW5kIGxvbmdpdHVkZSBwYXJhbWV0dGVycyAqL1xuICAvKiBUaGUgdXNlciBjYW4gYWxzbyBpbmZvcm0gdW5pdHMgYXMgbWV0cmljIChDZWxzaXVzKSwgaW1wZXJpYWwgKEZhcmVuaGVpdCkgb3Igc3RhbmRhcmQgKEtlbHZpbikgKi9cbiAgLyogSWYgbm8gdW5pdCBoYXMgYmVlbiBwcm92aWRlZCwgd2Ugd2lsbCBnb25uYSB1c2UgbWV0cmljLCBpZiB0aGUgdXJsIGRvZXNuJ3QgaGF2ZSB1bml0IGRlZmluZWQvKiAgIGl0IHdpbGwgdGFrZSBieSBkZWZhdWx0IFwic3RhbmRhcmRcIiBhbmQgcmV0dXJuIEtlbHZpbi4gKi9cbiAgLyogTGlzdCBvZiBhbGwgQVBJIHBhcmFtZXRlcnMgd2l0aCB1bml0cyBvcGVud2VhdGhlcm1hcC5vcmcvd2VhdGhlci1kYXRhICovXG4gIGFzeW5jIGZ1bmN0aW9uIGdldFdlYXRoZXJCeUNvb3JkcyhsYXQsIGxvbiwgdW5pdHMpIHtcbiAgICBpZiAodW5pdHMgPT09IG51bGwgfHwgdW5pdHMgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdW5pdHMgPSAnbWV0cmljJztcbiAgICB9XG5cbiAgICAvLyBUaGUgVVJMIGZvciBXZWF0aGVyIGFwaVxuICAgIGNvbnN0IHVybCA9IGBodHRwczovL2FwaS5vcGVud2VhdGhlcm1hcC5vcmcvZGF0YS8yLjUvd2VhdGhlcj9sYXQ9JHtsYXR9Jmxvbj0ke2xvbn0mdW5pdHM9JHt1bml0c30mYXBwaWQ9JHt3QXBpS2V5fWA7XG5cbiAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKHVybCwgbW9kZSk7XG4gICAgY29uc3QgZGF0YUpzb24gPSBhd2FpdCByZXNwb25zZS5qc29uKCk7XG4gICAgcmV0dXJuIGRhdGFKc29uO1xuICB9XG5cbiAgZnVuY3Rpb24gYXNzaWduRmVlZGJhY2soY29kZSkge1xuICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLmNvZGUgPSBjb2RlO1xuICAgIC8vIGxldHMgYXNzaWduIGEgcmVhc29uXG4gICAgc3dpdGNoIChjb2RlKSB7XG4gICAgICBjYXNlIDA6IHtcbiAgICAgICAgLy8gYWxsIHdlbnQgb2theVxuICAgICAgICBmZXRjaGVkRGF0YS5mZWVkYmFjay5yZWFzb24gPSAnb2snO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgMToge1xuICAgICAgICBmZXRjaGVkRGF0YS5mZWVkYmFjay5yZWFzb24gPSAnRXJyb3IgZHVyaW5nIGZldGNoaW5nIGRhdGEnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgMjoge1xuICAgICAgICBmZXRjaGVkRGF0YS5mZWVkYmFjay5yZWFzb24gPSBcIkNpdHkgYXJndW1lbnQgZG9lc24ndCBjb21wbHkgZm9ybWF0XCI7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSAzOiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdGZXRjaCB0eXBlIG5vdCBjb2RpZmllZC4nO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNhc2UgNDoge1xuICAgICAgICBmZXRjaGVkRGF0YS5mZWVkYmFjay5yZWFzb24gPSAnRXJyb3IgZmV0Y2hpbmcgR2VvQ29kaW5nJztcbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICBjYXNlIDU6IHtcbiAgICAgICAgZmV0Y2hlZERhdGEuZmVlZGJhY2sucmVhc29uID0gJ0Vycm9yIGZldGNoaW5nIG9wZW53ZWF0aGVyIGJ5IGNvb3Jkcyc7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgY2FzZSA2OiB7XG4gICAgICAgIGZldGNoZWREYXRhLmZlZWRiYWNrLnJlYXNvbiA9ICdMb2NhdGlvbiBub3QgZm91bmQnO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4geyBvYnRhaW4gfTtcbn0pKCk7XG5cbmV4cG9ydCB7IG1hbmFnZUZldGNocyB9O1xuIiwiLyogZXNsaW50LWVuYWJsZSAqL1xuaW1wb3J0IG1heFRlbXAgZnJvbSAnLi4vaW1nL2hpZ2gtdGVtcC5wbmcnO1xuaW1wb3J0IG1pblRlbXAgZnJvbSAnLi4vaW1nL2xvdy10ZW1wLnBuZyc7XG5pbXBvcnQgaHVtaWRpdHkgZnJvbSAnLi4vaW1nL2h1bWlkaXR5LnBuZyc7XG5pbXBvcnQgd2luZFNwZWVkIGZyb20gJy4uL2ltZy93aW5kU3BlZWQucG5nJztcblxuLy8gVGhpcyBtb2R1bGUgcGF0dGVybiB3aWxsIG1hbmFnZSB0aGUgZG9tIG1vZGlmaWNhdGlvbnMgb2Ygb3VyIHdlYlxuY29uc3QgbWFuYWdlRE9NID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gQWxsIHRoZSB3ZWIgZWxlbWVudHMgd2Ugd2FudCB0byB3b3JrIHdpdGhcbiAgY29uc3Qgd2VhdGhlckNhbnZhcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCd3ZWF0aGVyLWNhbnZhcycpO1xuXG4gIGNvbnN0IHNldFdlYXRoZXIgPSBmdW5jdGlvbiAoZGF0YSkge1xuICAgIGNsZWFuQ2FudmFzKCk7IC8vIFdlIGRlbGV0ZSBhbGwgY2hpbGRzIG9mIHdlYXRoZXJDYW52YXMgaWYgaXQgaGFzIGZyb20gYSBwcmV2aW91cyBzZXRcbiAgICB3ZWF0aGVyQ2FudmFzLmNsYXNzTGlzdC5yZW1vdmUoJ2ludmlzaWJsZScpO1xuICAgIGNvbnN0IHNpZ24gPSBnZXRUZW1wU2lnbigpO1xuICAgIC8vIGNvbnN0IHNpZ24gPSAnIMKwQyc7XG5cbiAgICBjb25zdCBsb2NhdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBsb2NhdGlvbi5pZCA9ICd3bG9jYXRpb24nO1xuICAgIGxvY2F0aW9uLnRleHRDb250ZW50ID0gZGF0YS5uYW1lO1xuXG4gICAgY29uc3QgZGVzYyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICBkZXNjLmlkID0gJ3dkZXNjJztcbiAgICBkZXNjLnRleHRDb250ZW50ID0gZGF0YS53ZWF0aGVyWzBdLmRlc2NyaXB0aW9uO1xuXG4gICAgY29uc3QgaW1hZyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltYWcuaWQgPSAnd2ltYWcnO1xuICAgIGltYWcuc3JjID0gYGh0dHBzOi8vb3BlbndlYXRoZXJtYXAub3JnL2ltZy93bi8ke2RhdGEud2VhdGhlclswXS5pY29ufUAyeC5wbmdgO1xuXG4gICAgY29uc3QgdGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTtcbiAgICB0ZW1wLmlkID0gJ3d0ZW1wJztcbiAgICB0ZW1wLnRleHRDb250ZW50ID0gZGF0YS5tYWluLnRlbXAgKyBzaWduO1xuXG4gICAgY29uc3QgdGhlcm1hbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3AnKTsgLy8gdGhlcm1hbCBTZW5zYXRpb25cbiAgICB0aGVybWFsLmlkID0gJ3d0aGVybWFsJztcbiAgICB0aGVybWFsLnRleHRDb250ZW50ID0gJ0ZlZWxzIGxpa2U6ICcgKyBkYXRhLm1haW4uZmVlbHNfbGlrZSArIHNpZ247XG5cbiAgICBjb25zdCBmb290V0RhdGEgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBmb290V0RhdGEuaWQgPSAnZm9vdC13ZWF0aGVyLWRhdGEnO1xuICAgIGNvbnN0IGxlZnRDb250YWluZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBsZWZ0Q29udGFpbmVyLmlkID0gJ2xlZnQtY29udGFpbmVyJztcbiAgICBjb25zdCByaWdodENvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHJpZ2h0Q29udGFpbmVyLmlkID0gJ3JpZ2h0LWNvbnRhaW5lcic7XG5cbiAgICAvKiBNYXggdGVtcCBpY29uIGFuZCB0ZXh0ICovXG4gICAgY29uc3QgaW1nTWF4VGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZ01heFRlbXAuaWQgPSAnaW1nLW1heC10ZW1wJztcbiAgICBpbWdNYXhUZW1wLnNyYyA9IG1heFRlbXA7XG4gICAgY29uc3QgdHh0TWF4VGVtcCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHR4dE1heFRlbXAuaWQgPSAndHh0LW1heC10ZW1wJztcbiAgICB0eHRNYXhUZW1wLnRleHRDb250ZW50ID0gZGF0YS5tYWluLnRlbXBfbWF4ICsgc2lnbjtcblxuICAgIC8qIE1pbiB0ZW1wIGljb24gYW5kIHRleHQgKi9cbiAgICBjb25zdCBpbWdNaW5UZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nTWluVGVtcC5pZCA9ICdpbWctbWluLXRlbXAnO1xuICAgIGltZ01pblRlbXAuc3JjID0gbWluVGVtcDtcbiAgICBjb25zdCB0eHRNaW5UZW1wID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdHh0TWluVGVtcC5pZCA9ICd0eHQtbWluLXRlbXAnO1xuICAgIHR4dE1pblRlbXAudGV4dENvbnRlbnQgPSBkYXRhLm1haW4udGVtcF9taW4gKyBzaWduO1xuXG4gICAgLyogSHVtaWRpdHkgaWNvbiBhbmQgdGV4dCAqL1xuICAgIGNvbnN0IGltZ0h1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW1nJyk7XG4gICAgaW1nSHVtaWRpdHkuaWQgPSAnaW1nLWh1bWlkaXR5JztcbiAgICBpbWdIdW1pZGl0eS5zcmMgPSBodW1pZGl0eTtcblxuICAgIGNvbnN0IHR4dEh1bWlkaXR5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdHh0SHVtaWRpdHkuaWQgPSAndHh0LWh1bWlkaXR5JztcbiAgICB0eHRIdW1pZGl0eS50ZXh0Q29udGVudCA9IGRhdGEubWFpbi5odW1pZGl0eSArICclJztcblxuICAgIC8qIFdpbmQgc3BlZWQgaWNvbiBhbmQgdGV4dCAqL1xuICAgIGNvbnN0IGltZ1dpbmRTcGVlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2ltZycpO1xuICAgIGltZ1dpbmRTcGVlZC5pZCA9ICdpbWctV2luZC1zcGVlZCc7XG4gICAgaW1nV2luZFNwZWVkLnNyYyA9IHdpbmRTcGVlZDtcblxuICAgIGNvbnN0IHR4dFdpbmRTcGVlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIHR4dFdpbmRTcGVlZC5pZCA9ICd0eHQtd2luZC1zcGVlZCc7XG4gICAgdHh0V2luZFNwZWVkLnRleHRDb250ZW50ID0gZGF0YS53aW5kLnNwZWVkICsgJyBrbS9oJztcblxuICAgIGxlZnRDb250YWluZXIuYXBwZW5kKGltZ01heFRlbXAsIHR4dE1heFRlbXAsIGltZ01pblRlbXAsIHR4dE1pblRlbXApO1xuICAgIHJpZ2h0Q29udGFpbmVyLmFwcGVuZCh0eHRIdW1pZGl0eSwgaW1nSHVtaWRpdHksIHR4dFdpbmRTcGVlZCwgaW1nV2luZFNwZWVkKTtcbiAgICBmb290V0RhdGEuYXBwZW5kKGxlZnRDb250YWluZXIsIHJpZ2h0Q29udGFpbmVyKTtcblxuICAgIHdlYXRoZXJDYW52YXMuYXBwZW5kKGxvY2F0aW9uLCBkZXNjLCBpbWFnLCB0ZW1wLCB0aGVybWFsLCBmb290V0RhdGEpO1xuICB9O1xuXG4gIGZ1bmN0aW9uIGdldFRlbXBTaWduKCkge1xuICAgIGNvbnN0IGRpdldpdGhTaWduID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNlbGVjdGVkJyk7XG4gICAgY29uc29sZS5sb2coJzxnZXRUZW1wU2lnbj4nICsgZGl2V2l0aFNpZ24pO1xuICAgIGNvbnNvbGUubG9nKCdkaXZXaXRoU2lnbi50ZXh0Y29udGVudDonICsgZGl2V2l0aFNpZ24udGV4dENvbnRlbnQpO1xuXG4gICAgcmV0dXJuICcgJyArIGRpdldpdGhTaWduLnRleHRDb250ZW50O1xuICB9XG5cbiAgY29uc3QgY2xlYW5DYW52YXMgPSBmdW5jdGlvbiAoKSB7XG4gICAgd2hpbGUgKHdlYXRoZXJDYW52YXMuZmlyc3RDaGlsZCkge1xuICAgICAgd2VhdGhlckNhbnZhcy5yZW1vdmVDaGlsZCh3ZWF0aGVyQ2FudmFzLmZpcnN0Q2hpbGQpO1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4geyBzZXRXZWF0aGVyIH07XG59KSgpO1xuXG5leHBvcnQgeyBtYW5hZ2VET00gfTtcbiIsIi8vIEltcG9ydHNcbmltcG9ydCBfX19DU1NfTE9BREVSX0FQSV9TT1VSQ0VNQVBfSU1QT1JUX19fIGZyb20gXCIuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L3J1bnRpbWUvc291cmNlTWFwcy5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfQVBJX0lNUE9SVF9fXyBmcm9tIFwiLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9ydW50aW1lL2FwaS5qc1wiO1xuaW1wb3J0IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18gZnJvbSBcIi4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2Rpc3QvcnVudGltZS9nZXRVcmwuanNcIjtcbnZhciBfX19DU1NfTE9BREVSX1VSTF9JTVBPUlRfMF9fXyA9IG5ldyBVUkwoXCIuLi9pbWcvY2xlYXJjbG91ZHkuanBnXCIsIGltcG9ydC5tZXRhLnVybCk7XG52YXIgX19fQ1NTX0xPQURFUl9FWFBPUlRfX18gPSBfX19DU1NfTE9BREVSX0FQSV9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9BUElfU09VUkNFTUFQX0lNUE9SVF9fXyk7XG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiQGltcG9ydCB1cmwoaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Db21pYytOZXVlJmZhbWlseT1LMkQ6aXRhbCx3Z2h0QDEsMzAwJmZhbWlseT1LcmVvbjp3Z2h0QDUwMCZmYW1pbHk9TW9udHNlcnJhdDp3Z2h0QDMwMCZmYW1pbHk9UmVlbmllK0JlYW5pZSZkaXNwbGF5PXN3YXApO1wiXSk7XG52YXIgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyA9IF9fX0NTU19MT0FERVJfR0VUX1VSTF9JTVBPUlRfX18oX19fQ1NTX0xPQURFUl9VUkxfSU1QT1JUXzBfX18pO1xuLy8gTW9kdWxlXG5fX19DU1NfTE9BREVSX0VYUE9SVF9fXy5wdXNoKFttb2R1bGUuaWQsIFwiLyogZm9udCBmYW1pbGllcyAqL1xcbi8qXFxuZm9udC1mYW1pbHk6ICdDb21pYyBOZXVlJywgY3Vyc2l2ZTtcXG5mb250LWZhbWlseTogJ0syRCcsIHNhbnMtc2VyaWY7XFxuZm9udC1mYW1pbHk6ICdLcmVvbicsIHNlcmlmO1xcbmZvbnQtZmFtaWx5OiAnTW9udHNlcnJhdCcsIHNhbnMtc2VyaWY7XFxuZm9udC1mYW1pbHk6ICdSZWVuaWUgQmVhbmllJywgY3Vyc2l2ZTsqL1xcbmJvZHkge1xcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xcbiAgYmFja2dyb3VuZDogdXJsKFwiICsgX19fQ1NTX0xPQURFUl9VUkxfUkVQTEFDRU1FTlRfMF9fXyArIFwiKSBuby1yZXBlYXQgY2VudGVyIGZpeGVkO1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luOiBhdXRvO1xcbiAgbWF4LXdpZHRoOiA4MDBweDtcXG4gIGhlaWdodDogMTAwdmg7XFxufVxcblxcbi5pbnZpc2libGUge1xcbiAgZGlzcGxheTogbm9uZTtcXG59XFxuXFxuLnZpc2libGUtYmxvY2sge1xcbiAgZGlzcGxheTogYmxvY2s7XFxufVxcblxcbiNzZWFyY2gtZGl2IHtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIG1hcmdpbi1ib3R0b206IDIwcHg7XFxufVxcbiNzZWFyY2gtZGl2ICNpbnB1dC1jaXR5IHtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiS3Jlb25cXFwiLCBzZXJpZjtcXG4gIHRleHQtYWxpZ246IGNlbnRlcjtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcXG4gIHBhZGRpbmc6IDEycHggMjBweDtcXG4gIG1hcmdpbjogOHB4IDA7XFxuICBiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGJsdWU7XFxuICBmb250LXNpemU6IDIycHg7XFxufVxcbiNzZWFyY2gtZGl2ICNpbnB1dC1jaXR5OmZvY3VzIHtcXG4gIGJvcmRlcjogM3B4IHNvbGlkICM1NTU7XFxufVxcbiNzZWFyY2gtZGl2ICNpbnB1dC1mZWVkYmFjayB7XFxuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgcGFkZGluZzogMTJweCAyMHB4O1xcbiAgbWFyZ2luOiA4cHggMDtcXG4gIGZvbnQtc2l6ZTogMjBweDtcXG4gIGJvcmRlcjogM3B4IHNvbGlkIHJnYigxOTIsIDExOCwgMTE4KTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHdoaXRlc21va2U7XFxuICBjb2xvcjogcmVkO1xcbn1cXG4jc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyIHtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnIgMWZyO1xcbiAgZ2FwOiAxMHB4O1xcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gIGp1c3RpZnktaXRlbXM6IGNlbnRlcjtcXG59XFxuI3NlYXJjaC1kaXYgI3VuaXRzLWNvbnRhaW5lciAjbWV0cmljLFxcbiNzZWFyY2gtZGl2ICN1bml0cy1jb250YWluZXIgI2ltcGVyaWFsLFxcbiNzZWFyY2gtZGl2ICN1bml0cy1jb250YWluZXIgI3N0YW5kYXJkIHtcXG4gIGFzcGVjdC1yYXRpbzogMTtcXG4gIGRpc3BsYXk6IGdyaWQ7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbiAganVzdGlmeS1pdGVtczogYmFzZWxpbmU7XFxuICBib3JkZXI6IDNweCBzb2xpZCAjNTU1O1xcbiAgaGVpZ2h0OiAxMDBweDtcXG4gIGZvbnQtc2l6ZTogODBweDtcXG4gIGJhY2tncm91bmQ6IHdoaXRlc21va2U7XFxuICBjdXJzb3I6IHBvaW50ZXI7XFxufVxcbiNzZWFyY2gtZGl2ICN1bml0cy1jb250YWluZXIgLnNlbGVjdGVkIHtcXG4gIGJhY2tncm91bmQ6IHJnYigwLCAwLCA5OSkgIWltcG9ydGFudDtcXG4gIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xcbiAgYm9yZGVyOiAzcHggc29saWQgcmdiKDE5MSwgMjAxLCAyNTUpICFpbXBvcnRhbnQ7XFxuICBvdXRsaW5lOiAxcHggc29saWQgcmdiKDI0MiwgMjQyLCAyNTUpICFpbXBvcnRhbnQ7XFxufVxcblxcbiN3ZWF0aGVyLWNhbnZhcyB7XFxuICBtYXJnaW46IDEwcHggYXV0bztcXG4gIHBhZGRpbmc6IDVweDtcXG4gIG1heC13aWR0aDogNTAwcHg7XFxuICBiYWNrZ3JvdW5kOiByZ2JhKDAsIDAsIDAsIDAuNDA0KTtcXG4gIGNvbG9yOiB3aGl0ZXNtb2tlO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI3dsb2NhdGlvbiB7XFxuICBmb250LXNpemU6IDcwcHg7XFxuICBtYXJnaW46IDA7XFxuICBwYWRkaW5nOiAwO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJLcmVvblxcXCIsIHNlcmlmO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI3dkZXNjIHtcXG4gIGZvbnQtc2l6ZTogNjBweDtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxuICBmb250LWZhbWlseTogXFxcIk1vbnRzZXJyYXRcXFwiLCBzYW5zLXNlcmlmO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI3dpbWFnIHtcXG4gIG1hcmdpbjogMDtcXG4gIHBhZGRpbmc6IDA7XFxufVxcbiN3ZWF0aGVyLWNhbnZhcyAjd3RlbXAge1xcbiAgZm9udC1zaXplOiA0MHB4O1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGZvbnQtZmFtaWx5OiBcXFwiTW9udHNlcnJhdFxcXCIsIHNhbnMtc2VyaWY7XFxufVxcbiN3ZWF0aGVyLWNhbnZhcyAjd3RoZXJtYWwge1xcbiAgZm9udC1zaXplOiA0MHB4O1xcbiAgbWFyZ2luOiAwO1xcbiAgcGFkZGluZzogMDtcXG4gIGNvbG9yOiByZ2IoOTgsIDI0OCwgOTgpO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJNb250c2VycmF0XFxcIiwgc2Fucy1zZXJpZjtcXG59XFxuI3dlYXRoZXItY2FudmFzICNmb290LXdlYXRoZXItZGF0YSB7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcbiAgZm9udC1mYW1pbHk6IFxcXCJLcmVvblxcXCIsIHNlcmlmO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI2Zvb3Qtd2VhdGhlci1kYXRhICNsZWZ0LWNvbnRhaW5lciB7XFxuICBqdXN0aWZ5LXNlbGY6IHN0YXJ0O1xcbiAgZGlzcGxheTogZ3JpZDtcXG4gIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gIGdyaWQtdGVtcGxhdGUtcm93czogMWZyIDFmcjtcXG4gIGp1c3RpZnktaXRlbXM6IGxlZnQ7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI2Zvb3Qtd2VhdGhlci1kYXRhICNyaWdodC1jb250YWluZXIge1xcbiAganVzdGlmeS1zZWxmOiBlbmQ7XFxuICBkaXNwbGF5OiBncmlkO1xcbiAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xcbiAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyO1xcbiAganVzdGlmeS1pdGVtczogcmlnaHQ7XFxuICBhbGlnbi1pdGVtczogY2VudGVyO1xcbn1cXG4jd2VhdGhlci1jYW52YXMgI2Zvb3Qtd2VhdGhlci1kYXRhIGltZyB7XFxuICBoZWlnaHQ6IDUwcHg7XFxufVxcblxcbiNjcmVkaXRzIHtcXG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcXG4gIGJvdHRvbTogMDtcXG4gIHdpZHRoOiAxMDAlO1xcbiAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgwLCAwLCAxMjgsIDAuMjY3KTtcXG4gIGZvbnQtc2l6ZTogMjJweDtcXG4gIGNvbG9yOiBuYXZ5O1xcbiAgZm9udC1mYW1pbHk6IFxcXCJLMkRcXFwiLCBzYW5zLXNlcmlmO1xcbn1cXG4jY3JlZGl0cyBhIHtcXG4gIHRleHQtYWxpZ246IGxlZnQ7XFxuICBmb250LXNpemU6IDE4cHg7XFxuICBkaXNwbGF5OiBibG9jaztcXG4gIGNvbG9yOiBuYXZ5O1xcbn1cXG5cXG5AbWVkaWEgKG1heC13aWR0aDogMzUwcHgpIHtcXG4gICNzZWFyY2gtZGl2ICNpbnB1dC1jaXR5IHtcXG4gICAgd2lkdGg6IDMwMHB4O1xcbiAgICBmb250LXNpemU6IDE1cHg7XFxuICB9XFxuICAjc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyICNtZXRyaWMsXFxuICAjc2VhcmNoLWRpdiAjdW5pdHMtY29udGFpbmVyICNpbXBlcmlhbCxcXG4gICNzZWFyY2gtZGl2ICN1bml0cy1jb250YWluZXIgI3N0YW5kYXJkIHtcXG4gICAgaGVpZ2h0OiA2MHB4O1xcbiAgICBmb250LXNpemU6IDUwcHg7XFxuICB9XFxuICAjd2VhdGhlci1jYW52YXMgI3dsb2NhdGlvbiB7XFxuICAgIGZvbnQtc2l6ZTogNjBweDtcXG4gIH1cXG4gICN3ZWF0aGVyLWNhbnZhcyAjd2Rlc2Mge1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxuICB9XFxuICAjd2VhdGhlci1jYW52YXMgI3d0ZW1wIHtcXG4gICAgZm9udC1zaXplOiAyMHB4O1xcbiAgfVxcbiAgI3dlYXRoZXItY2FudmFzICN3dGhlcm1hbCB7XFxuICAgIGZvbnQtc2l6ZTogMjBweDtcXG4gIH1cXG4gICNjcmVkaXRzIGEge1xcbiAgICBmb250LXNpemU6IDEzcHg7XFxuICB9XFxufVwiLCBcIlwiLHtcInZlcnNpb25cIjozLFwic291cmNlc1wiOltcIndlYnBhY2s6Ly8uL3NyYy9jc3Mvc3R5bGVzLnNjc3NcIl0sXCJuYW1lc1wiOltdLFwibWFwcGluZ3NcIjpcIkFBQUEsa0JBQUE7QUFFQTs7Ozs7dUNBQUE7QUFNQTtFQUNFLGtCQUFBO0VBQ0EsMEVBQUE7RUFDQSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxnQkFBQTtFQUNBLGFBQUE7QUFDRjs7QUFDQTtFQUNFLGFBQUE7QUFFRjs7QUFDQTtFQUNFLGNBQUE7QUFFRjs7QUFDQTtFQUNFLGtCQUFBO0VBQ0EsbUJBQUE7QUFFRjtBQUFFO0VBTUUsMkJBQUE7RUFFQSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtFQUVBLDJCQUFBO0VBQ0EsZUFBQTtBQUxKO0FBTUk7RUFDRSxzQkFBQTtBQUpOO0FBUUU7RUFDRSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsYUFBQTtFQUNBLGVBQUE7RUFDQSxvQ0FBQTtFQUNBLDRCQUFBO0VBQ0EsVUFBQTtBQU5KO0FBU0U7RUFDRSxhQUFBO0VBQ0Esa0NBQUE7RUFDQSxTQUFBO0VBQ0EsbUJBQUE7RUFDQSxxQkFBQTtBQVBKO0FBU0k7OztFQUdFLGVBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLHNCQUFBO0VBQ0EsYUFBQTtFQUNBLGVBQUE7RUFDQSxzQkFBQTtFQUVBLGVBQUE7QUFSTjtBQVVJO0VBQ0Usb0NBQUE7RUFDQSx1QkFBQTtFQUNBLCtDQUFBO0VBQ0EsZ0RBQUE7QUFSTjs7QUFhQTtFQUNFLGlCQUFBO0VBQ0EsWUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0NBQUE7RUFDQSxpQkFBQTtBQVZGO0FBWUU7RUFDRSxlQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFDQSwyQkFBQTtBQVZKO0FBYUU7RUFDRSxlQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFDQSxxQ0FBQTtBQVhKO0FBYUU7RUFDRSxTQUFBO0VBQ0EsVUFBQTtBQVhKO0FBYUU7RUFDRSxlQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFDQSxxQ0FBQTtBQVhKO0FBY0U7RUFDRSxlQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFDQSx1QkFBQTtFQUNBLHFDQUFBO0FBWko7QUFlRTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLDJCQUFBO0FBYko7QUFlSTtFQUNFLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsMkJBQUE7RUFDQSxtQkFBQTtFQUNBLG1CQUFBO0FBYk47QUFlSTtFQUNFLGlCQUFBO0VBQ0EsYUFBQTtFQUNBLDhCQUFBO0VBQ0EsMkJBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0FBYk47QUFlSTtFQUNFLFlBQUE7QUFiTjs7QUFrQkE7RUFDRSxrQkFBQTtFQUNBLFNBQUE7RUFDQSxXQUFBO0VBQ0Esd0NBQUE7RUFDQSxlQUFBO0VBQ0EsV0FBQTtFQUVBLDhCQUFBO0FBaEJGO0FBa0JFO0VBQ0UsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsY0FBQTtFQUNBLFdBQUE7QUFoQko7O0FBb0JBO0VBRUk7SUFDRSxZQUFBO0lBQ0EsZUFBQTtFQWxCSjtFQXFCSTs7O0lBR0UsWUFBQTtJQUNBLGVBQUE7RUFuQk47RUF5QkU7SUFDRSxlQUFBO0VBdkJKO0VBMEJFO0lBQ0UsZUFBQTtFQXhCSjtFQTJCRTtJQUNFLGVBQUE7RUF6Qko7RUE0QkU7SUFDRSxlQUFBO0VBMUJKO0VBK0JFO0lBQ0UsZUFBQTtFQTdCSjtBQUNGXCIsXCJzb3VyY2VzQ29udGVudFwiOltcIi8qIGZvbnQgZmFtaWxpZXMgKi9cXG5AaW1wb3J0IHVybCgnaHR0cHM6Ly9mb250cy5nb29nbGVhcGlzLmNvbS9jc3MyP2ZhbWlseT1Db21pYytOZXVlJmZhbWlseT1LMkQ6aXRhbCx3Z2h0QDEsMzAwJmZhbWlseT1LcmVvbjp3Z2h0QDUwMCZmYW1pbHk9TW9udHNlcnJhdDp3Z2h0QDMwMCZmYW1pbHk9UmVlbmllK0JlYW5pZSZkaXNwbGF5PXN3YXAnKTtcXG4vKlxcbmZvbnQtZmFtaWx5OiAnQ29taWMgTmV1ZScsIGN1cnNpdmU7XFxuZm9udC1mYW1pbHk6ICdLMkQnLCBzYW5zLXNlcmlmO1xcbmZvbnQtZmFtaWx5OiAnS3Jlb24nLCBzZXJpZjtcXG5mb250LWZhbWlseTogJ01vbnRzZXJyYXQnLCBzYW5zLXNlcmlmO1xcbmZvbnQtZmFtaWx5OiAnUmVlbmllIEJlYW5pZScsIGN1cnNpdmU7Ki9cXG5ib2R5IHtcXG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcXG4gIGJhY2tncm91bmQ6IHVybCgnLi4vaW1nL2NsZWFyY2xvdWR5LmpwZycpIG5vLXJlcGVhdCBjZW50ZXIgZml4ZWQ7XFxuICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICBtYXJnaW46IGF1dG87XFxuICBtYXgtd2lkdGg6IDgwMHB4O1xcbiAgaGVpZ2h0OiAxMDB2aDtcXG59XFxuLmludmlzaWJsZSB7XFxuICBkaXNwbGF5OiBub25lO1xcbn1cXG5cXG4udmlzaWJsZS1ibG9jayB7XFxuICBkaXNwbGF5OiBibG9jaztcXG59XFxuXFxuI3NlYXJjaC1kaXYge1xcbiAgdGV4dC1hbGlnbjogY2VudGVyO1xcbiAgbWFyZ2luLWJvdHRvbTogMjBweDtcXG5cXG4gICNpbnB1dC1jaXR5IHtcXG4gICAgLy8gYmFja2dyb3VuZC1pbWFnZTogdXJsKCcuLi9pbWcvbWFnbmlmeWluZ2dsYXNzLnBuZycpO1xcbiAgICAvLyBiYWNrZ3JvdW5kLXBvc2l0aW9uOiAxMHB4IDEwcHg7XFxuICAgIC8vIGJhY2tncm91bmQtc2l6ZTogMzFweDtcXG4gICAgLy8gYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcXG5cXG4gICAgZm9udC1mYW1pbHk6ICdLcmVvbicsIHNlcmlmO1xcblxcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XFxuICAgIHdpZHRoOiAxMDAlO1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBwYWRkaW5nOiAxMnB4IDIwcHg7XFxuICAgIG1hcmdpbjogOHB4IDA7XFxuXFxuICAgIGJhY2tncm91bmQtY29sb3I6IGxpZ2h0Ymx1ZTtcXG4gICAgZm9udC1zaXplOiAyMnB4O1xcbiAgICAmOmZvY3VzIHtcXG4gICAgICBib3JkZXI6IDNweCBzb2xpZCAjNTU1O1xcbiAgICB9XFxuICB9XFxuXFxuICAjaW5wdXQtZmVlZGJhY2sge1xcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xcbiAgICBwYWRkaW5nOiAxMnB4IDIwcHg7XFxuICAgIG1hcmdpbjogOHB4IDA7XFxuICAgIGZvbnQtc2l6ZTogMjBweDtcXG4gICAgYm9yZGVyOiAzcHggc29saWQgcmdiKDE5MiwgMTE4LCAxMTgpO1xcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB3aGl0ZXNtb2tlO1xcbiAgICBjb2xvcjogcmVkO1xcbiAgfVxcblxcbiAgI3VuaXRzLWNvbnRhaW5lciB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmciAxZnI7XFxuICAgIGdhcDogMTBweDtcXG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAganVzdGlmeS1pdGVtczogY2VudGVyO1xcblxcbiAgICAjbWV0cmljLFxcbiAgICAjaW1wZXJpYWwsXFxuICAgICNzdGFuZGFyZCB7XFxuICAgICAgYXNwZWN0LXJhdGlvOiAxO1xcbiAgICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgICBqdXN0aWZ5LWl0ZW1zOiBiYXNlbGluZTtcXG4gICAgICBib3JkZXI6IDNweCBzb2xpZCAjNTU1O1xcbiAgICAgIGhlaWdodDogMTAwcHg7XFxuICAgICAgZm9udC1zaXplOiA4MHB4O1xcbiAgICAgIGJhY2tncm91bmQ6IHdoaXRlc21va2U7XFxuXFxuICAgICAgY3Vyc29yOiBwb2ludGVyO1xcbiAgICB9XFxuICAgIC5zZWxlY3RlZCB7XFxuICAgICAgYmFja2dyb3VuZDogcmdiKDAsIDAsIDk5KSAhaW1wb3J0YW50O1xcbiAgICAgIGNvbG9yOiB3aGl0ZSAhaW1wb3J0YW50O1xcbiAgICAgIGJvcmRlcjogM3B4IHNvbGlkIHJnYigxOTEsIDIwMSwgMjU1KSAhaW1wb3J0YW50O1xcbiAgICAgIG91dGxpbmU6IDFweCBzb2xpZCByZ2IoMjQyLCAyNDIsIDI1NSkgIWltcG9ydGFudDtcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG4jd2VhdGhlci1jYW52YXMge1xcbiAgbWFyZ2luOiAxMHB4IGF1dG87XFxuICBwYWRkaW5nOiA1cHg7XFxuICBtYXgtd2lkdGg6IDUwMHB4O1xcbiAgYmFja2dyb3VuZDogcmdiYSgwLCAwLCAwLCAwLjQwNCk7XFxuICBjb2xvcjogd2hpdGVzbW9rZTtcXG5cXG4gICN3bG9jYXRpb24ge1xcbiAgICBmb250LXNpemU6IDcwcHg7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgZm9udC1mYW1pbHk6ICdLcmVvbicsIHNlcmlmO1xcbiAgfVxcblxcbiAgI3dkZXNjIHtcXG4gICAgZm9udC1zaXplOiA2MHB4O1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICAgIGZvbnQtZmFtaWx5OiAnTW9udHNlcnJhdCcsIHNhbnMtc2VyaWY7XFxuICB9XFxuICAjd2ltYWcge1xcbiAgICBtYXJnaW46IDA7XFxuICAgIHBhZGRpbmc6IDA7XFxuICB9XFxuICAjd3RlbXAge1xcbiAgICBmb250LXNpemU6IDQwcHg7XFxuICAgIG1hcmdpbjogMDtcXG4gICAgcGFkZGluZzogMDtcXG4gICAgZm9udC1mYW1pbHk6ICdNb250c2VycmF0Jywgc2Fucy1zZXJpZjtcXG4gIH1cXG5cXG4gICN3dGhlcm1hbCB7XFxuICAgIGZvbnQtc2l6ZTogNDBweDtcXG4gICAgbWFyZ2luOiAwO1xcbiAgICBwYWRkaW5nOiAwO1xcbiAgICBjb2xvcjogcmdiKDk4LCAyNDgsIDk4KTtcXG4gICAgZm9udC1mYW1pbHk6ICdNb250c2VycmF0Jywgc2Fucy1zZXJpZjtcXG4gIH1cXG5cXG4gICNmb290LXdlYXRoZXItZGF0YSB7XFxuICAgIGRpc3BsYXk6IGdyaWQ7XFxuICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gICAgZm9udC1mYW1pbHk6ICdLcmVvbicsIHNlcmlmO1xcblxcbiAgICAjbGVmdC1jb250YWluZXIge1xcbiAgICAgIGp1c3RpZnktc2VsZjogc3RhcnQ7XFxuICAgICAgZGlzcGxheTogZ3JpZDtcXG4gICAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XFxuICAgICAgZ3JpZC10ZW1wbGF0ZS1yb3dzOiAxZnIgMWZyO1xcbiAgICAgIGp1c3RpZnktaXRlbXM6IGxlZnQ7XFxuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgfVxcbiAgICAjcmlnaHQtY29udGFpbmVyIHtcXG4gICAgICBqdXN0aWZ5LXNlbGY6IGVuZDtcXG4gICAgICBkaXNwbGF5OiBncmlkO1xcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyIDFmcjtcXG4gICAgICBncmlkLXRlbXBsYXRlLXJvd3M6IDFmciAxZnI7XFxuICAgICAganVzdGlmeS1pdGVtczogcmlnaHQ7XFxuICAgICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcXG4gICAgfVxcbiAgICBpbWcge1xcbiAgICAgIGhlaWdodDogNTBweDtcXG4gICAgfVxcbiAgfVxcbn1cXG5cXG4jY3JlZGl0cyB7XFxuICBwb3NpdGlvbjogYWJzb2x1dGU7XFxuICBib3R0b206IDA7XFxuICB3aWR0aDogMTAwJTtcXG4gIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMTI4LCAwLjI2Nyk7XFxuICBmb250LXNpemU6IDIycHg7XFxuICBjb2xvcjogbmF2eTtcXG5cXG4gIGZvbnQtZmFtaWx5OiAnSzJEJywgc2Fucy1zZXJpZjtcXG5cXG4gIGEge1xcbiAgICB0ZXh0LWFsaWduOiBsZWZ0O1xcbiAgICBmb250LXNpemU6IDE4cHg7XFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcbiAgICBjb2xvcjogbmF2eTtcXG4gIH1cXG59XFxuXFxuQG1lZGlhIChtYXgtd2lkdGg6IDM1MHB4KSB7XFxuICAjc2VhcmNoLWRpdiB7XFxuICAgICNpbnB1dC1jaXR5IHtcXG4gICAgICB3aWR0aDogMzAwcHg7XFxuICAgICAgZm9udC1zaXplOiAxNXB4O1xcbiAgICB9XFxuICAgICN1bml0cy1jb250YWluZXIge1xcbiAgICAgICNtZXRyaWMsXFxuICAgICAgI2ltcGVyaWFsLFxcbiAgICAgICNzdGFuZGFyZCB7XFxuICAgICAgICBoZWlnaHQ6IDYwcHg7XFxuICAgICAgICBmb250LXNpemU6IDUwcHg7XFxuICAgICAgfVxcbiAgICB9XFxuICB9XFxuXFxuICAjd2VhdGhlci1jYW52YXMge1xcbiAgICAjd2xvY2F0aW9uIHtcXG4gICAgICBmb250LXNpemU6IDYwcHg7XFxuICAgIH1cXG5cXG4gICAgI3dkZXNjIHtcXG4gICAgICBmb250LXNpemU6IDQwcHg7XFxuICAgIH1cXG5cXG4gICAgI3d0ZW1wIHtcXG4gICAgICBmb250LXNpemU6IDIwcHg7XFxuICAgIH1cXG5cXG4gICAgI3d0aGVybWFsIHtcXG4gICAgICBmb250LXNpemU6IDIwcHg7XFxuICAgIH1cXG4gIH1cXG5cXG4gICNjcmVkaXRzIHtcXG4gICAgYSB7XFxuICAgICAgZm9udC1zaXplOiAxM3B4O1xcbiAgICB9XFxuICB9XFxufVxcblwiXSxcInNvdXJjZVJvb3RcIjpcIlwifV0pO1xuLy8gRXhwb3J0c1xuZXhwb3J0IGRlZmF1bHQgX19fQ1NTX0xPQURFUl9FWFBPUlRfX187XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLypcbiAgTUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcbiAgQXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcpIHtcbiAgdmFyIGxpc3QgPSBbXTtcblxuICAvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG4gIGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICByZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgIHZhciBjb250ZW50ID0gXCJcIjtcbiAgICAgIHZhciBuZWVkTGF5ZXIgPSB0eXBlb2YgaXRlbVs1XSAhPT0gXCJ1bmRlZmluZWRcIjtcbiAgICAgIGlmIChpdGVtWzRdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKTtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbWVkaWEgXCIuY29uY2F0KGl0ZW1bMl0sIFwiIHtcIik7XG4gICAgICB9XG4gICAgICBpZiAobmVlZExheWVyKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJAbGF5ZXJcIi5jb25jYXQoaXRlbVs1XS5sZW5ndGggPiAwID8gXCIgXCIuY29uY2F0KGl0ZW1bNV0pIDogXCJcIiwgXCIge1wiKTtcbiAgICAgIH1cbiAgICAgIGNvbnRlbnQgKz0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtKTtcbiAgICAgIGlmIChuZWVkTGF5ZXIpIHtcbiAgICAgICAgY29udGVudCArPSBcIn1cIjtcbiAgICAgIH1cbiAgICAgIGlmIChpdGVtWzJdKSB7XG4gICAgICAgIGNvbnRlbnQgKz0gXCJ9XCI7XG4gICAgICB9XG4gICAgICBpZiAoaXRlbVs0XSkge1xuICAgICAgICBjb250ZW50ICs9IFwifVwiO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGNvbnRlbnQ7XG4gICAgfSkuam9pbihcIlwiKTtcbiAgfTtcblxuICAvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuICBsaXN0LmkgPSBmdW5jdGlvbiBpKG1vZHVsZXMsIG1lZGlhLCBkZWR1cGUsIHN1cHBvcnRzLCBsYXllcikge1xuICAgIGlmICh0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIikge1xuICAgICAgbW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgdW5kZWZpbmVkXV07XG4gICAgfVxuICAgIHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG4gICAgaWYgKGRlZHVwZSkge1xuICAgICAgZm9yICh2YXIgayA9IDA7IGsgPCB0aGlzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIHZhciBpZCA9IHRoaXNba11bMF07XG4gICAgICAgIGlmIChpZCAhPSBudWxsKSB7XG4gICAgICAgICAgYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIGZvciAodmFyIF9rID0gMDsgX2sgPCBtb2R1bGVzLmxlbmd0aDsgX2srKykge1xuICAgICAgdmFyIGl0ZW0gPSBbXS5jb25jYXQobW9kdWxlc1tfa10pO1xuICAgICAgaWYgKGRlZHVwZSAmJiBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG4gICAgICAgIGNvbnRpbnVlO1xuICAgICAgfVxuICAgICAgaWYgKHR5cGVvZiBsYXllciAhPT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICBpZiAodHlwZW9mIGl0ZW1bNV0gPT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQGxheWVyXCIuY29uY2F0KGl0ZW1bNV0ubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChpdGVtWzVdKSA6IFwiXCIsIFwiIHtcIikuY29uY2F0KGl0ZW1bMV0sIFwifVwiKTtcbiAgICAgICAgICBpdGVtWzVdID0gbGF5ZXI7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmIChtZWRpYSkge1xuICAgICAgICBpZiAoIWl0ZW1bMl0pIHtcbiAgICAgICAgICBpdGVtWzJdID0gbWVkaWE7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaXRlbVsxXSA9IFwiQG1lZGlhIFwiLmNvbmNhdChpdGVtWzJdLCBcIiB7XCIpLmNvbmNhdChpdGVtWzFdLCBcIn1cIik7XG4gICAgICAgICAgaXRlbVsyXSA9IG1lZGlhO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAoc3VwcG9ydHMpIHtcbiAgICAgICAgaWYgKCFpdGVtWzRdKSB7XG4gICAgICAgICAgaXRlbVs0XSA9IFwiXCIuY29uY2F0KHN1cHBvcnRzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpdGVtWzFdID0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChpdGVtWzRdLCBcIikge1wiKS5jb25jYXQoaXRlbVsxXSwgXCJ9XCIpO1xuICAgICAgICAgIGl0ZW1bNF0gPSBzdXBwb3J0cztcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgbGlzdC5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgfTtcbiAgcmV0dXJuIGxpc3Q7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uICh1cmwsIG9wdGlvbnMpIHtcbiAgaWYgKCFvcHRpb25zKSB7XG4gICAgb3B0aW9ucyA9IHt9O1xuICB9XG4gIGlmICghdXJsKSB7XG4gICAgcmV0dXJuIHVybDtcbiAgfVxuICB1cmwgPSBTdHJpbmcodXJsLl9fZXNNb2R1bGUgPyB1cmwuZGVmYXVsdCA6IHVybCk7XG5cbiAgLy8gSWYgdXJsIGlzIGFscmVhZHkgd3JhcHBlZCBpbiBxdW90ZXMsIHJlbW92ZSB0aGVtXG4gIGlmICgvXlsnXCJdLipbJ1wiXSQvLnRlc3QodXJsKSkge1xuICAgIHVybCA9IHVybC5zbGljZSgxLCAtMSk7XG4gIH1cbiAgaWYgKG9wdGlvbnMuaGFzaCkge1xuICAgIHVybCArPSBvcHRpb25zLmhhc2g7XG4gIH1cblxuICAvLyBTaG91bGQgdXJsIGJlIHdyYXBwZWQ/XG4gIC8vIFNlZSBodHRwczovL2RyYWZ0cy5jc3N3Zy5vcmcvY3NzLXZhbHVlcy0zLyN1cmxzXG4gIGlmICgvW1wiJygpIFxcdFxcbl18KCUyMCkvLnRlc3QodXJsKSB8fCBvcHRpb25zLm5lZWRRdW90ZXMpIHtcbiAgICByZXR1cm4gXCJcXFwiXCIuY29uY2F0KHVybC5yZXBsYWNlKC9cIi9nLCAnXFxcXFwiJykucmVwbGFjZSgvXFxuL2csIFwiXFxcXG5cIiksIFwiXFxcIlwiKTtcbiAgfVxuICByZXR1cm4gdXJsO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoaXRlbSkge1xuICB2YXIgY29udGVudCA9IGl0ZW1bMV07XG4gIHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcbiAgaWYgKCFjc3NNYXBwaW5nKSB7XG4gICAgcmV0dXJuIGNvbnRlbnQ7XG4gIH1cbiAgaWYgKHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICB2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoY3NzTWFwcGluZykpKSk7XG4gICAgdmFyIGRhdGEgPSBcInNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LFwiLmNvbmNhdChiYXNlNjQpO1xuICAgIHZhciBzb3VyY2VNYXBwaW5nID0gXCIvKiMgXCIuY29uY2F0KGRhdGEsIFwiICovXCIpO1xuICAgIHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG4gICAgICByZXR1cm4gXCIvKiMgc291cmNlVVJMPVwiLmNvbmNhdChjc3NNYXBwaW5nLnNvdXJjZVJvb3QgfHwgXCJcIikuY29uY2F0KHNvdXJjZSwgXCIgKi9cIik7XG4gICAgfSk7XG4gICAgcmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbihcIlxcblwiKTtcbiAgfVxuICByZXR1cm4gW2NvbnRlbnRdLmpvaW4oXCJcXG5cIik7XG59OyIsIlxuICAgICAgaW1wb3J0IEFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luamVjdFN0eWxlc0ludG9TdHlsZVRhZy5qc1wiO1xuICAgICAgaW1wb3J0IGRvbUFQSSBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3N0eWxlRG9tQVBJLmpzXCI7XG4gICAgICBpbXBvcnQgaW5zZXJ0Rm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9pbnNlcnRCeVNlbGVjdG9yLmpzXCI7XG4gICAgICBpbXBvcnQgc2V0QXR0cmlidXRlcyBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL3NldEF0dHJpYnV0ZXNXaXRob3V0QXR0cmlidXRlcy5qc1wiO1xuICAgICAgaW1wb3J0IGluc2VydFN0eWxlRWxlbWVudCBmcm9tIFwiIS4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvZGlzdC9ydW50aW1lL2luc2VydFN0eWxlRWxlbWVudC5qc1wiO1xuICAgICAgaW1wb3J0IHN0eWxlVGFnVHJhbnNmb3JtRm4gZnJvbSBcIiEuLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2Rpc3QvcnVudGltZS9zdHlsZVRhZ1RyYW5zZm9ybS5qc1wiO1xuICAgICAgaW1wb3J0IGNvbnRlbnQsICogYXMgbmFtZWRFeHBvcnQgZnJvbSBcIiEhLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvZGlzdC9janMuanMhLi4vLi4vbm9kZV9tb2R1bGVzL3Nhc3MtbG9hZGVyL2Rpc3QvY2pzLmpzIS4vc3R5bGVzLnNjc3NcIjtcbiAgICAgIFxuICAgICAgXG5cbnZhciBvcHRpb25zID0ge307XG5cbm9wdGlvbnMuc3R5bGVUYWdUcmFuc2Zvcm0gPSBzdHlsZVRhZ1RyYW5zZm9ybUZuO1xub3B0aW9ucy5zZXRBdHRyaWJ1dGVzID0gc2V0QXR0cmlidXRlcztcblxuICAgICAgb3B0aW9ucy5pbnNlcnQgPSBpbnNlcnRGbi5iaW5kKG51bGwsIFwiaGVhZFwiKTtcbiAgICBcbm9wdGlvbnMuZG9tQVBJID0gZG9tQVBJO1xub3B0aW9ucy5pbnNlcnRTdHlsZUVsZW1lbnQgPSBpbnNlcnRTdHlsZUVsZW1lbnQ7XG5cbnZhciB1cGRhdGUgPSBBUEkoY29udGVudCwgb3B0aW9ucyk7XG5cblxuXG5leHBvcnQgKiBmcm9tIFwiISEuLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9kaXN0L2Nqcy5qcyEuLi8uLi9ub2RlX21vZHVsZXMvc2Fzcy1sb2FkZXIvZGlzdC9janMuanMhLi9zdHlsZXMuc2Nzc1wiO1xuICAgICAgIGV4cG9ydCBkZWZhdWx0IGNvbnRlbnQgJiYgY29udGVudC5sb2NhbHMgPyBjb250ZW50LmxvY2FscyA6IHVuZGVmaW5lZDtcbiIsIlwidXNlIHN0cmljdFwiO1xuXG52YXIgc3R5bGVzSW5ET00gPSBbXTtcblxuZnVuY3Rpb24gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcikge1xuICB2YXIgcmVzdWx0ID0gLTE7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHlsZXNJbkRPTS5sZW5ndGg7IGkrKykge1xuICAgIGlmIChzdHlsZXNJbkRPTVtpXS5pZGVudGlmaWVyID09PSBpZGVudGlmaWVyKSB7XG4gICAgICByZXN1bHQgPSBpO1xuICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuZnVuY3Rpb24gbW9kdWxlc1RvRG9tKGxpc3QsIG9wdGlvbnMpIHtcbiAgdmFyIGlkQ291bnRNYXAgPSB7fTtcbiAgdmFyIGlkZW50aWZpZXJzID0gW107XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldO1xuICAgIHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuICAgIHZhciBjb3VudCA9IGlkQ291bnRNYXBbaWRdIHx8IDA7XG4gICAgdmFyIGlkZW50aWZpZXIgPSBcIlwiLmNvbmNhdChpZCwgXCIgXCIpLmNvbmNhdChjb3VudCk7XG4gICAgaWRDb3VudE1hcFtpZF0gPSBjb3VudCArIDE7XG4gICAgdmFyIGluZGV4QnlJZGVudGlmaWVyID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoaWRlbnRpZmllcik7XG4gICAgdmFyIG9iaiA9IHtcbiAgICAgIGNzczogaXRlbVsxXSxcbiAgICAgIG1lZGlhOiBpdGVtWzJdLFxuICAgICAgc291cmNlTWFwOiBpdGVtWzNdLFxuICAgICAgc3VwcG9ydHM6IGl0ZW1bNF0sXG4gICAgICBsYXllcjogaXRlbVs1XVxuICAgIH07XG5cbiAgICBpZiAoaW5kZXhCeUlkZW50aWZpZXIgIT09IC0xKSB7XG4gICAgICBzdHlsZXNJbkRPTVtpbmRleEJ5SWRlbnRpZmllcl0ucmVmZXJlbmNlcysrO1xuICAgICAgc3R5bGVzSW5ET01baW5kZXhCeUlkZW50aWZpZXJdLnVwZGF0ZXIob2JqKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIHVwZGF0ZXIgPSBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKTtcbiAgICAgIG9wdGlvbnMuYnlJbmRleCA9IGk7XG4gICAgICBzdHlsZXNJbkRPTS5zcGxpY2UoaSwgMCwge1xuICAgICAgICBpZGVudGlmaWVyOiBpZGVudGlmaWVyLFxuICAgICAgICB1cGRhdGVyOiB1cGRhdGVyLFxuICAgICAgICByZWZlcmVuY2VzOiAxXG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpZGVudGlmaWVycy5wdXNoKGlkZW50aWZpZXIpO1xuICB9XG5cbiAgcmV0dXJuIGlkZW50aWZpZXJzO1xufVxuXG5mdW5jdGlvbiBhZGRFbGVtZW50U3R5bGUob2JqLCBvcHRpb25zKSB7XG4gIHZhciBhcGkgPSBvcHRpb25zLmRvbUFQSShvcHRpb25zKTtcbiAgYXBpLnVwZGF0ZShvYmopO1xuXG4gIHZhciB1cGRhdGVyID0gZnVuY3Rpb24gdXBkYXRlcihuZXdPYmopIHtcbiAgICBpZiAobmV3T2JqKSB7XG4gICAgICBpZiAobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwICYmIG5ld09iai5zdXBwb3J0cyA9PT0gb2JqLnN1cHBvcnRzICYmIG5ld09iai5sYXllciA9PT0gb2JqLmxheWVyKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgYXBpLnVwZGF0ZShvYmogPSBuZXdPYmopO1xuICAgIH0gZWxzZSB7XG4gICAgICBhcGkucmVtb3ZlKCk7XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiB1cGRhdGVyO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChsaXN0LCBvcHRpb25zKSB7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBsaXN0ID0gbGlzdCB8fCBbXTtcbiAgdmFyIGxhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShsaXN0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG4gICAgbmV3TGlzdCA9IG5ld0xpc3QgfHwgW107XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxhc3RJZGVudGlmaWVycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGlkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbaV07XG4gICAgICB2YXIgaW5kZXggPSBnZXRJbmRleEJ5SWRlbnRpZmllcihpZGVudGlmaWVyKTtcbiAgICAgIHN0eWxlc0luRE9NW2luZGV4XS5yZWZlcmVuY2VzLS07XG4gICAgfVxuXG4gICAgdmFyIG5ld0xhc3RJZGVudGlmaWVycyA9IG1vZHVsZXNUb0RvbShuZXdMaXN0LCBvcHRpb25zKTtcblxuICAgIGZvciAodmFyIF9pID0gMDsgX2kgPCBsYXN0SWRlbnRpZmllcnMubGVuZ3RoOyBfaSsrKSB7XG4gICAgICB2YXIgX2lkZW50aWZpZXIgPSBsYXN0SWRlbnRpZmllcnNbX2ldO1xuXG4gICAgICB2YXIgX2luZGV4ID0gZ2V0SW5kZXhCeUlkZW50aWZpZXIoX2lkZW50aWZpZXIpO1xuXG4gICAgICBpZiAoc3R5bGVzSW5ET01bX2luZGV4XS5yZWZlcmVuY2VzID09PSAwKSB7XG4gICAgICAgIHN0eWxlc0luRE9NW19pbmRleF0udXBkYXRlcigpO1xuXG4gICAgICAgIHN0eWxlc0luRE9NLnNwbGljZShfaW5kZXgsIDEpO1xuICAgICAgfVxuICAgIH1cblxuICAgIGxhc3RJZGVudGlmaWVycyA9IG5ld0xhc3RJZGVudGlmaWVycztcbiAgfTtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbnZhciBtZW1vID0ge307XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuZnVuY3Rpb24gZ2V0VGFyZ2V0KHRhcmdldCkge1xuICBpZiAodHlwZW9mIG1lbW9bdGFyZ2V0XSA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgIHZhciBzdHlsZVRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodGFyZ2V0KTsgLy8gU3BlY2lhbCBjYXNlIHRvIHJldHVybiBoZWFkIG9mIGlmcmFtZSBpbnN0ZWFkIG9mIGlmcmFtZSBpdHNlbGZcblxuICAgIGlmICh3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQgJiYgc3R5bGVUYXJnZXQgaW5zdGFuY2VvZiB3aW5kb3cuSFRNTElGcmFtZUVsZW1lbnQpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIC8vIFRoaXMgd2lsbCB0aHJvdyBhbiBleGNlcHRpb24gaWYgYWNjZXNzIHRvIGlmcmFtZSBpcyBibG9ja2VkXG4gICAgICAgIC8vIGR1ZSB0byBjcm9zcy1vcmlnaW4gcmVzdHJpY3Rpb25zXG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gc3R5bGVUYXJnZXQuY29udGVudERvY3VtZW50LmhlYWQ7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIC8vIGlzdGFuYnVsIGlnbm9yZSBuZXh0XG4gICAgICAgIHN0eWxlVGFyZ2V0ID0gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBtZW1vW3RhcmdldF0gPSBzdHlsZVRhcmdldDtcbiAgfVxuXG4gIHJldHVybiBtZW1vW3RhcmdldF07XG59XG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cblxuXG5mdW5jdGlvbiBpbnNlcnRCeVNlbGVjdG9yKGluc2VydCwgc3R5bGUpIHtcbiAgdmFyIHRhcmdldCA9IGdldFRhcmdldChpbnNlcnQpO1xuXG4gIGlmICghdGFyZ2V0KSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnQnIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcbiAgfVxuXG4gIHRhcmdldC5hcHBlbmRDaGlsZChzdHlsZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaW5zZXJ0QnlTZWxlY3RvcjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcbiAgb3B0aW9ucy5zZXRBdHRyaWJ1dGVzKGVsZW1lbnQsIG9wdGlvbnMuYXR0cmlidXRlcyk7XG4gIG9wdGlvbnMuaW5zZXJ0KGVsZW1lbnQsIG9wdGlvbnMub3B0aW9ucyk7XG4gIHJldHVybiBlbGVtZW50O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGluc2VydFN0eWxlRWxlbWVudDsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzZXRBdHRyaWJ1dGVzV2l0aG91dEF0dHJpYnV0ZXMoc3R5bGVFbGVtZW50KSB7XG4gIHZhciBub25jZSA9IHR5cGVvZiBfX3dlYnBhY2tfbm9uY2VfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19ub25jZV9fIDogbnVsbDtcblxuICBpZiAobm9uY2UpIHtcbiAgICBzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibm9uY2VcIiwgbm9uY2UpO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gc2V0QXR0cmlidXRlc1dpdGhvdXRBdHRyaWJ1dGVzOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAgKi9cbmZ1bmN0aW9uIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG4gIHZhciBjc3MgPSBcIlwiO1xuXG4gIGlmIChvYmouc3VwcG9ydHMpIHtcbiAgICBjc3MgKz0gXCJAc3VwcG9ydHMgKFwiLmNvbmNhdChvYmouc3VwcG9ydHMsIFwiKSB7XCIpO1xuICB9XG5cbiAgaWYgKG9iai5tZWRpYSkge1xuICAgIGNzcyArPSBcIkBtZWRpYSBcIi5jb25jYXQob2JqLm1lZGlhLCBcIiB7XCIpO1xuICB9XG5cbiAgdmFyIG5lZWRMYXllciA9IHR5cGVvZiBvYmoubGF5ZXIgIT09IFwidW5kZWZpbmVkXCI7XG5cbiAgaWYgKG5lZWRMYXllcikge1xuICAgIGNzcyArPSBcIkBsYXllclwiLmNvbmNhdChvYmoubGF5ZXIubGVuZ3RoID4gMCA/IFwiIFwiLmNvbmNhdChvYmoubGF5ZXIpIDogXCJcIiwgXCIge1wiKTtcbiAgfVxuXG4gIGNzcyArPSBvYmouY3NzO1xuXG4gIGlmIChuZWVkTGF5ZXIpIHtcbiAgICBjc3MgKz0gXCJ9XCI7XG4gIH1cblxuICBpZiAob2JqLm1lZGlhKSB7XG4gICAgY3NzICs9IFwifVwiO1xuICB9XG5cbiAgaWYgKG9iai5zdXBwb3J0cykge1xuICAgIGNzcyArPSBcIn1cIjtcbiAgfVxuXG4gIHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG4gIGlmIChzb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICBjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiLmNvbmNhdChidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpLCBcIiAqL1wiKTtcbiAgfSAvLyBGb3Igb2xkIElFXG5cbiAgLyogaXN0YW5idWwgaWdub3JlIGlmICAqL1xuXG5cbiAgb3B0aW9ucy5zdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCwgb3B0aW9ucy5vcHRpb25zKTtcbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuICAvLyBpc3RhbmJ1bCBpZ25vcmUgaWZcbiAgaWYgKHN0eWxlRWxlbWVudC5wYXJlbnROb2RlID09PSBudWxsKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcbn1cbi8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICAqL1xuXG5cbmZ1bmN0aW9uIGRvbUFQSShvcHRpb25zKSB7XG4gIHZhciBzdHlsZUVsZW1lbnQgPSBvcHRpb25zLmluc2VydFN0eWxlRWxlbWVudChvcHRpb25zKTtcbiAgcmV0dXJuIHtcbiAgICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZShvYmopIHtcbiAgICAgIGFwcGx5KHN0eWxlRWxlbWVudCwgb3B0aW9ucywgb2JqKTtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG4gICAgfVxuICB9O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGRvbUFQSTsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgICovXG5mdW5jdGlvbiBzdHlsZVRhZ1RyYW5zZm9ybShjc3MsIHN0eWxlRWxlbWVudCkge1xuICBpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcbiAgICBzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuICB9IGVsc2Uge1xuICAgIHdoaWxlIChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuICAgICAgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcbiAgICB9XG5cbiAgICBzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG4gIH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSBzdHlsZVRhZ1RyYW5zZm9ybTsiLCIvLyBUaGUgbW9kdWxlIGNhY2hlXG52YXIgX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fID0ge307XG5cbi8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG5mdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuXHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcblx0aWYgKGNhY2hlZE1vZHVsZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0cmV0dXJuIGNhY2hlZE1vZHVsZS5leHBvcnRzO1xuXHR9XG5cdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG5cdHZhciBtb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdID0ge1xuXHRcdGlkOiBtb2R1bGVJZCxcblx0XHQvLyBubyBtb2R1bGUubG9hZGVkIG5lZWRlZFxuXHRcdGV4cG9ydHM6IHt9XG5cdH07XG5cblx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG5cdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG5cdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG5cdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbn1cblxuLy8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbl9fd2VicGFja19yZXF1aXJlX18ubSA9IF9fd2VicGFja19tb2R1bGVzX187XG5cbiIsIi8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSAobW9kdWxlKSA9PiB7XG5cdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuXHRcdCgpID0+IChtb2R1bGVbJ2RlZmF1bHQnXSkgOlxuXHRcdCgpID0+IChtb2R1bGUpO1xuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCB7IGE6IGdldHRlciB9KTtcblx0cmV0dXJuIGdldHRlcjtcbn07IiwiLy8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5kID0gKGV4cG9ydHMsIGRlZmluaXRpb24pID0+IHtcblx0Zm9yKHZhciBrZXkgaW4gZGVmaW5pdGlvbikge1xuXHRcdGlmKF9fd2VicGFja19yZXF1aXJlX18ubyhkZWZpbml0aW9uLCBrZXkpICYmICFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywga2V5KSkge1xuXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcblx0XHR9XG5cdH1cbn07IiwiX193ZWJwYWNrX3JlcXVpcmVfXy5nID0gKGZ1bmN0aW9uKCkge1xuXHRpZiAodHlwZW9mIGdsb2JhbFRoaXMgPT09ICdvYmplY3QnKSByZXR1cm4gZ2xvYmFsVGhpcztcblx0dHJ5IHtcblx0XHRyZXR1cm4gdGhpcyB8fCBuZXcgRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmICh0eXBlb2Ygd2luZG93ID09PSAnb2JqZWN0JykgcmV0dXJuIHdpbmRvdztcblx0fVxufSkoKTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuX193ZWJwYWNrX3JlcXVpcmVfXy5yID0gKGV4cG9ydHMpID0+IHtcblx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG5cdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG5cdH1cblx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbn07IiwidmFyIHNjcmlwdFVybDtcbmlmIChfX3dlYnBhY2tfcmVxdWlyZV9fLmcuaW1wb3J0U2NyaXB0cykgc2NyaXB0VXJsID0gX193ZWJwYWNrX3JlcXVpcmVfXy5nLmxvY2F0aW9uICsgXCJcIjtcbnZhciBkb2N1bWVudCA9IF9fd2VicGFja19yZXF1aXJlX18uZy5kb2N1bWVudDtcbmlmICghc2NyaXB0VXJsICYmIGRvY3VtZW50KSB7XG5cdGlmIChkb2N1bWVudC5jdXJyZW50U2NyaXB0KVxuXHRcdHNjcmlwdFVybCA9IGRvY3VtZW50LmN1cnJlbnRTY3JpcHQuc3JjXG5cdGlmICghc2NyaXB0VXJsKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRpZihzY3JpcHRzLmxlbmd0aCkgc2NyaXB0VXJsID0gc2NyaXB0c1tzY3JpcHRzLmxlbmd0aCAtIDFdLnNyY1xuXHR9XG59XG4vLyBXaGVuIHN1cHBvcnRpbmcgYnJvd3NlcnMgd2hlcmUgYW4gYXV0b21hdGljIHB1YmxpY1BhdGggaXMgbm90IHN1cHBvcnRlZCB5b3UgbXVzdCBzcGVjaWZ5IGFuIG91dHB1dC5wdWJsaWNQYXRoIG1hbnVhbGx5IHZpYSBjb25maWd1cmF0aW9uXG4vLyBvciBwYXNzIGFuIGVtcHR5IHN0cmluZyAoXCJcIikgYW5kIHNldCB0aGUgX193ZWJwYWNrX3B1YmxpY19wYXRoX18gdmFyaWFibGUgZnJvbSB5b3VyIGNvZGUgdG8gdXNlIHlvdXIgb3duIGxvZ2ljLlxuaWYgKCFzY3JpcHRVcmwpIHRocm93IG5ldyBFcnJvcihcIkF1dG9tYXRpYyBwdWJsaWNQYXRoIGlzIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyXCIpO1xuc2NyaXB0VXJsID0gc2NyaXB0VXJsLnJlcGxhY2UoLyMuKiQvLCBcIlwiKS5yZXBsYWNlKC9cXD8uKiQvLCBcIlwiKS5yZXBsYWNlKC9cXC9bXlxcL10rJC8sIFwiL1wiKTtcbl9fd2VicGFja19yZXF1aXJlX18ucCA9IHNjcmlwdFVybDsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLmIgPSBkb2N1bWVudC5iYXNlVVJJIHx8IHNlbGYubG9jYXRpb24uaHJlZjtcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gW3Jlc29sdmUsIHJlamVjdCwgUHJvbWlzZV0gPSBjaHVuayBsb2FkaW5nLCAwID0gY2h1bmsgbG9hZGVkXG52YXIgaW5zdGFsbGVkQ2h1bmtzID0ge1xuXHRcIm1haW5cIjogMFxufTtcblxuLy8gbm8gY2h1bmsgb24gZGVtYW5kIGxvYWRpbmdcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxuLy8gbm8gb24gY2h1bmtzIGxvYWRlZFxuXG4vLyBubyBqc29ucCBmdW5jdGlvbiIsIl9fd2VicGFja19yZXF1aXJlX18ubmMgPSB1bmRlZmluZWQ7IiwiLyogZXNsaW50LWVuYWJsZSAqL1xuaW1wb3J0ICcuL2Nzcy9zdHlsZXMuc2Nzcyc7XG5pbXBvcnQgeyBtYW5hZ2VGZXRjaHMgfSBmcm9tICcuL2pzL2ZldGNoRGF0YS5qcyc7XG5pbXBvcnQgeyBtYW5hZ2VET00gfSBmcm9tICcuL2pzL21hbmFnZURPTS5qcyc7XG4vKiBkZWZpbml0aW9ucyBoZXJlIHRvIGJlIGFibGUgdG8gdXNlIGVtIGluc2lkZSBmdW5jdGlvbnMuIGlzbid0IGEgYmV0dGVyIHdheT8gKi9cbmNvbnN0IGZlZWRiYWNrID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2lucHV0LWZlZWRiYWNrJyk7XG5jb25zdCBpQ2l0eSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbnB1dC1jaXR5Jyk7XG5jb25zdCBtZXRyaWMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbWV0cmljJyk7XG5jb25zdCBpbXBlcmlhbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdpbXBlcmlhbCcpO1xuY29uc3Qgc3RhbmRhcmQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnc3RhbmRhcmQnKTtcbmxldCBjdXJyZW50VW5pdCA9ICcnO1xubGV0IGN1cnJlbnRDaXR5ID0gJyc7XG5cbmxvYWQoKTtcblxuZnVuY3Rpb24gbG9hZCgpIHtcbiAgc2V0TGlzdGVuZXJzKCk7XG59XG5cbmZ1bmN0aW9uIHNldExpc3RlbmVycygpIHtcbiAgaUNpdHkuYWRkRXZlbnRMaXN0ZW5lcignY2hhbmdlJywgc2V0Q2l0eSk7XG4gIG1ldHJpYy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIHNldFVuaXRTZWxlY3RlZCk7XG4gIGltcGVyaWFsLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgc2V0VW5pdFNlbGVjdGVkKTtcbiAgc3RhbmRhcmQuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBzZXRVbml0U2VsZWN0ZWQpO1xufVxuXG5hc3luYyBmdW5jdGlvbiBsb2FkV2VhdGhlcigpIHtcbiAgaWYgKGN1cnJlbnRDaXR5ID09PSAnJyB8fCBjdXJyZW50Q2l0eSA9PT0gbnVsbCB8fCBjdXJyZW50Q2l0eSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgLy8gSWYgbm8gaW5wdXQgd2UgZG8gbm90aGluZywgYnV0IHJlbW92ZSB0aGUgZXJyb3IgbXNnXG4gICAgZmVlZGJhY2suY2xhc3NMaXN0LmFkZCgnaW52aXNpYmxlJyk7XG4gICAgZmVlZGJhY2suY2xhc3NMaXN0LnJlbW92ZSgndmlzaWJsZScpO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IHdlYXRoZXJEYXRhID0gYXdhaXQgb2J0YWluKCd3ZWF0aGVyJywgY3VycmVudENpdHksIGN1cnJlbnRVbml0KTtcblxuICBpZiAod2VhdGhlckRhdGEgIT0gbnVsbCkge1xuICAgIG1hbmFnZURPTS5zZXRXZWF0aGVyKHdlYXRoZXJEYXRhKTtcbiAgICBmZWVkYmFjay50ZXh0Q29udGVudCA9ICcnO1xuICAgIGZlZWRiYWNrLmNsYXNzTGlzdC5hZGQoJ2ludmlzaWJsZScpO1xuICAgIGZlZWRiYWNrLmNsYXNzTGlzdC5yZW1vdmUoJ3Zpc2libGUnKTtcbiAgfSBlbHNlIHtcbiAgICBmZWVkYmFjay50ZXh0Q29udGVudCA9IFwiV2UgY291bGRuJ3QgZmluZCB0aGUgY2l0eSB5b3UncmUgbG9va2luZyBmb3JcIjtcbiAgICBmZWVkYmFjay5jbGFzc0xpc3QucmVtb3ZlKCdpbnZpc2libGUnKTtcbiAgICBmZWVkYmFjay5jbGFzc0xpc3QuYWRkKCd2aXNpYmxlJyk7XG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gb2J0YWluKHR5cGUsIC4uLmFyZ3MpIHtcbiAgY29uc3QgZmV0Y2hlZERhdGEgPSBhd2FpdCBtYW5hZ2VGZXRjaHMub2J0YWluKHR5cGUsIGFyZ3MpLmNhdGNoKChlKSA9PiB7fSk7XG5cbiAgaWYgKGZldGNoZWREYXRhLmZlZWRiYWNrLmNvZGUgPT09IDApIHtcbiAgICByZXR1cm4gZmV0Y2hlZERhdGEuZGF0YTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxufVxuXG5mdW5jdGlvbiBzZXRVbml0U2VsZWN0ZWQoZSkge1xuICBjb25zdCBzZWxlY3RlZCA9IGUudGFyZ2V0O1xuXG4gIG1ldHJpYy5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICBpbXBlcmlhbC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICBzdGFuZGFyZC5jbGFzc0xpc3QucmVtb3ZlKCdzZWxlY3RlZCcpO1xuICBzZWxlY3RlZC5jbGFzc0xpc3QuYWRkKCdzZWxlY3RlZCcpO1xuICBjdXJyZW50VW5pdCA9IFN0cmluZyhzZWxlY3RlZC5pZCk7XG4gIGxvYWRXZWF0aGVyKCk7XG59XG5cbmZ1bmN0aW9uIHNldENpdHkoZSkge1xuICBjdXJyZW50Q2l0eSA9IFN0cmluZyhpQ2l0eS52YWx1ZSk7XG4gIGxvYWRXZWF0aGVyKCk7XG59XG4iXSwibmFtZXMiOlsibWFuYWdlRmV0Y2hzIiwid0FwaUtleSIsIm1vZGUiLCJmZXRjaGVkRGF0YSIsImRhdGEiLCJmZWVkYmFjayIsImNvZGUiLCJyZWFzb24iLCJvYnRhaW4iLCJhcmdzIiwiYXNzaWduRmVlZGJhY2siLCJ0b0xvd2VyQ2FzZSIsImNpdHkiLCJTdHJpbmciLCJ1bml0cyIsInZhbGlkYXRlQ2l0eSIsImdldFdlYXRoZXJEYXRhIiwiY2F0Y2giLCJlIiwicmVnZXgiLCJ0ZXN0IiwiY29vcmRzIiwiZ2V0Q29vcmRzQnlDaXR5IiwidW5kZWZpbmVkIiwid2VhdGhlckRhdGEiLCJnZXRXZWF0aGVyQnlDb29yZHMiLCJsYXQiLCJsb24iLCJ1cmwiLCJyZXNwb25zZSIsImZldGNoIiwiZGF0YUpzb24iLCJqc29uIiwibWF4VGVtcCIsIm1pblRlbXAiLCJodW1pZGl0eSIsIndpbmRTcGVlZCIsIm1hbmFnZURPTSIsIndlYXRoZXJDYW52YXMiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwic2V0V2VhdGhlciIsImNsZWFuQ2FudmFzIiwiY2xhc3NMaXN0IiwicmVtb3ZlIiwic2lnbiIsImdldFRlbXBTaWduIiwibG9jYXRpb24iLCJjcmVhdGVFbGVtZW50IiwiaWQiLCJ0ZXh0Q29udGVudCIsIm5hbWUiLCJkZXNjIiwid2VhdGhlciIsImRlc2NyaXB0aW9uIiwiaW1hZyIsInNyYyIsImljb24iLCJ0ZW1wIiwibWFpbiIsInRoZXJtYWwiLCJmZWVsc19saWtlIiwiZm9vdFdEYXRhIiwibGVmdENvbnRhaW5lciIsInJpZ2h0Q29udGFpbmVyIiwiaW1nTWF4VGVtcCIsInR4dE1heFRlbXAiLCJ0ZW1wX21heCIsImltZ01pblRlbXAiLCJ0eHRNaW5UZW1wIiwidGVtcF9taW4iLCJpbWdIdW1pZGl0eSIsInR4dEh1bWlkaXR5IiwiaW1nV2luZFNwZWVkIiwidHh0V2luZFNwZWVkIiwid2luZCIsInNwZWVkIiwiYXBwZW5kIiwiZGl2V2l0aFNpZ24iLCJxdWVyeVNlbGVjdG9yIiwiY29uc29sZSIsImxvZyIsImZpcnN0Q2hpbGQiLCJyZW1vdmVDaGlsZCIsImlDaXR5IiwibWV0cmljIiwiaW1wZXJpYWwiLCJzdGFuZGFyZCIsImN1cnJlbnRVbml0IiwiY3VycmVudENpdHkiLCJsb2FkIiwic2V0TGlzdGVuZXJzIiwiYWRkRXZlbnRMaXN0ZW5lciIsInNldENpdHkiLCJzZXRVbml0U2VsZWN0ZWQiLCJsb2FkV2VhdGhlciIsImFkZCIsInR5cGUiLCJzZWxlY3RlZCIsInRhcmdldCIsInZhbHVlIl0sInNvdXJjZVJvb3QiOiIifQ==