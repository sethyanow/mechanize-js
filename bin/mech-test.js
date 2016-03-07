'use strict';
const mechanize = require('../lib/mechanize'),
  br = mechanize.newAgent();

br.get({uri:'https://login.yahoo.com/config/login_verify2?&.src=ym&.intl=us'}, function(err, page){
  const f = page.form('login_form');
  f.setFieldValue('login','myUsername');
  f.setFieldValue('passwd','myPassword');
  f.submit(function(err, page){
    if (page.response.statusCode >= 300 && page.response.statusCode < 400) {
      br.get({uri: page.response.headers.location}, function (err, page) {
        console.log(page);
      });
    } else {
      console.log(page);
    }
  }); 
});
