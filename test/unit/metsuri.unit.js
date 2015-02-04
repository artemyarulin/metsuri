describe('metsuri', () => {
  it('should work', () => {
    let expected = {
      sev: 'debug',
      sender: 'Metsuri',
      action: 'logs',
      context: {
        Hello: 'world'
      }
    }

    var log = new Metsuri('trace', [(sev, sender, action, context, fullString) => {
      assert.deepEqual(expected, {
        sev,
        sender,
        action,
        context
      }, 'There should be right values')
    }])

    log[expected.sev](expected.sender,
      expected.action,
      expected.context)
  })

  it('should support operations', () => {
    let log = new Metsuri('trace', [(sev, sender, action, context, fullString) => {
      assert.equal(context.hello, 'world', 'There should be right context')
    }])

    log.op({
      hello: 'world'
    })
    log.debug('Test', 'operation')
  })

  it('should work with ElasticsearchTransport',(done) => {
    let log = new Metsuri('trace',[new Metsuri.Transports.ElasticsearchTransport('http://192.168.59.103:9200','metsuri','logs', (ctx) => {
      assert.equal(ctx.sender,'App')
      assert.equal(ctx.action,'started')
      assert.equal(ctx.test,true)
      assert.equal(ctx.acc,22)
      assert.equal(ctx.server,'db-3')
      done()
      return ctx
    })])

    log.op({test:true})
    log.warn('App','started',{acc:22,server:'db-3'})
  })
})
