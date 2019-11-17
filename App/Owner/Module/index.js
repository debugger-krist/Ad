(function () {
    $(".bs-example-modal,[data-id='bs-example-modal']").on("click", function () {
        var contents = $('#IntelWindow').html();
        if (contents) {
            $('.bs-example-modal-lg').modal({
                show: true,
                backdrop: true
            });
        } else {
            $.get('/Intel/Index/post', {
                step: 1
            }, function (data) {
                $('#IntelWindow').html(data);
                $('.bs-example-modal-lg').modal({
                    show: true,
                    backdrop: true
                });
            });
        }
    });

    $('#IntelWindow').delegate('.categorysn', 'change', function () {
        var _this = $(this);
        var cat_id = _this.data('cat_id');
        $('.category_' + cat_id).prop('checked', false);
        SelectCatAll();
    });
    $('#IntelWindow').delegate('.categorysy', 'change', function () {
        SelectCatAll();
    });
    $('#IntelWindow').delegate('.soncat', 'change', function () {
        var _this = $(this);
        var parent_id = _this.data('parent_id');
        var max_sel = _this.data('max_sel');
        var mun = 0;
        $('.category_' + parent_id).each(function () {
            if ($(this).prop('checked') == true) {
                mun++;
            }
        });

        if (mun > 0) {
            $('#categorysy_' + parent_id).prop('checked', true);
        } else {
            $('#categorysn_' + parent_id).prop('checked', true);
        }
        if (max_sel > 0 && max_sel <= mun) {
            $('.category_' + parent_id).each(function () {
                if (!$(this).prop('checked')) {
                    $(this).prop('disabled', true);
                }
            });
        } else {
            $('.category_' + parent_id).prop('disabled', false);
        }
        SelectCatAll();
    });
    $('#IntelWindow').delegate('.delsel', 'click', function () {
        var _this = $(this);
        var cat_id = _this.data('cat_id');
        $('#this_' + cat_id).click();
        SelectCatAll();
    });
    $('#IntelWindow').delegate('.goback', 'click', function () {
        var _step = $(this).data('step');
        $.get('/Intel/Index/post', {
            step: (_step - 1)
        }, function (data) {
            $('#IntelWindow').html(data);
        });
    });

    $('#IntelWindow').delegate('.empty', 'click', function () {
        if (confirm('您确定要清空全部选项？')) {
            $('.soncat').prop('disabled', false).prop('checked', false);
            $('.categorysn').prop('checked', true);
            SelectCatAll();
        }
    });

    /* 获取手机验证码 */
    $('#IntelWindow').delegate('.getcode', 'click', function () {
        var _this = $(this);
        var mobile = $('input[name=mobile]');
        var captcha = $('input[name=captcha]');
        if (!mobile.val()) {
            ShowMsg('请输入手机号！');
            mobile.focus();
            return false;
        }
        var patten = /^1[3,4,5,7,8]\d{9}$/;
        if (!patten.test(mobile.val())) {
            ShowMsg('手机格式不正确！');
            mobile.focus();
            return false;
        }
        if (!captcha.val()) {
            ShowMsg('请输入图片验证码！');
            captcha.focus();
            return false;
        }

        var time = 120;
        var Timing = function () {
            time--;
            if (time <= 0) {
                _this.prop('disabled', false).html('发送短信验证码');
                clearTimeout(t);
            } else {
                _this.prop('disabled', true).html('倒计时 ' + time + ' 秒');
                var t = setTimeout(Timing, 1000);
            }
        }
        $.ajax({
            url: "/Api/SendMsg/intel/",
            type: "POST",
            async: false,
            cache: false,
            data: {
                telephone: mobile.val(),
                verify: captcha.val()
            },
            success: function (value) {
                if (value.status == 0) {
                    Timing();
                } else {
                    var href = "/Owner/Account/verify/" + '?_t=' + Math.random();
                    $('#resetVerifyCode').prop('src', href);
                    if (value.msg == '验证码错误!') {
                        captcha.val('').focus();
                        ShowMsg('图片验证码错误！');
                    }
                    ShowMsg(value.msg);
                }
            }
        });
    });
    $('#IntelWindow').delegate('#industry', 'change', function () {
        if ($(this).val() == '自定义') {
            $('#CustomIndustry').show();
        } else {
            $('#CustomIndustry').hide();
        }
    });
    /* 步骤1 */
    $('#IntelWindow').delegate('.IntelForm1', 'submit', function () {
        var _this = $(this);
        var industry = $('select[name=industry] > option:selected').val();
        var budget = $('input[name=budget]');
        var target = $('select[name=target] > option:selected').val();
        if (!industry) {
            ShowMsg('请选择行业分类！');
            return false;
        } else if (industry == '自定义') {
            if (!$('#custom_industry').val()) {
                $('#custom_industry').focus();
                ShowMsg('请输入自定义行业分类！');
                return false;
            }
        }
        if (!budget.val()) {
            ShowMsg('请输入营销预算，且只支持数字！');
            budget.focus();
            return false;
        }
        if (!target) {
            ShowMsg('请选择营销目标！');
            return false;
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
                _this.find('button[type=submit]').prop('disabled', false);
                if (data.status) {
                    $.get('/Intel/Index/post', {
                        step: 2
                    }, function (data) {
                        $('#IntelWindow').html(data);
                    });
                } else {
                    ShowMsg(data.info, 0);
                }
            },
            error: function (data) {
                ShowMsg(data.info, 0);
                _this.find('button[type=submit]').prop('disabled', false);
            }
        });
        return false;
    });

    /* 步骤2 */
    $('#IntelWindow').delegate('.IntelForm2', 'submit', function () {
        var _this = $(this);
        var error = 0;
        $('.checkbox').each(function () {
            var cthis = $(this);
            if (cthis.prop('checked') == true && cthis.val() == 1) {
                var smun = 0;
                $('.category_' + cthis.data('category_id')).each(function () {
                    if ($(this).prop('checked') == true) {
                        smun++;
                    }
                });
                if (smun == 0) {
                    error++;
                    ShowMsg(cthis.data('category_name') + '最少选择一个！', 0);
                    return false;
                }
            }
        });
        if (error) {
            return false;
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
                _this.find('button[type=submit]').prop('disabled', false);
                if (data.status) {
                    $.get('/Intel/Index/post', {
                        step: 3
                    }, function (data) {
                        $('#IntelWindow').html(data);
                    });
                } else {
                    ShowMsg(data.info, 0);
                }
            },
            error: function (data) {
                ShowMsg(data.info, 0);
                _this.find('button[type=submit]').prop('disabled', false);
            }
        });
        return false;
    });

    /* 步骤3 */
    $('#IntelWindow').delegate('.IntelForm3', 'submit', function () {
        var _this = $(this);
        var nickname = $('input[name=nickname]');
        var mobile = $('input[name=mobile]');
        var smscode = $('input[name=smscode]');
        if (!nickname.val()) {
            ShowMsg('请输入您的称呼！');
            nickname.focus();
            return false;
        }
        if (!mobile.val()) {
            ShowMsg('请输入您的手机！');
            mobile.focus();
            return false;
        }
        if (!smscode.val()) {
            ShowMsg('请输入短信验证码！');
            smscode.focus();
            return false;
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
                _this.find('button[type=submit]').prop('disabled', false);
                if (data.status) {
                    $.get('/Intel/Index/post', {
                        step: 4
                    }, function (data) {
                        $('#IntelWindow').html(data);
                    });
                } else {
                    ShowMsg(data.info, 0);
                }
            },
            error: function (data) {
                ShowMsg(data.info, 0);
                _this.find('button[type=submit]').prop('disabled', false);
            }
        });
        return false;
    });
    $(".remember-user").on("click", function () {
        var self = $(this);
        self.val(self.is(':checked') ? 1 : 0)
    })

})();

function SelectCatAll() {
    var shtml = '';
    $('.categorysn').each(function () {
        var _this = $(this);
        var cat_id = _this.data('cat_id');
        shtml += '<div class="qb"><div class="qb_fl">' + _this.data('cat_name') + '：</div><div class="qb_fr">';
        if ($(this).prop('checked')) {
            shtml += '<div class="qb_l">不限</div>';
        } else {
            $('.category_' + cat_id).each(function () {
                var _cthis = $(this);
                if (_cthis.prop('checked')) {
                    shtml += '<div class="qb_l">' + _cthis.data('cat_name') + '<a href="javascript:;" data-cat_id="' + _cthis.val() + '" class="delsel"><img src="/App/Public/Owner/images/tr1.jpg" class="qb_img"></a></div>';
                }
            });
        }
        shtml += '</div><div class="cl"></div></div>';
    });
    $('#SelectAll').html(shtml);

    /* 数据统计 */
    $('.IntelForm2').ajaxSubmit({
        type: 'post',
        url: '/Intel/Index/count',
        dataType: "json",
        data: {
            "inajax": '1'
        },
        success: function (data) {
            if (data.status) {
                $('#max_users').html(data.data.max_users);
                $('#max_views').html(data.data.max_views);
            }
        }
    });
}
