/* eslint-enable */
import './css/styles.scss';
import { manageFetchs } from './js/fetchData.js';
import { manageDOM } from './js/manageDOM.js';
/* definitions here to be able to use em inside functions. isn't a better way? */
const feedback = document.getElementById('input-feedback');
const iCity = document.getElementById('input-city');
const metric = document.getElementById('metric');
const imperial = document.getElementById('imperial');
const standard = document.getElementById('standard');
let currentUnit = '';
let currentCity = '';

load();
test(); // ojo borrar

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
    manageDOM.setWeather(weatherData);
    feedback.textContent = '';
    feedback.classList.add('invisible');
    feedback.classList.remove('visible');
    // console.log('--------- weatherData ---------');
    // console.log(weatherData);
    // console.log('--------- clouds -------------');
    // console.table(weatherData.clouds);
    // console.log('--------- coord ---------------');
    // console.table(weatherData.coord);
    // console.log('--------- main ----------------');
    // console.table(weatherData.main);
    // console.log('--------- sys -----------------');
    // console.table(weatherData.sys);
    // console.log('--------- weather -------------');
    // console.table(weatherData.weather);
    // console.log('--------- wind ----------------');
    // console.table(weatherData.wind);
  } else {
    feedback.textContent = "We couldn't find the city you're looking for";
    feedback.classList.remove('invisible');
    feedback.classList.add('visible');
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

async function test() {
  // ojo borrar
  const weatherData = await obtain('weather', 'Valencia', 'metric');

  if (weatherData != null) {
    manageDOM.setWeather(weatherData);
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
