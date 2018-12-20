require('../../config/config');

const {expect} = require('chai');
const moxios = require('moxios');

const hackerNewsWorker = require('../../workers/hackerNews');
const Item = require('../../models/item');
const List = require('../../models/list');
const db = require('../../db/db');

const BASE_URL = hackerNewsWorker.BASE_URL;
const ITEM_IDS = [1, 2, 3];

const LIST_IDS = List.getListIds();

describe('Hacker News Worker', () => {

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

    const randomItem = await Item.findById(2);
    expect(randomItem.title).to.equal('hnworker-item-2');
  });

});

// Private =====================================================================

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