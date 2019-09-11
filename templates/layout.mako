<!DOCTYPE html>
<!--[if IE 8]>
<html lang="en" class="ie8 no-js"> <![endif]-->
<!--[if IE 9]>
<html lang="en" class="ie9 no-js"> <![endif]--
<!--[if !IE]><!-->
<html lang="en" class="no-js">
<!--<![endif]-->
<head>
    <meta charset="utf-8"/>
    <title>公会管理系统</title>
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta content="width=device-width, initial-scale=1" name="viewport"/>
    <meta name="description" content="公会管理系统"/>
    <meta name="author" content="竹筏"/>
    ##         <meta name="csrf-token" content="{{ csrf_token() }}">

    <link href="${ static_url('local/img/logo.png')}" rel='icon' type='image/x-ico'/>

    <link href="${ static_url("plugins/font-awesome/css/font-awesome.min.css")}" rel="stylesheet" type="text/css"/>
    <link href="${ static_url("plugins/simple-line-icons/simple-line-icons.min.css")}" rel="stylesheet"
          type="text/css"/>
    <link href="${ static_url("plugins/bootstrap/css/bootstrap.min.css")}" rel="stylesheet" type="text/css"/>
    <link href="${ static_url("plugins/uniform/css/uniform.default.css")}" rel="stylesheet" type="text/css"/>
    <link href="${ static_url("adminlocal/css/tasks.css")}" rel="stylesheet" type="text/css"/>
    <link href="${ static_url("plugins/bootstrap-select/bootstrap-select.min.css")}" type="text/css" rel="stylesheet"/>
    <link href="${ static_url("adminlocal/css/components.css")}" id="style_components" rel="stylesheet"
          type="text/css"/>
    <link href="${ static_url("adminlocal/css/plugins.css")}" rel="stylesheet" type="text/css"/>
    <link href="${ static_url("adminlocal/css/layout.css")}" rel="stylesheet" type="text/css"/>
    <link href="${ static_url("adminlocal/css/themes/darkblue.css")}" rel="stylesheet" type="text/css"/>
    <link href="${ static_url("plugins/artDialog/css/xiaoquan-dialog.css")}" rel="stylesheet" type="text/css"/>
    <link href="${ static_url("plugins/artDialog/css/ui-dialog.css")}" rel="stylesheet" type="text/css"/>
    <%block name="page_level_css"/>
    <!--[if lt IE 9]>
        <!--<script src="${ static_url("plugins/respond.min.js")}"></script>-->
    <script src="${ static_url("plugins/respond.min.js")}"></script>
    <![endif]-->

    <script src="${ static_url("plugins/jquery.min.js")}" type="text/javascript"></script>
    <script src="${ static_url("plugins/jquery-migrate.min.js")}" type="text/javascript"></script>
    <script src="${ static_url("plugins/jquery-ui.min.js")}" type="text/javascript"></script>
    <script src="${ static_url("plugins/bootstrap/js/bootstrap.min.js")}" type="text/javascript"></script>
    <script src="${ static_url("plugins/bootstrap-hover-dropdown/bootstrap-hover-dropdown.min.js")}"
            type="text/javascript"></script>
    <script src="${ static_url("plugins/jquery-slimscroll/jquery.slimscroll.min.js")}" type="text/javascript"></script>
    <script src="${ static_url("plugins/jquery.blockui.min.js")}" type="text/javascript"></script>
    <script src="${ static_url("plugins/uniform/jquery.uniform.min.js")}" type="text/javascript"></script>
    <script src="${ static_url("adminlocal/js/metronic.js")}" type="text/javascript"></script>
    <script src="${ static_url("adminlocal/js/layout.js")}" type="text/javascript"></script>
    <script src="${ static_url("plugins/bootstrap-select/bootstrap-select.js")}" type="text/javascript"></script>
    <script src="${ static_url("plugins/artDialog/dist/dialog-plus-min.js")}" type="text/javascript"></script>
    <script src="${ static_url("adminlocal/js/common.js")}" type="text/javascript"></script>
</head>
<body class="page-header-fixed page-quick-sidebar-over-content page-style-square">
<div class="page-header navbar navbar-fixed-top">
    <div class="page-header-inner">
        <a data-target=".navbar-collapse" data-toggle="collapse" class="navbar-toggle collapsed" href="javascript:;">
            ##                 <img alt="" src="/adminlocal/img/sidebar_inline_toggler_icon_default.jpg">
                <img alt="" src="${ static_url("adminlocal/img/sidebar_inline_toggler_icon_default.jpg")}">
        </a>
        <div class="page-logo" style="width: 22%;margin-top:10px;">
            <!--<a href="#"></a>--><span style="color:#fff;">用户管理后台</span>
        </div>
        <ul class="nav navbar-nav pull-right">
            <li class="dropdown user">
                <a href="#" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown"
                   data-close-others="true">
                    <span class="username"></span><i class="fa fa-angle-down"></i>
                </a>
                <ul class="dropdown-menu">
                    <li>
                        <a href="/admin/logout"> <i class="fa fa-chevron-circle-left"></i> 登出</a>
                    </li>
                    <li>
                        <a onclick="userpassword_edit()"> <i class="fa fa-chevron-circle-left"></i>
                            修改密码</a>
                    </li>
                </ul>
                <ul class="dropdown-menu">

                </ul>
            </li>
        </ul>
    </div>
</div>

<div class="modal fade" tabindex="-1" role="dialog" id="edit_pass_show">
    <div class="modal-dialog" role="document">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">修改密码</h4>
            </div>
            <div class="modal-body">
                <form class="form-horizontal">
                    <div class="form-group">
                        <label class="col-sm-3 control-label">密码：</label>
                        <div class="col-sm-9">
                            <input class="form-control" id="passwd_set" type="text" placeholder="必填项"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <label class="col-sm-3 control-label">确认密码：</label>
                        <div class="col-sm-9">
                            <input class="form-control" id="passwd_again_set" type="text" placeholder="必填项"/>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-primary">确认</button>
                <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>
            </div>
        </div>
    </div>
</div>


<div class="clearfix"></div>
<div class="page-container">
    ##         @include('adminlayout.sidebar')
        <%include file="sidebar.mako" />
    <div class="page-content-wrapper">
        <div class="page-content">
            ##                 {!! Notification::showAll() !!}
            ##                 @yield('content')
                <%block name="content"/>
        </div>
    </div>
</div>

    ##     @yield('page_level_script')
    <%block name="page_level_script"/>
<script type="text/javascript">
    (function () {
        Metronic.init();
        Layout.init();
        %if 'menu' in data  and 'submenu' in data:
            var $topMenu = $('.page-sidebar-menu > li[data-menu=${data['menu']}]');
            $topMenu.addClass('active').find('a:first').append('<span class="selected"></span>');
            var $submenu = '${data['submenu']}';
            if ($submenu.length > 0) {
                $topMenu.find('ul li[data-menu=${data['submenu']}]').addClass('active');
            }
            if ($('div.alert-danger') || $('div.alert-success')) {
                setTimeout(function () {
                    $('div.alert-danger').remove();
                    $('div.alert-success').remove();
                }, 2500);
            }
        %endif
    })();


    function userpassword_edit() {
        // var id = document.getElementById("user_id").innerHTML;
        // $('.sign-box-edit').show();
        // $('.sign-detail-edit').fadeIn(222);
        // alert(login_name);
        $("#edit_pass_show").modal("show");
        $("#edit_pass_show .btn-primary").click(function () {
            var passwd = $('#passwd_set').val();
            var passwd_again = $('#passwd_again_set').val();
            var xhr = new XMLHttpRequest();
            var form = new FormData();

            if (passwd.length < 6) {
                alert('密码至少6位');
                return false
            }
            if (passwd_again != passwd) {
                alert('两次输入的密码不同，重新输入');
                return false
            }

            // 发送post请求，所有参数添加到表单对象中发送
            form.append("passwd", passwd);
            form.append("passwd_again", passwd_again);
            xhr.open("post", "/admin/logout_edit_password", false);
            xhr.send(form);
            data = eval("(" + xhr.response + ")");
            if (data.code == 200) {
                $("#edit_pass_show").modal("hide");
                $('#logo_img').attr('src', data.data.logurl)
                alert(data.message);
                window.location.href='/admin/logout';
##                 window.location.reload()
            }  else {
                alert(data.message);
                $("#edit_pass_show").modal("hide");
                window.location.reload()
            }


        })
    }


</script>
</body>
</html>