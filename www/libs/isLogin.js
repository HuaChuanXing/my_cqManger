(function() {
    $.ajax({
        type: 'get',
        url: 'http://127.0.0.1:4399/isLogin',
        success(backData) {
            if (backData.denglu == undefined) {
                alert('请登录！');
                location.href = './login.html';
            };
        }
    });
}());