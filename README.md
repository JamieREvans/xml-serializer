# Installation

`npm i xml-serializer --save`

# XML Object

### Instance Methods

``` javascript
/**
  @param prettyPrint   Bool    Passing true will pretty-print the xml

  @return [String] XML with embedded content, pretty printed, if specified
  */
function toXML(prettyPrint);
/**
  @param key   String    The key mapping to a value in content if it is an object, otherwise null

  @return [Bool] Indicates whether the key will be wrapped with CData tags
  */
function cdataForKey(key);
```

### Initialization

``` javascript
/**
  @param name        String            The name of the feed (appears as the top level tag)
  @param xmlItems    [XMLObject]       An array of embedded XML objects
  @param attributes  {Object}          Key-value pairs added to the top level tag (where the name is)
  @param content     {Object}/String   Key-value pairs added to the XML array alongside the xmlItems, otherwise a string for a literal object
  @param options     {Object}          Key-value pairs as follows
         @param useCData      Bool       Default: false; wraps content with a CData tag
         @param cdataFields   [String]   Optional; keys corresponding with the value keys - only these values will use CData
*/
function XML(name, xmlItems, attributes, content, options);
```
