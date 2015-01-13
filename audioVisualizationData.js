/**
 * Created by hebo (razr409355439@gmail.com)on 15/1/13.
 */

(function(exports){

    //https://docs.webplatform.org/wiki/apis/webaudio/AudioContext


        var AudioContext=  window.AudioContext || window.AudioContext || window.webkitAudioContext || window.mozAudioContext;

        if(AudioContext){
            exports.visualization = function(c){
                return new Visualization(c)
            }
        }else{
            alert("您的浏览器不知道Audio")
        }
        function Visualization(config){
            var renderer = config.render ||{},
                running = false ;
            var audio,
                audioCtx,
                analyser,
                source,
                frequencyData;
            function init(){
                audio = document.getElementById(config.id);
                //一个音频容器对象
                audioCtx = new AudioContext(audio)
                //一个分析器
                analyser = audioCtx.createAnalyser(),
                    //拿到输入源
                    //source =  audioCtx.createMediaElementSource(audio);
                    source =  audioCtx.createMediaElementSource(audio);

                source.loop = config.loop||false
                //输入源 连接到 分析器
                source.connect(analyser);
                //分析器 最后连接到 输出
                analyser.connect(audioCtx.destination);
                //Fast Fourier Transform (FFT)是快速傅里叶变换，它是对一定量的数据进行分析。
                // 数据量的大小根据频谱分析的需要，一般为2的n次方，如512，1024，2048，4096等。
                analyser.fftSize = 64;
                //音频中各频率的能量值
                frequencyData = new Uint8Array(analyser.frequencyBinCount);

                renderer.init(analyser.frequencyBinCount)
            }
            this.start = function() {
                audio.play();
                running = true;
                renderFrame();
                return this
            };
            this.stop = function() {
                running = false;
                audio.pause();
                return this
            };
            this.setRenderer = function(r) {
                if (!r.isInitialized()) {
                    r.init({
                        count: analyser.frequencyBinCount
                    });
                }
                renderer = r;
                return this
            };
            this.isPlaying = function() {
                return running;
            }
            var renderFrame = function() {
                //获取能量值
                analyser.getByteFrequencyData(frequencyData);
                //交给render
                renderer.renderFrame(frequencyData);
                if (running) {
                    requestAnimationFrame(renderFrame);
                }
            };

            init()
        }


})(window)
