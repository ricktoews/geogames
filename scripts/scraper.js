const fs = require('fs');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const url = `https://en.wikipedia.org/wiki/List_of_countries_and_territories_by_land_borders`;
const filename = `./data/borders.json`;
async function scrape() {

	const re = /(<table class="wikitable sortable jquery-tablesorter">[\s\S]*?<\/table>)/i;

	var data = [];
	var res = await fetch(url);
	var body = await res.text();
	if (body) {
		const $ = cheerio.load(body);
		var table = $('.wikitable');
		var tbody  = $(table).children('tbody');
		var rows  = $(tbody).children('tr');
		var rowNdx = 0;
		while (rowNdx < rows.length) {
			var tds = $(rows[rowNdx++]).children('td');

			var countryCell = tds[0];
			var countryEl = $(countryCell).find('a');
			if (countryEl.length === 0) continue;
			var country = $(countryEl).html();

			var bordersCell = tds[5];
			var bordersEl = $(bordersCell).children('a');
			var borders = [];
			if (bordersEl.length > 0) {
				for (let i = 0; i < bordersEl.length; i++) {
					let b = $(bordersEl[i]).html();
					borders.push(b);
				}
			}
			data.push({ country, borders });
if (rowNdx < 10) {
	console.log('Bordering countries ', borders);
}
				
		}
	}

	fs.writeFile(filename, JSON.stringify(data, null, 4), 'utf8', function(err) { if (err) console.log('Error writing', err); });
}

scrape();
