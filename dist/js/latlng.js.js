(function() {
  var ns;

  ns = window.edsc.map;

  ns.LatLng = (function() {
    var LatLng, exports;
    LatLng = (function() {
      function LatLng(a, b) {
        var lng, ref, ref1, ref2, ref3, ref4, ref5;
        if (!((a != null) || (b != null))) {
          ref = [null, null], this.lat = ref[0], this.lng = ref[1];
        }
        if (a instanceof LatLng) {
          ref1 = [a.lat, a.lng], this.lat = ref1[0], this.lng = ref1[1];
        }
        if (a instanceof Array) {
          if (typeof a[0] === 'number' || typeof a[0] === 'string') {
            ref2 = [a[0], a[1]], this.lat = ref2[0], this.lng = ref2[1];
          } else {
            ref3 = [null, null], this.lat = ref3[0], this.lng = ref3[1];
          }
        }
        if (typeof a === 'object' && 'lat' in a) {
          if ('lng' in a) {
            lng = a.lng;
          }
          if ('lon' in a) {
            lng = a.lon;
          }
          ref4 = [a.lat, lng], this.lat = ref4[0], this.lng = ref4[1];
        }
        if ((typeof a === 'number' || typeof a === 'string') && (typeof b === 'number' || typeof b === 'string')) {
          ref5 = [a, b], this.lat = ref5[0], this.lng = ref5[1];
        }
        this.lat = parseFloat(this.lat);
        this.lng = parseFloat(this.lng);
        if (isNaN(this.lat) || isNaN(this.lng)) {
          throw new Error('Invalid LatLng values: (' + this.lat + ', ' + this.lng + ')');
        }
      }

      return LatLng;

    })();
    return exports = LatLng;
  })();

}).call(this);
