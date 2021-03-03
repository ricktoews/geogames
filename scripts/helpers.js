const borders = require('./data/borders.json');
const centroids = require('./data/centroids.json');
for (let i = 0; i < borders.length; i++) {
	let cent = centroids.find(c => c.country === borders[i].country);
	if (cent) {
		borders[i].lat = cent.lat;
		borders[i].long = cent.long;
	}
}
// Now, we have a list of countries, with central latitudes and longitudes, and with bordering countries.
exports.borders = borders;
exports.centroids = centroids;

function getLatLong(country) {
	let cent = centroids.find(c => c.country === country) || {};
	return [ 1*cent.lat, 1*cent.long ];
}
exports.getLatLong = getLatLong;

function getDirection(from, to) {
	var [ fromLat, fromLong ] = getLatLong(from);
	var [ toLat, toLong ] = getLatLong(to);

	var deltaLat = Math.abs(toLat - fromLat);
	var deltaLong = Math.abs(toLong - fromLong);

	var latDir = toLat < fromLat ? 'west' : 'east';
	var longDir = toLong < fromLong ? 'south' : 'north';

	var angle = Math.atan(deltaLat / deltaLong) * (180/3.14159);

	return { latDir, longDir, angle, deltaLat, deltaLong };

}
exports.getDirection = getDirection;

function makeSortFn(originalDirectionData) {
	const borderingSort = (a, b) => {
		var aDirData = getDirectionFromOrigin(a);
		var bDirData = getDirectionFromOrigin(b);

		var aDirMatch, bDirMatch;
		if (aDirData.latDir === originalDirectionData.latDir &&
		    aDirData.longDir === originalDirectionData.longDir) {
			aDirMatch = 4;
		} else if (aDirData.latDir === originalDirectionData.latDir ||
		           aDirData.longDir === originalDirectionData.longDir) {
			aDirMatch = 2;
		} else {
			aDirMatch = 0;
		}

		if (bDirData.latDir === originalDirectionData.latDir &&
		    bDirData.longDir === originalDirectionData.longDir) {
			bDirMatch = 4;
		} else if (bDirData.latDir === originalDirectionData.latDir ||
		           bDirData.longDir === originalDirectionData.longDir) {
			bDirMatch = 2;
		} else {
			bDirMatch = 0;
		}

		var aDeltaAngle = Math.abs(originalDirectionData.angle - aDirData.angle);
		var bDeltaAngle = Math.abs(originalDirectionData.angle - bDirData.angle);

		if (aDirMatch === bDirMatch) {
			return aDeltaAngle < bDeltaAngle ? -1 : 1;
		} else {
			return aDirMatch < bDirMatch ? -1 : 1;
		}

	}

	return borderingSort;
}

function makeDirectionFromOriginFn(orig) {
	return to => getDirection(orig, to);
}

exports.makeSortFn = makeSortFn;
exports.makeDirectionFromOriginFn = makeDirectionFromOriginFn;

var getDirectionFromOrigin;
function setOriginDirection(origin) {
	getDirectionFromOrigin = makeDirectionFromOriginFn(origin);
}
exports.setOriginDirection = setOriginDirection;
