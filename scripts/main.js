let countries; //list of all countries
let filteredCountries; //copy of all countries / filtered countries
let themeFlag = false;
const mainContent = document.getElementById('main-content');
const filterInput = document.querySelector('select');
const searchBtn = document.getElementById('search-button');
const searchInput = document.getElementById('search-input');
const switchThemeBtn = document.getElementById('switch-theme');
createAndFetch(
  //fetching data from the API
  'https://restcountries.com/v3.1/all?fields=currencies,capital,name,flags,languages,population,region,subregion,tld,borders'
)
  .then(() => {
    filteredCountries = [...countries];
    renderUI(countries); //renders all countries on load
  })
  .catch(err => {
    alert('Server is offline, please try again later! (or try using vpn if you live in Iran (: )');
  });

async function createAndFetch(url) {
  //calls for fetch & parses datas
  const result = await fetch(url, {mode: 'no-cors',  headers: {
   'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Accept': 'application/json'
  }});
  countries = await result.json();
}

function renderUI(listOfCountries) {
  //render UI
  listOfCountries.forEach((country, index) => {
    const countryEl = document.createElement('section');
    countryEl.classList = 'country-prv';
    countryEl.setAttribute('id', `${country.population}`);
    countryEl.innerHTML = `
    <img
      class="county-flag-prv"
      src="${country.flags.svg}"
      alt="flag of ${country.name.common}"
    />
    <div class="country-desc-prv">
      <h2 class="country-name-prv">${country.name.common}</h2>
      <p class="country-population-prv">Population: ${country.population}</p>
      <p class="country-region-prv">Region: ${country.region}</p>
      <p class="country-capital-prv">Capital: ${country.capital[0]}</p>
    </div>`;
    mainContent.appendChild(countryEl);
  });

  const countryElements = document.querySelectorAll('.country-prv');
  countryElements.forEach(el => {
    el.addEventListener('click', showDetailHandler);
  });
}

function filterCountries(region) {
  //filter countries handler
  filteredCountries = countries.filter(country => {
    return country.region === region;
  });
  renderUI(filteredCountries);
}

filterInput.addEventListener('change', event => {
  //gets & passes the chosen region to filter
  mainContent.innerHTML = '';
  if (event.target.value === 'none') {
    renderUI(countries);
    filterFlag = false;
    return;
  }
  filterFlag = true;
  filterCountries(event.target.value);
});

searchBtn.addEventListener('click', () => {
  mainContent.innerHTML = '';
  searchCountries(searchInput.value.trim());
});

function searchCountries(searchedValue) {
  //search countries handler
  const matchedCountries = filteredCountries.filter(country => {
    const countryName = country.name.common;
    if (countryName.includes(searchedValue)) {
      return country;
    }
  });
  renderUI(matchedCountries);
}

function backBtnHandler() {
  //detail country back btn handler
  mainContent.style.display = 'flex';
  const detailPage = document.getElementById('country-detail');
  document.body.removeChild(detailPage);
}

function showDetailHandler(event) {
  //shows detail country page
  const countryId = +event.target.closest('section').id;
  const countryObj = countries.filter(el => {
    return el.population === countryId;
  });
  renderDetails(countryObj[0]);
  mainContent.style.display = 'none';
}

function renderDetails(obj) {
  //renders html to detail page
  const languagesList = [];
  const bordersList = [];
  for (border of obj.borders) {
    bordersList.push(border);
  }
  for (lan in obj.languages) {
    languagesList.push(lan);
  }
  const borderString = bordersList.join(', ');
  const langString = languagesList.join(', ');
  const detailCountryEl = document.createElement('div');
  detailCountryEl.setAttribute('id', 'country-detail');
  detailCountryEl.innerHTML = `  <button id="back-btn" type="button">&#x2190; Back</button>
  <div id="detail-country-img"><img src=${obj.flags.svg} alt=""/></div>
  <h2 id="detail-country-name">${obj.name.common}</h2>
  <div id="lists">
    <ul>
      <li>Native Name: ${Object.values(obj.name.nativeName)[0].common}</li>
      <li>Population: ${obj.population}</li>
      <li>Region: ${obj.region}</li>
      <li>Sub Region: ${obj.subregion}</li>
      <li>Capital: ${obj.capital[0]}</li>
    </ul>
    <ul>
      <li>Top Level Domain: ${obj.tld[0]}</li>
      <li>Currencies: ${Object.values(obj.currencies)[0].name}</li>
      <li>Languages: ${langString}</li>
    </ul>
  </div>
  <div id="borders">
    Border Countries: ${borderString}
  </div>`;
  document.body.insertAdjacentElement('beforeend', detailCountryEl);
  if (themeFlag) {
    //select theme of detail page on create
    detailTheme('second-light-bg', 'light-text', 'add');
  } else {
    detailTheme('second-light-bg', 'light-text', 'remove');
  }
  const backBtn = document.getElementById('back-btn');
  backBtn.addEventListener('click', backBtnHandler);
}

switchThemeBtn.addEventListener('click', () => {
  if (!themeFlag) {
    themeFlag = true;
  } else {
    themeFlag = false;
  }

  const bg = document.querySelectorAll(
    '.country-prv, header, #navigation-bar input, select'
  );
  const secondBg = document.querySelectorAll('#navigation-bar, #main-content');
  const txt = document.querySelectorAll(
    '.country-desc-prv p, .country-desc-prv h2, header h1, header button, header button i, #navigation-bar button i, select, option'
  );
  for (el of secondBg) {
    el.classList.toggle('second-light-bg');
  }
  for (el of txt) {
    el.classList.toggle('light-text');
  }
  for (el of bg) {
    el.classList.toggle('light-bg');
  }

  if (document.getElementById('country-detail')) {
    const detail = document.getElementById('country-detail');
    detail.classList.toggle('second-light-bg');
    detail.querySelector('h2').classList.toggle('light-text');
    const listItems = detail.querySelectorAll(
      'li, #borders, #country-detail button'
    );
    detail.querySelector('button').classList.toggle('light-bg');
    for (item of listItems) {
      item.classList.toggle('light-text');
    }
  }
});

function detailTheme(bg, txt, type) {
  //select theme of detail page on create
  if (type === 'add') {
    const detail = document.getElementById('country-detail');
    detail.classList.add(`${bg}`);
    detail.querySelector('h2').classList.add(`${txt}`);
    const listItems = detail.querySelectorAll(
      'li, #borders, #country-detail button'
    );
    detail.querySelector('button').classList.add('light-bg');
    for (item of listItems) {
      item.classList.add(`${txt}`);
    }
  } else {
    const detail = document.getElementById('country-detail');
    detail.classList.remove('second-light-bg');
    detail.querySelector('h2').classList.remove('light-text');
    const listItems = detail.querySelectorAll(
      'li, #borders, #country-detail button'
    );
    detail.querySelector('button').classList.remove('light-bg');
    for (item of listItems) {
      item.classList.remove('light-text');
    }
  }
}
