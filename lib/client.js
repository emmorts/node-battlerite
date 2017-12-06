const HttpClient = require('./httpClient');

const MatchRequest = require('./api/matchRequest');
const PlayerRequest = require('./api/playerRequest');

class Client {

  constructor (apiKey) {
    if (!apiKey) {
      throw new Error(`API key is missing!`);
    }

    this.httpClient = new HttpClient(apiKey);
  }

  get matches () {
    return new MatchRequest(this.httpClient);
  }

  get players () {
    return new PlayerRequest(this.httpClient);
  }

}

module.exports = Client;