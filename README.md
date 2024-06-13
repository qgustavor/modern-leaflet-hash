# Modern Leaflet Hash

This fork of [Leaflet-hash](https://github.com/mlevans/leaflet-hash), which lets you to add dynamic URL hashes to web pages with Leaflet maps, is made to be used with ES Module imports.

### Getting started

1. Prepare a basic leaflet map.

2. Include the plugin:

- `import { createHash } from '@qgustavor/leaflet-hash'` when using bundle tools (remember to install the library using npm or something else)
- `import { createHash } from 'https://unpkg.com/@qgustavor/leaflet-hash/leaflet-hash.global.mjs'` when loading directly on a browser

3. Initialize the plugin:

```javascript
// Assuming your map instance is in a variable called map
const map = L.map('example')
const hash = createHash(map)
```

### Author

[@mlevans](http://github.com/mlevans)

### Contributors

[@calvinmetcalf](http://github.com/calvinmetcalf)

[@jfirebaugh](http://github.com/jfirebaugh)

[@rsudekum](http://github.com/rsudekum)

[@tmcw](http://github.com/tmcw)

[@yohanboniface](http://github.com/yohanboniface)

[@qgustavor](http://github.com/qgustavor)

### License

MIT License. See [LICENSE](https://github.com/qgustavor/leaflet-hash/blob/master/LICENSE.md) for details.
