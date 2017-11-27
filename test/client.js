const config = require('./config');
const Client = require('../lib/client');

module.exports = new Client(config.apiKey);