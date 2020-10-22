var mime = require('mime-types');
var xml = require('xml');
var fs = require('fs');

const xmlPrefix = '<?xml version="1.0" encoding="UTF-8"?>';

class XML {
  constructor(name, xmlItems, attributes, content, options) {
    // name is required
    if (!name) {
      throw new Error("Name is required");
    }
    this.attributes = attributes;
    this.content = content;
    this.items = xmlItems;
    this.name = name;
    if (options) {
      this.useCData = options.useCData;
      this.cdataFields = options.cdataFields;
    }
  }

  toXML(indent, includePrefix = true) {
    return (includePrefix ? xmlPrefix : "") + xml(generateXMLObject(this), indent);
  }

  cdataForKey(key) {
    return this.useCData && (!this.cdataFields || this.cdataFields.indexOf(key) >= 0);
  }
}

function generateXMLObject(rootXML) {
  var xmlContent;
  var isSingleValue = rootXML.content && rootXML.content.constructor === String;
  var hasAttributes = rootXML.attributes && Object.keys(rootXML.attributes).length > 0;

  // Single Value XML with CData uses unique structure
  if (isSingleValue && rootXML.cdataForKey(null)) {
    xmlContent = {};
    if (hasAttributes) {
      xmlContent._attr = rootXML.attributes;
    }
    xmlContent._cdata = rootXML.content;
  }
  else {
    xmlContent = [];
    if (hasAttributes) {
      xmlContent.push({ _attr: rootXML.attributes });
    }
    // Single string, not array of content
    if (isSingleValue) {
      xmlContent.push(rootXML.content);
    }
    // Array of content
    else {
      if (rootXML.content && Object.keys(rootXML.content).length) {
        for (var key in rootXML.content) {
          var valueHash = {};
          var value = rootXML.content[key];
          if (rootXML.cdataForKey(key)) {
            valueHash[key] = { _cdata: value };
          }
          else {
            valueHash[key] = value;
          }
          xmlContent.push(valueHash);
        }
      }
      if (rootXML.items && rootXML.items.length) {
        rootXML.items.forEach(function(item) {
          xmlContent.push(generateXMLObject(item));
        });
      }
    }
  }

  var xmlObject = {};
  xmlObject[rootXML.name] = xmlContent;
  return xmlObject;
}

module.exports = XML;
