'use strict';
/**
 * Initialize a new `History`.
 * @api public
 */

const History = module.exports = function History() {
  this.pages = [];
  this.currentPage = null;
};

History.prototype.push = function (page) {
  this.pages.push(page);
  this.currentPage = page;
};
