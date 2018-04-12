const mongoose = require('mongoose');

const LIST_IDS = ['top', 'new', 'best', 'ask', 'show', 'job']
  .map((type) => type + 'stories');

const listSchema = new mongoose.Schema({
  _id: {type: String, required: true},
  elements: [{
    item: {type: Number, ref: 'Item'},
    rank: Number
  }]
});

// Static Methods --------------------------------------------------------------

/**
 * Returns an array of all list identifiers: ['topstories', 'newstories', ...].
 * @returns {string[]} Array of list identifiers.
 */
listSchema.statics.getListIds = () => {
  return LIST_IDS;
};

/**
 * Returns an array of elements with a calculated rank for each item.
 * @param items {Item[]} Array of items.
 * @returns {{item: Number, rank: Number}[]} Array of elements.
 */
listSchema.statics.rankElements = (items) => {
  const scores = items.map((item) => item.score).sort((a, b) => a - b);

  // Returns elements.
  return items.map((item) => ({
      item: item._id,
      rank: _getElementRank(scores, item.score)
    })
  );
};

module.exports = mongoose.model('List', listSchema);

// Private =====================================================================

/**
 * Returns the rank of an item by comparing its score to all other scores.
 * @param allScores {Number[]} Array of scores of all items of a list.
 * @param itemScore {Number} Item's score to compare and rank.
 * @returns {number} Item's rank.
 * @private
 */
function _getElementRank(allScores, itemScore) {
  const index = allScores.indexOf(itemScore);

  if (index >= (allScores.length * .9)) {
    return 3;
  } else if (index >= (allScores.length * .66)) {
    return 2;
  } else if (index >= (allScores.length * .50)) {
    return 1;
  }

  return 0;
}