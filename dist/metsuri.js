"use strict";
var Metsuri = function(minSeverity, transports) {
  var $__0 = arguments,
      $__1 = this;
  var _severities = {
    'trace': 1,
    'debug': 2,
    'warn': 3,
    'error': 4
  },
      _minSev = _severities[minSeverity],
      _defTransport = (function(p1, p2, p3, p4, fullString) {
        return console.log(fullString);
      }),
      _curContext = {},
      _transports = transports instanceof Array ? transports : [_defTransport];
  if (!_minSev)
    throw new Error((_minSev + " - is not recognized severity level"));
  var _sendLog = (function(sev, sender, action, context) {
    if (_severities[sev] < _minSev)
      return ;
    context = context || {};
    _mergeObjects({
      sev: sev,
      sender: sender,
      action: action
    }, context);
    _mergeObjects(_curContext, context);
    var fullString = ("[" + new Date().toISOString() + "] " + sev + " : " + sender + " " + action + " | " + JSON.stringify(context));
    _transports.forEach((function(tr) {
      return tr(sev, sender, action, context, fullString);
    }));
  });
  this.op = (function(opContext) {
    return _mergeObjects(opContext, _curContext);
  });
  this.stopOp = (function() {
    return Array.prototype.slice.call($__0).forEach((function(key) {
      return delete _curContext[key];
    }));
  });
  var _mergeObjects = (function(o1, o2) {
    return o1 && o2 && Object.keys(o1).forEach((function(key) {
      return o2[key] = o1[key];
    }));
  });
  Object.keys(_severities).forEach((function(sev) {
    return $__1[sev] = _sendLog.bind($__1, sev);
  }));
};
