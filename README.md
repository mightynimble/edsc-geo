# EDSC GEO Plugin

## About

This is a javascript plugin extracted from Earthdata Search. Visit Earthdata Search at
[https://search.earthdata.nasa.gov](https://search.earthdata.nasa.gov)

Earthdata Search is a web application developed by [NASA](http://nasa.gov) [EOSDIS](https://earthdata.nasa.gov)
to enable data discovery, search, comparison, visualization, and access across EOSDIS' Earth Science data holdings.
It builds upon several public-facing services provided by EOSDIS, including
the [Common Metadata Repository (CMR)](https://cmr.earthdata.nasa.gov/search/) for data discovery and access,
EOSDIS [User Registration System (URS)](https://urs.earthdata.nasa.gov) authentication,
the [Global Imagery Browse Services (GIBS)](https://earthdata.nasa.gov/gibs) for visualization,
and a number of OPeNDAP services hosted by data providers.

## License

> Copyright © 2007-2014 United States Government as represented by the Administrator of the National Aeronautics and Space Administration. All Rights Reserved.
>
> Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License.
> You may obtain a copy of the License at
>
>    http://www.apache.org/licenses/LICENSE-2.0
>
>Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS,
>WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

## Installation/Building

### Prerequisites

* [gulp](http://gulpjs.com/)

### Build
Run gulp from command line

    > gulp
or

    > gulp build

To clean up dist:

	> gulp clean

To compile coffeescripts only:

	> gulp js

## Example
There is an example html file (index.html) in dist folder.

## Usage
* Include divide-polygon.js in your html header

    > <script src="divide-polygon.js" type="text/javascript"></script>
* A polygon, an array of lat-lng objects, which crosses antemeridian, can be divided into multiple polygons, as is shown in the red polygon on the example page.

    > var crossAntiMPoly = [new LatLng(22, -130), new LatLng(22, 100), new LatLng(10, 100), new LatLng(10, -130), new LatLng(22, -130)];
    > divided = dividePolygon(crossAntiMPoly);


