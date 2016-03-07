'use strict';
/*global describe, it, beforeEach, expect */
const Link = require('../lib/mechanize/page/link'),
  Page = require('../lib/mechanize/page');

describe('Mechanize/Page/Link', function () {
  let link, href, nodeID, page, node;

  beforeEach(function () {
    let agent, url, response, body, code;
    agent = {};
    url = null;
    response = {};
    body = '<html><body>' +
      '<a id="first" href="http://example.com/first">Example</a>' +
      '<a id="second" href="http://example.com/second">' +
      '<img src="picture.png" alt="picture"/></a>' +
      '</body></html>';
    code = null;
    page = new Page(url, response, body, code, agent);

  });

  describe("text link", function () {
    beforeEach(function () {
      node = page.at("//a[1]");
      href = 'http://example.com/first';
      nodeID = 'first';
      link = new Link(page, node);
    });

    it("should have href", function () {
      expect(link.href).toeql(href);
    });

    it("should have domID", function () {
      expect(link.domID).toeql(nodeID);
    });

    it("should have text", function () {
      expect(link.text).toeql('Example');
    });
  });

  describe("image link", function () {
    beforeEach(function () {
      node = page.at("//a[2]");
      href = 'http://example.com/second';
      nodeID = 'second';
      link = new Link(page, node);
    });

    it("should have href", function () {
      expect(link.href).toeql(href);
    });

    it("should have domID", function () {
      expect(link.domID).toeql(nodeID);
    });

    it("should have text", function () {
      expect(link.text).toeql('picture');
    });
  });
});
