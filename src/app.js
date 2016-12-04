require([
  'esri/Map',
  'esri/Graphic',
  'esri/views/MapView',
  'esri/geometry/Point',
  'esri/symbols/SimpleMarkerSymbol',
  'dojo/domReady!',
], function (Map, Graphic, MapView, Point, SimpleMarkerSymbol) {
  var map = new Map({ basemap: 'streets' });

  var view = new MapView({
    container: 'root',
    map: map,
    center: [-0.1278990, 51.5032520],
    zoom: 13,
  });

  var geometry = new Point({
    x: -0.1278990,
    y: 51.5032520,
  });

  var symbol = new SimpleMarkerSymbol({
    style: 'square',
    color: 'blue',
    size: '8px',
    outline: {
      color: [255, 255, 0],
      width: 1,
    },
  });

  var attributes = {
    title: 'Free Red Bull here! (25 remaining)',
    content: 'Free Red Bull for the first 25 customers here',
  };

  var graphic = new Graphic({
    symbol: symbol,
    geometry: geometry,
    attributes: attributes,
    popupTemplate: {
      title: '{title}',
      content: '{content}',
    }
  });

  view.graphics.add(graphic);
  function tick() {
    graphic.geometry.x = graphic.geometry.x + Math.random() / 100.0;

    view.graphics.remove(graphic);
    graphic = new Graphic({
      symbol: symbol,
      geometry: geometry,
      attributes: attributes,
      popupTemplate: {
        title: '{title}',
        content: '{content}'
      }
    });
    view.graphics.add(graphic);

    setTimeout(tick, 1000);
  }

  tick();
});
