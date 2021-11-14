import './css/styles.css';
import { debounce } from 'lodash';
import { fetchCountries } from './fetchCountries';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector('#search-box');
const countryInfo = document.querySelector('.country-info');
const countriesList = document.querySelector('.country-list');

fetchCountries();
searchBox.addEventListener('input', debounce(onCountryInput, DEBOUNCE_DELAY));
function onCountryInput() {
  const inputText = searchBox.value.trim();

  countriesList.innerHTML = '';
  countryInfo.innerHTML = '';

  if (!inputText) {
    return;
  }
  fetchCountries(inputText)
    .then(countries => {
      if (countries.status === 404) {
        Notify.failure('Oops, there is no country with that name.');
        return;
      }
      if (countries.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      if (countries.length > 1) {
        renderCountries(countries);
        return;
      }
      renderCountryInfo(countries);
    })
    .catch(error => console.log(error));
};

function renderCountries(countries) {
  countryInfo.innerHTML = '';
  const markup = countries
    .map(country => {
      return `<li class="country-list-item">
                <img class="flag-image" src='${country.flag}' alt='${country.name} flag' width='40' />
                <p>${country.name}</p>
              </li>`;
    })
    .join('');
      countryInfo.innerHTML = markup;
};

function renderCountryInfo(country) {
  countriesList.innerHTML = '';
  const markup = country
    .map(country => {
      return `<div class="renderCountryInfo-firstString">
                <img class="flag-image" src='${country.flag}' alt='${country.name} flag' width='70' />
                <h2>${country.name}</h2>
              </div>
                <p><b>Capital</b>: ${country.capital}</p>
                <p><b>Population</b>: ${country.population}</p>
                <p><b>Languages</b>: ${country.languages.map(item => ` ${item.name}`)}</p>`;
    })
    .join('');
      countryInfo.innerHTML = markup;
};