import products from './shop/_products.js';

const contents = JSON.stringify(products);

export function get(req, res) {
	res.writeHead(200, {
		'Content-Type': 'application/json'
	});

    res.end(contents);
}