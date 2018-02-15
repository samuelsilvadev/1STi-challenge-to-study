window.onload = (function () {

    const END_POINT = 'https://query.yahooapis.com/v1/public/yql';
    getForecastTopCapitalBrazil();

    /**
     * @param city: string 
     * Must contain city, state
     * e.g 'Fortaleza, CE'
     */
    function _searchCapital(city) {

        const apiToSearch = `${END_POINT}?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}')&u=c&format=json`;
        fetch(apiToSearch)
            .then(_toJson)
            .then(console.log)
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
                        <td>${fahrenheitToCelsius(item.low)}°</td>
                        <td>${fahrenheitToCelsius(item.high)}°</td>
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
                .then(_toJson)
                .then(createTr)                
                .then(addTrInView)                
                .catch(console.log);
        });
    }

    function _toJson(data) {
        return data.json().then(json => { 
            console.log(json);
            return json;
        });
    }

    function fahrenheitToCelsius(temperature) {
        return Math.floor((temperature - 32) * (5/9));
    }

    /*--  SEARCH HANDLER --*/

    document.querySelector('.form').addEventListener('submit', handleSubmitSearch);

    function handleSubmitSearch(e) {
        e.preventDefault();
        const valueInputSearch = document.querySelector('.form__search-city').value;
        _searchCapital(valueInputSearch);
    }
})();