$(".title-box .tabBox-title").unbind("click").click(function(){if($(".article-left").hasClass("curr")){$(".title-box").css("position","inherit");$(".article-left").removeClass("curr");$(".title-box .tabBox-title").removeClass("curr");$(".title-box .tabBox-title").css("top","105px")}else{var itemTop=$(this).offset().top;$(".title-box").css("position","relative");$(".title-box .tabBox-title").addClass("curr");$(".title-box .tabBox-title").css("top",itemTop-280);$(".article-left").css("top",itemTop-280);$(".article-left").addClass("curr")}})
if($(window).width()<769){$(window).scroll(function(){var scrollTop=$(window).scrollTop();var top=$(".footer").offset().top;if(scrollTop+300>top){$(".title-box .tabBox-title").css("display","none")}else{$(".title-box .tabBox-title").css("display","block")}})}
$(function(){$(".personal-comments").mouseover(function(){$(this).prev().css("border-bottom","1px solid #fff")})
$(".personal-comments").mouseout(function(){$(this).prev().css("border-bottom","1px solid #d2d2d2")})})