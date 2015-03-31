require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');

/**
Removes HTML entities added by TextArea. Used in ticker search
@method cleanEnteredSearchText */
export default function cleanEnteredSearchText(str) {
  la(check.string(str), 'expected string to clean', str);
  str = str.toLowerCase();
  str = str.replace('&nbsp;', ' ');
  str = str.trim();
  str = _.unescape(str);
  return str;
};
