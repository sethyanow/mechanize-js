'use strict';
/*global describe, it, beforeEach, expect, fixture */
const Agent = require('../lib/mechanize/agent'),
  Cookie = require('cookiejar').Cookie,
  CookieAccessInfo = require('cookiejar').CookieAccessInfo;


describe("Mechanize/Agent", function () {
  let agent, options, response, responseBody, requestOptions, responseErr,
    responsePage;

  beforeEach(function () {
    agent = new Agent();
    agent.userAgentAlias = 'My agent';
    requestOptions = null;
    response = {
      statusCode: '200'
    };
    agent.request = function (options, fn) {
      requestOptions = options;
      fn(null, response, responseBody);
    };
    options = {
      uri: 'http://example.com/'
    };
  });

  it("should have a cookieJar", function () {
    expect(agent.cookieJar).not.toBeUndefined();
  });

  describe("getting page", function () {
    let domain, uri;

    beforeEach(function () {
      domain = 'example.com';
      uri = 'http://example.com/index.html';
    });

    describe("with meta cookies", function () {
      beforeEach(function () {
        responseBody = fixture("meta_cookies.html");
        agent.get({uri: uri}, function (err, page) {
          responseErr = err;
          responsePage = page;
        });
      });

      it("should set cookies", function () {
        let accessInfo, cookies;
        accessInfo = new CookieAccessInfo(domain, '/', true, false);
        cookies = agent.cookieJar.getCookies(accessInfo);
        expect(cookies.length).toBe(2);
      });
    });

    describe("with single header cookie", function () {
      beforeEach(function () {
        response = {
          statusCode: '200',
          headers: {
            'set-cookie': "sessionid=345; path=/; " +
              "expires=Fri, 01 Jan 2021 00:00:00 GMT; secure; HttpOnly"
          }
        };
        responseBody = fixture("login.html");
        agent.get({uri: uri}, function (err, page) {
          responseErr = err;
          responsePage = page;
        });
      });

      it("should set cookies", function () {
        let accessInfo, cookies;
        accessInfo = new CookieAccessInfo(domain, '/', true, false);
        cookies = agent.cookieJar.getCookies(accessInfo);
        expect(cookies.length).toBe(1);
      });
    });

    describe("with header cookies", function () {
      beforeEach(function () {
        response = {
          statusCode: '200',
          headers: {
            'set-cookie': [
              "sessionid=345; path=/; " +
                "expires=Fri, 01 Jan 2021 00:00:00 GMT; secure; HttpOnly",
              "name=smith; path=/; " +
                "expires=Fri, 01 Jan 2021 00:00:00 GMT; secure; HttpOnly"
            ]
          }
        };
        responseBody = fixture("login.html");
        agent.get({uri: uri}, function (err, page) {
          responseErr = err;
          responsePage = page;
        });
      });

      it("should set cookies", function () {
        let accessInfo, cookies;
        accessInfo = new CookieAccessInfo(domain, '/', true, false);
        cookies = agent.cookieJar.getCookies(accessInfo);
        expect(cookies.length).toBe(2);
      });
    });

    describe("with encoding", function () {
      beforeEach(function () {
        options = {};
        agent.get({ uri: uri, encoding: null }, function (err, page) {
          responseErr = err;
          responsePage = page;
        });
      });

      it("should have encoding", function () {
        expect(requestOptions.encoding).toBe(null);
      });
    });

    describe("without encoding", function () {
      beforeEach(function () {
        options = {};
        agent.get({ uri: uri }, function (err, page) {
          responseErr = err;
          responsePage = page;
        });
      });

      it("should not have encoding", function () {
        expect(requestOptions.encoding).toBeUndefined();
      });
    });

  });

  describe("submitting form", function () {
    let form, submitErr, submitPage, referer, contentType, requestData;

    beforeEach(function () {
      requestData = 'userID=&name=&street=Main';
      form = {
        requestData: function () {
          return requestData;
        },
        addButtonToQuery: function () {}
      };
    });

    describe("with partial URL", function () {
      beforeEach(function () {
        referer = "http://example.com/page";
        form.action = 'login';
        form.page = {uri: referer};
      });

      describe("with POST method", function () {
        let cookie;

        beforeEach(function () {
          cookie = new Cookie("sessionid=123;domain=.example.com;path=/");
          agent.cookieJar.setCookie(cookie);
          contentType = 'application/x-www-form-urlencoded';
          form.method = 'POST';
          form.enctype = contentType;
          agent.submit(form, null, {}, {}, function (err, page) {
            submitErr = err;
            submitPage = page;
          });
        });

        it("should use URI", function () {
          expect(requestOptions.uri).toBe('http://example.com/login');
        });

        it("should have referer", function () {
          expect(requestOptions.headers.Referer).toBe(referer);
        });

        it("should have origin", function () {
          expect(requestOptions.headers.Origin).toBe('http://example.com');
        });

        it("should have user agent", function () {
          expect(requestOptions.headers['User-Agent']).toBe('My agent');
        });

        it("should have content type", function () {
          expect(requestOptions.headers['Content-Type']).toBe(contentType);
        });

        it("should have content length", function () {
          expect(requestOptions.headers['Content-Length']).toBe('25');
        });

        it("should have cookie", function () {
          expect(requestOptions.headers.Cookie).toBe('sessionid=123');
        });

        it("should have accept", function () {
          expect(requestOptions.headers.Accept).toBe('*/*');
        });

        it("should have body", function () {
          expect(requestOptions.body).toBe(requestData);
        });

      });
    });

    describe("with full URL", function () {
      beforeEach(function () {
        form.action = 'http://example.com/login';
      });

      describe("with POST method", function () {
        beforeEach(function () {
          form.method = 'POST';
          agent.submit(form, null, {}, {}, function (err, page) {
            submitErr = err;
            submitPage = page;
          });
        });

        it("should use URI", function () {
          expect(requestOptions.uri).toBe('http://example.com/login');
        });

        it("should post form", function () {
          expect(requestOptions.method).toBe('POST');
        });

        it("should post form fields in body", function () {
          expect(requestOptions.body).toBe(requestData);
        });

      });
    });
  });
});
