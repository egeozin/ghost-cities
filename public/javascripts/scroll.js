// select video element
// var vid = document.getElementById('v0');
var vid = $('#v0')[0]; // jquery option
vid.autoplay = true;
 
//refresh video frames on interval for smoother playback
// setInterval(function(){
//     vid.currentTime = window.pageYOffset/1000;
// }, 40);

$(document).ready(function() {

    //
    //    afterLoad: function(anchorLink, index){
    //        $(this).animate({opacity:1}, 500); 
    //    }

    $('#fullpage').fullpage({
        //anchors:["home", "intro1", "intro2", "intro3", "intro4", "mapview", "video1", "video2","video3", "video4","video5","carousel", "press", "info1"],
        anchors:["home", "intro1", "intro2", "mapview", "carousel", "press", "info1", "credits"],
        scrollingSpeed: 600,
        navigation: true,
        navigationPosition: 'left',
        //navigationTooltips: ["home", "intro1", "intro2", "intro3", "intro4", "map", "video1", "video2","video3", "video4","video5","carousel", "press", "info1"],
        navigationTooltips: ["home", "intro1", "intro2", "map", "carousel", "press", "about", "credits"],
        showActiveTooltip: true,
        fadingEffect:'sections',
        fadingEffectKey: 'Z2hvc3RjaXRpZXMubWl0LmVkdV9wZllabUZrYVc1blJXWm1aV04wM0t6',
        scrollOverflow: true,
        scrollOverflowOptions: {
          click: true
        },
        afterLoad: function(anchorLink, index){
            $(this).animate({opacity:1}, 0);
            if(index === 1 && index === 2 && index == 3){
                vid.play();
            }
        },
        onLeave: function(index, nextIndex, direction){
            $(this).animate({opacity:0}, 300);
            if(index == 1 && direction == 'down'){
                $('#header-container').animate({opacity:1}, 500);
                //$('#nav-buttons').fadeIn(500);
            }
            if(index == 2 && direction == 'up'){
                $('#header-container').animate({opacity:0}, 300);
                //$('#nav-buttons').fadeOut(500);
            }
            if(index == 3 && direction == 'down'){
                vid.pause();
            }
            if(index == 4 && direction == 'up'){
                vid.play();
                vid.loop = true;
            }
        }
    });


});



$(window).scroll(function(){
    var st = $(this).scrollTop();
    var winH = $(this).height();
        /* you can set this add, 
        depends on where you want the animation to start
        for example if the section height is 100 and you set add of 50,
        that means if 50% of the section is revealed 
        on the bottom of viewport animate opacity
        */
    var add = 100; //50

    //vid.pause();

    if (st + winH >= $(".map-section").position().top + winH/2){
        $(".map-section").stop().animate({opacity:1}, 'fast');
    } else {
        $(".map-section").stop().animate({opacity:0}, 'fast');
    }

    $('.section-child').each(function(){
        var pos = $(this).position().top + $(this).height();       
        if(st + winH >= pos){
            $(this).stop().animate({opacity:1}, 'fast');
        }else{
            $(this).stop().animate({opacity:0}, 'fast');
        }
    });
}); 

// $("#home-btn").click(function(){
//     $('html,body').animate({scrollTop: 0});
// });
// $("#map-btn").click(function(){
//     $('html,body').animate({scrollTop: $("#map-scroll").offset().top});
// });
// $("#videos-btn").click(function(){
//     $('html,body').animate({scrollTop: $("#videos").offset().top});
// });
// $("#about-btn").click(function(){
//     $('html,body').animate({scrollTop: $("#about").offset().top});
// });
// $("#papers-btn").click(function(){
//     $('html,body').animate({scrollTop: $("#papers").offset().top});
// });


//Loading Baidu API asynchronously
function loadBaiduScripts(){
    var baidu_api = document.createElement("script");
    baidu_api.src = "http://api.map.baidu.com/api?v=2.0&ak=eYf9sA6yVTFHlh9ytU4a0EYY";
    var baidu_js = document.createElement("script");
    baidu_js.src = "javascripts/baiduStreetview.js";
    document.body.appendChild(baidu_api);
    document.body.appendChild(baidu_js);
}

// $(window).load(function(){
//     loadBaiduScripts();
// })
// window.onload = loadBaiduScripts;


