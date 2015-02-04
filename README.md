# metsuri - Object Oriented Logger
JavaScript logger which works not with string, but with objects. It makes super easy and effective to filter and find information latter on.

It is super easy to put a string in your log, but then it is very difficult to analyse log file looking for a specific part of information or patterns. We can solve this issue if we put a structured information in our logs - metsuri tries to make it easier.

Apart from JS library we have pre-build Dockerfile with super fast and powerful backend storage (elasticsearch) for your logs and cool UI (kibana) which can make log analysis extra convenient.

# Walkthrough
First create an instance of metsuri. Feel free to expose it as a global object. You have to specify miminum log severity level that you would like to process:
``` javascript
var log = new Metsuri('debug')
```
Start new operation - following keys would be added to all of the log entries:
``` javascript
log.op({userId:'JohnSmith',accountId:curAccount}) 
```
There are 4 actual logging methods: `error`,`warn`,`debug` and `verbose`. Each of them accept the same set of parameters:
- sender {string} - who sends the log. In most cases it is a class or function name
- action {string} - what exactly has heppend, usually one word is more than enough
- context {object} - any additional keys that you would like to include to your log entry

By default `ConsoleTransport` is used and it will render something like this:
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

# Transports
By default `ConsoleTransport` is used. But you can set second parameter of Metsuri constructor to one of those values:
- `new Metsuri.Transports.ServerSendTransport(url)` -  Would send all log entries using POST to the specified url
- `new Metsuri.Transports.ElasticsearchTransport('http://host:9200', 'metsuri', 'logs'` - Would send all log entries to the specified ElasticSearch server

# Storage
We have a Dockerfile for your convenience, just run:
``` bash
docker pull artemyarulin/metsuri
docker run --name metsuri -p 5601:5601 -p 9200:9200 artemyarulin/metsuri
```
And your would get fully configured platform (elasticsearch and Kibana) for log analysis.
![kibana](http://bezha.od.ua/wp-content/uploads/2012/04/Kibana.png)

# Caveat
- You should carefully select the keys for your log structures: if you decided to use `userId` - stick with it everywhere in your application or try to utilize it using operation
- Don't create too many operation keys - it makes your log very verbose. The point of operation is to group log entries together and save you some time from typing. 
- Good examples of operations: 
	- Any data which is used very often as a filter: `userId`, `serverName`
	- Uniq ID of a long complex operation. For each server request create `{correlationId:Math.random()}`. If something goes wrong - you can show it to the user and then he would use it as a reference for contacting support
- Data is yours - found a place where usOrID is used? Fix the code and then create a simple query for elasticsearch to fix this typo in data as well
