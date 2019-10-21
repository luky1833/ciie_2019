var zr = zrender.init(document.getElementById('main'));
var g = new zrender.Group()
var drawFunc = {
    speed: 0,
    domain: '',
    layerState: false,
    swiperGroup: new zrender.Group(),
    textGroup: new zrender.Group(),
    // 绘制中心点
    createCenterPoint: function () {
        var point = new zrender.Image({
            style: {
                image: '../../static/images/jbh/center.png',
                x: 855,
                y: 430,
            },
            z: 999
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
        var _this = this
        var clickFlag= false
        var speed = p.drop_radiation_speed != 0 ? p.drop_radiation_speed : 20
        var color = p.color
        var name = p.drop_name
        if(p.color=='yellow'||p.color=='red'){
            var id = p.id
            var c = p.color=='red'?'r':'y'
            var id = (id+'').toString().length>1?id:'0'+id
            var url = '../../static/images/jbh/'+id + c +'.gif'
            if(!$('#point'+id).html()){
                $('.gif').prepend(`<div class="mask" id="point${id}" style="background:url(${url})"></div>`)
            }
           
        }
        var x = p.site.split(',')[0]
        var y = p.site.split(',')[1]
        var line = this.drawLine({
            x: x,
            y: y
        }, color)
        var first = 0
        var last = 0.001
        var liftcolor = zrender.color.lift('#fff', 1)
        setInterval(() => {
            first += 0.005;
            last += 0.005;
            var linearColor = new zrender.LinearGradient(x, y, 945, 410, [{ offset: 0, color: p.color }, { offset: 1, color: p.color }], true)
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
        var text = new zrender.Text({
            position: [x * 1 + 25, y],
            style: {
                text: '名称：' + p.drop_name,
                textFill: p.color,
                fontSize: '16'
            },
            z: 999
        })
        g.add(line)
        //zr.add(line)
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
                _this.computeDropLayer([e.target.position[0] ,e.target.position[1]],name)
                this.attr({
                    position: [e.target.position[0] * 1 -12, e.target.position[1] * 1 -12],
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
                $('.swiper-container').show()
                g.childAt(index).show()
                g.childAt(index).attr({
                    shape: {
                        x1: e.target.position[0] * 1,
                        y1: e.target.position[1] * 1,
                        cpx1: _this.computeBC(e.target.position[0] * 1 + 12, e.target.position[1] * 1 + 22)[0],
                        cpy1: _this.computeBC(e.target.position[1] * 1 + 12, e.target.position[1] * 1 + 22)[1],
                    }
                })
                // _this.textGroup.childAt(index).attr({
                //     position: [e.target.position[0] * 1 + 25, e.target.position[1]]
                // })
            },
            ondragend: function (e) {
                $('.swiper-container').show()
                g.childAt(index).show()
                g.childAt(index).attr({
                    shape: {
                        x1: e.target.position[0] * 1 + 12,
                        y1: e.target.position[1] * 1 + 22,
                        cpx1: _this.computeBC(e.target.position[0] * 1 + 12, e.target.position[1] * 1 + 22)[0],
                        cpy1: _this.computeBC(e.target.position[1] * 1 + 12, e.target.position[1] * 1 + 22)[1],
                    }
                })
                // _this.textGroup.childAt(index).attr({
                //     position: [e.target.position[0] * 1 + 25, e.target.position[1]]
                // })
            },
            ondrag: function () {
                $('.droplayer').hide()
                $('.swiper-container').hide()
            },
            onmousedown: function () {
                //$('.swiper-container').hide()
                g.childAt(index).hide()
            },
            onclick: function (e) {
                clickFlag = true
                $('.droplayer').hide()
                _this.computeLayer(e.target.position, p)
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
            if (list[i].state == '3' && list[i].alert && list[i].alert != 'null' && list[i].alert != '""') {
                array.push({ data: list[i], index: i })
            }
        }
        if (array.length) {
            this.createSwiper(array)
        } else {
            $('.swiper-container').remove()
        }
    },
    // 数学计算
    sqrt1: function (x, y, cx, cy) {
        var z = Math.sqrt(x * x + y * y);
        var cz = Math.sqrt(cx * cx + cy * cy);
        var r = (z / cz * 100).toFixed(2)
        return r / 100
    },
    /** 
     *  计算贝塞尔控制点
     * */
    computeBC: function (x1, y1) {
        var center = [950, 470]
        var cx = 950
        var cy = 470
        var q1 = (x1 + cx) / 2
        var q2 = (y1 + cy) / 2 - 100
        if (x1 > cx * 4 / 5 && x1 < 6 * cx / 5) {
            q2 = (y1 + cy) / 2 - 30
        }
        if (y1 > cy * 4 / 5 && y1 < 6 * cy / 5) {
            q2 = (y1 + cy) / 2 - 30
        }
        return [q1, q2]
    },
    /** 
     * 绘制动态射线
     * */
    drawLine: function (points, color) {
        var _this = this
        var linearColor = new zrender.LinearGradient(points.x, points.y, 950, 470, [{ offset: 0, color: color }, { offset: 0.1, color: color }])
        var line = new zrender.BezierCurve({
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
                x1: (points.x * 1 + 20),
                y1: (points.y * 1 + 20),
                cpx1: _this.computeBC(points.x * 1 + 6, points.y * 1 + 22)[0],
                cpy1: _this.computeBC(points.x * 1 + 6, points.y * 1 + 22)[1]
            },
            z: 999
        });
        return line
    },
    /** 
     * 计算
     * */ 
    computeDropLayer:function(position, name){
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
            $('.droplayer').css({
                'left': x+35,
                'top': y-20
            })
            $('.droplayer').fadeIn(200)
    },
    /** 
     * 计算弹窗位置 （250*150）
    */
    computeLayer: function (position, obj, index) {
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
        var jsonstr = obj.bounced_content
        var params = JSON.parse(jsonstr)
        $('.layer h5 .tit').text(params.groupNameDevice)
        $('.layer p').html(`验证门连接总数:${params['ipTotal']} <br/> 验证门未通数:${params['unconnectedNumber']}`)
        $('.layer h5 .time').text(params.updateTime)
        $('.layer').css({
            'left': x,
            'top': y
        })
        $('.layerMask').fadeIn(200)
        this.layerState = true
        if(index){
            $('.layerMask').click(function () {
                g.childAt(index).attr({
                    style: {
                        image: '../../static/images/jbh/red.png',
                    } 
                })
                $('.layerMask').fadeOut(200)
            })
        }
        
    },
    /** 
     * 创建文字弹窗
     * 
     * */ 
    createDropLayer:function(){
        var html = `<div class="droplayer" style="display:none;">
        <p>名称:<span class="dropname"></span></p>
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
                            <h5><em class="tit"></em><span class="time"></span></h5>
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
            var str = JSON.stringify(list[i].data.alert)
            var newStr = str.replace(/(\\r\\n)/g, "");
            var jsonObj = JSON.parse(JSON.parse(newStr))
            html += `<div class="swiper-slide">
                <section>
                <p>设备名称：${jsonObj['deviceName'] ? jsonObj['deviceName'] : ""} <span>${jsonObj['alarmTime'] ? jsonObj['alarmTime'] : ''}</span> </p>
                <p>设备所属组名称：${jsonObj['groupNameDevice'] ? jsonObj['groupNameDevice'] : ''}</p>
                <p>报警信息：${jsonObj['alarmContent'] ? jsonObj['alarmContent'] : ''}</p>
                </section>
            </div>`
        }
        html += `</div>
                    <div class="swiper-pagination"></div> 
                </div>`
        $('.container').append(html)
        var swiper = new Swiper('.swiper-container', {
            effect: 'fade',
            fadeEffect: {
                crossFade: true,
            },
            direction: 'vertical',
            speed: 800,
            loop: true,
            autoplay: {
                delay: 5000,
                stopOnLastSlide: false,
            },
            on: {
                click: function () {
                    var index = this.realIndex
                    _this.swiperGroup.childAt(list[index].index).attr({
                        scale: [1, 1],
                        style: {
                            image: '../../static/images/jbh/' + list[index].data.color + '_active.png',
                        }
                    })
                    _this.computeLayer(_this.swiperGroup.childAt(list[index].index).position, list[index].data, list[index].index)
                    //_this.swiperGroup.childAt(list[index].index).Eventful.trigger('click')
                }
            }
        });
    },
    /** 
     * 
     * 中心点运动点虚线
    */
    createDashedLine() {
        var points = [[990, 505], [1029, 551], [1055, 581], [1077, 614], [1121, 688], [1147, 742], [1174, 816], [1219, 1040]];
        var polyline = new zrender.Polyline({
            style: {
                lineDash: [10, 10],
                stroke: 'rgba(226, 232, 133, 0.6)',
                lineWidth: 20
            },
            shape: {
                points: points.reverse(),
                smooth: 0.3
            },
            z: 999
        });
        zr.add(polyline);
        polyline.animate('style', true)
            .when(1000, {
                lineDashOffset: 20
            })
            .start();
    },
    init: function (list) {
        g.removeAll()
        this.swiperGroup.removeAll()
        zr.clear()
        //this.createDashedLine()
        // this.createCenterPoint()
        this.createLayer()
        this.createDropLayer()
        this.drawListPoint(list)
    }
}