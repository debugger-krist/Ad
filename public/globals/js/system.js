var System = function () {
	var i =1;
}

System.prototype.init = function () {
	this.validateImage = $('.validateImage');
}



System.prototype.validateImageFn = function () {
	var _fater_this = this;
	_fater_this.validateImage.click(function () {
		var _this = $(this);
		_this.attr('src',_this.data('image_url')+'&'+Math.random());
	});
}

/**
 * 同步模式AJAX提交
 */
System.prototype.ajax_post_setup = function ($url,$data,$type) {
	$type = $type || 'JSON';
    $.ajaxSetup({
		async: false//async:false 同步请求  true为异步请求
	});
	var result = false;
	//提交的地址，post传入的参数
	$.post($url,$data,function(content){
		result = content;
	},$type);
	
	return result;
}









System.prototype.goToUrl = function () {
	var _fater_this = this; 
	
	var go_to_url = $('.go_to_url');
	
	go_to_url.click(function () {
		var _this = $(this);
		var is_new_window = _this.data('is_new_window');
		var url = _this.data('url');
		if (is_new_window == 1) {
			window.open(url);	
		} else {
			window.location.href = url;
		}
	});
}




