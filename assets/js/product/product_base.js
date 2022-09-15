var productBase={init:function(){},getProductNav:function(){$.get("/assets/js/product/productNav.json",function(res){var proData=res[0]
var pathName=Object.keys(proData).filter((function(item){return window.location.pathname.indexOf(item)>-1}))[0];var reg=/guide|reviews/
var isPageArr=reg.exec(window.location.pathname);isPageArr||(isPageArr='')
var navInfo=proData[pathName]
var lineButton=''
var mobNameShow=''
mobNameShow+=(navInfo.showMobName?'<span>'+navInfo.productname+'</span>':'')
lineButton+=(navInfo.url&&isPageArr!==''?'<li><a href="'+navInfo.url+'" class="guide-link">Overview</a></li>':'')
lineButton+=(navInfo.guideUrl&&isPageArr[0]!=="guide"?'<li><a href="'+navInfo.guideUrl+'" class="guide-link">Guide</a></li>':'')
lineButton+=(navInfo.reviewsUrl&&isPageArr[0]!=="reviews"?'<li><a href="'+navInfo.reviewsUrl+'" class="reviews-link">Reviews</a></li>':'')
lineButton+=(navInfo.deviceType?'<li class="m-hidden allProduct-change"><a class="bt-monnitor sign_up" href="javascript:;" onclick="onMonitorNowClick('+"'"+navInfo.deviceType+"'"+');">Sign Up</a></li>':'')
lineButton+=(navInfo.appUrl?'<li class="m-hidden allProduct-change"><a class="bt-monnitor sign_up" href="'+navInfo.appUrl+'">Buy now</a></li>':'')
var navEl='<nav>\
            <div class="mask-bg"></div>\
            <div class="nav">\
                <div class="container">\
                    <div class="product-icon">\
                        <a class="icon-link" href="'+navInfo.url+'">\
                            <img src="'+navInfo.icon+'" loading="lazy" alt="'+navInfo.productname+'">\
                            <span>'+navInfo.productname+'</span>\
                        </a>\
                    </div>\
                    <ul class="nav-ul">\
                        <li class="icon-comm-pro">\
                            <img src="'+navInfo.icon+'" loading="lazy" alt="'+navInfo.productname+'">\
                                '+mobNameShow+'\
                        </li>\
                        '+lineButton+'\
                    </ul>\
                </div>\
            </div>\
            </nav>'
$('.header').after(navEl)
productBase.proScollTo()})},proScollTo:function(){var show_top=70;var show_num=0;var nav=$("nav");if(nav.length>0){$(window).scroll(function(){if($(".scroll_chk_top")[0]){var top=$(".scroll_chk_top").offset().top-$(window).scrollTop();if(top<=-10){if(show_num==0){nav.addClass("curr");show_num=1}}else{if(show_num==1){nav.removeClass("curr");show_num=0}}}else{if($(window).scrollTop()>show_top){nav.addClass("curr")}else{nav.removeClass("curr")}}})}},getReviewCount:function(requset,otherUrl){var reviewUrl=(otherUrl?otherUrl:window.location.pathname.replace(/(guide|reference|reviews)[\S]*/,''))+"reviews/";var nowSitme=md5Token.sitme()
$.ajax({type:'get',url:base.cmsProdApiUrl()+'/api/reviews/product_total',data:{review_url:reviewUrl,site_name:"famiguard_en"},dataType:"json",headers:{'token':md5Token.token(nowSitme),'stime':nowSitme},success:function(data){if(data.code===1){var init={total:data.data.total,rate_number:data.data.avg_score,smallNumber:data.data.top_score}
requset(init)}}})},}
productBase.init()