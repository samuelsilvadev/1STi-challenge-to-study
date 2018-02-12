window.onload = afterLoad;

function afterLoad() {
    getForecastTopCapitalBrazil();
};

/**
 * @param city: string 
 * Must contain city, state
 * e.g 'Fortaleza, CE'
 */
function _searchCapital(city) {

    const apiToSearch = `https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${city}')&u=c&format=json`;
    fetch(apiToSearch)
        .then(_toJson)
        .then(console.log)
        .catch(console.log);
};

function getForecastTopCapitalBrazil() {

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
    
    const endPoint = function(capital) {
        return window.encodeURI(`https://query.yahooapis.com/v1/public/yql?q=select * from weather.forecast where woeid in (select woeid from geo.places(1) where text='${capital}' )&u=c&format=json`);
    };

    capitals.forEach((capital) => {
        fetch(endPoint(capital))
            .then(_toJson)
            .then(console.log)
            .catch(console.log);
    });
}

function _toJson(data) {
    return data.json().then(json => json);
}

/*--  SEARCH HANDLER --*/

document.querySelector('.form').addEventListener('submit', handleSubmitSearch);

function handleSubmitSearch(e) {
    e.preventDefault();
    const valueInputSearch = document.querySelector('.form__search-city').value;
    _searchCapital(valueInputSearch);
}