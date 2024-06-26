const chai = require('chai');
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server.js');

chai.use(chaiHttp);

suite('Functional Tests', () => {
  suite('/api/translate POST', () => {
    test('Translation with text and locale fields', done => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: 'Translate this text', locale: 'american-to-british' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'text');
          assert.property(res.body, 'translation');
          done();
        });
    });

    test('Translation with missing text field', done => {
      chai.request(server)
        .post('/api/translate')
        .send({ locale: 'american-to-british' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Translation with missing locale field', done => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: 'Translate this text' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Required field(s) missing');
          done();
        });
    });

    test('Translation with empty text', done => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: '', locale: 'american-to-british' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'No text to translate');
          done();
        });
    });

    test('Translation with text and invalid locale', done => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: 'Translate this text', locale: 'invalid-locale' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid locale');
          done();
        });
    });
  });
});
