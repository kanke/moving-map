define([
  'esri/Map',
  'esri/Graphic',
  'esri/views/MapView',
  'esri/geometry/Point',
  'esri/symbols/SimpleMarkerSymbol',
], function (Map, Graphic, MapView, Point, SimpleMarkerSymbol) {
  var AVATAR_SYMBOL = new SimpleMarkerSymbol({
    style: 'square',
    color: 'blue',
    size: '8px',
    outline: {
      color: [255, 255, 0],
      width: 1,
    },
  });

  function Smap(divId) {
    this._map = new Map({ basemap: 'streets' });

    this._view = new MapView({
      container: divId,
      map: this._map,
      center: [-0.1278990, 51.5032520],
      zoom: 13,
    });

    this._avatars = {};
  }

  Smap.prototype.createOrUpdateAvatar = function createOrUpdateAvatar(uuid, coords) {
    console.log('ping', uuid, coords);
    var graphic = this._avatars[uuid] || {
      symbol: AVATAR_SYMBOL,
      geometry: new Point({ x: 0, y: 0 }),
    };
    this._view.graphics.remove(graphic);

    graphic.geometry.x = coords.longitude;
    graphic.geometry.y = coords.latitude;

    var newGraphic = new Graphic({
      symbol: graphic.symbol,
      geometry: graphic.geometry,
    });

    this._view.graphics.add(newGraphic);

    this._avatars[uuid] = newGraphic;
  };

  return Smap;
});
