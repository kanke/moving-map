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

  function Smap(options) {
    this._map = new Map({ basemap: 'dark-gray-vector' });

    this._view = new MapView({
      container: options.elementId,
      map: this._map,
      center: [options.longitude, options.latitude],
      zoom: 13,
    });

    this._view.on('click', console.log);

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
