(function ($) {
    "use strict";
    $(document).ready(function () {
        var $back_to_top = $("#back-to-top");

        if ($back_to_top.length) {
            var $min = 200;
            var $inDelay = 600;
            var $outDelay = 400;
            var $scrollSpeed = 300;
            var $easingType = 'linear';

            var $icon = $back_to_top.find("i"); 

            $(window).scroll(function () {
                var $sd = $(window).scrollTop();
                
                var rotation = $sd / $(document).height() * 360;
                $icon.css('transform', 'rotate(' + rotation + 'deg)'); 

                if (typeof document.body.style.maxHeight === "undefined") {
                    $($back_to_top).css({
                        'position': 'absolute',
                        'top': $sd + $(window).height() - 50
                    });
                }

                if ($sd > $min) {
                    $($back_to_top).fadeIn($inDelay);
                } else {
                    $($back_to_top).fadeOut($outDelay);
                }
            });

            $( $back_to_top ).hide().on("click", function(e) {
                $('html, body').animate({scrollTop: 0}, $scrollSpeed, $easingType);
                $('#back-to-top-hover').stop().animate({'opacity': 0 }, $inDelay, $easingType);
                return false;
            }).hover(function() {
                $('#back-to-top-hover').stop().animate({
                    'opacity': 1
                }, 600, 'linear');
            }, function() {
                $('#back-to-top-hover').stop().animate({
                    'opacity': 0
                }, 700, 'linear');
            });
        }
    });
})(jQuery);
