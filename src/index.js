/* eslint-enable */

import { manageFetchs } from './js/fetchData.js';
import { manageDOM } from './js/manageDOM.js';

// const canvas = document.getElementById('test-canvas');
const iCity = document.getElementById('input-city');
iCity.addEventListener('change', test);

async function test() {
  console.log('<test> ' + iCity.value);
  const weatherData = await obtain('weather', iCity.value);

  if (weatherData != null) {
    manageDOM.setWeather(weatherData);
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

async function obtain(type, ...args) {
  const fetchedData = await manageFetchs.obtain(type, args).catch((e) => {
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
