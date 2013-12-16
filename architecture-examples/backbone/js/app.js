/*global $ */
/*jshint unused:false */

(function(global){
  'use strict';

  var app = global.app || {};
  global.ENTER_KEY = 13;

  $(function () {
    // kick things off by creating the `App`
    __LOG("new app.AppView()");
    new app.AppView();
  });

})(window);
