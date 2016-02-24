var mime = require('mime-types');
var xml = require('xml');
var fs = require('fs');

function XML(name, xmlItems, attributes, content, options) {
  // name is required
  if (!name) {
    return null;
  }
  var xml = {};
  xml.attributes = attributes;
  xml.content = content;
  xml.items = xmlItems;
  xml.name = name;
  if (options) {
    xml.useCData = options.useCData;
    xml.cdataFields = options.cdataFields;
  }
  xml.toXML = toXML;
  xml.cdataForKey = cdataForKey;
  return xml;
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

function toXML(indent) {
  return '<?xml version="1.0" encoding="UTF-8"?>' + xml(generateXMLObject(this), indent);
}

function cdataForKey(key) {
  return this.useCData && (!this.cdataFields || this.cdataFields.indexOf(key) >= 0);
}

module.exports = XML;
