const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  _id: {type: Number, required: true},
  deleted: Boolean,
  type: String,
  by: String,
  time: Number,
  text: String,
  dead: Boolean,
  parent: {type: Number, ref: 'Item'},
  poll: {type: Number, ref: 'Item'},
  kids: [{type: Number, ref: 'Item'}],
  url: String,
  score: Number,
  title: String,
  parts: [{type: Number, ref: 'Item'}],
  descendants: Number
});

module.exports = mongoose.model('Item', itemSchema);

/*
Item, as defined in Hacker News API.
https://github.com/HackerNews/API#items

Field         |  Description
--------------|-------------------------------------------------------------------
id            |  The item's unique id.
deleted       |  true if the item is deleted.
type          |  The type of item. One of "job", "story", "comment", "poll", or "pollopt".
by            |  The username of the item's author.
time          |  Creation date of the item, in Unix Time.
text          |  The comment, story or poll text. HTML.
dead          |  true if the item is dead.
parent        |  The comment's parent: either another comment or the relevant story.
poll          |  The pollopt's associated poll.
kids          |  The ids of the item's comments, in ranked display order.
url           |  The URL of the story.
score         |  The story's score, or the votes for a pollopt.
title         |  The title of the story, poll or job.
parts         |  A list of related pollopts, in display order.
descendants   |  In the case of stories or polls, the total comment count.
*/