require([
  './src/smap.js',
  'dojo/domReady!',
], function (Smap) {
  var POLL_WAIT = 5000;
  var PINS_CHANNEL = 'smap-pins';
  var LOCATIONS_CHANNEL = 'smap-locations';
  var geolocation = navigator.geolocation;

  var smap = new Smap('root');
  geolocation.getCurrentPosition(function (initialPosition) {
    smap.zoomTo(
      initialPosition.coords.latitude,
      initialPosition.coords.longitude
    );
  }, console.error);

  var pubnub = new PubNub({
    publishKey: 'pub-c-e8c0a553-dc6e-4f7d-87b5-71872684b051',
    subscribeKey: 'sub-c-0fbe3c62-b988-11e6-9dca-02ee2ddab7fe'
  });

  smap.onClick(function (event) {
    if (event.target.tagName !== 'svg') {
      return;
    }

    var title = prompt('Enter the name of your promo', 'Free beers');

    if (title) {
      var point = event.mapPoint;
      var message = {
        title: title,
        content: 'Click <a href="javascript:void(0)" onclick="onClickClaim(\'' + title + '\')">here</a> to claim them now!',
        latitude: point.latitude,
        longitude: point.longitude,
      };

      pubnub.publish({
        channel: PINS_CHANNEL,
        message: message,
      });
    }
  });

  window.onClickClaim = function onClickClaim(message) {
    var number = prompt('You are attempting to claim "' + message + '", please enter your number below to complete the claim.', '');

    if (number) {
      $.ajax({
        method: 'POST',
        url: 'https://api.twilio.com/2010-04-01/Accounts/AC64b5b0dea55174050b753bf863341069/Messages.json',
        data: {
          From: '+441471392007',
          To: number,
          Body: 'Your claim for "' + message + '" has been successful. Your confirmation number is SMAP-' + Math.round(1e5*Math.random()),
        },
        beforeSend: function (xhr) {
          xhr.setRequestHeader ('Authorization', 'Basic ' + btoa('AC64b5b0dea55174050b753bf863341069:4249da0b42dcb376db8e25e7724263d2'));
        },
        success: function () {
          console.log('SUCCESS', arguments);
        },
      });
    }
  };

  pubnub.subscribe({
    channels: [LOCATIONS_CHANNEL, PINS_CHANNEL],
    withPresence: true,
  });

  pubnub.addListener({
    message: function (message) {
      switch (message.channel) {
        case LOCATIONS_CHANNEL:
          smap.createOrUpdateAvatar(message.publisher, message.message);
          break;

        case PINS_CHANNEL:
          smap.createPin(message.message);
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
});
