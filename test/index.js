const request = require('supertest');
const app = require('../index');
const express = require('express');
const cookieParser = require('cookie-parser');

describe('request.agent(app)', function() {

  const agent = request.agent(app);

  it('should give the jumbotron client a player joining URL', function(done) {
    agent
    .get('/api/v1/join-url')
    .expect('Content-Type', /json/)
    .expect((body) => {
      new RegExp('/api/v1/room/\\w+-\\w+').test(body.url)
    })
    .expect(200, done)
  });

  xit('should send cookies', function(done) {
    agent
    .get('/api/v1/join-url')
    .expect('set-cookie', 'cookie=hey; Path=/', done);
  });
});
