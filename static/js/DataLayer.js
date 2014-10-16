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

  function fixupSections(sectionsData) {
    return function(responses) {
      var termsData = responses[0].data;
      var coursesData = responses[1].data;
      // below requires special knowledge of server-side data model,
      // specifically alternate keys for data.  In my opinion, all of
      // this joining/unjoining is better off on the server side, even
      // if it means very specialized code that cannot be reused.
      _.each(sectionsData, function(section) {
        var term_id = _.find(termsData, function(term) {
          return term.term_name == section.term_name;
        }).term_id;
        var course_id = _.find(coursesData, function(course) {
          return course.course_name == section.course_name;
        }).course_id;
        section.term_id = term_id;
        section.course_id = course_id;
      });
      console.log("derp");
      return sectionsData;
    }
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
      data: JSON.stringify({data: postData, meta: {temp_id: '__id'}}),
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
        var termsData = _.map(data, function(x, i) {
          return { term_id: x.term_id,
                   term_name: x.term_name,
                   __id: i};
        });
        var coursesData = _.map(data, function(x, i) {
          return { course_id: x.course_id,
                   course_name: x.course_name,
                   __id: i};
        });
        var termsUpdate = jQueryPostPromise("/data/terms", termsData);
        var coursesUpdate = jQueryPostPromise("/data/courses", coursesData);
        //var sectionsUpdate = jQueryPostPromise("/data/sections", sectionsData);
        return Promise.all([termsUpdate, coursesUpdate]).then(
          fixupSections(data)).then(function(sectionsData) {
            console.log(sectionsData);
            return jQueryPostPromise("/data/sections", sectionsData);
          });
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
