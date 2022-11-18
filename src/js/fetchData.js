/* eslint-enable */

// We use a module Pattern to define a single object that will handle the fetchs.
// this object will contain the api keys as a private variable and the functions to do the requests.
const manageFetchs = (function () {
  const wApiKey = '058045ccc64546bb393afcf67c9f864f'; // it's a public API
  const mode = { mode: 'cors' };
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
      reason: '',
    },
  };

  // data --> Tells us what we gonna fetch
  // ...args --> receive the arguments for the call.
  async function obtain(data, ...args) {
    assignFeedback(0); // by default we've worked fine

    switch (data.toLowerCase()) {
      case 'weather': {
        const city = String(args[0]);
        if (validateCity(city)) {
          fetchedData.data = await getWeatherData(city.toLowerCase()).catch(
            (e) => {
              assignFeedback(1);
            }
          );
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
    const coords = await getCoordsByCity(city).catch((e) => {
      assignFeedback(4);
    });

    if (coords[0] !== undefined) {
      // 2) Openweather fetch
      const weatherData = await getWeatherByCoords(
        coords[0].lat,
        coords[0].lon,
        'metric'
      ).catch((e) => {
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
      case 0: {
        // all went okay
        fetchedData.feedback.reason = 'ok';
        break;
      }
      case 1: {
        fetchedData.feedback.reason = 'Error during fetching data';
        break;
      }
      case 2: {
        fetchedData.feedback.reason = "City argument doesn't comply format";
        break;
      }
      case 3: {
        fetchedData.feedback.reason = 'Fetch type not codified.';
        break;
      }
      case 4: {
        fetchedData.feedback.reason = 'Error fetching GeoCoding';
        break;
      }
      case 5: {
        fetchedData.feedback.reason = 'Error fetching openweather by coords';
        break;
      }
      case 6: {
        fetchedData.feedback.reason = 'Location not found';
        break;
      }
    }
  }

  return { obtain };
})();

export { manageFetchs };
