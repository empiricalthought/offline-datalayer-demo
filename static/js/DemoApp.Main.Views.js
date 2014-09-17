'use strict';

DemoApp.module('Main.Views', function (Views, App, Backbone, Marionette, $, _) {
  Views.SectionItemView = Marionette.ItemView.extend({
    editable: false,
    tagName: 'tr',
    template: '#template-sectionItemView',

    ui : {
      editButton: '.section-edit-button'
    },
    
    events: {
      'click @ui.editButton': 'editToggled'
    },

    editToggled: function() {
      this.editable = !this.editable;
      this.render();
    },

    templateHelpers: function () {
      return { editable: this.editable }
    }
    
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
      toggleButton: '#toggle',
      reloadButton: '#reload'
    },

    events: {
      'click @ui.toggleButton': 'offlineToggled',
      'click @ui.reloadButton': 'reloadClicked'
    },

    offlineToggled: function () {
      if (DataLayer.isOnline()) {
        DataLayer.goOffline();
      } else {
        DataLayer.goOnline();
      }
      this.ui.toggleButton.attr('value', DataLayer.isOnline() ? "Go Offline" : "Go Online");
    },

    reloadClicked: function () {
      this.trigger("reload:clicked");
    }
  });

  Views.ErrorItemView = Backbone.Marionette.ItemView.extend({
    tagName: 'li',
    template: '#template-errorItemView',
  });

  Views.ErrorListView = Backbone.Marionette.CompositeView.extend({
    template: '#template-errorListView',
    childView: Views.ErrorItemView,
    childViewContainer: '#error-list'
  });
});
