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
        .send({ text: 'Mangoes are my favorite fruit.', locale: 'american-to-british' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'text');
          assert.property(res.body, 'translation');
          assert.equal(res.body.translation, 'Mangoes are my <span class="highlight">favourite</span> fruit.');
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
        .send({ text: 'Translate this text', locale: 'Invalid value for locale field' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'error');
          assert.equal(res.body.error, 'Invalid value for locale field');
          done();
        });
    });

    test('Translation with time conversion American to British', done => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: 'Lunch is at 12:15 today.', locale: 'american-to-british' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'text');
          assert.property(res.body, 'translation');
          assert.equal(res.body.translation, 'Lunch is at <span class="highlight">12.15</span> today.');
          done();
        });
    });

    test('Translation with time conversion British to American', done => {
      chai.request(server)
        .post('/api/translate')
        .send({ text: 'Tea time is usually around 4 or 4.30.', locale: 'british-to-american' })
        .end((err, res) => {
          assert.equal(res.status, 200);
          assert.isObject(res.body);
          assert.property(res.body, 'text');
          assert.property(res.body, 'translation');
          assert.equal(res.body.translation, 'Tea time is usually around 4 or <span class="highlight">4:30</span>.');
          done();
        });
    });
  });
});
