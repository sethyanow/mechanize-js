'use strict';
/*global describe, it, beforeEach, expect */
const mechanize = require('../lib/mechanize');

describe('Mechanize', function () {
  let agent;

  beforeEach(function () {
    agent = mechanize.newAgent();
  });

  it('shows asynchronous test', function (done) {
    setTimeout(function () {
      expect('second').toBe('second');
      done();
    }, 1);
    expect('first').toBe('first');
  });
});
