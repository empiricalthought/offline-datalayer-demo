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
  })
});
