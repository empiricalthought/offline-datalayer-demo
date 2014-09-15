'use strict';

DemoApp.module('Main', function (Main, App, Backbone, Marionette, $, _) {

  
  Main.Controller = Marionette.Controller.extend({
    initialize: function(options) {
      this.sectionList = new App.Sections.SectionList();
    },
    
    start: function() {
      var controlView = new Main.Views.ControlView();
      App.controls.show(controlView);
      this.showSectionList(this.sectionList);
      this.populateList(this.sectionList);
      this.listenTo(controlView, "reload:clicked", function() {
        this.sectionList.reset();
        this.populateList(this.sectionList);
      });        
    },

    showSectionList: function(sectionList) {
      App.main.show(new Main.Views.SectionListView({
        collection: sectionList
      }));
    },

    populateList: function(sectionList) {
      var addToSectionList = function (data) {
        sectionList.add(new App.Sections.Section(data));
      };

      DataLayer.fetchSections().then(function(sectionData) {
        _.forEach(sectionData, addToSectionList);
      }).catch(function(resp) {
        var err = new Backbone.Model({
          messageText: "Unable to retrieve data: " + resp.statusText
        });
        App.error.show(new Main.Views.ErrorListView({
          collection: new Backbone.Collection([err])
        }));
      });

    }

  });
  
  Main.addInitializer(function () {
    var controller = new Main.Controller();
    controller.start();
  });
});
