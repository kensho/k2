import findPartialMatches from './find-partial-matches.es6'
import rankPartialMatches from './rank-partial-matches.es6'
import cleanText from './clean-text.es6'
import objectLens from './immutable-objects.es6'
import guessDateFormat from './guess-date-format.es6'
import onlyTrue from './only-true.es6'
import presentProperties from './present-properties.es6'

export default {
  findPartialMatches: findPartialMatches,
  rankPartialMatches: rankPartialMatches,
  cleanEnteredText: cleanText,
  objectLens: objectLens,
  guessDateFormat: guessDateFormat,
  onlyTrue: onlyTrue,
  presentProperties: presentProperties
};
