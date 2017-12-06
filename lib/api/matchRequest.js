const Request = require('./request');

class MatchRequest extends Request {

  constructor (httpClient) {
    super(httpClient, '/matches');
  }

}

module.exports = MatchRequest;