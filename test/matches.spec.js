const client = require('./client');
const expect = require('chai').expect;

describe('client', () => {

  describe('#matches', () => {

    it('should return a list of matches', async () => {
      const result = await client.matches.get();

      expect(result).to.be.ok;
      expect(result.errors).to.not.be.ok;
    });

    it('should return a list of matches by player name', async () => {
      const result = await client.matches
        .filter({ playerNames: 'eMmorts' })
        .get();
      // const result = await client.matches.getByPlayerNames('eMmorts');

      expect(result).to.be.ok;
      expect(result.errors).to.not.be.ok;
    });

  });

});