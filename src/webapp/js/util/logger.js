define(['util/class'], function(Class) {
  var Logger = Class.extend ({

    level : 1,

    logFunction : console.log || new function() {},

    className : null,

    init : function(className, level) {
      this.className = className;
      if (level !== undefined) {
        this.level = level;
      }
    },

    setLevel : function(level) {
      this.level = level;
    },

    debug : function() {
      if (this.level <= Logger.Levels.DEBUG) {
        [].unshift.apply(arguments,['%c[DEBUG]', 'background:#964141;color:#FFF', Logger.getDate(), '-']);
        this.logFunction.apply(window.console, arguments);
      }
    },

    info : function() {
      if (this.level <= Logger.Levels.INFO) {
        [].unshift.apply(arguments,['%c[INFO ]', 'background:#157D11;color:#FFF', Logger.getDate(), '-']);
        this.logFunction.apply(window.console, arguments);
      }
    },

    warn : function() {
      if (this.level <= Logger.Levels.WARN) {
        [].unshift.apply(arguments,['%c[WARN ]', 'background:#FF6600;color:#FFF', Logger.getDate(), '-']);
        this.logFunction.apply(window.console, arguments);
      }
    },

    error : function() {
      if (this.level <= Logger.Levels.ERROR) {
        [].unshift.apply(arguments,['%c[ERROR]', 'background:#FF2B2B;color:#FFF', Logger.getDate(), '-']);
        this.logFunction.apply(window.console, arguments);
      }
    },

    fatal : function() {
      if (this.level <= Logger.Levels.FATAL) {
        [].unshift.apply(arguments,['[FATAL]', Logger.getDate(), '-']);
        this.logFunction.apply(window.console, arguments);
      }
    }
  });
  Logger.Levels = {
    NONE	: 0,
    DEBUG 	: 1,
    INFO 	: 2,
    WARN 	: 3,
    ERROR 	: 4,
    FATAL 	: 5
  };
  Logger.loggers = { '_rootLogger' : new Logger(null, Logger.Levels.DEBUG) };
  Logger.getLogger = function(className, level) {
    var logger = null;
    if (!className) {
      return Logger.loggers['_rootLogger'];
    }
    if(Logger.loggers[className]) {
      logger = Logger.loggers[className];
      if (level !== undefined) {
        logger.setLevel(level);
      }
    } else {
      logger = new Logger(className, level);
      Logger.loggers[className] = logger;
    }
    return logger;
  };
  Logger.getDate = function() {
    var	 now = new Date();
    var h = now.getHours();
    if (h < 10) h = "0" + h;
    var m = now.getMinutes();
    if (m < 10) m = "0" + m;
    var s = now.getSeconds();
    if (s < 10) s = "0" + s;
    var t = now.getMilliseconds();
    t = (t < 10) ? "00" + t : (t < 100) ? "0" + t : t;
    return h + ':' + m + ':' + s + '.' + t;
  }

  return Logger;
});