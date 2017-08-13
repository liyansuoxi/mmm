$(".scrollTop").click(function(){
        var w = window;
        var option = {
            top: 0,             // 目标位置
            durTime: 1000,      // 动画时长
            delay: 30           // 延迟时间
        };

        // 最终的配置信息
        this[0]._timer = null;                                             // 计时器 ID

        // 局部变量
        var counter = 0,                                                // 用来计数, 函数运行了多少次
            leader = this.scrollTop(),                                  // 当前位置
            stepCount = Math.ceil(option.durTime / option.delay),       // 计时器运行次数
            subDistance = option.top - leader,                          // 当前位置跟目标位置的距离
            step = Math.round(subDistance / stepCount);                 // 每次运行的步长

        // 实际动画特效函数
        (function (option, w) {

            /* 还没到目标位置执行 */
            w.clearInterval(this[0]._timer);
            this[0]._timer = w.setInterval(function () {

                leader = this.scrollTop();

                // 到目标的距离大于当前步长
                if(Math.abs(option.top - leader) > Math.abs(step)) {
                    this.scrollTop(step + leader);
                    return;
                }

                // 到目标位置小于当前步长
                this.scrollTop(option.top);
                w.clearInterval(this[0]._timer);
                // if(callback && typeof callback === "function") {
                //     callback.call(this);
                // }
            }.bind(this), option.delay);

        }.call(this, option, w));
    }.bind($("body")))