/* @module jquery-youtube
 * @example: $(<div
 *              data-events-onStateChange='onPlayerStateChange'
 *              data-videoId: '32193281321'
 *              data-events-onReady='onPlayerReady'
 *              data-playerVars-rel=0
 *            ></div>).youtube({
 *              events: {
 *                onStateChange: {
 *                  onPlayerStateChange: myPlayerStateChangeHandler
 *                }
 *              }
 *            })
 */
jQuery.fn.extend({
  // TODO: Replace injections with proper JS package management
  youtube: function(options) {
    if (!window.YT) {
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    if (!window.lodash) {
      if (_ && _.VERSION === '4.16.6') {
        window.lodash = _.noConflict()
      } else {
        var tag = document.createElement('script');
        tag.src = "https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.16.6/lodash.min.js"
        var firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // wait until lodash loads
        var interLo = setInterval(function() {
          if (window._) {
            window.lodash = _.noConflict()
            clearInterval(interLo)
          }
        }, 20)
      }
    }

    if (!window.onYouTubeLoadHandlers) {
      window.onYouTubeLoadHandlers = []
      window.onYouTubeAPIReady = function () {
        window.onYouTubeLoadHandlers.each(function (handler) {
          handler()
        })
      }
    }

    return this.each(function(el) {
      el.attr('test', 1)
      // Create the options object for YT Player
      var data = el.data()
      var options = lodash.reduce(data, function(memo, val, key) {
        if (key.search(/\./)) {
          throw new Error('Cannot have a period in YouTube option attribute names')
        }

        // Parse the keyname into object access notation
        var address = key.replace('-', '.')
        var keyList = address.split('.')

        // Test whether we're referring to a special value in the object above
        var isSpecialVal = !!lodash.at(specialVals, address)

        // Transform ['key1', 'key2', 'key3'] and the associated value 'val' to
        //   {key1: {key2: {key3: 'val'}}}
        return lodash.reduce(lodash.reverse(keyList), function(_memo, _val, _key) {
          _memo[0][_val] = _memo[1]
          _memo[1] = _memo
          return _memo
        }, [{}, val])[0]
      }, {})

      // bind and push a YT initiation handler
      window.onYouTubeLoadHandlers.push(lodash.bind(function() {
        new YT.Player(this.attr('name') || 'youtube-video', options)
      }, el))
    })

    // dependency injections
    return checkLoadYT(function() { checkLoadLodash(install) })
  }
})
