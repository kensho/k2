require('lazy-ass');
var check = require('check-more-types');
var _ = require('lodash');

/**
Removes HTML entities added by TextArea. Used in ticker search
@method cleanEnteredSearchText */
export function cleanEnteredSearchText(str) {
  la(check.string(str), 'expected string to clean', str);
  str = str.toLowerCase();
  str = str.replace('&nbsp;', ' ');
  str = str.trim();
  str = _.unescape(str);
  return str;
}

var HTML_TAG_REPLACE_REGEX = /<\/?[a-zA-Z-0-9\ \(\);,:"'%=&\.\$\^\[\]#]*>/g;

// cleans html tags out of a string
export function cleanHtmlTags(str, replaceWith) {
  la(check.string(str), 'expected string', str);
  replaceWith = replaceWith || '';
  return str.replace(HTML_TAG_REPLACE_REGEX, replaceWith);
}

// cleans whatever user pasted into the HTML ticker search box
// NOTE: does not trim spaces
export function cleanTickerSearchHtml(html) {
  la(check.string(html), 'expected string', html);
  html = html.replace(HTML_TAG_REPLACE_REGEX, '\n');

  var NON_BREAKING_REGEX = /&nbsp;/g;
  html = html.replace(NON_BREAKING_REGEX, ' ');

  var AMPERSAND_REGEX = /&amp;/g;
  html = html.replace(AMPERSAND_REGEX, '&');

  // replace single no break symbol with space
  html = html.replace(/\s$/, ' ');
  html = html.replace(/^\s*/, '');
  html = html.replace(/\n+/, '\n');
  return html;
}
