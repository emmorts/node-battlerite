const Request = require('./request');

class PlayerRequest extends Request {

  constructor (httpClient) {
    super(httpClient, '/players');
  }

  get (id) {
    if (!id) {
      return super.get();
    }

    return this.httpClient.get(`/players/${id}`);
  }
}

module.exports = PlayerRequest;