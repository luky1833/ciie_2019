<%inherit file="base.html"/>
<%block name="content">
    <div class="tab-pane active">
        <div class="portlet light bordered">
            <div class="portlet-title">
                <div class="caption">
                    <i class="fa fa-circle-o-notc"></i>账号列表
                </div>
            </div>
            <div class="portlet-body">
                <button class="btn btn-primary" style="margin-bottom: 30px" id="set">新建账号</button>
                <table class="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>用户ID</th>
                        <th>用户名</th>
                        <th>注册日期</th>
                        <th>姓名</th>
                        <th>角色名称</th>
                        <th>上次登录时间</th>
                        <th>操作</th>
                    </tr>
                    </thead>
                    <tbody id="accountNumberMangerBody">
                    <tr>
                        <td colspan="9" style="text-align: center;">加载中 <img
                                src=${static_url("local/img/input-spinner.gif")}></td>
                    </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    <div class="sign-box">
        <div class="sign-detail">
            <div class="sign-con">
                <h3 id="sign_box_name">修改账号</h3>
                <label><span>用户名：</span><input id="mobile_phone" placeholder="请输入职员手机号"></label><br>
                <label><span>密码：</span><input id="passwd" placeholder="请输入六位以上的密码"></label><br>
                <label><span>确认密码：</span><input id="passwd_again" placeholder="再次确认密码"></label><br>
                <label><span>姓名：</span><input id="people_name" placeholder="请输入职员姓名"></label><br>
                <label>角色职位：<select id="rule" style="margin-left:110px;width: 160px;text-align: center">
                </select>
                </label>
                <div class="sub-but"><input type="button" id="set_new_number" value="确定"> <input class="box-abolish"
                                                                                                 type="button"
                                                                                                 value="取消"
                                                                                                 name="button"></div>
            </div>
        </div>
    </div>


</%block>
<%block name="page_level_css">
    <link rel="stylesheet" type="text/css" href="${ static_url("adminlocal/css/admin.css")}"> />
    <style>
        table.ExcelLoaded tr th, table.ExcelLoaded tr td {
            border: 1px solid grey;
            padding: 4px;
        }

        table.ExcelLoaded {
            width: 100%;
            text-align: left
        }
    </style>
</%block>
<%block name="page_level_script">
    <script type="text/javascript" src="${ static_url("adminlocal/js/admin/admin.js")}"></script>
    <script type="text/javascript" src="${ static_url("adminlocal/js/power/AccountManager.js")}"></script>
    <script>
        $(function () {
            $('#set').click(function () {
                $.get("/api/admin/getaccountRoleManger", function (ret) {
                            // var auxArr = [];
                            $("#rule").find("option").remove();
                            // $("#ads_schedule_id_list").append("<option value=''></option>");
                            $.each(ret.data.data, function (k, v) {
                                $("#rule").append("<option value='" + v["role_id"] + "'>" + v["role_name"] + "</option>");
                            });
                            // $('#ads_schedule_id_list').append(auxArr.join(''));
                            $('#rule').attr('rebuild');
                            // cb&&cb();
                        }
                );

                $('.sign-box').fadeIn(222);
                $('.sign-detail').fadeIn(222);
                $('#sign_box_name').text('新建账号');
                $('#set_new_number').click(function () {
                    var mobile_phone = $('#mobile_phone').val();
                    var passwd = $('#passwd').val();
                    var passwd_again = $('#passwd_again').val();
                    var people_name = $('#people_name').val();
                    var rule = $('#rule option:selected').val();
                    var xhr = new XMLHttpRequest();
                    var form = new FormData();
                    if (mobile_phone.length != 11 || isNaN(mobile_phone)) {
                        alert('请输入正确的手机号');
                        return false
                    }
                    if (passwd.length < 6) {
                        alert('密码至少6位');
                        return false
                    }
                    if (passwd_again != passwd) {
                        alert('两次输入的密码不同，重新输入');
                        return false
                    }
                    if (mobile_phone == '' || passwd == '' || passwd_again == '' || people_name == '' || rule == '') {
                        alert('所有值都不能为空');
                        return false
                    }
                    ## 发送post请求，所有参数添加到表单对象中发送
                     form.append("mobile_phone", mobile_phone);
                    form.append("passwd", passwd);
                    form.append("passwd_again", passwd_again);
                    form.append("people_name", people_name);
                    form.append("rule", rule);
                    xhr.open("post", "/api/admin/AccountMangerAdd", false);
                    xhr.send(form);
                    data = eval("(" + xhr.response + ")");
                    if (data.code == 200) {
                        $('.sign-box').hide();
                        $('.sign-detail').hide();
                        $('#logo_img').attr('src', data.data.logurl)
                        alert(data.message);
                        window.location.reload()
                    } else if (data.code == 0) {
                        $('.sign-box').hide();
                        $('.sign-detail').hide();
                        alert(data.message);
                        window.location.reload()
                    } else {
                        $('.sign-box').hide();
                        $('.sign-detail').hide();
                        alert(data.message);
                        window.location.reload()
                    }


                })


            });


        })

    </script>

</%block>
