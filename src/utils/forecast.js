const request = require('request');
const geocode = require('../utils/geocode');

const forecast = (latitude, longitude, callback) => {
	const url =
		'http://api.weatherstack.com/current?access_key=2c9b7cf9b6a681568dce3128960555ab&query=' +
		latitude +
		',' +
		longitude;
	request({ url, json: true }, (error, { body }) => {
		if (error) {
			callback('Unable to connect to weather service!', undefined);
		} else if (body.error) {
			callback('Unable to find location!', undefined);
		} else {
			callback(
				undefined,
				body.current.weather_descriptions[0] +
					'. It is currently ' +
					body.current.temperature +
					' degrees out.' +
					' There is ' +
					body.current.precip +
					'% chance of rain.' +
					' Humidity is ' +
					body.current.humidity +
					'%'
			);
		}
	});
};

module.exports = forecast;
