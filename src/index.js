import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';
import { fetchCountries } from './fetchCountries.js';
import { getRefs } from './getRefs';

const refs = getRefs();
const DEBOUNCE_DELAY = 300;

refs.input.addEventListener(
  'input',
  debounce(onInputSearchCountry, DEBOUNCE_DELAY)
);

function onInputSearchCountry(e) {
  e.preventDefault();
  const inputValue = e.target.value.trim();
  if (!inputValue) {
    return;
  }

  fetchCountries(inputValue).then(onFetchSuccess).catch(onFetchError);
}

function onFetchSuccess(data) {
  clearListCountry();
  clearCountry();
  console.log(data);
  if (data.length === 1) {
    clearListCountry();
    clearCountry();
    addCardCountry(data);
    return;
  }
  if (data.length > 10) {
    clearListCountry();
    clearCountry();
    Notify.info('Too many matches found. Please enter a more specific name.');
    return;
  }
  if (data.length >= 2 || data.length <= 10) {
    clearListCountry();
    clearCountry();
    addListCountry(data);
    return;
  }
}
function onFetchError(data) {
  Notify.failure('Oops, there is no country with that name');
}

function clearListCountry() {
  refs.ulEl.innerHTML = '';
}
function clearCountry() {
  refs.divEl.innerHTML = '';
}
function addListCountry(listCountry) {
  const addMarketing = listCountry
    .map(
      common =>
        `<li><img src=${common.flags.svg} width="50px"/><span>${common.name.official}</span></li>`
    )
    .join('');
  refs.ulEl.insertAdjacentHTML('afterbegin', addMarketing);
}
function addCardCountry(cardCountry) {
  const addMarketing = cardCountry.map(
    common => `<h1><img src=${common.flags.svg} width="50px"/>${
      common.name.common
    }</h1>
      <ul class="country">
        <li>Capital: ${common.capital}</li>
        <li>Population: ${common.population}</li>
        <li>Languages: ${Object.values(common.languages)}</li>
      </ul>`
  );
  refs.divEl.insertAdjacentHTML('afterbegin', addMarketing);
}
