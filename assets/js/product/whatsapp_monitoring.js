var dataLayer = window.dataLayer = window.dataLayer || []; dataLayer.push({ 'event': 'Product_Detail', 'ecommerce': { 'detail': { 'products': [{ 'name': 'iMyFone FamiGenius for WhatsApp' }] } } }); function goToPricingPage() { window.location.href = "/famiguard-whatsapp-pricing/" }
var mySwiper = new Swiper('#swiper-step-pic', { allowTouchMove: !0, lazy: !0, autoplay: !0, pagination: { el: '.swiper-step', clickable: !0, }, navigation: { nextEl: '.swiper-with-next', prevEl: '.swiper-with-prev', }, thumbs: { swiper: { el: '#swiper-step-txt', allowSlidePrev: !1, allowSlideNext: !1 } } }); var certifySwiper = new Swiper('#swiper-demo-pic', {
    loop: !0, allowTouchMove: !0, lazy: !0, centeredSlides: !0, slidesPerView: 'auto', watchSlidesProgress: !0, loopedSlides: 7, grabCursor: !0, autoplay: !0, navigation: { nextEl: '.swiper-with-next', prevEl: '.swiper-with-prev', }, pagination: { el: '.swiper-pag', clickable: !0, }, on: {
        progress: function (progress) {
            var _this = this; allowTouchFun(); $(window).resize(function () { allowTouchFun() })
            function allowTouchFun() {
                if ($(window).width() > 789) {
                    for (i = 0; i < _this.slides.length; i++) {
                        var slide = _this.slides.eq(i); var slideProgress = _this.slides[i].progress; modify = 1; if (Math.abs(slideProgress) > 1) { modify = (Math.abs(slideProgress) - 1) * 0.3 + 1 }
                        translate = slideProgress * modify * 760 + 'px'; scale = 1 - Math.abs(slideProgress) / 7; zIndex = 999 - Math.abs(Math.round(10 * slideProgress)); opacity = modify * slideProgress === 0 ? 1 : 0.7
                        slide.transform('translateX(' + translate + ') scale(' + scale + ')'); slide.css('zIndex', zIndex); slide.css('opacity', opacity); if (Math.abs(slideProgress) > 1) { slide.css('opacity', 0) }
                    }
                }
            }
        }, setTransition: function (transition) {
            for (var i = 0; i < this.slides.length; i++) {
                var slide = this.slides.eq(i)
                slide.transition(transition)
            }
        }
    }
})