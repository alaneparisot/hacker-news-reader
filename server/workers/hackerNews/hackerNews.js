const axios = require('axios');

const Item = require('../../models/item');
const List = require('../../models/list');
const mongoose = require('./../../db/mongoose');

const BASE_URL = 'https://hacker-news.firebaseio.com/v0/';

const FIND_OPTIONS = {
  new: true, // Return created/updated document
  upsert: true // Create new document if no one found
};

const UPDATE_DELAY = 300000; // 5 minutes

// README **********************************************************************
// This worker fetches items' lists and items themselves from Hacker News API, *
// then saves and updates them into a self-managed database for faster access. *
// *****************************************************************************

axios.defaults.baseURL = BASE_URL;

/**
 * Updates local database periodically, with data got from Hacker News API.
 * @returns {Promise<List[]>} Array of newly created or updated (mostly) lists.
 */
async function connect() {
  const createOrUpdateListPromises = [];
  const listIds = List.getListIds();

  await mongoose.connect();

  listIds.forEach((listId) => {
    createOrUpdateListPromises.push(_createOrUpdateList(listId));

    setInterval(() => {
      _createOrUpdateList(listId);
    }, UPDATE_DELAY);
  });

  return Promise.all(createOrUpdateListPromises);
}

module.exports = {connect};

// Private =====================================================================

/**
 * Creates or updates a list got from Hacker News API, into local database.
 * @param listId {Number} List's identifier.
 * @returns {Promise<List>} A newly created or updated (mostly) list.
 * @private
 */
async function _createOrUpdateList(listId) {
  try {
    const createOrUpdateItemPromises = [];

    const itemIds = (await axios.get(`${listId}.json`)).data;

    itemIds.forEach((itemId) => {
      createOrUpdateItemPromises.push(_createOrUpdateItem(itemId));
    });

    const items = (await Promise.all(createOrUpdateItemPromises)).filter(Boolean);

    if (items.length === 0) { return; }

    const update = {$set: {elements: List.rankElements(items)}};

    return List.findByIdAndUpdate(listId, update, FIND_OPTIONS);
  } catch (err) {
    _onError(`list ${listId}`, err);
  }
}

/**
 * Creates or updates an item got from Hacker News API, into local database.
 * @param itemId {Number} Item's identifier.
 * @returns {Promise<Item>} A newly created or updated item.
 * @private
 */
async function _createOrUpdateItem(itemId) {
  try {
    const item = (await axios.get(`item/${itemId}.json`)).data;

    if (!item) { return; }

    const update = {$set: item};

    return Item.findByIdAndUpdate(itemId, update, FIND_OPTIONS);
  } catch (err) {
    _onError(`item ${itemId}`, err);
  }
}

/**
 * Displays a formatted error message.
 * @param obj {String} Type (item or list) and identifier. Ex: 'item 123'.
 * @param err {Error} Error object.
 * @private
 */
function _onError(obj, err) {
  const message = `Unable to create or update ${obj}.`;
  console.error(message, err && err.code ? err.code : err, err);
}