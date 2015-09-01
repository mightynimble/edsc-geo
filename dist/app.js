this.edsc = {
	models: {
		data: {},
		page: {},
		ui: {}
	},
	map: {
 		L: {}
	},
	util: {}
};

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

(function() {
  var ns,
    slice = [].slice;

  ns = window.edsc.map;

  ns.Coordinate = (function(LatLng) {
    var Coordinate, DEG_TO_RAD, RAD_TO_DEG, exports;
    DEG_TO_RAD = Math.PI / 180;
    RAD_TO_DEG = 180 / Math.PI;
    Coordinate = (function() {
      Coordinate.fromLatLng = function() {
        var args, lat, lng, ref;
        args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
        if (args.length === 1) {
          ref = args[0], lat = ref.lat, lng = ref.lng;
        } else {
          lat = args[0], lng = args[1];
        }
        return Coordinate.fromPhiTheta(lat * DEG_TO_RAD, lng * DEG_TO_RAD);
      };

      Coordinate.fromPhiTheta = function(phi, theta) {
        var PI, cos, sin, x, y, z;
        PI = Math.PI;
        cos = Math.cos;
        sin = Math.sin;
        while (phi >= PI) {
          phi -= 2 * PI;
        }
        while (phi < PI) {
          phi += 2 * PI;
        }
        if (phi > PI / 2) {
          phi = PI - phi;
          theta += PI;
        }
        if (phi < -PI / 2) {
          phi = -PI - phi;
          theta += PI;
        }
        while (theta >= PI) {
          theta -= 2 * PI;
        }
        while (theta < -PI) {
          theta += 2 * PI;
        }
        x = cos(phi) * cos(theta);
        y = cos(phi) * sin(theta);
        z = sin(phi);
        return new Coordinate(phi, theta, x, y, z);
      };

      Coordinate.fromXYZ = function(x, y, z) {
        var d, phi, scale, theta;
        d = x * x + y * y + z * z;
        if (d === 0) {
          d = x = 1;
        }
        scale = 1 / Math.sqrt(d);
        x *= scale;
        y *= scale;
        z *= scale;
        theta = Math.atan2(y, x);
        phi = Math.asin(z);
        return new Coordinate(phi, theta, x, y, z);
      };

      function Coordinate(phi1, theta1, x1, y1, z1) {
        this.phi = phi1;
        this.theta = theta1;
        this.x = x1;
        this.y = y1;
        this.z = z1;
      }

      Coordinate.prototype.dot = function(other) {
        return this.x * other.x + this.y * other.y + this.z * other.z;
      };

      Coordinate.prototype.cross = function(other) {
        var x, y, z;
        x = this.y * other.z - this.z * other.y;
        y = this.z * other.x - this.x * other.z;
        z = this.x * other.y - this.y * other.x;
        return Coordinate.fromXYZ(x, y, z);
      };

      Coordinate.prototype.distanceTo = function(other) {
        return Math.acos(this.dot(other));
      };

      Coordinate.prototype.toLatLng = function() {
        return new LatLng(RAD_TO_DEG * this.phi, RAD_TO_DEG * this.theta);
      };

      Coordinate.prototype.toString = function() {
        var latlng;
        latlng = this.toLatLng();
        return "(" + (latlng.lat.toFixed(3)) + ", " + (latlng.lng.toFixed(3)) + ")";
      };

      Coordinate.prototype.toXYZString = function() {
        return "<" + (this.x.toFixed(3)) + ", " + (this.y.toFixed(3)) + ", " + (this.z.toFixed(3)) + ">";
      };

      return Coordinate;

    })();
    return exports = Coordinate;
  })(ns.LatLng);

}).call(this);

(function() {
  var ns;

  ns = window.edsc.map;

  ns.Arc = (function(Coordinate) {
    var Arc, EPSILON, exports;
    EPSILON = 0.00000001;
    Arc = (function() {
      function Arc(coordA, coordB) {
        var ref;
        if (coordB.theta < coordA.theta) {
          ref = [coordA, coordB], coordB = ref[0], coordA = ref[1];
        }
        if (coordB.theta - coordA.theta > Math.PI) {
          this.coordB = coordA;
          this.coordA = coordB;
        } else {
          this.coordA = coordA;
          this.coordB = coordB;
        }
        this.normal = this.coordA.cross(this.coordB);
      }

      Arc.prototype.antimeridianCrossing = function() {
        var abs, x, xN, y, yA, yN, z, zN;
        abs = Math.abs;
        if (this.coordA.theta < this.coordB.theta) {
          return null;
        }
        if (abs(Math.PI - abs(this.coordA.theta)) < EPSILON || abs(Math.PI - abs(this.coordB.theta)) < EPSILON) {
          return null;
        }
        if (abs(this.coordA.theta - this.coordB.theta) % Math.PI < EPSILON) {
          return null;
        }
        xN = this.normal.x;
        yN = this.normal.y;
        zN = this.normal.z;
        yA = this.coordA.y;
        if (abs(yA) < EPSILON) {
          yA = this.coordB.y;
        }
        if (abs(yA) < EPSILON) {
          return null;
        }
        if (abs(zN) < EPSILON && abs(xN) < EPSILON) {
          return null;
        }
        x = -zN / yA;
        y = 0;
        z = xN / yA;
        if (x > 0) {
          x = -x;
          z = -z;
        }
        return Coordinate.fromXYZ(x, y, z);
      };

      return Arc;

    })();
    return exports = Arc;
  })(ns.Coordinate);

}).call(this);

(function() {
  var ns;

  ns = window.edsc.map;

  ns.geoutil = (function(LatLng, Coordinate, Arc, config) {
    var DEG_TO_RAD, EPSILON, NORTH_POLE, RAD_TO_DEG, SOUTH_POLE, _angleDelta, _course, _rotationDirection, area, containsPole, exports, gcInterpolate;
    EPSILON = 0.00000001;
    NORTH_POLE = 1;
    SOUTH_POLE = 2;
    DEG_TO_RAD = Math.PI / 180;
    RAD_TO_DEG = 180 / Math.PI;
    gcInterpolate = function(p1, p2) {
      return (function(abs, asin, sqrt, pow, sin, cos, atan2) {
        var AB, d, lat, lat1, lat2, lon, lon1, lon2, ref, ref1, x, y, z;
        if ((abs(p1.lat) === (ref = abs(p2.lat)) && ref === 90)) {
          return p1;
        }
        if (p2.lng < p1.lng) {
          ref1 = [p2, p1], p1 = ref1[0], p2 = ref1[1];
        }
        lat1 = p1.lat * DEG_TO_RAD;
        lon1 = p1.lng * DEG_TO_RAD;
        lat2 = p2.lat * DEG_TO_RAD;
        lon2 = p2.lng * DEG_TO_RAD;
        d = 2 * asin(sqrt(pow(sin((lat1 - lat2) / 2), 2) + cos(lat1) * cos(lat2) * pow(sin((lon1 - lon2) / 2), 2)));
        AB = sin(d / 2) / sin(d);
        x = AB * (cos(lat1) * cos(lon1) + cos(lat2) * cos(lon2));
        y = AB * (cos(lat1) * sin(lon1) + cos(lat2) * sin(lon2));
        z = AB * (sin(lat1) + sin(lat2));
        lat = RAD_TO_DEG * atan2(z, sqrt(x * x + y * y));
        lon = RAD_TO_DEG * atan2(y, x);
        if (isNaN(lat) || isNaN(lon)) {
          return p1;
        }
        while (lon < p1.lng - EPSILON) {
          lon += 360;
        }
        while (lon > p2.lng + EPSILON) {
          lon -= 360;
        }
        return new LatLng(lat, lon);
      })(Math.abs, Math.asin, Math.sqrt, Math.pow, Math.sin, Math.cos, Math.atan2);
    };
    _course = function(latlng1, latlng2) {
      var PI, atan2, c1, c2, cos, denom, lat1, lat2, lng1, lng2, numer, result, sin;
      sin = Math.sin, cos = Math.cos, atan2 = Math.atan2, PI = Math.PI;
      c1 = Coordinate.fromLatLng(latlng1);
      c2 = Coordinate.fromLatLng(latlng1);
      lat1 = latlng1.lat * DEG_TO_RAD;
      lng1 = latlng1.lng * DEG_TO_RAD;
      lat2 = latlng2.lat * DEG_TO_RAD;
      lng2 = latlng2.lng * DEG_TO_RAD;
      if (lat1 > PI / 2 - EPSILON) {
        return PI;
      }
      if (lat1 < -PI / 2 + EPSILON) {
        return 2 * PI;
      }
      numer = sin(lng1 - lng2) * cos(lat2);
      denom = cos(lat1) * sin(lat2) - sin(lat1) * cos(lat2) * cos(lng1 - lng2);
      result = atan2(numer, denom) % (2 * PI);
      if (result < 0) {
        result += 2 * PI;
      }
      return result;
    };
    _angleDelta = function(a1, a2) {
      var left_turn_amount;
      if (a2 < a1) {
        a2 += 360;
      }
      left_turn_amount = a2 - a1;
      if (left_turn_amount === 180) {
        return 0;
      } else if (left_turn_amount > 180) {
        return left_turn_amount - 360;
      } else {
        return left_turn_amount;
      }
    };
    _rotationDirection = function(angles) {
      var a1, a2, delta, i, j, len, ref;
      delta = 0;
      len = angles.length;
      for (i = j = 0, ref = len; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        a1 = angles[i];
        a2 = angles[(i + 1) % len];
        delta += _angleDelta(a1, a2);
      }
      if (Math.abs(delta) < EPSILON) {
        delta = 0;
      }
      return delta;
    };
    containsPole = function(latlngs) {
      var angles, delta, delta0, delta1, dir, final, i, initial, j, latlng, latlng0, latlng1, latlng2, len, prev, ref;
      if (latlngs.length < 3) {
        return false;
      }
      latlngs = (function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = latlngs.length; j < len1; j++) {
          latlng = latlngs[j];
          results.push(new LatLng(latlng));
        }
        return results;
      })();
      delta = 0;
      len = latlngs.length;
      for (i = j = 0, ref = len; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        latlng0 = latlngs[(i - 1 + len) % len];
        latlng1 = latlngs[i];
        latlng2 = latlngs[(i + 1) % len];
        prev = (_course(latlng1, latlng0) + Math.PI) % (2 * Math.PI);
        initial = _course(latlng1, latlng2);
        final = (_course(latlng2, latlng1) + Math.PI) % (2 * Math.PI);
        delta0 = initial - prev;
        if (delta0 > Math.PI) {
          delta0 -= 2 * Math.PI;
        }
        if (delta0 < -Math.PI) {
          delta0 += 2 * Math.PI;
        }
        if (Math.abs(Math.PI - Math.abs(delta0)) < EPSILON) {
          delta0 = 0;
        }
        delta1 = final - initial;
        if (delta1 > Math.PI) {
          delta1 -= 2 * Math.PI;
        }
        if (delta1 < -Math.PI) {
          delta1 += 2 * Math.PI;
        }
        if (Math.abs(Math.PI - Math.abs(delta1)) < EPSILON) {
          delta1 = 0;
        }
        delta += delta0 + delta1;
      }
      delta = delta * RAD_TO_DEG;
      if (delta < -360 + EPSILON) {
        return NORTH_POLE | SOUTH_POLE;
      } else if (delta < EPSILON) {
        angles = (function() {
          var k, len1, results;
          results = [];
          for (k = 0, len1 = latlngs.length; k < len1; k++) {
            latlng = latlngs[k];
            results.push(latlng.lng);
          }
          return results;
        })();
        dir = _rotationDirection(angles);
        if (dir > 0) {
          return NORTH_POLE;
        } else if (dir < 0) {
          return SOUTH_POLE;
        } else {
          if (config.debug) {
            console.warn("Rotation direction is NONE despite containing a pole");
          }
          return 0;
        }
      } else {
        return 0;
      }
    };
    area = function(origLatlngs) {
      var PI, crossesMeridian, i, j, k, latlngA, latlngB, latlngC, latlngs, len, phiB, ref, ref1, sum, thetaA, thetaB, thetaC;
      if (origLatlngs.length < 3) {
        return 0;
      }
      latlngs = [];
      len = origLatlngs.length;
      for (i = j = 0, ref = len; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
        latlngA = origLatlngs[i];
        latlngB = origLatlngs[(i + 1) % len];
        latlngs.push(latlngA);
        if (Math.abs(latlngA.lat - latlngB.lat) > 20 || Math.abs(latlngA.lng - latlngB.lng) > 20) {
          latlngs.push(gcInterpolate(latlngA, latlngB));
        }
      }
      PI = Math.PI;
      crossesMeridian = false;
      sum = 0;
      len = latlngs.length;
      for (i = k = 0, ref1 = len; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        latlngA = latlngs[i];
        latlngB = latlngs[(i + 1) % len];
        latlngC = latlngs[(i + 2) % len];
        thetaA = latlngA.lng * DEG_TO_RAD;
        thetaB = latlngB.lng * DEG_TO_RAD;
        thetaC = latlngC.lng * DEG_TO_RAD;
        phiB = latlngB.lat * DEG_TO_RAD;
        if (Math.abs(thetaB - thetaA) > PI) {
          crossesMeridian = !crossesMeridian;
          if (thetaB > thetaA) {
            thetaB -= 2 * Math.PI;
          } else {
            thetaB += 2 * Math.PI;
          }
        }
        if (Math.abs(thetaC - thetaB) > PI) {
          crossesMeridian = !crossesMeridian;
          if (thetaC > thetaB) {
            thetaC -= 2 * Math.PI;
          } else {
            thetaC += 2 * Math.PI;
          }
        }
        sum += (thetaC - thetaA) * Math.sin(phiB);
      }
      if (crossesMeridian) {
        sum = 4 * Math.PI + sum;
      }
      area = -sum / 2;
      if (area < 0) {
        area = 4 * Math.PI + area;
      }
      return area;
    };
    return exports = {
      gcInterpolate: gcInterpolate,
      area: area,
      containsPole: containsPole,
      NORTH_POLE: NORTH_POLE,
      SOUTH_POLE: SOUTH_POLE
    };
  })(ns.LatLng, ns.Coordinate, ns.Arc, this.edsc.config);

}).call(this);

(function() {
  var ns;

  ns = edsc.map;

  ns.sphericalPolygon = (function(LatLng, geoutil, Arc, Coordinate, config) {
    var antimeridianCrossing, convertLatLngs, dividePolygon, exports, ll2j, ll2s, makeCounterclockwise;
    convertLatLngs = function(latlngs) {
      var j, latlng, len1, original, result;
      result = [];
      for (j = 0, len1 = latlngs.length; j < len1; j++) {
        original = latlngs[j];
        latlng = L.latLng(original);
        while (latlng.lng > 180) {
          latlng.lng -= 360;
        }
        while (latlng.lng < -180) {
          latlng.lng += 360;
        }
        result.push(latlng);
      }
      return result;
    };
    antimeridianCrossing = function(latlng0, latlng1) {
      var arc, ref;
      arc = new Arc(Coordinate.fromLatLng(new LatLng(latlng0)), Coordinate.fromLatLng(new LatLng(latlng1)));
      return (ref = arc.antimeridianCrossing()) != null ? ref.toLatLng() : void 0;
    };
    makeCounterclockwise = function(latlngs) {
      var area;
      area = geoutil.area(latlngs);
      if (area > 2 * Math.PI) {
        latlngs.reverse();
      }
      return latlngs;
    };
    ll2s = function(latlngs) {
      var ll;
      return ((function() {
        var j, len1, results;
        results = [];
        for (j = 0, len1 = latlngs.length; j < len1; j++) {
          ll = latlngs[j];
          results.push("(" + ll.lat + ", " + ll.lng + ")");
        }
        return results;
      })()).join(', ');
    };
    ll2j = function(latlngs) {
      var ll;
      return ((function() {
        var j, len1, ref, results;
        ref = latlngs.concat(latlngs[0]);
        results = [];
        for (j = 0, len1 = ref.length; j < len1; j++) {
          ll = ref[j];
          results.push(ll.lng + "," + ll.lat);
        }
        return results;
      })()).join(', ');
    };
    dividePolygon = function(latlngs) {
      var boundaries, boundary, containedPoles, containsNorthPole, containsSouthPole, crossing, extra, extras, hasInsertions, hasPole, hole, holes, i, inc, interior, interiors, j, k, l, lat, latlng, latlng1, latlng2, len, len1, len2, len3, lng, m, maxCrossingLat, minCrossingLat, n, next, o, p, q, ref, ref1, split;
      interiors = [];
      boundaries = [];
      holes = [];
      if (latlngs && latlngs[0] instanceof Array && typeof latlngs[0][0] !== 'number') {
        ref = latlngs.slice(1);
        for (j = 0, len1 = ref.length; j < len1; j++) {
          hole = ref[j];
          hole = convertLatLngs(hole);
          denormalizePath(hole);
          holes.push(hole);
        }
        latlngs = latlngs[0];
      }
      latlngs = convertLatLngs(latlngs);
      latlngs = makeCounterclockwise(latlngs);
      containedPoles = geoutil.containsPole(latlngs);
      containsNorthPole = (containedPoles & geoutil.NORTH_POLE) !== 0;
      containsSouthPole = (containedPoles & geoutil.SOUTH_POLE) !== 0;
      maxCrossingLat = -95;
      minCrossingLat = 95;
      split = [];
      len = latlngs.length;
      for (i = k = 0, ref1 = len; 0 <= ref1 ? k < ref1 : k > ref1; i = 0 <= ref1 ? ++k : --k) {
        latlng1 = latlngs[i];
        latlng2 = latlngs[(i + 1) % len];
        crossing = antimeridianCrossing(latlng1, latlng2);
        split.push(latlng1);
        extras = [];
        if (crossing != null) {
          lat = crossing.lat;
          if (latlng1.lng < latlng2.lng) {
            extras = [[lat, -180], [lat, 180]];
          } else {
            extras = [[lat, 180], [lat, -180]];
          }
        } else if (latlng1.lng === 180 && latlng2.lng < 0) {
          extras = [[latlng1.lat, -180]];
        } else if (latlng1.lng === -180 && latlng2.lng > 0) {
          extras = [[latlng1.lat, 180]];
        } else if (latlng2.lng === 180 && latlng1.lng < 0) {
          extras = [[latlng2.lat, -180]];
        } else if (latlng2.lng === -180 && latlng1.lng > 0) {
          extras = [[latlng2.lat, 180]];
        }
        for (l = 0, len2 = extras.length; l < len2; l++) {
          extra = extras[l];
          lat = extra[0], lng = extra[1];
          split.push(new LatLng(lat, lng));
          maxCrossingLat = Math.max(lat, maxCrossingLat);
          minCrossingLat = Math.min(lat, minCrossingLat);
        }
      }
      hasInsertions = latlngs.length < split.length;
      interior = [];
      boundary = [];
      if (hasInsertions) {
        if (Math.abs(split[0].lng) !== 180 || Math.abs(split[split.length - 1].lng) !== 180) {
          while (Math.abs(split[0].lng) !== 180) {
            split.push(split.shift());
          }
          split.push(split.shift());
        }
      }
      for (i = m = 0, len3 = split.length; m < len3; i = ++m) {
        latlng = split[i];
        interior.push(latlng);
        boundary.push(latlng);
        next = split[(i + 1) % split.length];
        if (interior.length > 2 && Math.abs(latlng.lng) === 180 && Math.abs(next.lng) === 180) {
          boundaries.push(boundary);
          boundary = [];
          hasPole = false;
          if (containsNorthPole && latlng.lat === maxCrossingLat) {
            hasPole = true;
            lng = latlng.lng;
            inc = lng < 0 ? 90 : -90;
            for (i = n = 0; n <= 4; i = ++n) {
              interior.push(new LatLng(90, lng + i * inc));
            }
          }
          if (containsSouthPole && latlng.lat === minCrossingLat) {
            hasPole = true;
            lng = latlng.lng;
            inc = lng < 0 ? 90 : -90;
            for (i = o = 0; o <= 4; i = ++o) {
              interior.push(new LatLng(-90, lng + i * inc));
            }
          }
          if (!hasPole) {
            interiors.push(interior);
            interior = [];
          }
        }
      }
      if (boundary.length > 0) {
        boundaries.push(boundary);
      }
      if (interior.length > 0) {
        interiors.push(interior);
      }
      if (containsNorthPole && containsSouthPole && !hasInsertions) {
        interior = [];
        for (i = p = 0; p <= 4; i = ++p) {
          interior.push(new LatLng(90, -180 + i * 90));
        }
        for (i = q = 0; q <= 4; i = ++q) {
          interior.push(new LatLng(-90, 180 - i * 90));
        }
        interiors.unshift(interior);
      }
      return {
        interiors: interiors,
        boundaries: boundaries
      };
    };
    return exports = {
      dividePolygon: dividePolygon
    };
  })(ns.LatLng, ns.geoutil, ns.Arc, ns.Coordinate, this.edsc.config);

}).call(this);
