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
      _defTransport = new Metsuri.Transports.ConsoleTransport(),
      _curContext = {},
      _transports = transports instanceof Array ? transports : [_defTransport];
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
  var _sendLog = (function(sev, sender, action, context) {
    if (_severities[sev] < _minSev)
      return ;
    context = context || {};
    var date = new Date().toISOString();
    _mergeObjects({
      sev: sev,
      sender: sender,
      action: action,
      date: date
    }, context);
    _mergeObjects(_curContext, context);
    var fullString = ("[" + date + "] " + sev + " : " + sender + " " + action + " | " + JSON.stringify(context));
    _transports.forEach((function(tr) {
      return tr(sev, sender, action, context, fullString);
    }));
  });
  if (!_minSev)
    throw new Error((_minSev + " - is not recognized severity level"));
  Object.keys(_severities).forEach((function(sev) {
    return $__1[sev] = _sendLog.bind($__1, sev);
  }));
};

"use strict";
Metsuri.Transports = (function() {
  var nop = (function(input) {
    return input;
  });
  var SendQueue = function(url) {
    var _sendQueue = [],
        _isSending = false,
        _url = url;
    this.sendMessage = (function(msg) {
      _sendQueue.push(msg);
      _sendNextMessage();
    });
    var _sendNextMessage = function() {
      if (!_sendQueue.length || _isSending)
        return ;
      _isSending = true;
      var msg = _sendQueue.shift(),
          req = new XMLHttpRequest();
      if (typeof msg !== 'string')
        msg = JSON.stringify(msg);
      req.open('POST', _url, true);
      req.setRequestHeader('Content-Type', 'text/plain');
      req.onreadystatechange = (function() {
        if (req.readyState === 4) {
          _isSending = false;
          setTimeout(_sendNextMessage, 0);
        }
      });
      req.send(msg);
    };
  };
  var ConsoleTransport = function() {
    var preProcessFunction = arguments[0] !== (void 0) ? arguments[0] : nop;
    return (function(sev, sender, action, context, fullString) {
      console.log(preProcessFunction(fullString));
    });
  };
  var ServerSendTransport = function(url) {
    var preProcessFunction = arguments[1] !== (void 0) ? arguments[1] : nop;
    var _queue = new SendQueue(url);
    return (function(sev, sender, action, context, fullString) {
      _queue.sendMessage(preProcessFunction(context));
    });
  };
  var ElasticsearchTransport = function() {
    var host = arguments[0] !== (void 0) ? arguments[0] : 'localhost';
    var indexName = arguments[1] !== (void 0) ? arguments[1] : 'metsuri';
    var type = arguments[2] !== (void 0) ? arguments[2] : 'logs';
    var preProcessFunction = arguments[3] !== (void 0) ? arguments[3] : nop;
    var _queue = new SendQueue((host + "/" + indexName + "/" + type));
    return (function(sev, sender, action, context, fullString) {
      _queue.sendMessage(preProcessFunction(context));
    });
  };
  return {
    ConsoleTransport: ConsoleTransport,
    ServerSendTransport: ServerSendTransport,
    ElasticsearchTransport: ElasticsearchTransport
  };
})();
