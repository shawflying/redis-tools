// API createNode(parent, id, text, position).     
//  parent:在该节点下创建，id： 新节点id， text：新节点文本, position：插入位置  
// 封装一个函数动态创建节点  
function createNode(parent_node, new_node_id, new_node_text, position) {
    $('#jstree').jstree('create_node', $(parent_node), { "text": new_node_text, "id": new_node_id }, position, false, false);
}
$(function () {
    var db_list = [];//返回列表 
    for (let i = 0; i < 16; i++) {
        let a = { id: "db" + i, text: "db" + i, keys: [] };//"text": "子节点1",  "id": "child1"
        db_list.push(a);
    }
    let db_name = window.localStorage.db_name;
    $.getJSON("/redis/main/load?db_name=" + db_name, function (data) {
        $('#jstree').jstree({
            'core': {
                'data': [{
                    "id": "root",
                    "text": data.data.name,
                    "state": {    //默认状态展开  
                        "opened": true
                    },
                    "children": db_list
                }],
                'check_callback': true
            }
        });
        //当jsree加载完成会执行如下函数，创建两个节点  
        $('#jstree').on('ready.jstree', function (e, data) {
            // createNode("#root", "child3", "子节点33", "last");   //在最后插入  
        });
        $('#jstree').bind("activate_node.jstree", function (obj, e) {
            let isOpenDb = false;//是否点击操作
            for (let i = 0; i < 16; i++) {
                if (e.node.text == "db" + i) {
                    isOpenDb = true;
                } else if (e.node.text == "db" + i) {
                    //点击其他
                }
            }

            if (isOpenDb) {
                var ref = $('#jstree').jstree(true);
                $("li[id^=" + e.node.id + "_key]").each(function () {
                    ref.delete_node(this);//点击刷新
                });

                let db = e.node.text.substring(2)
                $.getJSON("/redis/keys?db_name="+db_name+"&db=" + db, function (data) {
                    for (let i = 0; i < data.length; i++) {
                        createNode("#" + e.node.id, e.node.id + "_key" + i, data[i], "last");   //在最后插入  
                    }
                });
            } else {
                let db = e.node.text.substring(2)
                $.post("/redis/values?db_name="+db_name, { db: 1, key: e.node.text }, function (data) {
                    $(".show").html(JSON.stringify(data));
                });
            }
        });
    });
});