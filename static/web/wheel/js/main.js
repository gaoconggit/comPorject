"use strict";

var turnplate = {
  restaraunts: [], //大转盘奖品名称
  colors: [], //大转盘奖品区块对应背景颜色
  outsideRadius: 172, //大转盘外圆的半径
  textRadius: 170, //大转盘奖品位置距离圆心的距离
  insideRadius: 58, //大转盘内圆的半径
  startAngle: 0, //开始角度
  
  bRotate: false //false:停止;ture:旋转
};

var base_url = getQueryVariable("base_url"),
  token = getQueryVariable("token"),
  uid = getQueryVariable("uid");

var dataJson = {
  token: token,
  uid: uid
};

var game_id = 0;            //此游戏ID

$(document).ready(function () {
  
  $(".close").click(function () {
    $(".turnplate-pop").css({
      "opacity": 0,
      "z-index": -1
    });
    $(".pop-wrapper").css({
      "-webkit-transform": "scale3d(0, 0, 0)",
      "-moz-transform": "scale3d(0, 0, 0)",
      "-ms-transform": "scale3d(0, 0, 0)",
      "-o-transform": "scale3d(0, 0, 0)",
      "transform": "scale3d(0, 0, 0)"
    });
  });
  
  //动态添加大转盘的奖品与奖品区域背景颜色
  // turnplate.restaraunts = [100, 200, 300, 400, 500, 600, 700, 800, 900];
  var rotateTimeOut = function rotateTimeOut() {
    $('#wheelcanvas').rotate({
      angle: 0,
      animateTo: 2160,
      duration: 8000,
      callback: function callback() {
        alert('网络超时，请检查您的网络设置！');
      }
    });
  };
  
  //旋转转盘 item:奖品位置; txt：提示语;
  var rotateFn = function rotateFn(item, txt) {
    var angles = item * (360 / turnplate.restaraunts.length) - 360 / (turnplate.restaraunts.length * 2);
    if (angles < 270) {
      angles = 270 - angles;
    } else {
      angles = 360 - angles + 270;
    }
    $('#wheelcanvas').stopRotate();
    $('#wheelcanvas').rotate({
      angle: 0,
      animateTo: angles + 1800,
      duration: 8000,
      callback: function callback() {
        console.log(txt);
        turnplate.bRotate = !turnplate.bRotate;
        
        $(".turnplate-pop").css({"opacity": 1, "z-index": 1000});
        $(".pop-wrapper").css({
          "transform": "scale3d(1,1,1)"
        });
      }
    });
    $('#turnplate').stopRotate();
    $('#turnplate').rotate({
      angle: 0,
      animateTo: angles + 1800,
      duration: 8000
    });
  };
  
  $('.start_btn').click(function () {
    if (turnplate.bRotate) return;
    
    turnplate.bRotate = !turnplate.bRotate;
    
    //获取随机数(奖品个数范围内)
    //var item = rnd(1,turnplate.restaraunts.length);
    var item = 2;
    dataJson.service = "WheelSurf.runGame";
    dataJson.game_id = game_id;
    $.ajax({
      url: base_url,
      type: "POST",
      data: dataJson,
      success: successTurn,
      error: function (err) {
        console.log(err);
        console.log("获取失败");
        sendData("ZhuanpanError");
      }
    });
    
    function successTurn(result) {
      console.log(result);
      if (result.code == "1") {
        sendData("Zhuanpan");                    //通知RN更新历史记录
        result = result.data;
        
        if (parseInt(result.free_chance)) {
          $(".start_text").text("免费" + result.free_chance + "次")
        } else {
          _getZhuanpanInfo();
        }
        
        item = result.result_index + 1;
        
        //奖品数量等于10,指针落在对应奖品区域的中心角度[252, 216, 180, 144, 108, 72, 36, 360, 324, 288]
        rotateFn(item, turnplate.restaraunts[item - 1]);
        /* switch (item) {
            case 1:
                rotateFn(252, turnplate.restaraunts[0]);
                break;
            case 2:
                rotateFn(216, turnplate.restaraunts[1]);
                break;
            case 3:
                rotateFn(180, turnplate.restaraunts[2]);
                break;
            case 4:
                rotateFn(144, turnplate.restaraunts[3]);
                break;
            case 5:
                rotateFn(108, turnplate.restaraunts[4]);
                break;
            case 6:
                rotateFn(72, turnplate.restaraunts[5]);
                break;
            case 7:
                rotateFn(36, turnplate.restaraunts[6]);
                break;
            case 8:
                rotateFn(360, turnplate.restaraunts[7]);
                break;
            case 9:
                rotateFn(324, turnplate.restaraunts[8]);
                break;
            case 10:
                rotateFn(288, turnplate.restaraunts[9]);
                break;
        } */
        console.log("-----");
        console.log(item);
        
        /*获得奖品*/
        /*if (turnplate.restaraunts[result.result_index].img) {
        } else {
            $(".prize-img").attr("src", "./images/jf_1.png");*/
        $(".prize-img").attr("src", result.result_icon);
        $(".description").text(result.result_name);
        //}
      } else if (result.code == "-100") {
        sendData(result.code);
      } else {
        sendData(result.msg);
      }
    }
  });
});

/*获取url参数*/
function getQueryVariable(val) {
  var query = $(location)[0].search.substring(1);
  var values = query.split('&');
  for (var i = 0; i < values.length; i++) {
    var pair = values[i].split('=');
    console.log(pair);
    if (val == pair[0]) {
      return pair[1];
    }
  }
  return false;
}

//页面所有元素加载完毕后执行drawRouletteWheel()方法对转盘进行渲染
window.onload = function () {
  $('body').css({width: $(window).width(), height: $(window).height()});
  $('html').css({width: $(window).width(), height: $(window).height(), overflow: "hidden"});
  $('wrapper').css({width: $(window).width(), height: $(window).height(), overflow: "hidden"});
  var turnplateScale = $(window).width() / 360;
  if ($(window).width() < 360) {
    $('.turnplate').css({
      "transform": "scale(" + turnplateScale + ")",
      "-webkit-transform": "scale(" + turnplateScale + ")",
      "-moz-transform": "scale(" + turnplateScale + ")",
      "-ms-transform": "scale(" + turnplateScale + ")",
      "-o-transform": "scale(" + turnplateScale + ")"
    });
  }
  if ($(window).width() < 334) {
    $('.turnplate').css("margin-left", $(window).width() - 334);
  }
  console.log($(window).width(), $(window).height());
  
  /*跟换背景图片*/
  var winImageArr = ["./images/turnplate-bg-1.png", "./images/turnplate-bg-2.png"];
  var turnplateBg = $('.bg_img');
  var j = 0;
  setInterval(function () {
    if (j >= winImageArr.length) {
      j = 0;
    } else {
      turnplateBg.attr("src", winImageArr[j]);
      j++;
    }
  }, 500);
  
  
  if (!token) {
    sendData("ZhuanpanError");
    return false;
  } else {
    /*获取转盘信息*/
    _getZhuanpanInfo();
  }
};

function _getZhuanpanInfo() {
  $(".img-wrapper").html("");
  dataJson.service = "WheelSurf.gameInfo";
  
  $.ajax({
    url: base_url,
    type: 'POST',
    data: dataJson,
    success: function (result) {
      console.log(result)
      if (result.code == 1) {
        result = result.data;
        game_id = result.game_id;
        if (parseInt(result.free_chance)) {
          $(".start_text").text("免费" + result.free_chance + "次")
        } else {
          $(".start_text").text(result.coin + "金币/次");
        }
        turnplate.restaraunts = result.reward_info;
        
        turnplate.restaraunts.forEach(function (v, i) {
          var itemWrapper = "";
          itemWrapper += "<img src=\"" + v.img + "\" alt=\"\" class=\"item-" + i + "\" style=\"display:none\"/>";
          $(".img-wrapper").append(itemWrapper);
        });
        
        /*绘制文字图片*/
        setTimeout(function () {
          drawRouletteWheel();
        }, 400)
      } else {
        sendData(result.msg);                    //通知RN更新历史记录
      }
    },
    error: function (err) {
      console.log(err);
      console.log("获取失败");
      sendData("ZhuanpanError");
    }
  });
}

function drawRouletteWheel() {
  var canvas = document.getElementById("wheelcanvas");
  if (canvas.getContext) {
    //根据奖品个数计算圆周角度
    var arc = Math.PI / (turnplate.restaraunts.length / 2);
    var ctx = canvas.getContext("2d");
    //在给定矩形内清空一个矩形
    ctx.clearRect(0, 0, 844, 844);
    //strokeStyle 属性设置或返回用于笔触的颜色、渐变或模式
    ctx.strokeStyle = "#FFBE04";
    //font 属性设置或返回画布上文本内容的当前字体属性
    ctx.font = '500 28px Microsoft YaHei';
    console.log(turnplate.restaraunts);
    for (var i = 0; i < turnplate.restaraunts.length; i++) {
      var angle = turnplate.startAngle + i * arc;
      ctx.fillStyle = turnplate.colors[i];
      ctx.beginPath();
      //arc(x,y,r,起始角,结束角,绘制方向) 方法创建弧/曲线（用于创建圆或部分圆）
      // ctx.arc(211, 211, turnplate.outsideRadius, angle, angle + arc, false);
      // ctx.arc(211, 211, turnplate.insideRadius, angle + arc, angle, true);
      ctx.stroke();
      // ctx.fill();
      //锁画布(为了保存之前的画布状态)
      ctx.save();
      
      //----绘制奖品开始----
      ctx.fillStyle = "#FF98BC";
      var text = turnplate.restaraunts[i];
      var line_height = 17;
      //translate方法重新映射画布上的 (0,0) 位置
      ctx.translate(422 + Math.cos(angle + arc / 2) * turnplate.textRadius, 422 + Math.sin(angle + arc / 2) * turnplate.textRadius);
      
      //rotate方法旋转当前的绘图
      ctx.rotate(angle + arc / 2 + Math.PI / 2);
      
      /** 下面代码根据奖品类型、奖品名称长度渲染不同效果，如字体、颜色、图片效果。(具体根据实际情况改变) **/
      //在画布上绘制填色的文本。文本的默认颜色是黑色
      //measureText()方法返回包含一个对象，该对象包含以像素计的指定字体宽度
      ctx.fillText(text.description, -ctx.measureText(text.description).width / 2, 0);
      
      //添加对应图标
      var img = document.querySelector(".item-" + i);
      /* img.onload = function () {
           ctx.drawImage(img, -140, 10);
       };*/
      ctx.drawImage(img, -56, -120, 118, 90);
      //把当前画布返回（调整）到上一个save()状态之前
      ctx.restore();
      //----绘制奖品结束----
    }
  }
}

/*向RN发送通知*/
function sendData(data) {
  if (window.originalPostMessage) {
    window.postMessage(data);
  } else if (window.parent) {
    window.parent.postMessage(data);
  } else {
    throw Error('postMessage错误');
  }
};
