LocationTracker = function() {

  var locationCallback;
  var channelName = 'locationChannel';
  
  var pubnub = new PubNub({
    publishKey : 'pub-c-e8c0a553-dc6e-4f7d-87b5-71872684b051',
    subscribeKey : 'sub-c-0fbe3c62-b988-11e6-9dca-02ee2ddab7fe'
  });

  var setLocationCallback = function(callback) {
    locationCallback = callback;
    pubnub.subscribe({ channels: [channelName] })
    pubnub.addListener({
      message: function (message) {
        locationCallback(message.message.latitude, message.message.longitude);
      }
    });
  };

  var publish = function(latitude, longitude) {
    pubnub.publish({
        channel: channelName,
        message: { latitude : latitude, longitude : longitude}
    }, function ( status, response ) {
        //console.log( status.error, response )
    });
  }

  return {
    setListener : function(callback) {
      setLocationCallback(callback);
    },

    publishLocation : function(latitude, longitude) {
      publish(latitude, longitude);
    }
  }
};

