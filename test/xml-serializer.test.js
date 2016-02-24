require('rootpath')();
var XML = require('index');
var should = require('should');
var fs = require('fs');

function compareXMLToFile(xml, fileName, callback) {
  fs.readFile(__dirname + '/test-data/' + fileName + '.xml', 'utf-8', function(error, data) {
    xml.should.equal(data.trim());
    if (callback) {
      callback(error);
    }
  });
}

describe('XML Parser', function() {
  var xml;
  var feedContent;
  var items;
  var attributes;
  before(function() {
    feedContent = {
      url: 'http://wirkn.com',
      publisher: 'wirkn'
    };
    items = [];
    for (var index = 0; index < 5; index++) {
      var itemContent = {
        title: 'Something cool ' + (index + 1),
        description: 'This will be unique'
      };
      items.push(XML('item', null, null, itemContent));
    }
    attributes = {
        'xmlns:dc':         'http://purl.org/dc/elements/1.1/',
        'xmlns:content':    'http://purl.org/rss/1.0/modules/content/',
        'xmlns:atom':       'http://www.w3.org/2005/Atom',
        'version':          '2.0'
    };
  });
  describe('Generating a single level object', function() {
    before(function() {
      xml = XML('source', null, null, feedContent).toXML(true);
    });
    it('should have be single level with a url and publisher', function(done) {
      compareXMLToFile(xml, 'single-level-with-values', done);
    });
  });
  describe('Generating a single level object with items', function() {
    before(function() {
      xml = XML('source', items, null, feedContent).toXML(true);
    });
    it('should have be single level with a url and publisher', function(done) {
      compareXMLToFile(xml, 'single-level-with-items-and-values', done);
    });
  });
  describe('when creating a feed with attributes', function() {
    before(function() {
      xml = XML('source', null, attributes, null).toXML(true);
    });
    it('should have attributes', function(done) {
      compareXMLToFile(xml, 'single-level-with-attributes', done);
    });
  });
  describe('multi-level feed with values and items', function() {
    before(function() {
      innerFeed = XML('channel', items, null, feedContent);
      outerFeed = XML('source', [innerFeed]);
      xml = outerFeed.toXML(true);
    });
    it('should have multiple levels and values at the correct level', function(done) {
      compareXMLToFile(xml, 'multi-level-with-items-and-values', done);
    });
  });
  describe('Generating a single level object with items wrapped with cdata', function() {
    before(function() {
      items.forEach(function(item) {
        item.useCData = true;
      });
      xml = XML('source', items, null, feedContent).toXML(true);
    });
    after(function() {
      items.forEach(function(item) {
        item.useCData = false;
      });
    });
    it('should have be single level with a url and publisher', function(done) {
      compareXMLToFile(xml, 'single-level-with-cdata-wrapped-items', done);
    });
  });
  describe('Generating a single level object wtih one item wrapped with cdata',function() {
    before(function() {
      items.forEach(function(item) {
        item.useCData = true;
        item.cdataFields = ['title'];
      });
      xml = XML('source', items, null, feedContent, null).toXML(true);
    });
    after(function() {
      items.forEach(function(item) {
        item.useCData = false;
        item.cdataFields = undefined;
      });
    });
    it('should have single level object, with title wrapped in cdata',function(done) {
      compareXMLToFile(xml,'single-level-with-one-attribute-cdata-wrapped-items',done);
    });
  });
  describe('Generating a single level object wtih only a string value',function() {
    before(function() {
      xml = XML('source', null, attributes, "Sample String", null).toXML(true);
      console.log(xml);
    });
    it('should have single level object, with title wrapped in cdata', function(done) {
      compareXMLToFile(xml,'single-level-with-string-value', done);
    });
  });
  describe('Generating a single level object wtih only a string value',function() {
    before(function() {
      xml = XML('source', null, attributes, "Sample String", { useCData: true }).toXML(true);
    });
    it('should have single level object, with title wrapped in cdata', function(done) {
      compareXMLToFile(xml,'single-level-with-cdata-string-value', done);
    });
  });
});
