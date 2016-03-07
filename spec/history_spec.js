'use strict';
/*global describe, it, beforeEach, expect */
const History = require('../lib/mechanize/history');

describe('Mechanize/History', function () {
  let history;

  beforeEach(function () {
    history = new History();
  });

  it("should exist", function () {
    expect(history).not.toBeUndefined();
    // expect(history).toBe(2);
  });

});
