'use strict';

DemoApp.module('Main.Views', function (Views, App, Backbone, Marionette, $, _) {
  Views.SectionItemView = Marionette.ItemView.extend({
    tagName: 'tr',
    template: '#template-sectionItemView',

    ui : {
      editButton: '.section-edit-button',
      termName: '.section-term-name',
      courseName: '.section-course-name'
    },
    
    events: {
      'click @ui.editButton': 'editToggled'
    },

    modelEvents: {
      'change:viewIsEditable': 'render'
    },

    editToggled: function() {
      var isEditable = this.model.get('viewIsEditable');
      console.log(this.ui.courseName);
      if (isEditable) {
        this.model.set('course_name', this.ui.courseName[0].value);
        this.model.set('term_name', this.ui.termName[0].value);
      }
      this.model.set('viewIsEditable', !isEditable);
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
      addButton: '#add',
      saveButton: '#save'
    },

    events: {
      'click @ui.offlineButton': 'offlineToggled',
      'click @ui.reloadButton': 'reloadClicked',
      'click @ui.addButton': 'addClicked',
      'click @ui.saveButton': 'saveClicked'
    },

    collectionEvents: {
      'add': 'render'
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

    addClicked: function() {
      this.trigger("addClicked");
    },

    saveClicked: function() {
      this.trigger("saveClicked");
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
