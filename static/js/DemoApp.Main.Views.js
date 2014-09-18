'use strict';

DemoApp.module('Main.Views', function (Views, App, Backbone, Marionette, $, _) {
  Views.SectionItemView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#template-sectionItemView',

    ui : {
      editButton: '.section-edit-button'
    },
    
    events: {
      'click @ui.editButton': 'editToggled'
    },

    modelEvents: {
      'change:viewIsEditable': 'render'
    },

    editToggled: function() {
      this.model.set('viewIsEditable', !this.model.get('viewIsEditable'));
    }

  });

  Views.SectionListView = Backbone.Marionette.CollectionView.extend({
    template: '#template-sectionListView',
    childView: Views.SectionItemView,
    childViewContainer: '#section-list'
  });

  Views.ControlView = Backbone.Marionette.ItemView.extend({
    tagName: 'div',
    
    template: '#template-controlsView',

    ui: {
      offlineButton: '#offline',
      reloadButton: '#reload',
      addButton: '#add'
    },

    events: {
      'click @ui.offlineButton': 'offlineToggled',
      'click @ui.reloadButton': 'reloadClicked'
    },

    offlineToggled: function () {
      if (DataLayer.isOnline()) {
        DataLayer.goOffline();
      } else {
        DataLayer.goOnline();
      }
      this.render();
    },

    reloadClicked: function () {
      this.trigger("reloadClicked");
    },

    templateHelpers: function () {
      return { online: DataLayer.isOnline() }
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
