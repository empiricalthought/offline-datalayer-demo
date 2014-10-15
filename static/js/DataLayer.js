'use strict';
var DataLayer = (function () {

  var online = true;
  
  function storeResults(responses) {
    var termsData = responses[0].data;
    var coursesData = responses[1].data;
    var sectionsData = responses[2].data;
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

  function ajaxHandler(uri) {
    return function (resp) {
      return new Promise(function(f, r) {
        var error = new Error(uri + " returned " + resp.statusText);
        error.context = resp;
        r(error);
      });
    }
  }

  function jQueryAjaxPromise() {
    return Promise.resolve($.ajax.apply($, arguments)).catch(ajaxHandler(arguments));
  }

  function jQueryPostPromise(uri, postData) {
    return jQueryAjaxPromise(uri, {
      data: JSON.stringify({data: postData}),
      type: 'POST',
      dataType: 'json',
      headers: {'Content-Type': 'application/json'},
      processData: false
    });
  }
  
  return {
    fetchSections: function() {
      var promise;
      if (online) {
        console.log("data from network");
        var termsPromise = jQueryAjaxPromise("/data/terms");
        var coursesPromise = jQueryAjaxPromise("/data/courses");
        var sectionsPromise = jQueryAjaxPromise("/data/sections");
        promise = Promise.all(
          [termsPromise,
           coursesPromise,
           sectionsPromise]).then(storeResults);
      } else {
        console.log("data from localforage");
        promise = Promise.all(
          [localforage.getItem('terms'),
           localforage.getItem('courses'),
           localforage.getItem('sections')]);
      }
      return promise.then(processResults);
    },

    saveSections: function(data) {
      if (!online) {
        return Promise.resolve("can't save while offline");
      } else {
        var termsData = _.map(data, function(x) {
          return { term_id: x.term_id,
                   term_name: x.term_name };
        });
        var coursesData = _.map(data, function(x) {
          return { course_id: x.course_id,
                   course_name: x.course_name };
        });
        var sectionsData = _.map(data, function(x) {
          return { course_id: x.course_id,
                   term_id: x.term_id,
                   section_id: x.section_id,
                   start_date: x.start_date,
                   end_date: x.end_date };
        });
        var termsUpdate = jQueryPostPromise("/data/terms", termsData);
        var coursesUpdate = jQueryPostPromise("/data/courses", coursesData);
        var sectionsUpdate = jQueryPostPromise("/data/sections", sectionsData);
        return Promise.all([termsUpdate, coursesUpdate]).then(
          sectionsUpdate).then(function() { return "saved!";});
      }
    },

    goOnline: function() {
      online = true;
    },

    goOffline: function() {
      online = false;
    },

    isOnline: function() {
      return online;
    }
    
  }
})();
