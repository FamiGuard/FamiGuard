jQuery.browser = {};
(function () {
  jQuery.browser.msie = !1;
  jQuery.browser.version = 0;
  if (navigator.userAgent.match(/MSIE ([0-9]+)./)) {
    jQuery.browser.msie = !0;
    jQuery.browser.version = RegExp.$1;
  }
})();
var base = (function () {
  var bgEl = $('#modal-backdrop');
  var modalEl = $('#chooseModal');
  var chooseButton, screenwidth;
  var chooseWrapInit = !1;
  var util = {
    getPathname: function () {
      return window.location.pathname;
    },
    isProductEnv: function () {
      return window.location.hostname === 'www.famiguard.com';
    },
    cmsApiUrl: function () {
      return util.isProductEnv()
        ? 'https://apis.imyfone.com'
        : 'https://apis.ifonelab.net';
    },
    masterApiUrl: function () {
      return util.isProductEnv()
        ? 'https://api.imyfone.com'
        : 'https://api-www.ifonelab.net';
    },
    cmsProdApiUrl: function () {
      return 'https://apis.imyfone.com';
    },
    domainUrl: function () {
      return this.isProductEnv()
        ? 'https://www.famiguard.com/'
        : 'https://famiguard.ifonelab.com/';
    },
    bindWindowsFun: function (windows, arr) {
      for (var i = 0; i < arr.length; i++) {
        windows[arr[i]] = controller[arr[i]];
      }
    },
  };
  var controller = {
    returnHostName: function () {
      var hostname = '';
      if (util.isProductEnv()) {
        hostname = 'https://panel.famiguard.com';
      } else {
        hostname = 'https://cg-panel-famiguard.ifonelab.com';
      }
      return hostname;
    },
    md5Token: {
      sitme: function () {
        return new Date().getTime().toString().slice(0, 10);
      },
      token: function (nowtime) {
        return md5(nowtime + 'NAgwtY8Go36r2yJPQ');
      },
    },
    setCookie: function (key, value) {
      var expires = new Date();
      expires.setTime(expires.getTime() + 30 * 60 * 60 * 24 * 1000);
      document.cookie =
        key +
        '=' +
        value +
        ';path=/;domain=' +
        commonMethods.cookie.getDomain() +
        ';expires=' +
        expires.toUTCString();
    },
    getCookie: function (key) {
      var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
      return keyValue ? keyValue[2] : null;
    },
    debounce: function (func, delay, immediate) {
      var timeout;
      var _this = this;
      var args = arguments;
      return function () {
        if (immediate) {
          if (!timeout) {
            timeout = setTimeout(function () {
              timeout = null;
            }, delay);
            func.apply(_this, args);
          }
        } else {
          clearTimeout(timeout);
          timeout = setTimeout(function () {
            func.apply(_this, args);
          }, delay);
        }
      };
    },
    onMonitorNowClick: function (device_type) {
      if (!commonMethods.is_login) {
        location.href =
          controller.returnHostName() +
          '/sign-up' +
          (device_type ? '?dev_tp=' + device_type : '');
      } else {
        location.href = controller.returnHostName() + '/wizard/my-products';
      }
    },
    showChooseDialog: function (label) {
      if (!chooseWrapInit) {
        $('.choose-wrap').append('<div class="modal-wrap"></div>');
        $('.choose-wrap .modal-wrap').load(
          '/overview/common/public_choose.html',
          function () {
            $('#chooseModal').click(function (e) {
              if (e.target.contains($('.modal-dialog')[0])) {
                controller.toggleChooseDialog(!1);
              }
            });
            $('#chooseModal .m-radio').click(function () {
              $(this).addClass('curr').siblings().removeClass('curr');
              $(this).parents('.section').find('.to-next').addClass('curr');
              $(this)
                .parents('.section')
                .attr('data-next', $(this).attr('data-value'));
              if ($(this).hasClass('need-email')) {
                var type = $(this).attr('data-type');
                $(this).attr('data-value') == '14'
                  ? $('#chooseModal #email_fill_hidden').val(type)
                  : ($('#chooseModal #email_choose_hidden').val(
                      type + ' Monitoring'
                    ),
                    $('#chooseModal')
                      .find('.section-10 .section-title')
                      .text(
                        'The ' + type + ' monitoring software is coming soon'
                      ),
                    $('#chooseModal')
                      .find('.section-10 .pd-desc .product-sys')
                      .html(type),
                    $('#chooseModal')
                      .find('.section-11 .pd-desc span')
                      .text(type));
              }
            });
            $('#chooseModal .to-next').click(function () {
              if (!$(this).hasClass('curr')) {
                return;
              }
              var showElClass =
                '.section-' + $(this).parents('.section').attr('data-next');
              var isPrev = $('#chooseModal')
                .find(showElClass)
                .attr('data-prev');
              var id = $(this).parents('.section').attr('data-id');
              $('#chooseModal .section').addClass('hidden');
              $('#chooseModal').find(showElClass).removeClass('hidden');
              $('#chooseModal input:not([type=hidden])')
                .val('')
                .removeClass('error');
              $('#chooseModal .error-tips').addClass('hidden');
              $('#chooseModal .submitted-info').hide();
              isPrev
                ? $('.prev-step').removeClass('hidden').attr('data-value', id)
                : $('.prev-step').addClass('hidden').attr('data-value', id);
            });
            $('#chooseModal .prev-step').click(function () {
              var showElClass = '.section-' + $(this).attr('data-value');
              $('#chooseModal .section').addClass('hidden');
              $('#chooseModal').find(showElClass).removeClass('hidden');
              $(this).attr('data-value', '00');
              $('#chooseModal').find(showElClass).attr('data-prev') == 'true'
                ? $(this).removeClass('hidden')
                : $(this).addClass('hidden');
            });
            var joinNowUtil = {
              errorText: function (json) {
                var $tips = json.tips,
                  $choose = json.choose;
                if (json.msg) {
                  $tips.removeClass('hidden').text(json.msg);
                  $choose.addClass('error');
                } else {
                  $tips.addClass('hidden');
                  $choose.removeClass('error');
                }
                if (json.submittedInfoHide) {
                  $('#chooseModal .submitted-info').hide();
                }
              },
              justEmail: function (email) {
                var emailReg =
                  /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/;
                return emailReg.test(email);
              },
              saveProductEmailAjax: function (
                json,
                successCallBall,
                errorCallBall
              ) {
                var arrs = json.elArr,
                  email = json.email,
                  productName = json.productName;
                if (!email) {
                  arrs.msg = json.emailNullText;
                  joinNowUtil.errorText(arrs);
                } else if (!joinNowUtil.justEmail(email)) {
                  arrs.msg = 'The email address is not valid.';
                  joinNowUtil.errorText(arrs);
                } else {
                  arrs.msg = !1;
                  joinNowUtil.errorText(arrs);
                  var nowSitme = md5Token.sitme();
                  $.ajax({
                    type: 'POST',
                    dataType: 'json',
                    url: 'https://apis.imyfone.com/saveProductEmail',
                    headers: {
                      token: md5Token.token(nowSitme),
                      stime: nowSitme,
                    },
                    data: {
                      email: email,
                      product_name: productName,
                      site_name: 'famiguard_en',
                      url: location.origin,
                    },
                    success: function (res) {
                      successCallBall(res, arrs);
                    },
                    error: function () {
                      errorCallBall(arrs);
                    },
                  });
                }
              },
            };
            $('#chooseModal .submit.submit-btn-one').click(function () {
              joinNowUtil.saveProductEmailAjax(
                {
                  elArr: {
                    tips: $('#chooseModal .section-10 .error-tips'),
                    choose: $('#email_choose'),
                  },
                  email: $('#email_choose').val().trim(),
                  emailNullText: 'This field is required.',
                  productName: $('#email_choose_hidden').val(),
                },
                function (res, arrs) {
                  if (res.code == 1) {
                    $('#chooseModal .section').addClass('hidden');
                    $('#chooseModal').find('.section-11').removeClass('hidden');
                    $('.prev-step').attr('data-value', '10');
                  } else {
                    arrs.msg = res.msg;
                    joinNowUtil.errorText(arrs);
                  }
                },
                function (arrs) {
                  arrs.msg = 'Unknown error. Please try again.';
                  joinNowUtil.errorText(arrs);
                }
              );
            });
            $('#chooseModal .submit.submit-btn-two').click(function () {
              joinNowUtil.saveProductEmailAjax(
                {
                  elArr: {
                    tips: $('#chooseModal .section-14 .error-tips'),
                    choose: $('#email_fill'),
                    submittedInfoHide: !0,
                  },
                  email: $('#email_fill').val().trim(),
                  emailNullText: 'Please fill in your email address.',
                  productName: $('#email_fill_hidden').val(),
                },
                function (res) {
                  if (res.code == 1) {
                    info('success', 'error', res.msg);
                  } else {
                    info('error', 'success', res.msg, !0);
                  }
                },
                function () {
                  info(
                    'error',
                    'success',
                    'Unknown error. Please try again.',
                    !0
                  );
                }
              );
              function info(add, remove, msg, fill) {
                $('#chooseModal .section-14 .submitted-info')
                  .addClass(add)
                  .removeClass(remove)
                  .html(msg)
                  .show();
                if (fill) {
                  $('#email_fill').addClass('error');
                }
              }
            });
            chooseWrapInit = !0;
            controller.resetChooseModal();
            bgEl.show();
            modalEl.show();
            setTimeout(function () {
              bgEl.css('opacity', '0.5');
              modalEl.css('opacity', '1');
            }, 100);
            controller.clickChooseEvent(0, label);
          }
        );
      } else {
        controller.toggleChooseDialog(!0, 'sidebar');
      }
    },
    toggleChooseDialog: function (show, label) {
      chooseButton = $('.choose-wrap .choose-aside');
      screenwidth = $(window).outerWidth();
      if (show) {
        resetChooseModal();
        bgEl.show();
        modalEl.show();
        setTimeout(function () {
          bgEl.css('opacity', '0.5');
          modalEl.css('opacity', '1');
        }, 100);
        controller.clickChooseEvent(0, label);
      } else {
        bgEl.css('opacity', '0');
        modalEl.css('opacity', '0');
        setTimeout(function () {
          bgEl.hide();
          modalEl.hide();
          if (screenwidth < 992) {
            chooseButton.hide();
          }
        }, 150);
      }
    },
    clickChooseEvent: function (eventName, eventLabel, eventValue) {
      var eventObj = { event: eventName, 'event-label': eventLabel };
      if (eventValue) {
        eventObj['event-value'] = eventValue;
      }
      dataLayer.push(eventObj);
    },
    resetChooseModal: function () {
      var chooseModal = $('#chooseModal');
      chooseModal.find('.prev-step').addClass('hidden');
      chooseModal.find('.section').addClass('hidden');
      chooseModal.find('.section-00').removeClass('hidden');
      chooseModal.find('.m-radio').removeClass('curr');
      chooseModal.find('.to-next').removeClass('curr');
      chooseModal.find('#email_choose').val('').removeClass('error');
      chooseModal.find('.error-tips').addClass('hidden');
    },
    urlReplace: function () {
      var cHost = window.location.host;
      if (cHost !== 'famiguard.ifonelab.com' && cHost !== 'www.famiguard.com') {
        $('a').each(function () {
          var href = $(this).attr('href');
          if (
            href.indexOf('https://panel.famiguard.com/') != -1 ||
            href.indexOf('https://cg-panel-famiguard.ifonelab.com/') != -1
          ) {
            if (href.indexOf('?') != -1) {
              href = href + '&site=' + cHost;
            } else {
              href = href + '?site=' + cHost;
            }
          }
          if (href.indexOf('https://www.famiguard.com') != -1) {
            href = href.replace('https://www.famiguard.com', '');
          }
          $(this).attr('href', href);
        });
      }
    },
    nav: function () {
      var screenWidth = $(window).width();
      if (screenWidth < 768) {
        $('nav .product-icon')
          .unbind('click')
          .click(function () {
            if ($('nav .nav .nav-ul').is(':hidden')) {
              $('nav .product-icon').addClass('curr');
              $('nav .nav .nav-ul').show();
              $('nav .mask-bg').show();
              $('html').css({ 'overflow-y': 'hidden', 'overflow-x': 'hidden' });
            } else {
              $('nav .product-icon').removeClass('curr');
              $('nav .nav .nav-ul').hide();
              $('nav .mask-bg').hide();
              $('html').css({ 'overflow-y': 'auto', 'overflow-x': 'hidden' });
            }
          });
        $('nav .mask-bg')
          .unbind('click')
          .click(function () {
            $('nav .product-icon').removeClass('curr');
            $('nav .nav .nav-ul').hide();
            $('nav .mask-bg').hide();
            $('html').css({ 'overflow-y': 'auto', 'overflow-x': 'hidden' });
          });
      }
    },
  };
  var commonMethods = {
    main: function () {
      this.eventListener();
      this.cookiePolicy();
      this.setIrclickid();
      this.loginStatus();
    },
    createActiveBanner: function (json) {
      var isshow = !0;
      $.each(json.noShowPath, function (i, n) {
        if (location.pathname.indexOf(n) >= 0) {
          isshow = !1;
        }
      });
      isshow &&
        setTimeout(function () {
          $('body').before(
            ' <aside class="base-active-banner"><a href="' +
              json.pcUrl +
              '"><img class="base-phidden pc-active-banner" src="' +
              json.pcImage +
              '" alt="active banner"></a><a href="' +
              json.pcUrl +
              '"><img class="base-phidden pad-active-banner" src="' +
              json.padImage +
              '" alt="active banner"></a><a href="' +
              json.mobileUrl +
              '"><img class="base-mhidden mobile-active-banner" src="' +
              json.mobileImage +
              '" alt="active mobile"></a><p class="banner-close"><img src="' +
              json.closeImage +
              '" alt="close"></p></aside>'
          );
          $('.base-active-banner .banner-close').click(function () {
            $('.base-active-banner').remove();
            commonMethods.cookie.setCookie('active-banner', '1');
          });
        }, 2000);
    },
    eventListener: function () {
      $('.menu_btn,.menu_btn_close').click(function () {
        $('.menu_btn,.menu_btn_close').toggleClass('curr');
        $('.clickMenu_show_nav').toggleClass('show');
      });
      if ($(window).width() <= 991) {
        if ($('.js_no_mobile_header_fixed').length <= 0) {
          $(window).scroll(
            debounce(
              function () {
                console.log;
                if ($(window).scrollTop() >= 200) {
                  $('.mobile_header').addClass('mobile_header_fixed');
                } else {
                  $('.mobile_header').removeClass('mobile_header_fixed');
                }
              },
              50,
              !0
            )
          );
        }
        $('.clickMenu_show_nav .nav > li').on('click', function () {
          if ($(this).find('ul').is(':hidden')) {
            $(this).addClass('curr').siblings('li').removeClass('curr');
            $(this).siblings('li').find('ul').slideUp();
            $(this).find('ul').slideDown();
          } else {
            $(this).removeClass('curr');
            $(this).find('ul').slideUp();
          }
        });
      }
      $('.footer .footer-item2 .title').click(function () {
        if ($(window).width() <= 979) {
          $(this)
            .toggleClass('curr')
            .parents('.col-md-2')
            .siblings('.col-md-2')
            .find('.title')
            .removeClass('curr');
          $(this)
            .next('ul')
            .slideToggle()
            .parents('.col-md-2')
            .siblings('.col-md-2')
            .find('.footer_ul')
            .slideUp();
        }
      });
      $(window).scroll(
        debounce(function () {
          if ($(window).scrollTop() <= 500) {
            $('.totop').attr('style', 'opacity:0;display:none');
          } else {
            $('.totop').attr('style', 'opacity:1;display:inline-block');
          }
        }, 200)
      );
      $('.totop').on('click', function () {
        $('body,html').animate({ scrollTop: 0 }, 1);
        return !1;
      });
      $('.btn_buy_event').mouseenter(function () {
        $(this).children('.price_platform').slideDown();
      });
      $('.btn_buy_event').mouseleave(function () {
        $(this).children('.price_platform').slideUp();
      });
      $('.btn_try_event').mouseenter(function () {
        $(this).children('.try_platform').slideDown();
      });
      $('.btn_try_event').mouseleave(function () {
        $(this).children('.try_platform').slideUp();
      });
      $('.more_event').click(function () {
        if ($(this).children('a').hasClass('curr')) {
          $(this)
            .children('a')
            .children('span')
            .addClass('glyphicon-triangle-bottom')
            .removeClass('glyphicon-triangle-top');
          $(this).children('a').siblings('.more_category').slideUp();
        } else {
          $(this)
            .children('a')
            .children('span')
            .addClass('glyphicon-triangle-top')
            .removeClass('glyphicon-triangle-bottom');
          $(this).children('a').siblings('.more_category').slideDown();
        }
        $(this).children('a').toggleClass('curr');
      });
      $('.search-btn').click(function (event) {
        $('.search_box').show();
        if (!commonMethods.is_login) {
          $('.nav-btn-v2').hide();
        }
        $('.header .clickMenu_show_nav').hide();
        $('.header .nav-btn-v2-login .nav-login-a').hide();
        $(this).hide();
      });
      $('.search_box').click(function (e) {
        e.stopPropagation();
      });
      $('.pchide').bind('click', function () {
        $('.search_box').hide();
        if (!commonMethods.is_login) {
          $('.nav-btn-v2').show();
        }
        $('.header .clickMenu_show_nav').show();
        $('.header .nav-btn-v2-login .nav-login-a').show();
        $('.header .search-btn').show();
      });
      $('.logOut').click(function () {
        var option = new Array();
        option.path = '/';
        option.domain = commonMethods.cookie.getDomain();
        commonMethods.cookie.setCookieOptions('TOKEN', '', option);
        commonMethods.cookie.setCookieOptions('suser_id', '', option);
        commonMethods.cookie.setCookieOptions('suser_login', '', option);
        commonMethods.cookie.setCookieOptions('stype', '', option);
        setCookieForDeviceType('marketingDeviceType', '', -1);
        $('.nav-btn-v2-login').hide();
        $('.nav-btn-v2').show();
        $('.nav-btn-login-text').show();
        function setCookieForDeviceType(key, value, flag) {
          var justIfonelab = /ifonelab.com/;
          var domain = '';
          if (justIfonelab.test(location.hostname)) {
            domain = 'ifonelab.com';
          } else {
            domain = 'imyfone.com';
          }
          var date = new Date();
          date.setTime(date.getTime() + 24 * 60 * 60 * 1000 * flag);
          document.cookie =
            key +
            '=' +
            value +
            ';path=/;domain=' +
            domain +
            ';expires=' +
            date.toGMTString();
        }
      });
      $('.fixed-ad .fixed-ad-close').click(function () {
        commonMethods.cookie.setCookie('closeAd', 1);
        $('.fixed-ad').fadeOut();
        $('.footer_box2').css('padding-bottom', '30px');
      });
      if (commonMethods.cookie.getCookie('closeAd')) {
        $('.fixed-ad').hide();
        $('.footer_box2').css('padding-bottom', '30px');
      }
      $(window).resize(function () {
        if ($(window).width() <= 1024) {
          $('.nav-down').click(function (e) {
            e.stopPropagation();
            if ($(this).children('a').hasClass('curr')) {
              $(this).children('a').siblings('.products-show').hide();
            } else {
              $(this).children('a').siblings('.products-show').show();
            }
            $(this).children('a').toggleClass('curr');
          });
          $(document).on(
            'click',
            ':not(.nav.clickMenu_show_nav>li)',
            function () {
              $('.products-show').hide();
              $('.nav-down>a').removeClass('checked');
              $('.nav-down>a').removeClass('curr');
            }
          );
        }
      });
    },
    cookie: {
      setCookieDomain: function (name, value, days) {
        days || (days = 365);
        var date = new Date();
        date.setTime(date.getTime() + 24 * days * 60 * 60 * 1000),
          (document.cookie =
            name +
            '=' +
            value +
            ';path=/;domain=' +
            document.domain.split('.').slice(-2).join('.') +
            ';expires=' +
            date.toGMTString());
      },
      setCookieOptions: function (name, value, options) {
        options = options || {};
        if (value === null) {
          value = '';
          options.expires = -1;
        }
        var expires = '';
        if (
          options.expires &&
          (typeof options.expires == 'number' || options.expires.toUTCString)
        ) {
          var date;
          if (typeof options.expires == 'number') {
            date = new Date();
            date.setTime(
              date.getTime() + options.expires * 24 * 60 * 60 * 1000
            );
          } else {
            date = options.expires;
          }
          expires = '; expires=' + date.toUTCString();
        }
        var path = options.path ? '; path=' + options.path : '';
        var domain = options.domain
          ? '; domain=' + options.domain
          : this.getDomain();
        var secure = options.secure ? '; secure' : '';
        document.cookie = [
          name,
          '=',
          encodeURIComponent(value),
          expires,
          path,
          domain,
          secure,
        ].join('');
      },
      setCookie: function (name, value, days) {
        days || (days = 365);
        var date = new Date();
        date.setTime(date.getTime() + 24 * days * 60 * 60 * 1000),
          (document.cookie =
            name + '=' + value + ';path=/;expires=' + date.toGMTString());
      },
      getCookie: function (key) {
        var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
        return keyValue ? keyValue[2] : null;
      },
      getDomain: function () {
        var domain = document.domain;
        var domainList = domain.split('.').slice(-2).join('.');
        return '.' + domainList;
      },
    },
    cookiePolicy: function () {
      setTimeout(function () {
        if (commonMethods.cookie.getCookie('cookie_policy') == null) {
          $('body').append(
            '<div class="cookie_policy">We use Cookie to provide a good user experience. Once you use this website, you agree with our <a href="/cookie-policy/"> Cookie policy</a>.<span class="btn-cookie">OK, got it</span></div>'
          );
          $('.cookie_policy .btn-cookie').click(function () {
            $(this).parent().slideUp(400);
            commonMethods.cookie.setCookie('cookie_policy', '1');
          });
        }
      }, 5000);
    },
    setIrclickid: function () {
      var url = window.location.href;
      if (window.location.href.search('irclickid') !== -1) {
        var irclickidVal = commonMethods.getParameterByName('irclickid', url);
        commonMethods.cookie.setCookieDomain('irclickid', irclickidVal, 30);
      }
      if (window.location.href.search('campaign_id') !== -1) {
        var ircidVal = commonMethods.getParameterByName('campaign_id', url);
        commonMethods.cookie.setCookieDomain('ir-cid', ircidVal, 30);
      }
      if (window.location.href.search('media_partner_id') !== -1) {
        var irpidVal = commonMethods.getParameterByName(
          'media_partner_id',
          url
        );
        commonMethods.cookie.setCookieDomain('ir-pid', irpidVal, 30);
      }
      if (window.location.href.search('tracker_id') !== -1) {
        var irtidVal = commonMethods.getParameterByName('tracker_id', url);
        commonMethods.cookie.setCookieDomain('ir-tid', irtidVal, 30);
      }
    },
    getParameterByName: function (name, url) {
      if (!url) url = window.location.href;
      name = name.replace(/[\[\]]/g, '\\$&');
      var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
      if (!results) return null;
      if (!results[2]) return '';
      return decodeURIComponent(results[2].replace(/\+/g, ' '));
    },
    is_login: '',
    loginStatus: function () {
      this.is_login = commonMethods.cookie.getCookie('TOKEN');
      var email = commonMethods.cookie.getCookie('WEB_EMAIL');
      if (this.is_login) {
        $('.nav-btn-v2, .nav-btn-login-text').hide();
        $('.nav-btn-v2-login').show();
        $('.mobile_header .clickMenu_show_nav .nav-btn-v2-login').show();
        if (email) {
          $('.shareit_buy_link').each(function () {
            $(this).attr('href', $(this).attr('href') + '&EMAIL=' + email);
          });
        }
        $('#buyTip').addClass('show');
      } else {
        $('.nav-btn-v2').show();
        $('.nav-btn-login-text').show();
      }
    },
  };
  var init = function () {
    var bindWindowsFunParams = [
      'md5Token',
      'returnHostName',
      'debounce',
      'onMonitorNowClick',
      'setCookie',
      'getCookie',
      'showChooseDialog',
      'toggleChooseDialog',
      'clickChooseEvent',
      'resetChooseModal',
    ];
    util.bindWindowsFun(window, bindWindowsFunParams);
    controller.urlReplace();
    controller.nav();
    $(window).resize(function () {
      controller.nav();
    });
    commonMethods.main();
    if (!util.isProductEnv()) {
  //     $('a').each(function () {
  //       if (
  //         $(this).attr('href') &&
  //         $(this).attr('href').indexOf('https://panel.famiguard.com/') > -1
  //       ) {
  //         var hostname = returnHostName();
  //         console.log(hostname, 111);
  //         var url = $(this)
  //           .attr('href')
  //           .replace('https://panel.famiguard.com/', hostname + '/');
  //         $(this).attr('href', url);
  //       }
  //     });
  //   }
  // };
  return { init: init, util: util, commonMethods: commonMethods };
})();
base.init();
base.commonMethods.cookie.getCookie('active-banner') ||
  base.commonMethods.createActiveBanner({
    pcImage: '',
    mobileImage:
      'https://images.imyfone.com/famiguarden/assets/common/store/m-banner-active.png',
    padImage:
      'https://images.imyfone.com/famiguarden/assets/common/store/bottom_banner.png',
    closeImage:
      'https://images.imyfone.com/famiguarden/assets/common/store/close.svg',
    pcUrl: '/store/',
    mobileUrl: '/store/',
    noShowPath: [
      'famiguard-whatsapp-pricing',
      'famiguard-pro-pricing-android',
      'store',
    ],
  });
window.commonMethods = base.commonMethods;
window.base = base.util;
