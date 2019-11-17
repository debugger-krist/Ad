/* 操作提示框 */

function promptBox(text, status, time, close) {
    $(function () {
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

        //3秒后自动关闭
        if (close > 0) var closeTime = close * 1000;
        else var closeTime = 1800;
        setTimeout(function () {
            $(".boxClose").click();
        }, closeTime);

        /* 成功后自动刷新 */
        if (time) {
            if (status) {
                setTimeout(function () {
                    location.reload(true);
                }, time * 1000);
            }
        }


    });
}
