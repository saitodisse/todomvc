"use strict";
/**
  example:

  __LOG({ functionName: "    Events.on"
      , backboneType: "vendor"
      , arguments: [name]
      });

  or just:
    __LOG("message");


 */
(function(){
  window.S_Utils = {};
  window.S_Utils.convertAbsUrl = function(url){
    if(!url){
      return url;
    }
    
    return url.replace(/^(?:\/\/|[^\/]+)*\//, "");
  };

  window.S_Utils.rpad = function(str, padString, length) {
      while (str.length < length)
          str = str + padString;
      return str;
  };

  window.S_Utils.truncate = function(str, length, truncateStr){
    if (str === null) return "";
    str = String(str); truncateStr = truncateStr || "...";
    length = ~~length;
    return str.length > length ? str.slice(0, length) + truncateStr : str;
  };
})();

(function(window){
  // emits a ---pause--- when its not canceled
  var globalTimeoutLogId;

  /**
   * better console.log output, with colors
   * @return {string}
   */
  function __LOG(){
    var slice = Array.prototype.slice
      , args = slice.call(arguments, 0)
      , backLogObj = args.shift()
      , argPassed
      , startString
      , objPreAppendColor

      /**
       * getName: style for console log method names
       * @param  {object} options
       * @return {string}
       */
      , getName = function(options){
          var nameParts
            , name = ""
            , method = ""
          ;

          if(options.name){
            nameParts = options.name.split(".");
          }
          else{
            return "";
          }
          
          name   = window.S_Utils.truncate(nameParts[0], options.nameSize  -2, "..");
          method = window.S_Utils.truncate(nameParts[1], options.methodSize-2, "..");

          if(nameParts.length === 2){
            name   = window.S_Utils.rpad(name,   " ", options.nameSize);
            method = window.S_Utils.rpad(method, " ", options.methodSize);
          }
          else{
            name = window.S_Utils.rpad(options.name, " ", options.nameSize + options.methodSize);
          }

          return name + method;
        }

      , contains = function(name, contains){
          if(!name){
            return false;
          }
          var preparedName = name.toLowerCase();
          return preparedName.indexOf(contains) >= 0;
        }

      , getForeColorByFunctionName = function(name){
          if(contains(name, "router")){
              return "#6700B9";
          }
          if(contains(name, "model")){
              return "#620F09";
          }
          if(contains(name, "collection")){
              return "#426D09";
          }
          if(contains(name, "view")){
              return "#21460F";
          }
          if(contains(name, "events")){
              return "#284";
          }
          return "#7653C1";
        }

      /**
       * configure colors and a pre-append string
       * @type {Object}
       */
      , classTypes = {
          "model": {
              backgroundColor   : "#DCECEF"
            , foregroundColor   : "#620F09"
            , preAppendedResult : "%c-   model    : "
          },

          "collection": {
              backgroundColor   : "#DCECEF"
            , foregroundColor   : "#426D09"
            , preAppendedResult : "%c-   collectio: "
          },

          "view": {
              backgroundColor   : "#FFFFD7"
            , foregroundColor   : "#21460F"
            , preAppendedResult : "%c-     view   : "
          },

          "router": {
              backgroundColor   : "#FFFDF7"
            , foregroundColor   : "#6700B9"
            , preAppendedResult : "%c- router     : "
          },
          
          "vendor": {
              backgroundColor   : "#eee"
            , foregroundColor   : "#284"
            , preAppendedResult : "%c: "
          },
          
          "": {
              backgroundColor: "#FFFDF7"
            , foregroundColor: "#7653C1"
            , preAppendedResult: "%c-            : "
          }
        }

        /**
         * getPreAppendColor: style for console log method types
         */
      , getPreAppendColor = function(options){
          var configPreColor = classTypes[options.backboneType]
          ;

          if(configPreColor){
            /**
             * Pre-configured console colors
             */
            return {
                preAppendedResult: configPreColor.preAppendedResult
              , colorConfig: "  background: " + configPreColor.backgroundColor +
                  "; color     : " + getForeColorByFunctionName(options.functionName)
            };
          }
          else{
            /**
             * Simple Message: fixed colors
             */
            return {
                preAppendedResult: "%c > "
              , colorConfig : "  background: #FFFDF" +
                  "; color: #555" +
                  "; font-weight: bold" +
                  "; font-style: italic"
            };
          }
          
        }

      , /**
         * text: A text message
         * collapsed: True if the image should be collapsed
         */
        logGroup = function(options)
        {
            var argsStringified = JSON.stringify(options.arguments, null, 2);

            if(options.functionName.indexOf("Events.on") > 0){
              return console.log(options.text1, options.format1, options.arguments[0]);
            }
            if(options.functionName.indexOf("Events.trigger") > 0){
              return console.log(options.text1, options.format1, options.arguments[0]);
            }

            console.groupCollapsed(options.text1, options.format1);
            console.log(argsStringified);
            console.dir(options.arguments);
            console.groupEnd();
        }
    ;

    objPreAppendColor = getPreAppendColor({
        backboneType : backLogObj.backboneType,
        functionName : backLogObj.functionName
    });
    
    startString = objPreAppendColor.preAppendedResult + getName({
      name      : backLogObj.functionName,
      nameSize  : 12,
      methodSize: 17
    });

    // get arguments
    if(backLogObj.arguments){
      argPassed = slice.call(backLogObj.arguments, 0);
    }

    if(_.isString(backLogObj)){
      console.log(    startString + backLogObj
                    , objPreAppendColor.colorConfig
                  );
    }else{
      logGroup({
        functionName: backLogObj.functionName,
        text1: startString,
        format1: objPreAppendColor.colorConfig,
        arguments: argPassed
      });
    }

    // if is fast enougth, the timeout is canceled
    clearTimeout(globalTimeoutLogId);
    globalTimeoutLogId = setTimeout(function(){
      // if is not canceled, shows line bellow
      console.log("----------------------------------pause--------------------------");
    }, 100);
    
  }

  window.__LOG = __LOG;
})(window);

