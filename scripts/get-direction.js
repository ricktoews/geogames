const { borders, centroids, getLatLong, setOriginDirection, getDirection, makeSortFn } = require('./helpers');

const args = process.argv.slice(2);
const origin = args[0];
const destination = args[1];
const originalDirectionData = getDirection(origin, destination);
const borderingSort = makeSortFn(originalDirectionData);
setOriginDirection(origin);

var countryData = borders.find(b => b.country === origin);
var borderingCountries = countryData.borders;
borderingCountries.sort(borderingSort);

const [ origLat, origLong ] = getLatLong(origin);
const [ destLat, destLong ] = getLatLong(destination);

console.log(origin, borderingCountries);
console.log(destination);
const { angle, latDir, longDir, deltaLat, deltaLong } = getDirection(origin, destination);
console.log('Travel', longDir, latDir);
console.log('Angle', angle);
console.log('Change in Latitude', deltaLat, 'Change in Longitude', deltaLong);
