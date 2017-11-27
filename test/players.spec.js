const client = require('./client');
const expect = require('chai').expect;

describe('client', () => {

  describe('#players', () => {

    it('should return a list of players', async () => {
      const result = await client.players.get();
      
      expect(result).to.be.ok;
      expect(result.errors).to.not.be.ok;
    });

    it('should return a player by id', async () => {
      const result = await client.players.getById(934569741945810944);
      
      expect(result).to.be.ok;
      expect(result.errors).to.not.be.ok;
    });

  });

});