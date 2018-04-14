const expect = require('chai').expect;

const List = require('./list');

describe('List', () => {

  it('should rank elements', () => {
    const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => ({
      _id: num,
      score: num
    }));

    const elements = List.rankElements(items);

    elements.forEach((element) => {
      expect(element.rank).to.equal(_getExpectedRank(element.item));
    });
  });

});

// Private =====================================================================

function _getExpectedRank(itemId) {
  switch (itemId) {
    case 10:
      return 3;
    case 9:
    case 8:
      return 2;
    case 7:
    case 6:
      return 1;
    default:
      return 0;
  }
}