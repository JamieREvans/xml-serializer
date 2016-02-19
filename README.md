# Installation

`npm i xml-serializer --save`

# XML Object

### Initialization

``` javascript
/**
  @param name        {String}      The name of the feed (appears as the top level tag)
  @param xmlItems    [XMLObject]   An array of embedded XML objects
  @param attributes  {Object}      Key-value pairs added to the top level tag (where the name is)
  @param values      {Object}      Key-value pairs added to the XML array alongside the xmlItems
  @param options     {Object}      Key-value pairs as follows
         @param useCData    Bool       Default: false; wraps values content with a CData tag
         @param cdataFields [String]   Optional; keys corresponding with the value keys - only these values will use CData
*/
function XML(name, xmlItems, attributes, values, options);
```
