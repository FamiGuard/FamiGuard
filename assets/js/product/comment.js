var comment={data:{jRateText:["Poor","Fair","Average","Good","Excellent"],star:5},main:function(){this.other.btnPosition();this.other.changeIcon();this.other.scroll();this.other.otherFun()},other:{scroll:function(){var show_top=0;var show_num=0;var pro_fixed_button=$('.pro_fixed_button');if(pro_fixed_button.length>0){$(window).scroll(function(){if($(window).scrollTop()>show_top){if(show_num==0){pro_fixed_button.addClass('current');show_num=1}}else{if(show_num==1){pro_fixed_button.removeClass('current');show_num=0}}})}},btnPosition:function(){var type='win';if(navigator.platform=="Win32"||navigator.platform=="Windows"){type='win'}else if(navigator.platform=="Mac68K"||navigator.platform=="MacPPC"||navigator.platform=="Macintosh"||navigator.platform=="MacIntel"){type='mac'}
$("input[type=radio][name=support][value="+type+"]").attr("checked",!0)},changeIcon:function(){var support=$("input[name='support']:checked").val();$("input[name='support']").parent("label").removeClass("selected");$("input[name='support']:checked").parent("label").addClass("selected");if(support=='mac'){$("#buy-mac").show();$("#buy-win").hide();$(".pro-buy-win").hide();$(".pro-buy-mac").show()}else if(support=='win'){$("#buy-mac").hide();$("#buy-win").show();$(".pro-buy-win").show();$(".pro-buy-mac").hide()}},otherFun:function(){if($("#jRate")){starNull(comment.data.star);$("#jRate i").each(function(){$(this).mouseover(function(){starNull($(this).index()+1)})
$(this).mouseout(function(){starNull(comment.data.star)})
$(this).click(function(){comment.data.star=$(this).index()+1})});function starNull(num){$("#jRate i").addClass("null");$("#comment_star").val(comment.data.jRateText[num-1]);for(i=0;i<num;i++){$("#jRate i").eq(i).removeClass("null")}}}
$("#addR").click(function(){$("html,body").animate({scrollTop:$('#addreview').offset().top-100},500)})},reviewForm:function(reviewUrl){if($(".refresh")){function getCap(){var t=new Date().getTime()
$("#captcha_img_two").attr("src",base.cmsProdApiUrl()+"/api/captcha?t="+t)
$("[name=t]").val(t)}
getCap();$(".refresh").click(function(){getCap()})}
$("#cform").validate({errorPlacement:function(error,element){error.appendTo(element.siblings("label"))},rules:{full_name:{required:!0,minlength:2},email:{required:!0,email:!0},comment:"required",refresh:"required"},messages:{full_name:{required:"Please enter a name",minlength:"Su autor debe constar de al menos 2 caracteres"},email:{required:"Please enter your email.",email:"Please enter the valid email."},comment:"Please enter your message.",refresh:"Please enter the identification code."},submitHandler:function(){var form_data={site_name:"famiguard_en",review_url:reviewUrl,code:$("#authcode").val(),name:$("#full_name").val(),email:$("#email").val(),content:$("#comment").val(),start:comment.data.star,t:$("[name=t]").val()}
var nowSitme=md5Token.sitme();$.ajax({type:"post",url:base.cmsProdApiUrl()+"/api/reviews/save",data:form_data,headers:{'token':md5Token.token(nowSitme),'stime':nowSitme,},dataType:"json",success:function(data){console.log(data);if(data.code===1){alert("Thanks! The comment of it has been sent, it will adopt as soon as possible!");$("#full_name, #email, #comment, #authcode").val("")}else{alert(data.msg)}
getCap()},error:function(){console.log('error')}})}})}}}
comment.main()