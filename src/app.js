const path = require('path');
const express = require('express');
const hbs = require('hbs');
const geocode = require('./utils/geocode');
const forecast = require('./utils/forecast');

const app = express();
const port = process.env.PORT || 3000;

// Define paths for express config
const publicDirectory = path.join(__dirname, '../public');
const viewsDirectory = path.join(__dirname, '../templates/views');
const partialsDirectory = path.join(__dirname, '../templates/partials');

// Setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsDirectory);
hbs.registerPartials(partialsDirectory);

// Setup static directory to serve
app.use(express.static(publicDirectory));

app.get('', (req, res) => {
	res.render('index', {
		title: 'Weather',
		name: 'Shahnawaz Alam'
	});
});

app.get('/about', (req, res) => {
	res.render('about', {
		title: 'About me',
		name: 'Shahnawaz Alam'
	});
});

app.get('/help', (req, res) => {
	res.render('help', {
		title: 'Help Page',
		msg: "Seriously? You've come here for help, lol!",
		name: 'Shahnawaz Alam'
	});
});

app.get('/weather', (req, res) => {
	if (!req.query.address) {
		return res.send({
			error: 'You must provide an address'
		});
	}

	geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
		if (error) {
			return res.send({ error });
		}
		forecast(latitude, longitude, (error, forecastData) => {
			if (error) {
				return res.send({ error });
			}

			res.send({
				forecast: forecastData,
				location,
				address: req.query.address
			});
		});
	});
});

app.get('/products', (req, res) => {
	if (!req.query.search) {
		return res.send({
			error: 'You must provide a search term'
		});
	}
	console.log(req.query.search);
	res.send({
		products: []
	});
});

app.get('/help/*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Shahnawaz Alam',
		errorMessage: 'Help article not found!'
	});
});

app.get('*', (req, res) => {
	res.render('404', {
		title: '404',
		name: 'Shahnawaz Alam',
		errorMessage: 'Page not found!'
	});
});

app.listen(port, () => {
	console.log('Server started on port ' + port);
});
