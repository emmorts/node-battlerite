const HttpClient = require('./httpClient');

const Matches = require('./api/matches');
const Players = require('./api/players');

class Client {

  constructor (apiKey) {
    if (!apiKey) {
      throw new Error(`API key is missing!`);
    }

    this.httpClient = new HttpClient(apiKey);

    this._matches = new Matches(this.httpClient);
    this._players = new Players(this.httpClient);
  }

  get matches () {
    return this._matches;
  }

  get players () {
    return this._players;
  }
  
}

module.exports = Client;