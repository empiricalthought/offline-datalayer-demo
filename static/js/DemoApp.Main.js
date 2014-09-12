'use strict';

DemoApp.module('Main', function (Main, App, Backbone, Marionette, $, _) {

  Main.Controller = function () {
    this.sectionList = new App.Sections.SectionList();
  };

  _.extend(Main.Controller.prototype, {

    start: function() {
      App.controls.show(new Main.Views.ControlView());
      this.showSectionList(this.sectionList);
      this.populateList(this.sectionList);
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
      });
    }
    
  });
  
  Main.addInitializer(function () {
    var controller = new Main.Controller();
    controller.start();
  });
});
