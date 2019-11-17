
$(document).ready(function(){
    var $nav=$("#cwq-menu");
    var $sidebar=$("#case_sidebar");
    $(window).scroll(function(){
        if($(document).scrollTop()>=200){
            $nav.addClass("fixednav");
        }
        else{
            $nav.removeClass("fixednav");
        }
        if($sidebar.length>0) {
            var $case_body=$("#case_body").height();
            if ($(document).scrollTop() >= 700 && $(document).scrollTop() <= $case_body+400) {
                $sidebar.addClass("fixedsidebar");
            }
            else {
                $sidebar.removeClass("fixedsidebar");
            }
        }
    })
    /*导航墙 begin*/
    $('#ToTop').click(function(){$('html,body').animate({scrollTop: '0px'}, 400);return false;});
    $("#solu_close").click(function(){
        $('#cwq-navigation-top').toggle();
        $('#cwq-navigation-tabs').toggle();
        $('#cwq-navigation').toggleClass("cwq-navigation-open");
        $(this).toggleClass("icon_close");
        $("#navigation_close").text($("#cwq-navigation-tabs").is(":hidden") ? "打开导航墙" : "关闭导航墙");

    });
    var navigfooterTime;
    $("[data-type='navigfooter']").hover(function(){
        var $this = $(this);
        navigfooterTime = setTimeout(function(){
            $this.find(".tab-text").animate({right:40, opacity: 1}).show()
        },200);
        $this.addClass("cwq-navigation-tab-hover").children(".cwq-navigation-nav").removeClass("cwq-navigation-tab-hover");
    },function(){
        clearTimeout(navigfooterTime);
        var $this = $(this);
        $this.removeClass("cwq-navigation-tab-hover");
        $this.find(".tab-text").stop(true).animate({right: 80,opacity: .0},100).hide();
    });
    var navigationTime;
    $("[data-type='navigation']").hover(function(){
        var $this = $(this);
        navigationTime = setTimeout(function(){
            $this.find(".tab-text").animate({right:40, opacity: 1}).show()
        },200);
        $this.addClass("cwq-navigation-tab-selected").children(".cwq-navigation-nav").removeClass("cwq-navigation-tab-selected");
    },function(){
        clearTimeout(navigationTime);
        var $this = $(this);
        $this.removeClass("cwq-navigation-tab-selected");
        $this.find(".tab-text").stop(true).animate({right: 80,opacity: .0},100).hide();
    });
//导航栏点击之后的颜色效果,告诉用户你看的是什么
    $("[data-type='navigation']").on("click",function(){
        var $this = $(this);
        navigfooterTime = setTimeout(function(){
            $this.find(".tab-text").animate({right:40, opacity: 1}).show()
        },200);
        $this.addClass("cwq-navigation-tab-selected").children(".cwq-navigation-nav").removeClass("cwq-navigation-tab-selected");
    });
    /*导航墙 end*/


    if($sidebar.length>0) {
        $("#case_sidebar > ul").each(function () {
            /*二级栏目动效*/
            $(this).find("li").hover(function () {
                $(this).addClass("cur").siblings().removeClass("cur");
            }, function () {
                $("#case_sidebar > ul > li.active").addClass("cur").siblings().removeClass("cur");
            })
        })
    }
//首页导航 begin
    $('[data-event="index_close"]').on('click', function() { //弹窗查看图片
        $(this).parent(".index_top").fadeOut();
    });
    $('#cwqnav-menu>li').hover(function() {
        // $(this).addClass("active");
        $(this).find('.dropdown-menu').show();
    }, function() {
        // $(this).removeClass("active");
        $(this).find('.dropdown-menu').hide();
    });
    $('#navigation').hover(function() {
        $(this).find('#navigation_van').css('display', 'block');
    }, function() {
        $(this).find('#navigation_van').css('display', 'none');
    });
//首页导航 end
    $("[data-type='nav_menu_sun']").hover(function () {
        $(this).addClass("active");
        $(this).find("[data-type='nav_con_sun']").show();
    }, function () {
        $(this).removeClass("active");
        $(this).find("[data-type='nav_con_sun']").hide();
    })
    $("[data-divhover='hover']").hover(function () {
        $(this).addClass("bor_red").removeClass("bor");
        $(this).find(".more").show();
    }, function () {
        $(this).addClass("bor").removeClass("bor_red");
        $(this).find(".more").hide();
    })

    //鼠标滑动效果
    jQuery.jqtab = function(tabtit,tab_conbox,shijian) {
        $(tab_conbox).find("li").hide();
        $(tabtit).find("li:first").addClass("active").show();
        $(tab_conbox).find("li:first").show();

        $(tabtit).find("li").bind(shijian,function(){
            $(this).addClass("active").siblings("li").removeClass("active");
            var activeindex = $(tabtit).find("li").index(this);
            $(tab_conbox).children().eq(activeindex).animate({opacity: 1}).show().siblings().css("opacity",0).hide();
            return false;
        });

    };

    $('#oul').click(function(event){
        var index = $(this).index();
        $(this).stop(true).animate({width:'350px'});
        $(document).one("click", function (){
            $('#oul').stop(true).animate({width:'250px'});
        });
        event.stopPropagation();
    });
    $('#shutdown_max').click(function() {
        $('#shutdown_max').hide();
        $('#shutdown_cen').hide();
        $('#shutdown_min').show();
    })
    $('#shutdown_min').click(function() {
        $('#shutdown_min').hide();
        $('#shutdown_cen').show();
        $('#shutdown_max').show();
    })
    //COOKIE 缓存 begin
    var consultation = 'consultation';
    businesactive();
    $("[data-type='consultation']").click(function(){
        //if(this.checked){
        $.cookie(consultation,1);
        $("[data-type='consultation_fixed']").hide();
        //var date = new Date();
        //date.setTime(date.getTime() + (3 * 24 * 60 * 60 * 1000)); //三天后的这个时候过期
        //$.cookie(COOKIE_NAME, $("#username").val(), { path: '/', expires: date });
        //}else{
        // $.cookie(COOKIE_NAME, null, { path: '/' }); //删除cookie
        //}
    });

    $('.navigation-tab-kf').click(function(){
        $("[data-type='consultation_fixed']").show();
        $.cookie(consultation, 0); //删除cookie
    });
    function businesactive(){
        if($.cookie(consultation)!=1){
            $("[data-type='consultation_fixed']").show();
        }else {
            $("[data-type='consultation_fixed']").hide();
        }
    }
    //COOKIE 缓存 end

    $('.dh_1').hover(function(){
        $(this).stop(true).animate({'marginLeft':'40px'},500);
    },function(){
        $(this).stop(true).animate({'marginLeft':'20px'},500);
    });


    
    $('body').delegate("#owBtnReg", 'click', function () {
        $(".left-login").hide(300,function () {
            $(".ow-reg").show();
            ShowVerifyCode('AdVerify');
        })
    })
    $('body').delegate("#mdBtnReg", 'click', function () {
        $(".right-login").hide(300,function () {
            $(".md-reg").show();
            ShowVerifyCode('MerVerify');
        })
    })

    //cookie处理
    $('body').delegate("form[data-callback=MediaLoginback],form[data-callback=OwnerLoginback]", 'submit', function () {
        var rmCheckbox = $(this).find(".remember-user").val();
        var user = $("#ad_account").val();
        if(rmCheckbox == 0){
            $.cookie("user_name","",{path:"/"});
        }else {
            $.cookie("user_name", user,{ path: '/',expires:7}); //添加cookie
        }
    });
    //30秒收缩
    if(index_running==1){
        // alert($.cookie("running"));
        if($.cookie("running")){
            collapse($.cookie("running"));
        }else{
            collapse(0);
        }
    }else{
        collapse(1);
    }
    function collapse(val) {
        if (val == 0) {
            $(".banner-bottom-min").animate({ "right": "-240" }, 800, "swing", function () {
                $(".banner-bottom-min").hide();
                $(".banner-bottom").animate({ "right": "0%" }, 800, "swing", function () {
                });
                $(".banner-bottom").show().removeClass("active");
            });
        }else{
            $(".banner-bottom").animate({ "right": "-100%" }, 800, "swing", function () {
                $(".banner-bottom").hide().addClass("active");
                $(".banner-bottom-min").animate({ "right": "40" }, 800, "swing", function () {
                });
                $(".banner-bottom-min").show();
            });
        }
        // return running;
    }

    $(".banner-bottom-colse").click(function () {
        collapse(1);
        $.cookie("running", 1,{ path: '/',expires:7}); //添加cookie
    })
    $(".banner-bottom-min").click(function () {
        collapse(0);
        $.cookie("running", 0,{ path: '/',expires:7}); //添加cookie
    })

    loginstatus(refer);
});
function setTab2(name, cursel, n) {
    for (var i = 1; i <= n; i++) {
        var menu = document.getElementById(name + i);var con = document.getElementById("con_" + name + "_" + i);
        menu.className = i == cursel ? "active" : "";con.style.display = i == cursel ? "block" : "none";
    }
}
//移动端判断
function browserRedirect() {
    var activeClass = window.location.pathname.split("/");
    var sUserAgent= navigator.userAgent.toLowerCase();

    var bIsIpad= sUserAgent.match(/ipad/i) == "ipad";

    var bIsIphoneOs= sUserAgent.match(/iphone os/i) == "iphone os";

    var bIsMidp= sUserAgent.match(/midp/i) == "midp";

    var bIsUc7= sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";

    var bIsUc= sUserAgent.match(/ucweb/i) == "ucweb";

    var bIsAndroid= sUserAgent.match(/android/i) == "android";

    var bIsCE= sUserAgent.match(/windows ce/i) == "windows ce";

    var bIsWM= sUserAgent.match(/windows mobile/i) == "windows mobile";

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        var activeurl='https://m.cwq.com/Index';
        if(browserVal==2){
            if(activeClass[1]){
                activeurl += '/' + activeClass[1]
            }
        }
        else if(browserVal==3){
            activeurl += '/' + 'blockchain'
        }
        else if(browserVal==4){
            activeurl += '/' + 'cases'
        }
        else if(browserVal==5){
            activeurl += '/' + 'xiaohongshu'
        }
        // else if(activeClass[2]) {
        //     activeurl += activeurl + '/' + activeClass[1]
        // }
        // else if(activeClass[3]){
        //     activeurl+=activeurl+'/'+activeClass[2]
        // }
        // alert(activeurl);
        window.location.href= activeurl;

    // } else {
    //
    //     window.location= '电脑网站地址';

    }

}
// if(browserVal>1){
//     browserRedirect();
// }


