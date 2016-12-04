define([
  'esri/Map',
  'esri/Graphic',
  'esri/views/MapView',
  'esri/geometry/Point',
  'esri/symbols/PictureMarkerSymbol',
], function (Map, Graphic, MapView, Point, PictureMarkerSymbol) {
  var AVATAR_SYMBOL = new PictureMarkerSymbol({
    url: './assets/avatar-pin.png',
    width: '24px',
    height: '24px',
  });
  var PIN_SYMBOL = new PictureMarkerSymbol({
    url: './assets/location-pin.png',
    width: '24px',
    height: '24px',
  });

  function Smap(elementId) {
    this._map = new Map({ basemap: 'dark-gray-vector' });

    this._view = new MapView({
      container: elementId,
      map: this._map,
      center: [-0.1278990, 51.5032520],
      zoom: 13,
    });

    this._avatars = {};
  }

  Smap.prototype.zoomTo = function zoomTo(latitude, longitude, zoom) {
    this._view.goTo({
      zoom: 17,
      center: [longitude, latitude],
    });
  };

  Smap.prototype.onClick = function onClick(callback) {
    return this._view.on('click', callback);
  };

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

  Smap.prototype.createPin = function createPin(options) {
    this._view.graphics.add(new Graphic({
      symbol: PIN_SYMBOL,
      geometry: new Point({
        x: options.longitude,
        y: options.latitude,
      }),
      popupTemplate: {
        title: options.title,
        content: options.content,
      },
    }));
  };

  return Smap;
});
