/**
 * Created by hebo (razr409355439@gmail.com)on 15/2/28.
 */


!function(){
    //canvas
    var v = $("#view"),
        canvas = document.createElement("canvas"),
        ctx = canvas.getContext("2d"),
        isMobile = false,
        isApple = false,
        SIZE = 64,
        ARR = [],
        HEIGHT,
        WIDTH

    ARR.dotMode = "random"

    v.appendChild(canvas);

    isMobile&&(SIZE=32)


    //播放列表
    var lis = $all("ul li a")
    var visualizer = new MusicVisualizer({
        size:SIZE,
        onenned:function(){
            console.log('end')
        },
        visualizer:render()
    })

    for(var i=0;i<lis.length;i++){
        lis[i].onclick = function(){
            var p = this.dataset.src
            if(this.classList.contains("play")){
                this.className = "stop";
                MusicVisualizer.stop(visualizer)
            }else{
                visualizer.play('/media/'+p);
                for(var j = 0; j < lis.length; j++){
                    lis[j].className = "";
                }
                this.className = "play active";
            }
        }
    }
    lis[0].click()


    function getArr(){
        ARR.length = 0;
        ARR.linearGradient = ctx.createLinearGradient(0, 200, 0, 0);
        ARR.linearGradient.addColorStop(0, '#109D59');
        ARR.linearGradient.addColorStop(0.5, '#F6B400');
        ARR.linearGradient.addColorStop(1, '#DD4436');
        for(var i = 0;i < SIZE; i++){
            var x =  random(0, WIDTH),
                y = random(0, HEIGHT),
                color = 'rgba(221,68,55,opacity)',
            //color = 'rgba('+random(100, 250)+','+random(50, 250)+','+random(50, 100)+',opacity)',
                ran = random(1, 4);
            ARR.push({
                x: x,
                y: y,
                color: color,
                dx: ARR.dotMode == "random" ? ran : 0,
                dx2: ran,
                dy: random(1, 15),
                cap: 0,
                cheight : 10
            });
        }
    }


    function init(){
        HEIGHT = v.clientHeight,
            WIDTH = v.clientWidth;
        canvas.height = HEIGHT;
        canvas.width = WIDTH;
        getArr();
    }
    init()
    window.onresize = init;

    function render(){
        var o = null
        return function(){
            ctx.fillStyle = ARR.linearGradient
            //ctx.fillStyle = ARR.linearGradient;
            var w = Math.round(WIDTH / SIZE),
                cgap = Math.round(w * 0.3),
                cw = w - cgap;
            ctx.clearRect(0, 0, WIDTH, HEIGHT);

            for(var i = 0; i < SIZE; i++){
                o = ARR[i];
                if(render.type == 'Dot'){
                    //ctx.strokeStyle = ARR[i].color.replace(",0",","+this[i]/270);
                    var x = o.x,
                        y = o.y,
                        r = Math.round((this[i]/2+18)*(HEIGHT > WIDTH ? WIDTH : HEIGHT)/(isMobile ? 500 : 800));
                    o.x += o.dx;
                    //o.x += 2;
                    o.x > (WIDTH + r) && (o.x = - r);

                    //开始路径，绘画圆
                    ctx.beginPath();
                    ctx.arc(x, y, r, 0, Math.PI * 2, true);
                    var gradient = ctx.createRadialGradient(x, y, 0, x, y, r);
                    gradient.addColorStop(0, "rgba(255,255,255,"+(this[i]/280+.5)+")");

                    var per = this[i]/(isMobile ? 160 : 250);
                    per = per > 1 ? 1 : per;

                    gradient.addColorStop(per, o.color.replace("opacity",1-this[i]/(isMobile ? 160 : 220)));
                    //gradient.addColorStop(1, 'rgba(0,0,0,0)');
                    /*for(var j = 0, l = Math.round(this[i]/10); j < l; j++){
                     //ctx.beginPath();
                     ctx.moveTo(x ,y);
                     ctx.quadraticCurveTo(x+random(-30, 30), y+random(-30, 30), random(x + 100), random(y + 100));
                     }
                     //ctx.stroke();*/
                    ctx.fillStyle = gradient;
                    ctx.fill();
                }
                if(render.type == 'Column'){
                    var h = this[i] / 280 * HEIGHT;
                    ARR[i].cheight > cw && (ARR[i].cheight = cw);
                    if(--ARR[i].cap < ARR[i].cheight){
                        ARR[i].cap = ARR[i].cheight;
                    };
                    if(h > 0 && (ARR[i].cap < h + 40)){
                        ARR[i].cap = h + 40 > HEIGHT ? HEIGHT : h + 40;
                    }
                    //console.log(ARR[i].cap);
                    ctx.fillRect(w * i, HEIGHT - ARR[i].cap, cw, ARR[i].cheight);
                    ctx.fillRect(w * i, HEIGHT - h, cw, h);
                }

            }
        }

    }
    render.type = "Column"
    canvas.onclick = function(){
        if(render.type == 'Dot'){
            for(var i = 0;i < SIZE; i++){
                ARR.dotMode == "random" ? ARR[i].dx = 0 : ARR[i].dx = ARR[i].dx2;
            }
            ARR.dotMode = ARR.dotMode == "static" ? "random" : "static";
        }
    }
    var uselect = $all("#select a")
    uselect[0].onclick=function(){
        render.type = "Dot"
        uselect[1].className =""
        this.className = "active"
    }
    uselect[1].onclick=function(){
        render.type = "Column"
        uselect[0].className =""
        this.className = "active"
    }
    console.log(uselect)
    function $(s){
        return document.querySelector(s)
    }

    function $all(s){
        return document.querySelectorAll(s);
    }
    function random(min,max){
        min = min || 0;
        max = max || 1;
        return max >= min ? Math.round(Math.random()*(max - min) + min) : 0;
    }
    !function(){
        var u = window.navigator.userAgent;
        var m = /(Android)|(iPhone)|(iPad)|(iPod)/i;
        if(m.test(u)){
            isMobile = true;
        }
        var ap = /(iPhone)|(iPad)|(iPod)|(Mac)/i;
        if(ap.test(u)){
            isApple = true;
        }
    }();

}()