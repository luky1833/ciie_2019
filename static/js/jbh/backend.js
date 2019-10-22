var zr = zrender.init(document.getElementById('main'));
var g = new zrender.Group()
var drawFunc = {
    
    speed: 0,
    layerState: false,
    swiperGroup: new zrender.Group(),
    textGroup: new zrender.Group(),
    // 绘制中心点
    createCenterPoint: function () {
        var point = new zrender.Image({
            style: {
                image: '../../static/images/jbh/center.png',
                x: 925,
                y: 410,
            },
            z: 1
        })
        zr.add(point)
    },
    /*******  创建坐标点
     *
     * color -坐标点颜色
     * x - 横坐标
     * y - 纵坐标
     * width - 坐标点宽度 默认24
     * height - 坐标点高度 默认33
     *
     *******/
    createPoint: function (p, index) {
        var clickFlag =false
        var _this = this
        var speed = p.drop_radiation_speed != 0 ? p.drop_radiation_speed : 20
        var color = p.color
        var name  = p.drop_name
        var ID = p.id
        var x = p.site.split(',')[0]
        var y = p.site.split(',')[1]
        var line = this.drawLine({
            x: x,
            y: y
        }, color)
        if(p.color=='yellow'||p.color=='red'){
            var id = p.id
            var c = p.color=='red'?'r':'y'
            var id = (id+'').toString().length>1?id:'0'+id
            var url = '../../static/images/jbh/'+id + c +'.gif'
            if(!$('#point'+id).html()){
                $('.gif').prepend(`<div class="mask" id="point${id}" style="background:url(${url})"></div>`)
            }
           
        }
        var text = new zrender.Text({
            position: [x * 1 + 25, y],
            style: {
                text: '名称：' + p.drop_name + '\nID：' + p.id,
                textFill: p.color,
                fontSize: '16',
            }
        })
        var first = 0
        var last = 0.001
        var liftcolor = zrender.color.lift('#fff', 1)
        setInterval(() => {
            first += 0.005;
            last += 0.005;
            var linearColor = new zrender.LinearGradient(x, y, 945, 410, [{
                offset: 0,
                color: p.color ? p.color : 'green'
            }, {offset: 1, color: p.color ? p.color : 'green'}], true)
            linearColor.addColorStop(first, liftcolor)
            linearColor.addColorStop(last, p.color)
            line.attr({
                style: {
                    stroke: linearColor
                }
            })
            if (last >= 0.99) {
                first = 0
                last = 0.001
            }
        }, speed)
        //zr.add(line)
        line.animate('style', true)
            .when(1000, {
                lineDashOffset: -20
            })
            .start();
        var point = new zrender.Image({
            z: 999,
            position: [x, y],
            scale: [1, 1],
            style: {
                image: '../../static/images/jbh/' + color + '.png',
                x: 0,
                y: 0,
                width: 20,
                height: 18,
            },
            onmouseover: function (e) {
                _this.computeDropLayer([e.target.position[0] ,e.target.position[1]],name,ID)
                this.attr({
                    position: [e.target.position[0] * 1-12, e.target.position[1] * 1-12],
                    scale: [1, 1],
                    style: {
                        image: '../../static/images/jbh/' + color + '_active.png',
                        width: 35,
                        height: 34,
                    }
                })
            },
            onmouseout: function (e) {
                $('.droplayer').hide()
                if(clickFlag){
                    this.attr({
                        scale: [1, 1],
                    })
                    clickFlag = false
                }else{
                    this.attr({
                        position: [e.target.position[0] * 1+12, e.target.position[1] * 1+12],
                        scale: [1, 1],
                        style: {
                            image: '../../static/images/jbh/' + color + '.png',
                            width: 20,
                            height: 18,
                        }
                    })
                }
            },
            onmouseup: function (e) {
                $('input[name="x"]').val(e.target.position[0])
                $('input[name="y"]').val(e.target.position[1])
                var site = [e.target.position[0], e.target.position[1]].join(',')

            },
            onmousedown: function () {
                isDrag = true
            },
            ondragend: function (e) {
                $('input[name="x"]').val(e.target.position[0])
                $('input[name="y"]').val(e.target.position[1])
                var site = [e.target.position[0], e.target.position[1]].join(',')
                if (p.id) {
                    $.ajax({
                        url: domain+'/mysql_update_drop_data?drop_name='+p.drop_name+'&site=' + site + '&batch=' + p.batch + '&state=' + p.state + '&drop_radiation_speed=' + p.drop_radiation_speed + '&color=' + p.color + '&id=' + p.id,
                        success: function (result) {
                            var res = JSON.parse(result)
                            if (res.code == '200') {
                                //window.location.reload()
                            }
                        }
                    })
                }
            },
            ondrag: function (e) {
                $('.droplayer').hide()
                if(e.target.position[0]<=0){
                    this.attr({
                        position: [0, e.target.position[1] * 1],
                    }) 
                }
                if(e.target.position[0]>=1870){
                    this.attr({
                        position: [1870, e.target.position[1] * 1],
                    })
                }
                if(e.target.position[1]>=1040){
                    this.attr({
                        position: [e.target.position[0], 1040],
                    })
                }
                if(e.target.position[1]<=0){
                    this.attr({
                        position: [e.target.position[0], 0],
                    })
                }
            },
            onclick: function (e) {
                clickFlag = true
                $('.box').show()
                $('#delete').show()
                $('select[name="state"]').val(p.state)
                $('input[name="batch"]').val(p.batch)
                $('input[name="speed"]').val(p.drop_radiation_speed)
                $('input[name="drop_name"]').val(p.drop_name ? p.drop_name : 0)
                $('input[name="id"]').val(p.id ? p.id : '')
                // _this.computeLayer(e.target.position,p)
                this.attr({
                    position: [e.target.position[0] * 1, e.target.position[1] * 1],
                    scale: [1, 1],
                    style: {
                        image: '../../static/images/jbh/' + color + '_active.png',
                        width: 35,
                        height: 34,
                    }
                })

            },
            cursor: 'pointer',
            draggable: true,
        })
        this.swiperGroup.add(point)
        zr.add(point)
    },
    /**
     * list渲染处理
     *
     */
    drawListPoint(list) {
        var array = []
        for (var i = 0; i < list.length; i++) {
            this.createPoint(list[i], i)
            if (list[i].state == '3') {
                array.push({data: list[i], index: i})
            }
        }
        //this.createSwiper(array)  
    },
    /**
     *  计算贝塞尔控制点
     * */
    computeBC: function (x1, y1) {
        var center = [950,470]
        var cx = 950
        var cy = 470
        var q1 = (x1+cx)/2
        var q2 = (y1+cy)/2 -100
        if(x1>cx*4/5&&x1<6*cx/5){
            q2 = (y1+cy)/2 - 30
        }
        if(y1>cy*4/5&&y1<6*cy/5){
            q2 = (y1+cy)/2 - 30
        }
        return [q1,q2]
    },
    /**
     * 绘制动态射线
     * */
    drawLine: function (points, color) {
        var _this = this
        var pcolor = color ? color : 'green'
        var linearColor = new zrender.LinearGradient(points.x, points.y, 945, 410, [{
            offset: 0,
            color: pcolor
        }, {offset: 0.1, color: pcolor}])
        var line = new zrender.BezierCurve({
            z: 9,
            style: {
                //lineDash: [10, 10],
                stroke: linearColor,
                shadowBlur: 5,
                shadowColor: '#fff',
                lineWidth: 1,
            },
            shape: {
                x2: 950,
                y2: 470,
                x1: (points.x * 1 + 6),
                y1: (points.y * 1 + 22),
                cpx1: _this.computeBC(points.x * 1 + 6, points.y * 1 + 22)[0],
                cpy1: _this.computeBC(points.x * 1 + 6, points.y * 1 + 22)[1]
            }
        });
        return line
    },
    /**
     * 计算弹窗位置 （250*150）
     */
    computeLayer: function (position, obj) {
        var lx = position[0]
        var ly = position[1]
        var x = lx * 1 + 12;
        var y = ly * 1 + 22
        if (lx >= 1920 - 250 && y < 1080 - 150) {
            x = lx - 250 - 12;
            y = ly + 22
        } else if (lx >= 1920 - 250 && ly >= 1080 - 150) {
            x = lx - 250 - 12
            y = ly - 150 - 22
        } else if (lx < 1920 - 250 && ly >= 1080 - 150) {
            x = lx + 12
            y = ly - 150
        } else {
            x = lx * 1 + 12;
            y = ly * 1 + 22
        }
        var text = obj.bounced_content
        var time = new Date().toLocaleTimeString()
        $('.layer p').text(text)
        $('.layer h5 span').text(time)
        $('.layer').css({
            'left': x,
            'top': y
        })
        $('.layerMask').fadeIn(200)
        this.layerState = true
    },
    /** 
     * 计算
     * */ 
    computeDropLayer:function(position, name,id){
        var lx = position[0]
        var ly = position[1]
        var x = lx * 1 + 12;
        var y = ly * 1 + 22
        if (lx >= 1920 - 400 && y < 1080 - 150) {
            x = lx - 250 - 12;
            y = ly + 22
        } else if (lx >= 1920 - 400 && ly >= 1080 - 150) {
            x = lx - 250 - 12
            y = ly - 150 - 22
        } else if (lx < 1920 - 400 && ly >= 1080 - 150) {
            x = lx + 12
            y = ly - 150
        } else {
            x = lx * 1 + 12;
            y = ly * 1 + 22
        }
        $('.dropname').text(name)
        $('.dropid').text(id)
        $('.droplayer').css({
            'left': x+35,
            'top': y-20
        })
        $('.droplayer').fadeIn(200)
},
/** 
     * 创建文字弹窗
     * 
     * */ 
    createDropLayer:function(){
        var html = `<div class="droplayer" style="display:none;">
        <p>名称:<span class="dropname"></span>，ID:<span class="dropid"></span>
        
        </p>
    </div>`
        $('.container').append(html)
        $('#main').click(function (e) {
            e.stopPropagation()
        })
        $('.layerMask').click(function () {
            $('.layerMask').fadeOut(200)
        })
    },
    /**
     * 创建弹窗
     * */
    createLayer: function () {
        var html = `<div class="layerMask">
                        <div class="layer" style="">
                            <h5>详细信息标题 <span></span></h5>
                            <p></p>
                        </div>
                    </div>`
        $('.container').append(html)
        $('#main').click(function (e) {
            e.stopPropagation()
        })
        $('.layerMask').click(function () {
            $('.layerMask').fadeOut(200)
        })
    },
    /**
     * 创建警告轮播
     * */
    createSwiper: function (list) {
        var _this = this
        var html = `<div class="swiper-container"><div class="swiper-wrapper">`
        for (var i = 0; i < list.length; i++) {
            html += `<div class="swiper-slide"><p>${list[i].data.alert}</p></div>`
        }
        html += `</div>
                    <div class="swiper-pagination"></div> 
                </div>`
        $('.container').append(html)
    },
    /**
     * 创建新点
     *
     * */
    createNewPoint: function () {
        $('input[name="id"]').val('')
        var index = this.swiperGroup.childCount()
        var p = {
            alert: "",
            batch: "1",
            bounced_content: "",
            color: "green",
            drop_name: "newPoint",
            drop_radiation_speed: 0,
            id: null,
            site: "0,200",
            state: "1",
        }
        $('.box').show()
        $('input[name="drop_name"]').val(p.drop_name)
        $('input[name="x"]').val(p.site.split(',')[0])
        $('input[name="y"]').val(p.site.split(',')[1])
        $('input[name="batch"]').val(p.batch)
        $('input[name="speed"]').val(p.drop_radiation_speed)
        this.createPoint(p, index)
    },
    /** 
     * 
     * 中心点运动点虚线
    */
   createDashedLine(){
    var points = [[990,505],[1029,551],[1055,581],[1077,614],[1121,688],[1147,742],[1174,816],[1219,1040]];
    var polyline = new zrender.Polyline({
        style: {
            lineDash: [10, 10],
            stroke: 'rgba(226, 232, 133, 0.8)',
            lineWidth: 20
        },
        shape: {
            points: points.reverse(),
            smooth: 0.3
        },
        z:2
    });
    zr.add(polyline);
    polyline.animate('style', true)
        .when(1000, {
            lineDashOffset: 20
        })
        .start();
},
    init: function (list) {
        var _this = this
        this.swiperGroup.removeAll()
        zr.clear()
        this.createDropLayer()
        //this.createDashedLine()
        //this.createCenterPoint()
        this.createLayer()
        this.drawListPoint(list)
        $('#create').click(function () {
            _this.createNewPoint()
        })
    }
}