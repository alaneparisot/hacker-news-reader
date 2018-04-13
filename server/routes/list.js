const express = require('express');

const List = require('./../models/list');

const POPULATE_OPTIONS = {
  path: 'elements.item',
  fields: '_id title score descendants url'
};

const router = express.Router();

/**
 * Returns a list with limited item properties for faster access.
 * @param id {String} List's identifier. Ex: 'topstories'.
 * @returns {List} A populated list.
 */
router.get('/:id', (req, res) => {
  List
    .findById({_id: req.params.id})
    .populate(POPULATE_OPTIONS.path, POPULATE_OPTIONS.fields)
    .exec((err, list) => {
      if (err || !list) { return res.status(err ? 500 : 404).end(); }
      res.send(list);
    });
});

module.exports = router;