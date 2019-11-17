



function ShowVerifyCode(Verify) {
    $('#' + Verify).show();
    var VerifyCode = $('#' + Verify + 'Code');
    var w = VerifyCode.attr('width');
    var h = VerifyCode.attr('height');
    var url = '/Api/Captcha/?w=' + w + '&h=' + h + '&_t=';
    VerifyCode.attr('src', url + Math.random()).click(function () {
        $(this).attr('src', url + Math.random())
    });
}


$(function () {
    $('.dh_1').hover(function () {
        $(this).stop(true).animate({
            'marginLeft': '40px'
        }, 500);
    }, function () {
        $(this).stop(true).animate({
            'marginLeft': '20px'
        }, 500);
    });
    var ShowOwnerVerify = ShowMediaVerify = null;
    $('#ad_account,#ad_password,#me_account,#me_password').blur(function () {
        var meid = $(this).attr('id');
        if (meid == 'ad_account' || meid == 'ad_password') {
            if ((ShowOwnerVerify == null && !$('#OwnerVerify').is(':visible'))) {
                Ajaxcall('/Api/Captcha/check', '', function (data) {
                    ShowOwnerVerify = 1;
                    if (data.login_error >= 2) {
                        $("input[name='account']").removeClass("he4");
                        $("input[name='password']").removeClass("he4");
                        $("#ad_forget_psd").removeClass("mt20");
                        $("#ad_forget_psd").addClass("mt5");
                        ShowVerifyCode('OwnerVerify');
                    }
                }, 'get', 'json');
            }
        } else {
            if ((ShowMediaVerify == null && !$('#MediaVerify').is(':visible'))) {
                Ajaxcall('/Api/Captcha/check', '', function (data) {
                    if (meid == 'ad_account' || meid == 'ad_password') {
                        ShowOwnerVerify = 1;
                    } else {
                        ShowMediaVerify = 1;
                    }
                    if (data.login_error >= 2) {
                        $("input[name='account']").removeClass("he4");
                        $("input[name='password']").removeClass("he4");
                        $("#me_forget_psd").removeClass("mt20");
                        $("#me_forget_psd").addClass("mt5");
                        ShowVerifyCode('MediaVerify');
                    }
                }, 'get', 'json');
            }
        }
    });

    $('#mer_account').blur(function () {
        var _this = $(this);
        if (_this.val() != "") {
            Ajaxcall('/Media/Account/checkUserName/', 'account=' + _this.val(), function (data) {
                if (data.status == '0') {
                    AddPrompt(_this, data.info);
                    _this.focus();
                } else DelPrompt(_this);
            }, 'post', 'json');
        } else AddPrompt(_this, _this.data('content'));
    });

    $('#adr_account').blur(function () {
        var _this = $(this);
        if (_this.val() != "") {
            Ajaxcall('/Owner/Account/checkUserName/', 'account=' + _this.val(), function (data) {
                if (data.status == '0') {
                    AddPrompt(_this, data.info);
                    _this.focus();
                } else DelPrompt(_this);
            }, 'post', 'json');
        } else AddPrompt(_this, _this.data('content'));
    });

    $('#adr_iphone').blur(function () {
        var _this = $(this);
        if (is_phone(_this.val())) {
            ShowVerifyCode('AdVerify');
            DelPrompt(_this);
        } else if (_this.val()) {
            AddPrompt(_this, '手机格式不正确');
        } else {
            DelPrompt(_this);
            $('#AdVerify').hide();
        }
    });
    $('#mer_iphone').blur(function () {
        var _this = $(this);
        if (is_phone(_this.val())) {
            DelPrompt(_this);
        } else if (_this.val()) {
            AddPrompt(_this, '手机格式不正确');
        } else {
            AddPrompt(_this, '请输入手机号码');
        }
    });

    $('#adr_qq').blur(function () {
        var _this = $(this);
        if (_this.val() && !is_qq(_this.val())) {
            AddPrompt(_this, 'QQ格式不正确');
        } else DelPrompt(_this);
    });

    $('.phoneclick').click(function () {
        var _this = $(this);
        if (_this.html() == '获取短信验证码' || _this.html() == '获取验证码') {
            var _type = _this.data('tname');
            var _phone = $('#' + _type + '_iphone');
            if (is_phone(_phone.val()) === true) {
                var _verify = $('#' + _type + '_verify');
                if (!_verify.val()) {
                    if (_type == 'adr' || _type == 'mer') AddPrompt(_verify, _verify.data('content'));
                    else {
                        _verify.focus();
                        ShowMsg('请输入图片验证码！');
                    }
                    return false;
                }
                //电话是否可以注册
                var _url = (_type == 'mer' ? '/Media/Account/checkPhone/' : '/Owner/Account/checkPhone/');
                Ajaxcall(_url, 'telephone=' + _phone.val(), function (data) {
                    if (data.status == '1') {
                        _this.html('正在发送...').blur();
                        var _smsurl = (_type == 'mer' ? '/Api/SendMsg/media_register_send/' : '/Api/SendMsg/owner_register_send/');
                        Ajaxcall(_smsurl, 'telephone=' + _phone.val() + '&verify=' + _verify.val(), function (ndata) {
                            if (ndata.status == 0) {
                                _this.html('倒计时 ' + '120' + ' 秒');
                                var settime = function () {
                                    var thist = parseInt(_this.html().substr(4, 3));
                                    var nextt = thist - 1;
                                    if (nextt == 0) {
                                        _this.prop('disabled', false).html('获取短信验证码');
                                        clearTimeout(t);
                                    } else {
                                        _this.prop('disabled', true).html('倒计时 ' + nextt + ' 秒');
                                        var t = setTimeout(settime, 1000);
                                    }
                                }
                                settime();
                            } else {
                                ShowVerifyCode(_this.data('verify_id'));
                                ShowMsg(ndata.msg);
                                _verify.focus().val('');
                                _this.html('获取短信验证码');
                            }
                        }, 'post', 'json');
                    } else {
                        if (_type == 'adr' || _type == 'mer') AddPrompt(_phone, data.info);
                        else ShowMsg(data.info, data.status);
                    }
                }, 'post', 'json');
            } else {
                if (_phone.val()) {
                    if (_type == 'adr' || _type == 'mer') AddPrompt(_phone, '手机号格式不正确');
                    else {
                        _phone.focus();
                        ShowMsg('手机号格式不正确');
                    }
                } else {
                    if (_type == 'adr' || _type == 'mer') AddPrompt(_phone, '手机号不能为空');
                    else {
                        _phone.focus();
                        ShowMsg('手机号不能为空');
                    }
                }
            }
        }
    });
    $('#OneStep').click(function () {
        var CallFunc = $(this).parents('form.AjaxSubmitForm').data('callfunc');
        var Func = eval(CallFunc);
        var Step = Func('OneStep');
        if (Step) {
            var url = '',
                account = '';
            if (CallFunc == 'OwnerRegCheck') {
                url = '/Owner/Account/checkUserName/';
                account = $('#adr_account');
            } else {
                url = '/Media/Account/checkUserName/';
                account = $('#mer_account');
            }
            if (account.val()) {
                Ajaxcall(url, 'account=' + account.val(), function (data) {
                    if (data.status == '0') AddPrompt(account, data.info);
                    else {
                        $('.OneStep').hide();
                        $('.TowStep').show();
                    }
                }, 'post', 'json');
            } else AddPrompt(account, account.data('content'));
        }
    });

    $('#adr_password,#adr_password_check,#mer_password,#mer_password_check').blur(function () {
        var _this = $(this);
        if (_this.val() == '' || _this.val().length < 6) AddPrompt(_this, _this.data('content'));
        else DelPrompt(_this);
    });

    $('#adr_verify,#adr_phone_verify,#mer_verify,#mer_phone_verify').blur(function () {
        var _this = $(this);
        if (_this.val() == '') AddPrompt(_this, _this.data('content'));
        else DelPrompt(_this);
    });
    $('#reset').trigger('click');
});
