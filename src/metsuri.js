var Metsuri = function (minSeverity,transports) { // jshint ignore:line
    let _severities = {
            'trace':1,
            'debug':2,
            'warn' :3,
            'error':4
    	},
    	_minSev = _severities[minSeverity],
    	_defTransport = new Metsuri.Transports.ConsoleTransport(),
    	_curContext = {},
    	_transports = transports instanceof Array ? transports : [_defTransport]
       
    this.op = opContext => _mergeObjects(opContext,_curContext)
    this.stopOp = () => Array.prototype.slice.call(arguments).forEach(key => delete _curContext[key])

    var _mergeObjects = (o1,o2) => o1 && o2 && Object.keys(o1).forEach(key => o2[key] = o1[key])
    var _sendLog = (sev,sender,action,context) => {
        if (_severities[sev] < _minSev)
            return

		context = context || {}
		let date = new Date().toISOString()
		
        _mergeObjects({sev,sender,action,date},context)
        _mergeObjects(_curContext,context)

        let fullString = `[${date}] ${sev} : ${sender} ${action} | ${JSON.stringify(context)}`
        _transports.forEach(tr => tr(sev,sender,action,context,fullString))
    }
    
    if (!_minSev)
        throw new Error(`${_minSev} - is not recognized severity level`)
    Object.keys(_severities).forEach(sev => this[sev] = _sendLog.bind(this,sev))
}