/*
 * Following file is intended to use with closure-compiler, but it could be used to make your editor autocomple 
 * better as well.
 */

/** 
 * @constructor 
 * @param {string} minSeverity Minimum siverty. One of the following: trace,debug,warn,error 
 */
var Metsuri = function(minSeverity){}

/**
 * Add context keys to each log enty
 * @param  {Object} opContext Object to merge with log entry context
 */
Metsuri.prototype.op = function(opContext)

/**
 * Trace log entry
 * @param  {string} sender Sender of log entry
 * @param  {string} action Description of what heppend to sender
 * @param  {Object} object Log entry context
 */
Metsuri.prototype.trace = function(sender,action,object)

/**
 * Debug log entry
 * @param  {string} sender Sender of log entry
 * @param  {string} action Description of what heppend to sender
 * @param  {Object} object Log entry context
 */
Metsuri.prototype.degug = function(sender,action,object)

/**
 * Warn log entry
 * @param  {string} sender Sender of log entry
 * @param  {string} action Description of what heppend to sender
 * @param  {Object} object Log entry context
 */
Metsuri.prototype.warn = function(sender,action,object)

/**
 * Error log entry
 * @param  {string} sender Sender of log entry
 * @param  {string} action Description of what heppend to sender
 * @param  {Object} object Log entry context
 */
Metsuri.prototype.error = function(sender,action,object)