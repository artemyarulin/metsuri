var Metsuri = function (minSeverity,transports) { // jshint ignore:line
    let _severities = {
            'trace':1,
            'debug':2,
            'warn' :3,
            'error':4
    	},
    	_minSev = _severities[minSeverity],
    	_defTransport = (p1,p2,p3,p4,fullString) => console.log(fullString),
    	_curContext = {},
    	_transports = transports instanceof Array ? transports : [_defTransport] 
    
    if (!_minSev)
        throw new Error(`${_minSev} - is not recognized severity level`)

    var _sendLog = (sev,sender,action,context) => {
        if (_severities[sev] < _minSev)
            return

		context = context || {}
		
        _mergeObjects({sev,sender,action},context)
        _mergeObjects(_curContext,context)

        let fullString = `[${new Date().toISOString()}] ${sev} : ${sender} ${action} | ${JSON.stringify(context)}`
        _transports.forEach(tr => tr(sev,sender,action,context,fullString))
    }

    this.op = opContext => _mergeObjects(opContext,_curContext)
    this.stopOp = () => Array.prototype.slice.call(arguments).forEach(key => delete _curContext[key])

    var _mergeObjects = (o1,o2) => o1 && o2 && Object.keys(o1).forEach(key => o2[key] = o1[key])
    Object.keys(_severities).forEach(sev => this[sev] = _sendLog.bind(this,sev))
}