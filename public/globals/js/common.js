// JavaScript Document$.extend({
/* 操作提示框 */
ShowMsg: function (text, status, time) {
        /* 先删除div层，防止重复叠加 */
        $(".promptBox").remove();

        //判断成功或者失败
        if (status) var id = "success";
        else var id = "failure";

        //生成html添加到body
        var addHtml = "";
        addHtml += '<div class="promptBox" id="' + id + '">';
        addHtml += '<div class="outer">';
        addHtml += '<div class="transparent"></div>';
        addHtml += '<i class="iconfont boxClose">&#xe6c9;</i>';
        addHtml += '<div class="inner">';
        addHtml += text;
        addHtml += '</div>';
        addHtml += '</div>';
        addHtml += '</div>';
        $(addHtml).appendTo("body");

        //根据文字定义外层宽度
        var innerWidth = $(".inner").outerWidth(true) + 40;
        $(".promptBox .outer,.promptBox .outer .transparent").width(innerWidth);
        $(".promptBox").css({
            marginLeft: -innerWidth / 2
        });

        //淡淡显示出来
        $(".promptBox").animate({
            'opacity': 1
        }, 1000);

        //关闭提示框
        $(".boxClose").click(function () {
            $(".promptBox").fadeOut(1000, function () {
                $(this).remove();
            });
        });

        //自动关闭
        var CloseTime = (time ? (time * 1000) : 1800);
        setTimeout(function () {
            $(".boxClose").click();
        }, CloseTime);

        /* 成功后自动刷新 */
        if (time && status) {
            setTimeout(function () {
                console.log('aa');
                location.reload(true);
            }, time * 1000);
        }
    }, //$.ShowMsg(text,status,time);

    /*
     ajax 请求函数
     CallUrl 请求url
     CallData 请求数据
     CallBack 返回的数据处理函数
     CallType 请求类型可选get, post
     CallDataType 服务器返回的数据类型 可选XML ,Json jsonp script html text等
    */
    Ajaxcall: function (CallUrl, CallData, CallBack, CallType, CallDataType) {
        $.ajax({
            type: CallType ? CallType : 'post', //可选get, post
            url: CallUrl, //这里是接收数据的PHP程序
            data: CallData + (CallData ? '&' : '') + "inajax=1&_t=" + Math.random(), //传给PHP的数据，多个参数用&连接
            dataType: CallDataType ? CallDataType : 'Json', //服务器返回的数据类型 可选XML ,Json jsonp script html text等
            success: function (result) {
                //这里是ajax提交成功后，PHP程序返回的数据处理函数。result是返回的数据，数据类型在dataType参数里定义！
                if (typeof (CallBack) === "function") {
                    CallBack(result);
                }
            },
            error: function () {
                //ajax提交失败的处理函数！
                //alert('error!');
            }
        });
    }, //$.Ajaxcall('index.php', 'a=b', function, 'post', 'html');

});

function ShowMsg(text, status, time) {
    $.ShowMsg(text, status, time);
}

function Ajaxcall(CallUrl, CallData, CallBack, CallType, CallDataType) {
    $.Ajaxcall(CallUrl, CallData, CallBack, CallType, CallDataType);
}

/* 注册时提示框（注册时才使用） */
function AddPrompt(obj, msg, step) {
    obj.siblings('.promptmsg').remove();
    if (step) {
        $('.OneStep,.TowStep').hide();
        $('.' + step).show();
    }
    obj.addClass('promptbor').after('<i class="promptmsg">' + msg + '</i>');
}

function DelPrompt(obj) {
    obj.removeClass('promptbor');
    obj.siblings('.promptmsg').remove();
}

/**
 * 正则匹配手机号
 * @author liuchunhua
 * @date   20150918
 * @params phone
 * @return boolean
 */
function is_phone(phone) {
    var mobile = /^1[34578]{1}\d{9}$/;
    return (phone.length == 11 && mobile.test(phone));
}

/**
 * 正则匹配QQ号
 * @author liuchunhua
 * @date   20150918
 * @params phone
 * @return boolean
 */
function is_qq(QQ) {
    var qq_match = /^[1-9]\d{4,9}$/;
    return qq_match.test(QQ);
}

$(function () {
    /*
     * ajax 提交表单
     * 带 .AjaxSubmitForm 的表单自动转为ajax方式提交
     */
    $('.AjaxSubmitForm').submit(function () {
        var _this = $(this);
        /* 表单检测 */
        var CallFunc = _this.data('callfunc');
        if (CallFunc) {
            CallFunc = eval(CallFunc);
            if (typeof (CallFunc) === "function" && !CallFunc()) {
                return false;
            }
        }
        _this.find('button[type=submit]').prop('disabled', true);
        _this.ajaxSubmit({
            type: _this.prop('method'),
            url: _this.prop('action'),
            dataType: "json",
            data: {
                "inajax": '1'
            },
            success: function (data) {
                var Callback = _this.data('callback');
                if (Callback) {
                    Callback = eval(Callback);
                    if (typeof (Callback) === "function") {
                        Callback(data);
                    }
                } else {
                    ShowMsg(data.info, data.status);
                    if (data.goto_url || data.url) {
                        window.setTimeout(function () {
                            window.location.href = (data.goto_url ? data.goto_url : data.url);
                        }, 2000);
                    }
                }
                _this.find('button[type=submit]').prop('disabled', false);
            },
            error: function (data) {
                ShowMsg(data.info, 0);
                _this.find('button[type=submit]').prop('disabled', false);
            }
        });
        return false;
    });
});


// 首测登陆表单提交
$('.AjaxForm').submit(function () {
    var _this = $(this);
    _this.find('button[type=submit]').prop('disabled', true);
    _this.ajaxSubmit({
        type: _this.prop('method'),
        url: _this.prop('action'),
        dataType: "json",
        data: {
            "inajax": '1'
        },
        success: function (data) {
            console.log(data)
            if (data.status != true) {
                promptBox(data.msg, 0, 2000)
            } else {
                promptBox(data.msg, 1, 2000)
                $('.modal').modal('hide')
            }
            _this.find('button[type=submit]').prop('disabled', false);
        },
        error: function (data) {
            ShowMsg(data.info, 0);
            _this.find('button[type=submit]').prop('disabled', false);
        }
    });
    return false;
});
