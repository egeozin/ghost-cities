
$(document).ready(function() {

    /* Responsive Navbar and Background Video
    */

    var $player = $("#v0");

    var setVideoTransform = function(scale, margin, flag) {
        offset = $.extend({ x: 0, y: 0 }, false);
        var transform = 'translate(' + Math.round(offset.x) + 'px,' + Math.round(offset.y) + 'px) scale(' + scale  + ')';
        var transform2 = 'scale(' + scale + ')';

        $player.css({
            '-webkit-transform': transform2,
            'transform': transform2,
            'margin-top': margin
        });

        if (flag) {

            //var scales = $player.css("transform");

            //var scale = getScaleDegrees(scales);
            
            $player.css({
                "min-width": `100%`,
                "min-height": `100%`,
                "width": `auto`, 
                "height": `auto`,
                "position": `absolute`,
                "top": `50%`,
                "left": `50%`,
                "transform": `translate(-50%,-50%)`,
                "background-size": `cover`,
                "transition": `1s opacity`
            })

        }
    };

    function checkWidth() {
        var windowWidth = $(window).width();
        var windowHeight = $(window).height();

        if (windowWidth < 800) {
            
            setVideoTransform(2, -300, false);
        } else {
            
            setVideoTransform(1, 0, true);
        }

        if (windowWidth < 600) {
            $('#fp-nav').hide();
            $('#menu-toggle').show();

        } else {
            $('#fp-nav').show();
            $('#menu-toggle').hide();
        }


        if (windowHeight < 600 ){

        }else {

        }

    }

    checkWidth();

    $(window).resize(checkWidth);


})