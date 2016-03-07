'use strict';
const arguments = process.argv.slice(2),
      Mechanize = require('../lib/mechanize'),
  uri = 'http://www.google.com';

if (arguments.length > 0) {
	uri = arguments[0];
}

Mechanize.newAgent().
  get({uri: uri}, function (err, page) {
      console.log(page);
  });
