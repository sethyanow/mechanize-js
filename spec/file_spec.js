'use strict';
/*global describe, it, beforeEach, expect, fixture */
const File = require('../lib/mechanize/file');

describe('Mechanize/File', function () {
  let body, file, userAgentVersion, userAgent;

  beforeEach(function () {
    let agent, uri, code, response;
    agent = {};
    uri = null;
    code = null;
    response = {};
    userAgentVersion = '5.0 (Macintosh; Intel Mac OS X 10_6_7) AppleWebKit/' +
      '534.30 (KHTML, like Gecko) Chrome/12.0.742.77 Safari/534.30';
    userAgent = 'Mozilla/' + userAgentVersion;
    agent.userAgentVersion = userAgentVersion;
    agent.userAgent = userAgent;
    body = fixture('login.html');
    file = new File(agent, uri, response, body, code);
  });

  it("should exist", function () {
    expect(file).not.toBeUndefined();
  });

});
