const americanOnly = require('./american-only.js');
const americanToBritishSpelling = require('./american-to-british-spelling.js');
const americanToBritishTitles = require("./american-to-british-titles.js");
const britishOnly = require('./british-only.js');

class Translator {
  translate(text, locale, highlight = true) {
    let translation;

    if (locale === 'american-to-british') {
      translation = this.americanToBritish(text, highlight);
    } else if (locale === 'british-to-american') {
      translation = this.britishToAmerican(text, highlight);
    } else {
      return { error: 'Invalid value for locale field' };
    }

    return translation;
  }

  americanToBritish(text, highlight) {
    let translation = text;

    // Replace American-only terms with British terms
    for (const [key, value] of Object.entries(americanOnly)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      translation = translation.replace(regex, (match) => {
        return highlight ? `<span class="highlight">${value}</span>` : value;
      });
    }

    // Replace American spellings with British spellings
    for (const [key, value] of Object.entries(americanToBritishSpelling)) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      translation = translation.replace(regex, (match) => {
        return highlight ? `<span class="highlight">${value}</span>` : value;
      });
    }

    // Replace American titles with British titles
    for (const [key, value] of Object.entries(americanToBritishTitles)) {
      const regex = new RegExp(`\\b${key}`, 'gi');
      translation = translation.replace(regex, (match) => {
        const replacedValue = value.charAt(0).toUpperCase() + value.slice(1);
        return highlight ? `<span class="highlight">${replacedValue}</span>` : replacedValue;
      });
    }

    // Handle time format change (12:00 to 12.00) with span wrapping
    translation = translation.replace(/(\d{1,2}):(\d{2})/g, (match, p1, p2) => {
      return highlight ? `<span class="highlight">${p1}.${p2}</span>` : `${p1}.${p2}`;
    });

    return translation;
  }

  britishToAmerican(text, highlight) {
    let translation = text;

    // Handle "Mrs." specifically first to prevent conflict with "Mr."
    translation = translation.replace(/\bMrs\b/g, (match) => {
      return highlight ? '<span class="highlight">Mrs.</span>' : 'Mrs.';
    });

    // Replace British-only terms with American terms
    const britishToAmericanReplacements = Object.entries(britishOnly);
    britishToAmericanReplacements.sort((a, b) => b[0].length - a[0].length);
    for (const [key, value] of britishToAmericanReplacements) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      translation = translation.replace(regex, (match) => {
        return highlight ? `<span class="highlight">${value}</span>` : value;
      });
    }

    // Replace British spellings with American spellings
    const britishToAmericanSpellings = Object.entries(this.invertObject(americanToBritishSpelling));
    britishToAmericanSpellings.sort((a, b) => b[0].length - a[0].length);
    for (const [key, value] of britishToAmericanSpellings) {
      const regex = new RegExp(`\\b${key}\\b`, 'gi');
      translation = translation.replace(regex, (match) => {
        return highlight ? `<span class="highlight">${value}</span>` : value;
      });
    }

    // Replace British titles with American titles, handling "Mrs." separately
    for (const [key, value] of Object.entries(this.invertObject(americanToBritishTitles))) {
      if (key !== 'mrs') {
        const regex = new RegExp(`\\b${key}\\b`, 'gi');
        translation = translation.replace(regex, (match) => {
          return highlight
            ? `<span class="highlight">${value.charAt(0).toUpperCase() + value.slice(1) + (value.endsWith('.') ? '' : '.')}</span>`
            : value.charAt(0).toUpperCase() + value.slice(1) + (value.endsWith('.') ? '' : '.');
        });
      }
    }

    // Handle time format change (12.00 to 12:00) with span wrapping
    translation = translation.replace(/(\d{1,2})\.(\d{2})/g, (match, p1, p2) => {
      return highlight ? `<span class="highlight">${p1}:${p2}</span>` : `${p1}:${p2}`;
    });

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
    if (original === translated) {
      return 'Everything looks good to me!';
    }

    return translated;
  }
}

module.exports = Translator;

