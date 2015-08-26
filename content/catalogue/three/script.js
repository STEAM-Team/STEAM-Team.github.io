$(function() {
    var boxLefts = [];
    $('.scroll').each(function(i, el){
        boxLefts.push(this.offsetTop);
    });
    
    $(document).keydown(function(e) {
        var dir = false,
            targetLeft = -1;
        
        switch (e.keyCode) {
        case 38:
            dir = -1;
            break;                
        case 40:
            dir = 1;
            break;
        default:
            break;
        }

        if (dir) {
            e.preventDefault();
            winLeft = window.scrollY;
            $.each(boxLefts, function(i, v){
                if ((dir == 1 && winLeft < v && targetLeft < 0) ||
                    (dir == -1 && winLeft > v)) {
                    targetLeft = v;
                }
            });
            if (targetLeft >= 0) {
                $('html, body').animate({scrollTop: targetLeft}, 400);
            }
        }
    });
});
