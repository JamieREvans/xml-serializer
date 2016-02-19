var mime = require('mime-types');
var xml = require('xml');
var fs = require('fs');

function XML(name, xmlItems, attributes, values, options) {
  // name is required
  if (!name) {
    return null;
  }
  var xml = {};
  xml.attributes = attributes;
  xml.values = values;
  xml.items = xmlItems;
  xml.name = name;
  if (options) {
    xml.useCData = options.useCData;
    xml.cdataFields = options.cdataFields;
  }
  xml.toXML = toXML;
  return xml;
}

function generateXMLObject(rootXML) {
  var xmlArray = [];
  if (rootXML.attributes && Object.keys(rootXML.attributes).length > 0) {
    xmlArray.push({ _attr: rootXML.attributes });
  }
  if (rootXML.values && Object.keys(rootXML.values).length) {
    for (var key in rootXML.values) {
      var valueHash = {};
      var value = rootXML.values[key];
      if (rootXML.useCData && (!rootXML.cdataFields || rootXML.cdataFields.indexOf(key) >= 0)) {
        valueHash[key] = { _cdata: value };
      }
      else {
        valueHash[key] = value;
      }
      xmlArray.push(valueHash);
    }
  }
  if (rootXML.items && rootXML.items.length) {
    rootXML.items.forEach(function(item) {
      xmlArray.push(generateXMLObject(item));
    });
  }

  var xmlObject = {};
  xmlObject[rootXML.name] = xmlArray;
  return xmlObject;
}

function toXML(indent) {
  return '<?xml version="1.0" encoding="UTF-8"?>' + xml(generateXMLObject(this), indent);
}

module.exports = XML;
