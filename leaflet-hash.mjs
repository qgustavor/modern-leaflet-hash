import L from 'leaflet'

/**
 * Class representing the hash management for a Leaflet map.
 */
export class Hash {
  /**
   * Creates an instance of Hash.
   * @param {L.Map} map - A Leaflet map instance.
   */
  constructor (map) {
    /**
     * @type {number}
     * @description Delay time in milliseconds for change handling.
     */
    this.changeDefer = 100

    if (map) {
      this.init(map)
    }
  }

  /**
   * Parses the hash string and returns map center and zoom level.
   * @param {string} hash - The hash string from the URL.
   * @returns {{center: L.LatLng, zoom: number} | false} The parsed center and zoom level or false if invalid.
   */
  static parseHash (hash) {
    if (hash.startsWith('@')) {
      hash = hash.slice(1)
    }
    const args = hash.split(',')
    if (args.length === 3) {
      const lat = parseFloat(args[0])
      const lon = parseFloat(args[1])
      const zoom = parseInt(args[2].replace('z', ''), 10)
      if (isNaN(lat) || isNaN(lon) || isNaN(zoom)) {
        return false
      } else {
        return {
          center: new L.LatLng(lat, lon),
          zoom: zoom
        }
      }
    } else {
      return false
    }
  }

  /**
   * Formats the map's center and zoom level into a hash string.
   * @param {L.Map} map - A Leaflet map instance.
   * @returns {string} The formatted hash string.
   */
  static formatHash (map) {
    const center = map.getCenter()
    const zoom = map.getZoom()
    const precision = Math.max(0, Math.ceil(Math.log(zoom) / Math.LN2))

    return `@${center.lat.toFixed(precision)},${center.lng.toFixed(precision)},${zoom}z`
  }

  /**
   * Initializes the hash management for the map.
   * @param {L.Map} map - A Leaflet map instance.
   */
  init (map) {
    this.map = map

    // Reset the hash
    this.lastHash = null
    this.onHashChange()

    if (!this.isListening) {
      this.startListening()
    }
  }

  /**
   * Removes the hash management from the map.
   */
  removeFrom () {
    if (this.changeTimeout) {
      clearTimeout(this.changeTimeout)
    }

    if (this.isListening) {
      this.stopListening()
    }

    this.map = null
  }

  /**
   * Handles map move events.
   */
  onMapMove = () => {
    // Bail if we're moving the map (updating from a hash),
    // or if the map is not yet loaded
    if (this.movingMap || !this.map || !this.map._loaded) {
      return
    }

    const hash = Hash.formatHash(this.map)
    if (this.lastHash !== hash) {
      history.replaceState(null, '', hash)
      this.lastHash = hash
    }
  }

  /**
   * Updates the map view based on the current hash in the URL.
   */
  update = () => {
    const hash = location.hash
    if (hash === this.lastHash) {
      return
    }
    const parsed = Hash.parseHash(hash)
    if (parsed) {
      this.movingMap = true

      if (this.map) {
        this.map.setView(parsed.center, parsed.zoom)
      }

      this.movingMap = false
    } else {
      this.onMapMove()
    }
  }

  /**
   * Handles hash change events.
   */
  onHashChange = () => {
    // Throttle calls to update() so that they only happen every `changeDefer` ms
    if (!this.changeTimeout) {
      this.changeTimeout = setTimeout(() => {
        this.update()
        this.changeTimeout = null
      }, this.changeDefer)
    }
  }

  /**
   * Starts listening for map move and hash change events.
   */
  startListening () {
    if (this.map) {
      this.map.on('moveend', this.onMapMove)
    }

    window.addEventListener('hashchange', this.onHashChange)
    this.isListening = true
  }

  /**
   * Stops listening for map move and hash change events.
   */
  stopListening () {
    if (this.map) {
      this.map.off('moveend', this.onMapMove)
    }

    window.removeEventListener('hashchange', this.onHashChange)
    this.isListening = false
  }
}

/**
 * Creates a new Hash instance for the given map.
 * @param {L.Map} map - A Leaflet map instance.
 * @returns {Hash} The created Hash instance.
 */
export function createHash (map) {
  return new Hash(map)
}
