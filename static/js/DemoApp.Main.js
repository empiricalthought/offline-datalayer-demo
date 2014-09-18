'use strict';

DemoApp.module('Main', function (Main, App, Backbone, Marionette, $, _) {

  
  Main.Controller = Marionette.Controller.extend({
    initialize: function(options) {
      this.sectionList = new App.Sections.SectionList();
    },

    start: function() {
      var sectionListView = new Main.Views.SectionListView({
        collection: this.sectionList
      });
      var controlView = new Main.Views.ControlView();
      this.reloadData();
      controlView.on("reloadClicked", this.reloadData, this);
      controlView.on("addClicked", this.addSection, this);
      App.main.show(sectionListView);
      App.controls.show(controlView);
    },

    addSection: function() {
      this.sectionList.add(new App.Sections.Section({viewIsEditable: true}));
    },
    
    reloadData: function() {
      var sectionList = this.sectionList;
      DataLayer.fetchSections().then(function(sectionsData) {
        var newSectionCollection = _.map(
          sectionsData,
          function(sectionData) {
            return new App.Sections.Section(sectionData);
          });
        sectionList.reset(newSectionCollection);
      }).catch(function(resp) {
        if (resp.context) {
          console.log(resp.context);
        }
        var err = new Backbone.Model({
          messageText: "Unable to retrieve data: " + resp
        });
        App.error.show(new Main.Views.ErrorListView({
          collection: new Backbone.Collection([err])
        }));
      });
    }
  });
  
  Main.addInitializer(function() {
    var controller = new Main.Controller();
    controller.start();
  });

});
