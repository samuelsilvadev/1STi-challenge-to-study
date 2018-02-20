/**
 * Function used to facilite get elements from view
 * @param {selector} element 
 */
function $(element) {
    return document.querySelector(element);
};

function toJson(data) {
    return data.json().then(json => json);
};

function fahrenheitToCelsius(temperature) {
    return Math.floor((temperature - 32) * (5 / 9));
};

exports.$ = $;
exports.toJson = toJson;
exports.fahrenheitToCelsius = fahrenheitToCelsius;