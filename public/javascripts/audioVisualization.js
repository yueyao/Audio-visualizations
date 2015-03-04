/**
 * Created by hebo (razr409355439@gmail.com)on 15/3/2.
 */
(function(exports){
    //https://docs.webplatform.org/wiki/apis/webaudio/AudioContext
    var AudioContext=
        exports.AudioContext ||
        exports.AudioContext ||
        exports.webkitAudioContext ||
        exports.mozAudioContext;



    function MusicVisualizer(opts){
        var me = this;

        //播放过的bufferSource
        me.buffer = {}
        //正在播放的bufferSource
        me.source = null
        //选择过的累计数量
        me.count = 0
        //播放完成以后的回调
        me.onended = opts.onended
        //unit8Array 长度
        me.size = opts.size
        //可视化调用的函数
        me.visualizer = opts.visualizer
        //初次加载回调
        me.initCb = null

        //音量控制
        me.gainNode = MusicVisualizer.ac[MusicVisualizer.ac.createGain?"createGain":"createGainNode"]()

        //分析器，分析音频
        me.analyser = MusicVisualizer.ac.createAnalyser()

        me.analyser.connect(me.gainNode)

        me.gainNode.connect(MusicVisualizer.ac.destination)

        this.xhr = new XMLHttpRequest()

        MusicVisualizer.visualize(this)
    }
    MusicVisualizer.ac = new AudioContext()
    /**
     * 加载音频资源
     * @param xhr   xhr对象
     * @param path  音频资源路径
     * @param fun   回调
     */
    MusicVisualizer.load = function(xhr,path,fun){
        xhr.abort()
        xhr.open("GET",path,true)
        xhr.responseType = "arraybuffer"
        xhr.onload = function(){
            isFunction(fun)&&fun.call(xhr.response)
        }
        xhr.send()
    }
    //播放对象
    MusicVisualizer.play = function(mv){
        mv.source.connect(mv.analyser)

        mv.source.start()

        isFunction(mv.onended)&&(mv.source.onended=mv.onended)
    }

    MusicVisualizer.stop = function(mv){
        mv.source.stop()
        mv.source.onended = null
    }

    MusicVisualizer.visualize = function(mv){
        //傅里叶变换
        //Fast Fourier Transform (FFT)是快速傅里叶变换，它是对一定量的数据进行分析。
        // 数据量的大小根据频谱分析的需要，一般为2的n次方，如512，1024，2048，4096等。
        mv.analyser.fftSize = mv.size*2

        var arr = new Uint8Array(mv.analyser.frequencyBinCount);

        var requestAnimationFrame = exports.requestAnimationFrame ||
            exports.webkitRequestAnimationFrame ||
            exports.oRequestAnimationFrame ||
            exports.mzRequestAnimationFrame;


        function v(){
            mv.analyser.getByteFrequencyData(arr)
            mv.visualizer.call(arr)
            requestAnimationFrame(v)
        }
        isFunction(mv.visualizer)&&requestAnimationFrame(v)
    }

    MusicVisualizer.prototype.decode = function(arrayBuffer,fun){
        var me = this

        MusicVisualizer.ac.decodeAudioData(arrayBuffer,function(buffer){
            var bufferSourceNode = MusicVisualizer.ac.createBufferSource()

            bufferSourceNode.buffer = buffer

            fun.call(bufferSourceNode)
        },function(err){

        })
    }

    MusicVisualizer.prototype.play = function(path){
        var me = this,
            count = ++me.count

        //暂停当前的播放
        me.source && MusicVisualizer.stop(me)

        if(path instanceof ArrayBuffer){
            me.decode(path, function(){
                me.source = this;
                MusicVisualizer.play(me);
            });
        }

        if(typeof(path)=="string" ){
            if(path in me.buffer){
                MusicVisualizer.stop(me.source)

                var bufferSource = MusicVisualizer.ac.createBufferSource()
                bufferSource.buffer = me.buffer[path]
                me.source = bufferSource
                MusicVisualizer.play(me)
            }else{
                MusicVisualizer.load(me.xhr,path,function(){
                    if(count != me.count) return

                    me.decode(this,function(){
                        if(count != me.count) return

                        me.initCb && !me.source && isFunction(me.initCb) && me.initCb()

                        me.source = this

                        MusicVisualizer.play(me)
                    })
                })
            }

        }
    }
    MusicVisualizer.prototype.start = function(){
        this.source&& this.source.start()
    }
    MusicVisualizer.prototype.addinit = function(fun){
        this.initCb = fun
    }
    MusicVisualizer.prototype.changeVolume = function(rate){
        this.gainNode.gain.value = rate * rate
    }
    var isFunction = function(fun){
        return Object.prototype.toString.call(fun) == "[object Function]";
    }

    if(AudioContext){
        //exports.visualization = function(c){
        //    return new Visualization(c)
        //}
        exports.MusicVisualizer = MusicVisualizer
    }else{
        alert("您的浏览器不知道Audio")
    }
})(window)
