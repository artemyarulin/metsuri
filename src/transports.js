Metsuri.Transports = (function () { //jshint ignore:line
    let nop = (input) => input
    
    var SendQueue = function (url) {
        let _sendQueue = [],
            _isSending = false,
            _url = url

        this.sendMessage = msg => {
            _sendQueue.push(msg)
            _sendNextMessage()
        }

        var _sendNextMessage = function () {
            if (!_sendQueue.length || _isSending)
                return

            _isSending = true

            let msg = _sendQueue.shift(),
                req = new XMLHttpRequest()

            req.open('POST', _url, true)
            req.setRequestHeader('Content-Type', 'text/plain')
            req.onreadystatechange = () => {
                if (req.readyState === 4) {
                    _isSending = false
                    setTimeout(_sendNextMessage, 0)
                }
            }
            req.send(msg)
        }
    }
    
    var ConsoleTransport = function (preProcessFunction = nop) {
        return (sev, sender, action, context, fullString) => {
            console.log(preProcessFunction(fullString))
        }
    }
    
    var ServerSendTransport = function (url, preProcessFunction = nop) {
        let _queue = new SendQueue(url)
        return (sev, sender, action, context, fullString) => {
            _queue.sendMessage(preProcessFunction(context))
        }
    }
  
    var ElasticsearchTransport = function (host = 'localhost', indexName = 'metsuri', type = 'logs', preProcessFunction = nop) {
        let _queue = new SendQueue(`${host}/${indexName}/${type}`)
        return (sev, sender, action, context, fullString) => {
            _queue.sendMessage(preProcessFunction(context))
        }
    }

    return {
        ConsoleTransport, ServerSendTransport, ElasticsearchTransport
    }
})()
