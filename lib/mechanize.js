'use strict';
const Agent = require('./mechanize/agent'),
  Page = require('./mechanize/page');

function newAgent() {
  return new Agent();
}

exports.newAgent = newAgent;
exports.Page = Page;
