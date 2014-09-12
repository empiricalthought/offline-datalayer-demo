'use strict';

DemoApp.module('Main', function (Main, App, Backbone, Marionette, $, _) {

  Main.Controller = function () {
    this.sectionList = new App.Sections.SectionList();
  };

  _.extend(Main.Controller.prototype, {

    start: function() {
      this.showSectionList(this.sectionList);
      this.sectionList.add(new DemoApp.Sections.Section(
         {'term_name': 'Spring 2014',
          'course_name': 'Foobar Baz Thud'}
      ));

    },

    showSectionList: function(sectionList) {
      App.main.show(new Main.Views.SectionListView({
        collection: sectionList
      }));
    },
    
  });
  
  Main.addInitializer(function () {
    var controller = new Main.Controller();
    controller.start();
  });
});
