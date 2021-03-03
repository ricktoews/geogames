const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');
const { centroids } = require('./centroids');
const filename = `./data/centroids.json`;

function cleanup() {

	var data = [];
	const $ = cheerio.load(centroids);
	var table = $('table');
	var tbody  = $(table).children('tbody');
	var rows  = $(tbody).children('tr');
	var rowNdx = 0;
	while (rowNdx < rows.length) {
		var tds = $(rows[rowNdx++]).children('td');

		var countryCell = tds[3];
		var country = $(countryCell).html();
		if (!country) continue;

		var latCell = tds[2];
		var lat = $(latCell).html();

		var longCell = tds[1];
		var long = $(longCell).html();

		data.push({ country, lat, long });
if (rowNdx < 10) {
	console.log('Country', country);
}
				
	}

	fs.writeFile(filename, JSON.stringify(data, null, 4), 'utf8', function(err) { if (err) console.log('Error writing', err); });
}

cleanup();

