require([
  './src/smap.js',
  'dojo/domReady!',
], function (Smap) {
  var POLL_WAIT = 5000;
  var LOCATIONS_CHANNEL = 'smap-locations';
  var geolocation = navigator.geolocation;

  var smap = null;
  geolocation.getCurrentPosition(function (initialPosition) {
    smap = new Smap({
      elementId: 'root',
      latitude: initialPosition.coords.latitude,
      longitude: initialPosition.coords.longitude,
    });

    var pubnub = new PubNub({
      publishKey: 'pub-c-e8c0a553-dc6e-4f7d-87b5-71872684b051',
      subscribeKey: 'sub-c-0fbe3c62-b988-11e6-9dca-02ee2ddab7fe'
    });

    pubnub.subscribe({
      channels: [LOCATIONS_CHANNEL],
      withPresence: true,
    });

    pubnub.addListener({
      message: function (message) {
        switch (message.channel) {
          case LOCATIONS_CHANNEL:
            smap.createOrUpdateAvatar(message.publisher, message.message);
            break;

          default:
            console.warn('Unhandled message', message);
            break;
        }
      },

      presence: function (event) {
        console.log(event);
      },
    });

    function ping() {
      geolocation.getCurrentPosition(function (position) {
        pubnub.publish({
          channel: LOCATIONS_CHANNEL,
          message: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: console.error,
        });

        setTimeout(ping, POLL_WAIT);
      });
    }

    if (geolocation) {
      ping();
    } else {
      console.error('The geolocation API is not supported by this browser');
    }
  }, console.error);
});
