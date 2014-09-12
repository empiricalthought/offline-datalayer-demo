'use strict';

window.DemoApp = new Backbone.Marionette.Application();

DemoApp.addRegions({
  main: '#main'
});

DemoApp.on('start', function () {
  Backbone.history.start();
});
