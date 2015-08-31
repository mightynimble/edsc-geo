ns = window.edsc.map

ns.LatLng = do ->

  # accepts (number, number), (LatLng) or ([Number, Number])
  class LatLng
    constructor: (a, b) ->
      [@lat, @lng] = [null, null] unless a? || b?
      [@lat, @lng] = [a.lat, a.lng] if a instanceof LatLng

      if a instanceof Array
        if typeof a[0] == 'number' || typeof a[0] == 'string'
          [@lat, @lng] = [a[0], a[1]]
        else
          [@lat, @lng] = [null, null]

      if typeof a == 'object' and 'lat' of a
        lng = a.lng if 'lng' of a
        lng = a.lon if 'lon' of a
        [@lat, @lng] = [a.lat, lng]

      if (typeof a == 'number' || typeof a == 'string') && (typeof b == 'number' || typeof b == 'string')
        [@lat, @lng] = [a, b]

      @lat = parseFloat(@lat)
      @lng = parseFloat(@lng)

      if isNaN(@lat) or isNaN(@lng)
        throw new Error('Invalid LatLng values: (' + @lat + ', ' + @lng + ')')

  exports = LatLng
