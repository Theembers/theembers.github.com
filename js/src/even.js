(function(window) {
  'use strict'

  function Even(config) {
    this.config = config
  }

  Even.prototype.setup = function() {
    var theme = this.config
    var leancloud = theme.leancloud

    this.scrollTopBar()
    this.navbar()
    if (theme.toc) {
      this.scrollToc()
      this.tocFollow()
      this.navbarToc()
    }
    if (theme.fancybox) {
      this.fancybox()
    }
    if (leancloud.app_id && leancloud.app_key) {
      this.recordReadings()
      this.statistics()
    }
    if (theme.pjax) {
      this.pjax()
    }
    this.backToTop()
    this.thanksFor()
    this.darkStyle()
    this.routeTo()
  }

  Even.prototype.routeTo = function() {
    var uri = location.hostname
    if (uri === 'theembers.github.io' || uri === 'localhost') {
      var COOKIE_KEY = 'route_to'

      if ($.cookie(COOKIE_KEY)) {
        return
      }
      $.cookie(COOKIE_KEY, true, {
        path: '/'
      })
      $.growl.warning({
        title: '加速建议',
        message:
          "国内请访问「gitee」以保证网站流畅加载体验：<a href='https://theembers.gitee.io'>theembers.gitee.io</a>",
        size: 'medium',
        duration: 10000
      })
    }
  }
  /**
   * dark theme style
   */
  Even.prototype.darkStyle = function() {
    var COOKIE_KEY = 'dark_style'
    var $body = $('body')
    var isDark = $.cookie(COOKIE_KEY)
    // if (isDark == undefined  || isDark) {
    if (isDark) {
      $body.addClass('dark')
      $('#md_2').attr('checked', true)
    } else {
      $body.removeClass('dark')
    }

    $('#md_2').click(function() {
      if ($(this).prop('checked')) {
        $body.addClass('dark')
        $.cookie(COOKIE_KEY, true, {
          path: '/',
          expires: 30
        })
      } else {
        $body.removeClass('dark')
        $.removeCookie(COOKIE_KEY, { path: '/' })
      }
    })
  }
  /**
   * 移动端菜单
   */
  Even.prototype.navbar = function() {
    var $nav = $('#mobile-navbar')
    var $navIcon = $('.mobile-navbar-icon')

    var slideout = new Slideout({
      panel: document.getElementById('mobile-panel'),
      menu: document.getElementById('mobile-menu'),
      padding: 180,
      tolerance: 70
    })
    slideout.disableTouch()

    $navIcon.click(function() {
      slideout.toggle()
    })

    slideout.on('beforeopen', function() {
      $nav.addClass('fixed-open')
      $navIcon.addClass('icon-click').removeClass('icon-out')
    })

    slideout.on('beforeclose', function() {
      $nav.removeClass('fixed-open')
      $navIcon.addClass('icon-out').removeClass('icon-click')
    })

    $('#mobile-panel').on('touchend', function() {
      slideout.isOpen() && $navIcon.click()
    })
  }

  Even.prototype.navbarToc = function() {
    var $nav = $('#mobile-navbar')
    var $tocIcon = $('.mobile-post-toc-icon')
    var postToc = $('#post-toc')
    var slideout = new Slideout({
      panel: document.getElementById('mobile-panel'),
      menu: document.getElementById('mobile-toc'),
      side: 'right',
      padding: 180,
      tolerance: 70
    })
    slideout.disableTouch()

    $tocIcon.click(function() {
      slideout.toggle()
      $('#mobile-toc').append(postToc)
    })

    slideout.on('beforeopen', function() {
      $nav.addClass('fixed-open-left')
    })

    slideout.on('beforeclose', function() {
      $nav.removeClass('fixed-open-left')
    })

    $('#mobile-panel').on('touchend', function() {
      slideout.isOpen() && $tocIcon.click()
    })
  }

  Even.prototype.scrollTopBar = function() {
    var topBar = $('#topbar')
    var headerTop = $('#header').outerHeight()
    var scrollTop = $(window).scrollTop()
    addOrRemove(headerTop, scrollTop)
    $(window).scroll(function() {
      scrollTop = $(window).scrollTop()
      addOrRemove(headerTop, scrollTop)
    })

    function addOrRemove(headerTop, scrollTop) {
      if (headerTop > scrollTop) {
        topBar.addClass('hidden')
      } else {
        topBar.removeClass('hidden')
      }
    }
  }

  /**
   * 目录悬浮
   */
  Even.prototype.scrollToc = function() {
    var SPACING = 85
    var $toc = $('.post-toc')
    var $footer = $('.footer')

    if ($toc.length) {
      console.log($toc.offset().top, $toc.height())
      var minScrollTop = $toc.offset().top - SPACING
      var maxScrollTop = $footer.offset().top - $toc.height() - SPACING
      console.log(minScrollTop, maxScrollTop)
      var tocState = {
        start: {
          position: 'absolute',
          top: minScrollTop
        },
        process: {
          position: 'fixed',
          top: SPACING
        },
        end: {
          position: 'absolute',
          top: maxScrollTop
        }
      }

      $(window).scroll(function() {
        var scrollTop = $(window).scrollTop()

        if (scrollTop < minScrollTop) {
          $toc.css(tocState.start)
        } else if (scrollTop > maxScrollTop) {
          $toc.css(tocState.end)
        } else {
          $toc.css(tocState.process)
        }
      })
    }
  }
  /**
   * 目录跟随
   */
  Even.prototype.tocFollow = function() {
    var HEADERFIX = 30

    var $toclink = $('.toc-link'),
      $headerlink = $('.headerlink')

    var headerlinkTop = $.map($headerlink, function(link) {
      return $(link).offset().top
    })

    $(window).scroll(function() {
      var scrollTop = $(window).scrollTop()
      for (var i = 0; i < $toclink.length; i++) {
        var isLastOne = i + 1 === $toclink.length,
          currentTop = headerlinkTop[i] - HEADERFIX,
          nextTop = isLastOne ? Infinity : headerlinkTop[i + 1] - HEADERFIX
        if (currentTop < scrollTop && scrollTop <= nextTop) {
          $($toclink[i]).addClass('active')
        } else {
          $($toclink[i]).removeClass('active')
        }
      }
    })
  }
  /**
   * fancybox
   */
  Even.prototype.fancybox = function() {
    if ($.fancybox) {
      $('.post').each(function() {
        $(this)
          .find('img')
          .each(function() {
            var href = 'href="' + this.src + '"'
            var title = 'title="' + this.alt + '"'
            $(this).wrap('<a class="fancybox" ' + href + ' ' + title + '></a>')
          })
      })

      $('.fancybox').fancybox({
        openEffect: 'elastic',
        closeEffect: 'elastic'
      })
    }
  }

  Even.prototype.recordReadings = function() {
    if (typeof AV !== 'object') return

    var $visits = $('.visits')
    var Counter = AV.Object.extend('Counter')
    if ($visits.length === 1) {
      addCounter(Counter)
    } else {
      showTime(Counter)
    }

    function updateVisits(dom, time) {
      var readText = dom.text().replace(/(\d+)/i, time)
      dom.text(readText)
    }

    function addCounter(Counter) {
      var query = new AV.Query(Counter)

      var url = $visits.data('url').trim()
      var title = $visits.data('title').trim()

      query.equalTo('url', url)
      query.find().then(
        function(results) {
          if (results.length > 0) {
            var counter = results[0]
            counter
              .save(null, {
                fetchWhenSave: true
              })
              .then(function(counter) {
                counter.increment('time', 1)
                return counter.save()
              })
              .then(function(counter) {
                updateVisits($visits, counter.get('time'))
              })
          } else {
            var newcounter = new Counter()
            newcounter.set('title', title)
            newcounter.set('url', url)
            newcounter.set('time', 1)

            newcounter.save().then(function() {
              updateVisits($visits, newcounter.get('time'))
            })
          }
        },
        function(error) {
          // eslint-disable-next-line
          console.log('Error:' + error.code + ' ' + error.message)
        }
      )
    }

    function showTime(Counter) {
      $visits.each(function() {
        var $this = $(this)
        var query = new AV.Query(Counter)
        var url = $this.data('url').trim()

        query.equalTo('url', url)
        query.find().then(
          function(results) {
            if (results.length === 0) {
              updateVisits($this, 0)
            } else {
              var counter = results[0]
              updateVisits($this, counter.get('time'))
            }
          },
          function(error) {
            // eslint-disable-next-line
            console.log('Error:' + error.code + ' ' + error.message)
          }
        )
      })
    }
  }

  Even.prototype.statistics = function() {
    var options = {
      useEasing: true,
      useGrouping: true,
      separator: ',',
      decimal: '.'
    }

    var Counter = AV.Object.extend('Counter')
    // 统计
    var query = new AV.Query(Counter)
    var $total = 0
    query.select(['time'])
    query.find().then(
      function(results) {
        if (results.length > 0) {
          for (var i = 0; i < results.length; i++) {
            $total += results[i].attributes.time
          }
        }
        var countUp = new CountUp('total', 0, $total, 0, 2.5, options)
        if (!countUp.error) {
          countUp.start()
          $('.total').text($total)
        } else {
          $('.total').text($total)
          $('#total').text($total)
        }
      },
      function(error) {
        // console.error(error)
        $('#total').text($total)
        $('.total').text($total)
      }
    )
  }

  Even.prototype.pjax = function() {
    if (location.hostname === 'localhost' || this.hasPjax) return
    this.hasPjax = true

    var that = this
    $(document).pjax('a', 'body', { fragment: 'body' })
    $(document).on('pjax:send', function() {
      NProgress.start()
      $('body').addClass('hide-top')
    })
    $(document).on('pjax:complete', function() {
      NProgress.done()
      $('body').removeClass('hide-top')
      that.setup()
    })
  }
  /**
   * 回到顶部
   */
  Even.prototype.backToTop = function() {
    var $backToTop = $('#back-to-top')

    $(window).scroll(function() {
      if ($(window).scrollTop() > 100) {
        $backToTop.fadeIn(1000)
      } else {
        $backToTop.fadeOut(1000)
      }
    })

    $backToTop.click(function() {
      $('body,html').animate({ scrollTop: 0 })
    })
  }

  Even.prototype.thanksFor = function() {
    if (window.isThanksFor && window.isThanksFor === true) {
      return
    }
    var css = 'font-size:1.5em;color:#4267b2'
    var content =
      '==++++++++++++++++++++++++++++++++==\n==+ powered by Hexo - Theme even +==\n==++++++++++++++++++++++++++++++++=='
    console.log('%c' + content, css)
    window.isThanksFor = true
  }

  var config = window.config
  var even = new Even(config)
  even.setup()
})(window)
