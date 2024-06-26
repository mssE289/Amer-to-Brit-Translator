const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {
  translate(text, locale, highlight = false) {
    let translation;

    if (locale === 'american-to-british') {
      translation = this.americanToBritish(text);
    } else if (locale === 'british-to-american') {
      translation = this.britishToAmerican(text);
    } else {
      return { error: 'Invalid locale' };
    }

    return highlight ? this.highlightTranslation(text, translation) : translation;
  }

  americanToBritish(text) {
    const americanToBritishSpelling = require('./american-to-british-spelling');
    const americanOnly = require('./american-only');
    const americanToBritishTitles = require('./american-to-british-titles');

    let translation = text;

    // Replace American-only terms with British equivalents
    for (const [key, value] of Object.entries(americanOnly)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      translation = translation.replace(regex, value);
    }

    // Replace American spellings with British spellings
    for (const [key, value] of Object.entries(americanToBritishSpelling)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      translation = translation.replace(regex, value);
    }

    // Replace American titles with British titles
    for (const [key, value] of Object.entries(americanToBritishTitles)) {
      const regex = new RegExp(`\\b${key}`, 'gi');
      translation = translation.replace(regex, (match) => {
        return value.charAt(0).toUpperCase() + value.slice(1);
      });
    }

    // Handle time format change (12:00 to 12.00)
    translation = translation.replace(/(\d{1,2}):(\d{2})/g, (match, p1, p2) => `${p1}.${p2}`);

    return translation;
  }

  britishToAmerican(text) {
    let translation = text;

    // Handle "Mrs." specifically first to prevent conflict with "Mr."
    translation = translation.replace(/\bMrs\b/g, 'Mrs.');

    // Replace British-only terms with American equivalents
  const britishToAmericanReplacements = Object.entries(britishOnly);
  britishToAmericanReplacements.sort((a, b) => b[0].length - a[0].length);
  for (const [key, value] of britishToAmericanReplacements) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translation = translation.replace(regex, value);
  }

  // Replace British spellings with American spellings
  const britishToAmericanSpellings = Object.entries(this.invertObject(americanToBritishSpelling));
  britishToAmericanSpellings.sort((a, b) => b[0].length - a[0].length);
  for (const [key, value] of britishToAmericanSpellings) {
    const regex = new RegExp(`\\b${key}\\b`, 'gi');
    translation = translation.replace(regex, value);
  }

    // Replace British titles with American titles, handling "Mrs." separately
    for (const [key, value] of Object.entries(this.invertObject(americanToBritishTitles))) {
      if (key !== 'mrs') {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translation = translation.replace(regex, (match) => {
          return value.charAt(0).toUpperCase() + value.slice(1) + (value.endsWith('.') ? '' : '.');
        });
      }
    }

    // Handle time format change (12.00 to 12:00)
    translation = translation.replace(/(\d{1,2})\.(\d{2})/g, (match, p1, p2) => `${p1}:${p2}`);

    return translation;
  }

  invertObject(obj) {
    const invertedObj = {};
    for (const [key, value] of Object.entries(obj)) {
      invertedObj[value] = key;
    }
    return invertedObj;
  }

  highlightTranslation(original, translated) {
    const originalWords = original.split(/(\s+|\b)/);
    const translatedWords = translated.split(/(\s+|\b)/);

    let highlighted = '';
    for (let i = 0; i < originalWords.length; i++) {
      if (originalWords[i] !== translatedWords[i]) {
        highlighted += `<span class="highlight">${translatedWords[i]}</span>`;
      } else {
        highlighted += translatedWords[i];
      }
    }

    return highlighted;
  }
}

module.exports = Translator;

