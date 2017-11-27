class Matches {

  constructor (httpClient) {
    if (!httpClient) {
      throw new Error(`HTTP client not provided`);
    }

    this.httpClient = httpClient;
  }

  get (options) {
    return this.httpClient.get('/matches', options);
  }

  getByPlayerNames (names) {
    if (names instanceof Array) {
      names = names.join(',');
    }

    const options = {
      'filter': {
        'playerNames': names
      }
    };

    return this.httpClient.get('/matches', options);
  }
}

module.exports = Matches;