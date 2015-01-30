# metsuri
JavaScript logger which works not with string, but with objects. It makes super easy and effective to filter and find information latter on.

It is super easy to put a string in your log, but then it is very difficult to grep through the log file looking for a specific part of information. We can solve this issue if we put a structured information in our logs - metsuri tries to make it easier.

# Walkthrough
First create an instance of metsuri. Feel free to expose it as a global object. You can specify miminum log severity level that you would like to process:
``` javascript
var log = new Metsuri(minSeverity='debug')
```
Start new operation - following keys would be added to all of the log entries:
``` javascript
log.op({userId:'JohnSmith',accountId:curAccount}) 
```
There are 4 actual logging methods: `error`,`warn`,`debug` and `verbose`. Each of them accept the same set of parameters:
- sender {string} - who sends the log. In most cases it is a class or function name
- action {string} - what exactly has heppend, usually one word is more than enough
- context {object} - any additional keys that you would like to include to your log entry

By default log entry output would have sender, message or error messsage, then | as a separator and then JSON string which would contain the whole entry:
``` javascript
log.debug('Account','changed',{before:_prevState,after:_cutState})
> [TIMESTAMP] Account changed | {before:17,after:23,userId:'JohnSmith',accountId:23,sender:'Account',action:'changed',}
```

You can pass error as a second parameter as well:
``` javascript
log.warn('Cache',new Error('No space available'),{cacheState:cState})
> [TIMESTAMP] Cache No space available | {cacheState:-1,userId:'JohnSmith',accountId:23,sender:'Cache',err:'Cache is broken',trace:"Error: Cache is broken\nat <anonymous>:2:4..."}
```
You can start as many operation as you want, it can be nested as well:
``` javascript
log.op({'correlationId':Math.random())
log.trace('Test','started') 
> [TIMESTAMP] Test started | {userId:'JohnSmith',accountId:curAccount,correlationId:0.8854716555215418,sender:'Test',action:'started'}
```

Whenever you start operation which is already running - it will rewrite an existed value. It is very convenient - no need to bother about closing operation:
``` javascript
log.op({'correlationId':Math.random())
log.trace('Test','started') 
> [TIMESTAMP] Test started | {userId:'JohnSmith',accountId:curAccount,correlationId:0.8237492183742932,sender:'Test',action:'started'}
```

But you can always close the operation manually. Just pass the strings of keys you would like to stop adding:
``` javascript
log.stopOp('correlationId','userId','accountId')
log.trace('End')
> [TIMESTAMP] End
```
Notice that metsuri puts sender and action as a last parameters in JSON output: it always put your context data first, then goes operation keys and only after that sender and action keys. It makes it simple to read log output as a simple text

# Storage
Put in a elasticsearch manually or configure the realtime processing with logstash, run kibana and enjoy the pleasure of **real time structered log data**:
![kibana](http://bezha.od.ua/wp-content/uploads/2012/04/Kibana.png)

# Caveat
- You should carefully select the keys for your log structures: if you decided to use `userId' - stick with it everywhere in your application or try to utilize it using operation
- Don't create too many operation keys - it makes your log very verbose. The point of operation is to group log entries together and save you some time from typing
- Last but not least - the project is not yet implemented ![doh](http://rafinhaea7arte.files.wordpress.com/2010/04/homer-doh.gif)

