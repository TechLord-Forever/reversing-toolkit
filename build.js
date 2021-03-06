#!/usr/bin/env node

var fs = require('fs');
var minimist = require('minimist');
var _ = require('underscore');

var sortTypes = [
  {
    name: "Alphebetical",
    // Sort alphabetically by name
    callback: function(i1, i2) {
      var name1 = i1.name.toLowerCase(),
          name2 = i2.name.toLowerCase();
      if(name1 < name2) {
        return -1;
      } else if(name1 > name2) {
        return 1;
      } else {
        return 0;
      }
    },
    prefix: "ABC"
  }
];

/**
 * Get a string containing N dashes.
 * @param {(Number|String)} length - Number of dashes, if a string use the
 *                          length of the string
 * @return {String} dashes string
 */
var dashes = function(length) {
  if(_.isString(length)) {
    length = length.length;
  }

  var text = '';
  for(var i = 0; i < length; i++)
    text += '-';

  return text;
};

/**
 * Convert an item to markdown text.
 * @param {Object} item - Item
 * @return {String} markdown text
 */
var itemToMarkdown = function(item) {
  var builder = [];

  builder.push(item.name);
  builder.push(dashes(item.name));

  if(item.description) {
    builder.push(item.description);
  }

  if(item.repository) {
    builder.push('- Repository: ' + item.repository);
  }

  if(item.thread) {
    builder.push('- Thread: ' + item.thread);
  }

  if(item.website) {
    builder.push('- Website: ' + item.website);
  }

  return builder.join('\n');
};

/**
 * Convert a JSON-parsed object containing items to markdown text.
 * @param {Object} json - JSON object
 * @return {String} markdown text
 */
var getMarkdown = function(json) {
  var builder = [];

  // Append all items
  if(_.isArray(json.toolkit)) {
    json.toolkit.forEach(function(item) {
      builder.push(itemToMarkdown(item));
      builder.push('');
    });
  }

  return builder.join('\n');
};

var main = function(args) {
  var contents = fs.readFileSync('toolkit.json'),
      json = undefined;

  try { json = JSON.parse(contents); }
  catch (e) { console.error(e); }

  // Sort
  json.toolkit = json.toolkit.sort(sortTypes[0].callback);

  if(json) {
    var markdown = getMarkdown(json);
    console.log(markdown);
  }

  return 0;
};

var args = minimist(process.argv.slice(2)),
    retval = main(args);

if(_.isNumber(retval)) {
  process.exit(retval);
}
