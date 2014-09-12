'use strict';

DemoApp.module('Main.Views', function (Views, App, Backbone, Marionette, $, _) {
  Views.SectionItemView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#template-sectionItemView',
  });

  Views.SectionListView = Backbone.Marionette.CompositeView.extend({
    template: '#template-sectionListView',
    childView: Views.SectionItemView,
    childViewContainer: '#section-list'
  });

  Views.ControlView = Backbone.Marionette.ItemView.extend({
    tagName: 'div',
    
    template: '#template-controlsView',

    ui: {
      button: '.toggle'
    },

    events: {
      'click .toggle': 'offlineToggled'
    },

    offlineToggled: function () {
      console.log("y u no work");
      // if (DataLayer.online) {
      //   DataLayer.goOffline();
      // } else {
      //   DataLayer.goOnline();
      // }
      // this.ui.button.set('text', DataLayer.online ? "Go Offline" : "Go Online");
    }
  });
});
