'use strict';
/*global describe, it, beforeEach, expect, fixture */
const Page = require('../lib/mechanize/page.js');

describe("Mechanize/Form/Text", function () {
  let text, form;

  beforeEach(function () {
    let agent, url, response, body, code, page;
    agent = {
      submit: function (form, button, headers, requestOptions, fn) {
        let page = {};
        fn(null, page);
      }
    };
    url = 'form.html';
    response = {};
    body = fixture('form_elements.html');
    code = null;
    page = new Page(url, response, body, code, agent);

    form = page.form('form1');

  });

  describe("text field", function () {
    beforeEach(function () {
      text = form.field("text");
    });

    it("should not be disabled", function () {
      expect(text.disabled).toeql(false);
    });
  });

  describe("disabled text field", function () {
    beforeEach(function () {
      text = form.field("textDisabled");
    });

    it("should be disabled", function () {
      expect(text.disabled).toeql(true);
    });
  });
});
