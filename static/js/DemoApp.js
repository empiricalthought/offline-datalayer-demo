'use strict';

window.DemoApp = new Backbone.Marionette.Application();

DemoApp.addRegions({
  main: '#main',
  controls: '#controls',
  error: '#error'
});

DemoApp.on('start', function () {
  Backbone.history.start();
});
