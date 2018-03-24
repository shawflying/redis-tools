

$(function () {
    $(".btn-submit").click(function () {
        var name = $(".txtName").val();
        var ip = $(".txtIp").val();
        var pwd = $(".txtPwd").val();
        var port = $(".txtPort").val();
        var params = {
            name,
            ip,
            pwd,
            port
        }
        location.href = "/redis/main"
        $.post("/redis/login", params, function (data) {
            if (data.code == 1) {
                window.localStorage.db_name = $(".txtName").val();
                location.href = "/redis/main?db_name=" + $(".txtName").val()
            } else {
                alert("链接失败");
            }
        });
    });
});
