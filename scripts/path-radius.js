const fs = require('fs');

const { borders, centroids, getLatLong, setOriginDirection, getDirection, makeSortFn } = require('./helpers');

const args = process.argv.slice(2);
const origin = args[0];
const destination = args[1];
const skip = args[2] || 'omitted';

var paths = [[origin]];

const MAX_DEPTH = 30;

function notAlreadyInPaths(depthPaths, country) {
	var result = true;
	var search = `"${country}"`;
	result = depthPaths.indexOf(search) === -1;
	return result;
}

function getBorders(currentCountry) {
	var countryData = borders.find(b => b.country === currentCountry) || [];
	return countryData.borders;
}

var reachedDest = false;
for (depth = 0; !reachedDest && depth < MAX_DEPTH; depth++) {
	console.log('Depth', depth);
	var depthPaths = JSON.stringify(paths);
	for (let i = 0, j = paths.length; i < j; i++){
		let p = paths[i];
		var country = p[p.length - 1];

		var bordering = getBorders(country);
		bordering = bordering.filter(c => c !== skip);
		let pathStub = paths[i].slice(0);
		for (let j = 0; j < bordering.length; j++) {
			// Add only if this country isn't in the path already.
			if (pathStub.indexOf(bordering[j]) === -1) {
				if (notAlreadyInPaths(depthPaths, bordering[j])) {
					if (j === 0) paths[i].push(bordering[j]);
					else paths.push(pathStub.concat(bordering[j]));
				}
			}
			if (bordering[j] === destination) reachedDest = true;
		}
	}
	paths = paths.filter(p => p.length === depth + 2);
	paths.sort((a, b) => { let strA = a.join('.'), strB = b.join('.'); return strA < strB ? -1 : 1; });
//	console.log('paths after depth', depth, paths);
//	console.log('==============================>');
}

if (reachedDest) {
	console.log('Found path from', origin, 'to', destination);
	let foundPath = paths.filter(p => p.indexOf(destination) !== -1);
	foundPath.forEach(p => {
		console.log(p);
	});
	console.log('Minimum border crossings', foundPath[0].length - 1);
	console.log('Number of paths found', foundPath.length);
} else {
	console.log('Did not find path');
	console.log('paths accumulated', paths.length);

	let ends = paths.map(p => p[p.length - 1]);
	fs.writeFile('./ends.txt', JSON.stringify(ends, null, 4), 'utf8', function(err) { if (err) console.log('Error writing', err); });
	fs.writeFile('./incomplete.txt', JSON.stringify(paths, null, 4), 'utf8', function(err) { if (err) console.log('Error writing', err); });
}
