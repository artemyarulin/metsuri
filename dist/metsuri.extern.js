/*
 * Following file is intended to use with closure-compiler, but it could be used to make your editor autocomple 
 * better as well.
 */

/** 
 * @constructor 
 * @param {string} minSeverity Minimum siverty. One of the following: trace,debug,warn,error 
 * @param {Array.<Object> =} transports Array of transports that would be used for log processing. Default is ConsoleTransport
 */
var Metsuri = function(minSeverity,transports){}

/**
 * Add context keys to each log enty
 * @param  {Object} opContext Object to merge with log entry context
 */
Metsuri.prototype.op = function(opContext){}

/**
 * Trace log entry
 * @param  {string} sender Sender of log entry
 * @param  {string} action Description of what heppend to sender
 * @param  {Object} object Log entry context
 */
Metsuri.prototype.trace = function(sender,action,object){}

/**
 * Debug log entry
 * @param  {string} sender Sender of log entry
 * @param  {string} action Description of what heppend to sender
 * @param  {Object} object Log entry context
 */
Metsuri.prototype.debug = function(sender,action,object){}

/**
 * Warn log entry
 * @param  {string} sender Sender of log entry
 * @param  {string} action Description of what heppend to sender
 * @param  {Object} object Log entry context
 */
Metsuri.prototype.warn = function(sender,action,object){}

/**
 * Error log entry
 * @param  {string} sender Sender of log entry
 * @param  {string} action Description of what heppend to sender
 * @param  {Object} object Log entry context
 */
Metsuri.prototype.error = function(sender,action,object){}

Metsuri.Transports = {}
/**
 * Will output everything to console
 * @constructor
 * @param {function(string): string =} preProcessFunction Optional function which can change string before the output to console 
 */
Metsuri.Transports.ConsoleTransport = function(preProcessFunction){}

/**
 * Will send data using POST request to the specified url
 * @constructor
 * @param {string} url Destination url
 * @param {function(Object): Object =} preProcessFunction Optional function which can change object context before sending to the server 
 */
Metsuri.Transports.ServerSendTransport = function(url,preProcessFunction){}

/**
 * Will send data to the ElasticSearch server
 * @constructor
 * @param {string} host [http://localhost:9200]	Hostname (with port) to your ElasticSearch server
 * @param {string} indexName [metsuri] Index name to be used for sending     
 * @param {string} type [logs] Type to be used for sending
 * @param {function(Object): Object =} preProcessFunction Optional function which can change object context before sending to the server 
 */
Metsuri.Transports.ElasticsearchTransport = function(host, indexName, type, preProcessFunction){}