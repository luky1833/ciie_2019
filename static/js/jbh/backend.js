var zr = zrender.init(document.getElementById('main'));
var g = new zrender.Group()
var drawFunc = {
    speed:0,
    layerState:false,
    swiperGroup:new zrender.Group(),
    textGroup:new zrender.Group(),
     // 绘制中心点
    createCenterPoint:function(){
        var point = new zrender.Image({
            style:{
                image:'../../static/images/jbh/red.png',
                x:945,
                y:410,
                width:24,
                height:33
            },
            z:9999
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
    createPoint:function(p,index){
        var _this = this
        var speed = p.drop_radiation_speed!=0?p.drop_radiation_speed:20
        var color = p.color
        var x = p.site.split(',')[0]
        var y = p.site.split(',')[1]
        var line = this.drawLine({
            x: x,
            y: y
        },color)
        var text = new zrender.Text({
            position:[x*1+25,y],
            style:{
                text:'名称：'+p.drop_name+'\nID：'+p.id,
                textFill:p.color,
                fontSize:'16',
            }
        })
        var first = 0
        var last = 0.001
        var liftcolor = zrender.color.lift('#fff', 1)
        setInterval(()=>{
            first+=0.005;
            last+=0.005;
            var linearColor = new zrender.LinearGradient(x,y,945,410,[{offset:0,color:p.color},{offset:1,color:p.color}],true)
            linearColor.addColorStop(first,liftcolor)
            linearColor.addColorStop(last,p.color)
            line.attr({
                style:{
                    stroke: linearColor
                }})
            if(last>=0.99){
                first=0
                last=0.001
            }
        },speed)
        text.hide()
        this.textGroup.add(text)
        zr.add(text)
        g.add(line)
        zr.add(line)
        line.animate('style', true)
                .when(1000, {
                    lineDashOffset: -20
                })
                .start();
        var point = new zrender.Image({
            position:[x,y],
            scale: [1, 1],
            style:{
                image:'../../static/images/jbh/'+color+'.png',
                x:0,
                y:0,
                width:16,
                height:22,
            },
            onmouseover:function(e){
                this.attr({
                    position:[e.target.position[0]*1-6,e.target.position[1]*1-6],
                    scale: [1.2, 1.2],
                    style:{
                        image:'../../static/images/jbh/'+color+'_active.png',
                        width:20,
                        height:27,
                    }
                })
                _this.textGroup.childAt(index).show()
            },
            onmouseout:function(e){
                this.attr({
                    position:[e.target.position[0]*1+6,e.target.position[1]*1+6],
                    scale: [1, 1],
                    style:{
                        image:'../../static/images/jbh/'+color+'.png',
                        width:16,
                        height:22,
                    }
                })
                _this.textGroup.childAt(index).hide()
                _this.textGroup.childAt(index).hide()
            },
            onmouseup: function(e) {
                _this.textGroup.childAt(index).show()
                g.childAt(index).show()
                g.childAt(index).attr({
                    shape: {
                        x1:  e.target.position[0]*1+12,
                        y1: e.target.position[1]*1+22
                    }
                })
                $('input[name="x"]').val(e.target.position[0])
                $('input[name="y"]').val(e.target.position[1])
                _this.textGroup.childAt(index).attr({
                    position:[e.target.position[0]*1+25,e.target.position[1]]
                })
                $.ajax({
                    url:''
                })
            },
            onmousedown:function(){
                g.childAt(index).hide()
                _this.textGroup.childAt(index).hide()
            },
            onclick:function(e){
                $('.box').show()
                $('#delete').show()
                $('select[name="state"]').val(p.state)
                $('input[name="batch"]').val(p.batch)
                $('input[name="speed"]').val(p.drop_radiation_speed)
                $('input[name="drop_name"]').val(p.drop_name?p.drop_name:0)
                $('input[name="id"]').val(p.id)
               // _this.computeLayer(e.target.position,p)

            },
            cursor:'pointer',
            draggable: true,
        })
        this.swiperGroup.add(point)
        zr.add(point)
    },
    /** 
     * list渲染处理
     * 
    */
    drawListPoint(list){
        var array = []
        for(var i=0;i<list.length;i++){
            this.createPoint(list[i],i)
            if(list[i].state=='3'){
                array.push({data:list[i],index:i})
            }
        } 
        //this.createSwiper(array)  
    },
    /** 
     *  计算贝塞尔控制点
     * */ 
    computeBC:function(x1,y1){
        var center = [957,440]
        var q1 = x1+100
        var q2 = y1/2
        
        if(x1<957&&y1<440){
            q1 = (957-x1)/2+x1
            q2 = y1-200
            console.log(x1,q1)
        }else if(x1<957&&y1>=440){
            q1 = (957-x1)/2+x1
            q2 = y1-250
        }else if(x1>=957&&y1<440){
            q1 = (957-x1)/2+x1
            q2 = 400
        }else{
            q1 = (957-x1)/2+x1
            q2 = y1-250
        }
        return [q1,q2]
    },
    /** 
     * 绘制动态射线
     * */
    drawLine:function(points,color) {
        var _this = this
       var linearColor = new zrender.LinearGradient(points.x,points.y,945,410,[{offset:0,color:color},{offset:0.1,color:color}])
       var line = new zrender.BezierCurve({
           style: {
               //lineDash: [10, 10],
               stroke: linearColor,
               shadowBlur:5,
               shadowColor:'#fff',
               lineWidth:1,  
           },
           shape: {
               x2:945+12,
               y2:410+30,
               x1: (points.x*1+6),
               y1: (points.y*1+22),
               cpx1:_this.computeBC(points.x*1+6,points.y*1+22)[0],
               cpy1:_this.computeBC(points.x*1+6,points.y*1+22)[1]
           }
       });
       return line
   },
    /** 
     * 计算弹窗位置 （250*150）
    */
    computeLayer:function(position,obj){
        var lx = position[0]
        var ly = position[1]
        var x = lx*1+12;
        var y = ly*1+22
        if(lx>=1920-250&&y<1080-150){
            x = lx-250-12;
            y = ly+22
        }else if(lx>=1920-250&&ly>=1080-150){
            x = lx - 250 - 12
            y = ly - 150 - 22
        }else if(lx<1920-250&&ly>=1080-150){
            x = lx +12
            y = ly - 150
        }else{
            x = lx*1+12;
            y = ly*1+22
        }
        var text = obj.bounced_content
        var time = new Date().toLocaleTimeString()
        $('.layer p').text(text)
        $('.layer h5 span').text(time)
        $('.layer').css({
            'left':x,
            'top':y
        })
        $('.layerMask').fadeIn(200)
        this.layerState = true
    },
    /** 
     * 创建弹窗
     * */ 
    createLayer:function(){
        var html = `<div class="layerMask">
                        <div class="layer" style="">
                            <h5>详细信息标题 <span></span></h5>
                            <p></p>
                        </div>
                    </div>`
        $('.container').append(html)
        $('#main').click(function(e){
            e.stopPropagation()
        })
        $('.layerMask').click(function(){
            $('.layerMask').fadeOut(200)
        })
    },
    /** 
     * 创建警告轮播
     * */ 
    createSwiper:function(list){
        var _this = this
        var html = `<div class="swiper-container"><div class="swiper-wrapper">`
        for(var i =0;i<list.length;i++){
            html+=`<div class="swiper-slide"><p>${list[i].data.alert}</p></div>`
        }
        html+=`</div>
                    <div class="swiper-pagination"></div> 
                </div>`    
        $('.container').append(html)      
    },
    /** 
     * 创建新点
     * 
     * */
    createNewPoint:function(){
        $('input[name="id"]').val()
        var index = this.swiperGroup.childCount()
        var p = {
            alert: "",
            batch: "1",
            bounced_content: "",
            color: "green",
            drop_name: "newPoint",
            drop_radiation_speed: 0,
            id: 1,
            site: "200,200",
            state: "1",
        }
        $('.box').show()
        $('input[name="drop_name"]').val(p.drop_name)
        $('input[name="x"]').val(p.site.split(',')[0])
        $('input[name="y"]').val(p.site.split(',')[1])
        $('input[name="batch"]').val(p.batch)
        $('input[name="speed"]').val(p.drop_radiation_speed)
        this.createPoint(p,index)
    } ,
    /** 
     *  删除点位
     * */ 
    init:function(list){
        var _this = this
        g.removeAll()
        this.swiperGroup.removeAll()
        zr.clear()
        this.createCenterPoint()
        this.createLayer()
        this.drawListPoint(list)
        $('#create').click(function(){
            _this.createNewPoint()
        })
    }
}