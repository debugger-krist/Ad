$(function () {
    $('#findfamousForm').submit(function () {
        var _this = $(this);
        var type = $("select[name='type'] option:selected").val();
        var title = $("input[name='title']").val();
        var content = $("input[name='content']").val();
        if (isNaN(type) && type > 0) {
            promptBox('请输入媒体类型！', 0);
            return false;
        }
        if ($.trim(title).length == '') {
            promptBox('请输入手机号码！', 0);
            return false;
        }
        if ($.trim(title).length > 11) {
            promptBox('请输入正确的手机号码！', 0);
            return false;
        }
        if ($.trim(content).length == '') {
            promptBox('请输入推广的文案/产品/品牌等！', 0);
            return false;
        }
        if ($.trim(content).length > 2000) {
            promptBox('推广的文案/产品/品牌的长度不能大于2000个字符！', 0);
            return false;
        }

        var postUrl = _this.attr('action');
        _this.find('button[type="submit"]').attr('disabled', true);
        $.post(postUrl, _this.serialize(), function (d) {
            promptBox(d.info, d.status, d.status);
            if (!d.status) {
                _this.find('button[type="submit"]').removeAttr('disabled');
            }
        }, 'json');
        return false;
    });

});
