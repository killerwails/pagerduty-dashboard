app.factory('audioNotifications', function(dashboardSettings) {
  var AUDIO_INTERVAL_TIME = 1000 * 60 * 30;
  var audioInterval;

  var currentStatus = 'active';
  var audioElements = {
    'critical': document.createElement('audio'),
    'warning': document.createElement('audio'),
    'active': document.createElement('audio')
  };
  var eventTypes = [
    'active',
    'warning',
    'critical'
  ];

  function getDefaultSound(eventType) {
    return 'sounds/' + eventType + '.mp3';
  }

  function setEventSound(eventType, sound) {
    sound = sound || getDefaultSound(eventType);
    if (audioElements[eventType].src !== sound) {
      audioElements[eventType].src = sound;
    }
  }

  function playSound() {
    if (dashboardSettings.getValue('soundsPlay') && audioElements[currentStatus]) {
      audioElements[currentStatus].play();
    }
  }

  function changeCurrentStatus(status) {
    currentStatus = status;
    if (audioInterval) {
      clearInterval(audioInterval);
    }
    playSound();
    audioInterval = setInterval(playSound, AUDIO_INTERVAL_TIME);
  }

  dashboardSettings.onUpdate(function() {
    eventTypes.forEach(function(eventType) {
      var settingName = 'sounds' + eventType.charAt(0).toUpperCase() + eventType.slice(1);
      setEventSound(eventType, dashboardSettings.getValue(settingName));
    });
  });

  function handleDataChange(data, groupsToShow) {
    var globalStatus = groupsToShow[0] ? groupsToShow[0].status : '';
    if (currentStatus !== globalStatus) {
      changeCurrentStatus(globalStatus);
    }
  }

  function initialize() {
    eventTypes.forEach(function(eventType) {
      setEventSound(eventType);
    });
  }

  return {
    initialize: initialize,
    handleDataChange: handleDataChange
  };
});
