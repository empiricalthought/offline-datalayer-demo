'use strict';

DemoApp.module('Sections', function(Sections, DemoApp, Backbone) {

  Sections.Section = Backbone.Model.extend({
    defaults: {
      section_id: null,
      term_id: null,
      course_id: null,
      term_name: '',
      course_name: '',
      viewIsEditable: false
    }
  });

  Sections.SectionList = Backbone.Collection.extend({
    model: Sections.Section
  });
  
});

