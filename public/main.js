// API createNode(parent, id, text, position).     
//  parent:在该节点下创建，id： 新节点id， text：新节点文本, position：插入位置  
// 封装一个函数动态创建节点  
function createNode(parent_node, new_node_id, new_node_text, position) {
    $('#jstree').jstree('create_node', $(parent_node), { "text": new_node_text, "id": new_node_id }, position, false, false);
}
var com_link_name = "";//当前选择的链接名称
var com_links_list = [];//链接列表，加载后的链接名称
$(function () {
    $.getJSON("/redis/links", function (data) {
        var links = [];//链接
        com_links_list = data.data;
        for (let i = 0; i < data.data.length; i++) {

            let db_list = [];//返回列表 
            for (let t = 0; t < 16; t++) {
                let a = { id: "link_" + data.data[i].id + "__db" + t, text: "db" + t };//"text": "子节点1",  "id": "child1"
                db_list.push(a);
            }

            let a = {
                id: "link_" + data.data[i].id,
                text: data.data[i].link_name,
                "state": {    //默认状态展开  
                    "opened": false
                },
                "children": db_list
            };//"text": "子节点1",  "id": "child1"
            links.push(a);
        }
        //创建列表树
        $('#jstree').jstree({
            'core': {
                'data': links,
                'check_callback': true
            }
        });
        //当jsree加载完成会执行如下函数，创建两个节点  
        $('#jstree').on('ready.jstree', function (e, data) {
            // createNode("#root", "child3", "子节点33", "last");   //在最后插入  
        });
        $('#jstree').bind("activate_node.jstree", function (obj, e) {
            console.log("text:" + e.node.text)
            console.log("id:" + e.node.id)
            console.log("id:" + JSON.stringify(e.node))
            com_link_name = e.node.text;
            //links 层 不进行请求处理
            if (e.node.parent == "#") {
                return
            }

            //db 列表
            if (e.node.text.indexOf("db") > -1 && parseInt(e.node.text.substring(2)) < 16) {
                var ref = $('#jstree').jstree(true);
                $("li[id^=" + e.node.id + "_key]").each(function () {
                    ref.delete_node(this);//点击刷新
                });

                let aa = e.node.id.split("__")
                let db = aa[1].substring(2)
                let link_id = aa[0].substring(5)
                $.getJSON("/redis/keys?link_id=" + link_id + "&db=" + db, function (data) {
                    for (let i = 0; i < data.length; i++) {
                        createNode("#" + e.node.id, e.node.id + "_key" + i, data[i], "last");   //在最后插入  
                    }
                });
                return
            }

            if (e.node.parent.indexOf("db") > -1) {
                let aa = e.node.parent.split("__")
                let db = aa[1].substring(2)
                let link_id = aa[0].substring(5)
                $.post("/redis/values?link_id=" + link_id, { db: db, key: e.node.text }, function (data) {
                    $(".show").html(JSON.stringify(data));
                });
                return
            }
        });
    });
});


//格式化代码函数,已经用原生方式写好了不需要改动,直接引用就好
var formatJson = function (json, options) {
    var reg = null,
            formatted = '',
            pad = 0,
            PADDING = '    ';
    options = options || {};
    options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
    options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
    if (typeof json !== 'string') {
        json = JSON.stringify(json);
    } else {
        json = JSON.parse(json);
        json = JSON.stringify(json);
    }
    reg = /([\{\}])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /([\[\]])/g;
    json = json.replace(reg, '\r\n$1\r\n');
    reg = /(\,)/g;
    json = json.replace(reg, '$1\r\n');
    reg = /(\r\n\r\n)/g;
    json = json.replace(reg, '\r\n');
    reg = /\r\n\,/g;
    json = json.replace(reg, ',');
    if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
        reg = /\:\r\n\{/g;
        json = json.replace(reg, ':{');
        reg = /\:\r\n\[/g;
        json = json.replace(reg, ':[');
    }
    if (options.spaceAfterColon) {
        reg = /\:/g;
        json = json.replace(reg, ':');
    }
    (json.split('\r\n')).forEach(function (node, index) {
                var i = 0,
                        indent = 0,
                        padding = '';

                if (node.match(/\{$/) || node.match(/\[$/)) {
                    indent = 1;
                } else if (node.match(/\}/) || node.match(/\]/)) {
                    if (pad !== 0) {
                        pad -= 1;
                    }
                } else {
                    indent = 0;
                }

                for (i = 0; i < pad; i++) {
                    padding += PADDING;
                }

                formatted += padding + node + '\r\n';
                pad += indent;
            }
    );
    return formatted;
};
//引用示例部分
//(1)创建json格式或者从后台拿到对应的json格式
var originalJson = {"name": "binginsist", "sex": "男", "age": "25"};
//(2)调用formatJson函数,将json格式进行格式化
var resultJson = formatJson(originalJson);
//(3)将格式化好后的json写入页面中




//增加
$(".btn_create").click(function () {
    $(".alert_bg").show();
    $(".add_con").show();
});
//查看数据信息
$(".btn_view_info").click(function () {
    if (com_link_name == "") {
        alert("请选择数据库");
        return;
    }
    let item = {};
    com_links_list.forEach(function (m, i) {
        if (m.link_name == com_link_name) {
            item = m
        }
    })
    if (item.link_name == "" || item.link_name == null || item.link_name == undefined) {
        alert("请选择正确的数据库");
        return;
    }

    $.getJSON("/redis/info/" + com_link_name, function (data) {
        var resultJson = formatJson(data);
        $(".show").html(resultJson);
    });
});
//删除
$(".btn_delete").click(function () {
    if (com_link_name == "") {
        alert("请选择数据库");
        return;
    }
    let item = {};
    com_links_list.forEach(function (m, i) {
        if (m.link_name == com_link_name) {
            item = m
        }
    })
    if (item.link_name == "" || item.link_name == null || item.link_name == undefined) {
        alert("请选择正确的数据库");
        return;
    }
    $.ajax({
        url: "/redis/links/" + com_link_name,
        type: 'DELETE',
        success: function (data) {
            if (data.code == 1) {
                alert("删除成功");
                location.reload();
            } else {
                alert(data.msg);
            }
        }
    });
});
//编辑
$(".btn_edit").click(function () {
    if (com_link_name == "") {
        alert("请选择数据库");
        return;
    }
    let item = {};
    com_links_list.forEach(function (m, i) {
        if (m.link_name == com_link_name) {
            item = m
        }
    })
    if (item.link_name == "" || item.link_name == null || item.link_name == undefined) {
        alert("请选择正确的数据库");
        return;
    }
    $(".txtName").val(item.link_name);
    $(".txtIp").val(item.host);
    $(".txtPwd").val(item.auth);
    $(".txtPort").val(item.port);
    $(".alert_bg").show();
    $(".add_con").show();
});
$(".btn-submit").click(function () {
    var name = $(".txtName").val();
    var ip = $(".txtIp").val();
    var pwd = $(".txtPwd").val();
    var port = $(".txtPort").val();
    var params = {
        link_name: name,
        ip,
        pwd,
        port
    }
    $.post("/redis/links", params, function (data) {
        if (data.code == 1) {
            location.reload();
        } else {
            alert(data.msg);
        }
    });
});

//隐藏
$(".btn-cancel").click(function () {
    $(".alert_bg").hide();
    $(".add_con").hide();
});

$(".alert_bg").click(function (e) {
    $(".alert_bg").hide();
    $(".add_con").hide();
});

$(".add_con").click(function (e) {
    e.stopPropagation();
});