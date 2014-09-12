'use strict';
var DataLayer = (function () {

  function processResults(termsResponse, coursesResponse, sectionsResponse) {
    // this in-memory join is for demonstration purposes only
    var sectionData = sectionsResponse[0].results;
    var coursesData = coursesResponse[0].results;
    var termsData = termsResponse[0].results;
    var result = _.map(sectionData, function(section) {
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
      var termsPromise = $.ajax("/data/terms");
      var coursesPromise = $.ajax("/data/courses");
      var sectionsPromise = $.ajax("/data/sections");
      var processedPromise = $.when(termsPromise,
                                    coursesPromise,
                                    sectionsPromise).then(processResults);
      return processedPromise;
    }
  }
})();
