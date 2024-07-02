'use strict';

const Translator = require('../components/translator.js');
const translator = new Translator();

module.exports = function (app) {
  app.route('/api/translate')
    .post((req, res) => {
      const { text, locale } = req.body;

      // Check if text or locale is missing
      if (text === undefined || locale === undefined) {
        return res.json({ error: 'Required field(s) missing' });
      }

      // Check if text is empty
      if (text.trim() === '') {
        return res.json({ error: 'No text to translate' });
      }

      // Check locale validation
      if (locale !== 'american-to-british' && locale !== 'british-to-american') {
        return res.json({ error: 'Invalid value for locale field' });
      }

      // Perform the translation
      const translation = translator.translate(text, locale);

      // Check if the translation is the same as the original text
      if (text === translation) {
        return res.json({ text, translation: 'Everything looks good to me!' });
      }

      // Return the translation
      res.json({ text, translation });
    });
};
