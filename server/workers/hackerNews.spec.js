require('./../config/config');

const expect = require('chai').expect;
const moxios = require('moxios');

const hackerNewsWorker = require('./hackerNews');
const Item = require('./../models/item');
const List = require('./../models/list');
const db = require('../db/db');

const BASE_URL = hackerNewsWorker.BASE_URL;
const ITEM_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const LIST_IDS = List.getListIds();

describe('Hacker News Worker', () => {

  describe('.connect()', () => {

    _stubRequests();

    beforeEach(async () => {
      await db.connect();
      await List.remove({});
      await Item.remove({});
      moxios.install();
    });

    afterEach(async () => {
      await db.disconnect();
      moxios.uninstall();
    });

    it('should save data from Hacker News API into database', async () => {
      await hackerNewsWorker.connect();

      const listCount = await List.count({});
      expect(listCount).to.equal(LIST_IDS.length);

      const randomList = await List.findById(LIST_IDS[3]);
      expect(randomList.elements.length).to.equal(ITEM_IDS.length);

      randomList.elements.forEach((element) => {
        expect(element.rank).to.equal(_getExpectedRank(element.item._id));
      });

      const randomItem = await Item.findById(5);
      expect(randomItem.title).to.equal('hnworker-item-5');
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

function _stubRequests() {
  LIST_IDS.forEach((listId) => {
    moxios.stubRequest(`${BASE_URL}/${listId}.json`, {
      status: 200,
      responseText: ITEM_IDS
    });
  });

  ITEM_IDS.forEach((itemId) => {
    moxios.stubRequest(`${BASE_URL}/item/${itemId}.json`, {
      status: 200,
      responseText: {
        _id: itemId,
        title: `hnworker-item-${itemId}`
      }
    });
  });
}