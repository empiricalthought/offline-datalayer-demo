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
      if (DataLayer.isOnline()) {
        DataLayer.goOffline();
      } else {
        DataLayer.goOnline();
      }
      this.ui.button.attr('value', DataLayer.isOnline() ? "Go Offline" : "Go Online");
    }
  });
});
