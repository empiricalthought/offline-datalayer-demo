'use strict';
var DataLayer = (function () {

  function storeResults(responses) {
    var termsData = responses[0].results;
    var coursesData = responses[1].results;
    var sectionsData = responses[2].results;
    return Promise.all(
      [localforage.setItem('terms', termsData),
       localforage.setItem('courses', coursesData),
       localforage.setItem('sections', sectionsData)]
    ).then(function() {
      return [termsData, coursesData, sectionsData];
    });
  }

  function processResults(vals) {
    var termsData = vals[0];
    var coursesData = vals[1];
    var sectionsData = vals[2];
    // this in-memory join is for demonstration purposes only
    var result = _.map(sectionsData, function(section) {
      var row = {};
      $.extend(row, section);
      row.course_name = _.find(coursesData, function(course) {
        return course.course_id == row.course_id;
      }).course_name;
      row.term_name = _.find(termsData, function(term) {
        return term.term_id == row.term_id;
      }).term_name;
      return row;
    });
    return result;
  }
    
  return {
    fetchSections: function() {
      var termsPromise = Promise.resolve($.ajax("/data/terms"));
      var coursesPromise = Promise.resolve($.ajax("/data/courses"));
      var sectionsPromise = Promise.resolve($.ajax("/data/sections"));
      var processedPromise = Promise.all(
        [termsPromise,
         coursesPromise,
         sectionsPromise]).then(storeResults).then(processResults);
      return processedPromise;
    }
  }
})();
