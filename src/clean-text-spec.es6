/* global describe, it */
require('lazy-ass');
var check = require('check-more-types');

import { cleanEnteredSearchText, cleanHtmlTags, cleanTickerSearchHtml } from './clean-text.es6';

describe('cleanEnteredSearchText', function () {

  it('is a function', function () {
    la(check.fn(cleanEnteredSearchText), 'missing clean function', cleanEnteredSearchText);
  });

  it('removes non breaking space', function () {
    var result = cleanEnteredSearchText('foo&nbsp;b');
    la(result === 'foo b');
  });

  it('restores &', function () {
    la(cleanEnteredSearchText('FOO&nbsp;b') === 'foo b');
    la(cleanEnteredSearchText('foo&amp;bar') === 'foo&bar');
  });

  it('trims spaces on the ends after conversion', function () {
    la(cleanEnteredSearchText('foo&nbsp;') === 'foo');
    la(cleanEnteredSearchText('&nbsp;foo') === 'foo');
  });
});

describe('cleanHtmlTags', function () {

  it('is a function', function () {
    la(check.fn(cleanHtmlTags), 'has cleanHtmlTags', cleanHtmlTags);
  });

  it('passes string unchanged', function () {
    var result;
    result = cleanHtmlTags('GOOG');
    la(result === 'GOOG', result);

    result = cleanHtmlTags('f');
    la(result === 'f', result);
  });

  it('removes html tags, can leaves space', function () {
    la(cleanHtmlTags('<a></a>') === '');
    la(cleanHtmlTags('<a>f</a>', ' ') === ' f ');
    la(cleanHtmlTags('<h3>author here</h3>') === 'author here');
  });

  it('can cleanup attributes', function () {
    var html = '<a id="a">f</a>';
    la(cleanHtmlTags(html) === 'f');
  });

  it('can cleanup styles', function () {
    var html = '<a style="margin-bottom: 20px;">f</a>';
    la(cleanHtmlTags(html) === 'f');
  });

  it('can cleanup multiple styles', function () {
    var html = '<a style="margin-bottom: 20px; max-width: 560px; color: rgb(68, 68, 68);">f</a>';
    la(cleanHtmlTags(html) === 'f');
  });

  it('can cleanup font names', function () {
    var html = '<a style="font-family: Palatino, \'Palatino Linotype\', Georgia, serif;">f</a>';
    la(cleanHtmlTags(html) === 'f');
  });

  it('can clean gradients', function () {
    var html = '<h2 class="story" style="background: -webkit-gradient(linear, 0% 0%, 0% 100%, ' +
      'from(rgb(0, 102, 102)), to(rgb(0, 66, 66))) rgb(0, 66, 66);">foo</h2>';
    la(cleanHtmlTags(html) === 'foo');
  });
});

describe('cleanTickerSearchHtml', function () {
  var clean = cleanTickerSearchHtml;

  it('is a function', function () {
    la(check.fn(clean), 'missing clean fn');
  });

  it('passes string unchanged', function () {
    la(clean('GOOG') === 'GOOG');
    la(clean('f') === 'f');
  });

  it('removes white space', function () {
    la(clean(' GOOG') === 'GOOG');
    la(clean('   GOOG') === 'GOOG');
  });

  it('keeps white space at the end', function () {
    la(clean('GOOG ') === 'GOOG ');
    la(clean('GOOG  ') === 'GOOG  ');
  });

  it('replaces white space at the end with space', function () {
    la(clean('GOOG\t') === 'GOOG ');
  });

  it('removes html tags, leaves space', function () {
    la(clean('<a></a>') === '');
    la(clean('<a>f</a>') === 'f ');
  });

  it('removes html tags leaves space', function () {
    la(clean('<a>f </a>') === 'f  ');
  });

  it('removes tags with spaces', function () {
    la(clean('<this is tag>f') === 'f');
    la(clean('<this is tag>f</this is tag>') === 'f ', 'has closing tag');
  });

  it('removes tags with dashes', function () {
    la(clean('<this-is-tag>f') === 'f');
    la(clean('<this-is-tag>f</this-is-tag>') === 'f ', 'has closing tag');
  });

  it('removes tags with attributes', function () {
    la(clean('<a id="a">f</a>') === 'f ');
  });

  it('removes tags with guids', function () {
    la(clean('<span id="docs-internal-guid-3f7bace0-cee6-dba1-d26d05895">f</span>') === 'f ');
  });

  it('removes tags with styles', function () {
    la(clean('<span style="font-size: 15px; color: rgb(0, 0, 0);">f</span>') === 'f ');
  });

  it('removes data tag with &', function () {
    la(clean('<td data-sheets-value="[null,2,&quot;GOOG&quot;]">GOOG</td>') === 'GOOG ');
  });

  it('removes data tag with ^', function () {
    la(clean('<td data-sheets-value="[null,2,&quot;^GOOG&quot;]">^GSPC</td>') === '^GSPC ');
  });

  it('removes data tag with $', function () {
    la(clean('<td data-sheets-value="[null,2,&quot;$GOOG&quot;]">$RR</td>') === '$RR ');
  });

  it('removes data tag with .', function () {
    la(clean('<td something="[.something]">$CL</td>') === '$CL ');
  });

  it('splits tags into new lines', function () {
    var result = clean('<div>F</div><div>BA</div>');
    la(result === 'F\nBA ');
  });

  it('cleans as expected', function () {
    var txt = 'foo &nbsp; &nbsp; bar';
    var reg = /&nbsp;/g;
    var cleaned = txt.replace(reg, '');
    la(cleaned === 'foo   bar');
  });

  it('cleans non-breaking spaces', function () {
    var txt = 'foo &nbsp; &nbsp; bar';
    la(clean(txt) === 'foo     bar');
  });

  it('allows ampersands', function () {
    var txt = 'foo &amp; bar';
    la(clean(txt) === 'foo & bar');
  });
});

