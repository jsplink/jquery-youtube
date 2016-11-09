describe('jquery-youtube', function() {
  var sandbox = sinon.sandbox.create()
  var server = sinon.fakeServer.create()

  beforeEach(function (done) {
    sandbox.$el = $('#test1')
    sandbox.onReady = sinon.spy()
    sandbox.onPlayerStateChange = sinon.spy()
    sandbox.$el.youtube({
      height: '390',
      width: '640',
      videoId: 'M7lc1UVf-VE',
      events: {
        'onReady': sandbox.onReady,
        'onStateChange': sandbox.onPlayerStateChange
      }
    })

    setTimeout(done, 200)
  })

  afterEach(function () {
    sandbox.restore()
    server.restore()
  })

  it('should load the test div', function () {
    expect($('#test1').get(0)).to.not.be.undefined
  })

  it('should load the iframe', function () {
    expect($('#test1 iframe').get(0)).to.not.be.undefined
  })
})
