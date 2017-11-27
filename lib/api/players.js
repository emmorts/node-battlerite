class Players {
  
    constructor (httpClient) {
      if (!httpClient) {
        throw new Error('HTTP client not provided');
      }
  
      this.httpClient = httpClient;
    }
  
    get (options) {
      return this.httpClient.get('/players', options);
    }
  
    getById (id) {
      return this.httpClient.get(`/players/${id}`);
    }
  }
  
  module.exports = Players;