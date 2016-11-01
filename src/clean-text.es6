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

var STYLE_TAG = /<style\ ?[\w\W\s]*>[\w\W\s]*<\/style>/g;
var HTML_TAG_REPLACE_REGEX = /<\/?[a-zA-Z-0-9_\ \(\);,\/:"'%=&\.\$\^\[\]#]*>/g;

// cleans html tags out of a string
export function cleanHtmlTags(str, replaceWith) {
  la(check.string(str), 'expected string', str);
  replaceWith = replaceWith || '';
  return str.replace(HTML_TAG_REPLACE_REGEX, replaceWith);
}

function cleanAttributes(text) {
  var doubleQuotes = /"[^"]+"/g;
  return text.replace(doubleQuotes, '""');
}

function mergeWhiteSpaces(text) {
  // replace single no break symbol with space
  text = text.replace(/\s$/, ' ');
  text = text.replace(/^\s*/, '');
  text = text.replace(/\n+/, '\n');
  return text;
}

// cleans whatever user pasted into the HTML ticker search box
// NOTE: does not trim spaces
export function cleanTickerSearchHtml(html) {
  la(check.string(html), 'expected string', html);

  var XML_COMMENT_REGEX = /<!--.*?-->/g;
  html = html.replace(XML_COMMENT_REGEX, ' ');

  // remove style tags
  html = html.replace(STYLE_TAG, ' ');

  html = cleanAttributes(html);

  html = html.replace(HTML_TAG_REPLACE_REGEX, '\n');

  var NON_BREAKING_REGEX = /&nbsp;/g;
  html = html.replace(NON_BREAKING_REGEX, ' ');

  var AMPERSAND_REGEX = /&amp;/g;
  html = html.replace(AMPERSAND_REGEX, '&');

  html = mergeWhiteSpaces(html);
  return html;
}
