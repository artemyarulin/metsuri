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
})
