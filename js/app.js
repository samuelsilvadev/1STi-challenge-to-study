'use strict'

window.onload = (function () {
    
    const Utils = require('./helpers');
    const conditionsCode = require('./conditionsCodes');
    const week = require('./weekDays');

    const END_POINT = 'https://query.yahooapis.com/v1/public/yql';
    const $ = Utils.$;

    getForecastTopCapitalBrazil();

    /**
     * @param city: string 
     * Must contain city, state
     * e.g 'Fortaleza, CE'
     */
    function _searchCapital(city) {

        const apiToSearch = `${END_POINT}?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}')&u=c&format=json`;

        const createCard = function (data) {

            if (data.query.results) {

                const baseObj = data.query.results.channel;
                const location = baseObj.location;
                const item = baseObj.item.forecast[0];
                const wind = baseObj.wind;
                const humidity = baseObj.atmosphere.humidity;

                $('.card__time__title').innerText = `${location.city}, ${location.region} - ${location.country}`;
                $('.card__time__forecast').innerText = `${Utils.fahrenheitToCelsius(item.high)}°C ${conditionsCode[item.code]}`;
                $('#lowTime').innerText = `${Utils.fahrenheitToCelsius(item.low)}°`
                $('#highTime').innerText = `${Utils.fahrenheitToCelsius(item.high)}°`
                $('#humidity').innerText = `${humidity}%`
                $('#sensation').innerText = `${Utils.fahrenheitToCelsius(wind.chill)}°`
                $('#wind').innerText = `${wind.speed} Km/h`
                $('.card__time').classList.remove('display--none');

                createWeekDays(baseObj.item.forecast);
            }
        };

        const createWeekDays = function (forecast) {
            let htmlCardTimeDays = '';
            if (forecast && forecast.length > 0 && Array.isArray(forecast)) {
                forecast = forecast.slice(1, 6);
                htmlCardTimeDays = forecast.map(day => {
                    return ` <div>
                                <h4>${week[day.day]}</h4>
                                <div class="color--dark-orange">
                                    <span>${Utils.fahrenheitToCelsius(day.low)}º</span>
                                    <span>${Utils.fahrenheitToCelsius(day.high)}º</span>
                                </div>
                            </div>`
                }).join('');
                $('.card__time__days').innerHTML = htmlCardTimeDays;
            }
        };

        fetch(apiToSearch)
            .then(Utils.toJson)
            .then(createCard)
            .catch(console.log);
    };

    function getForecastTopCapitalBrazil() {
        let count = 0;

        const capitals = [
            'Rio de Janeiro',
            'São Paulo',
            'Belo Horizonte',
            'Brasilia',
            'Belém',
            'Salvador',
            'Curitiba',
            'Fortaleza',
            'Manaus',
            'João Pessoa'
        ];

        const createURL = function (capital) {
            return window.encodeURI(`${END_POINT}?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${capital}')&u=c&format=json`);
        };

        const createTr = function (data) {
            count++;
            if (data.query.results) {
                const baseObj = data.query.results.channel;
                const location = baseObj.location.city;
                const item = baseObj.item.forecast[0];
                return `<tr>
                        <td>${Utils.fahrenheitToCelsius(item.low)}°</td>
                        <td>${Utils.fahrenheitToCelsius(item.high)}°</td>
                        <td>${location}</td>
                    </tr>`;
            }
            throw new Error('Invalid Data');
        };

        const addTrInView = function (tr) {
            const idToPutTr = count <= 5 ? '#tbodyLeft' : '#tbodyRight';
            document.querySelector(idToPutTr).innerHTML += tr;
        };

        capitals.forEach((capital) => {
            fetch(createURL(capital))
                .then(Utils.toJson)
                .then(createTr)
                .then(addTrInView)
                .catch(console.log);
        });
    }

    /*--  SEARCH HANDLER --*/

    document.querySelector('.form').addEventListener('submit', handleSubmitSearch);

    function handleSubmitSearch(e) {
        e.preventDefault();
        const valueInputSearch = document.querySelector('.form__search-city').value;
        _searchCapital(valueInputSearch);
    }
})();