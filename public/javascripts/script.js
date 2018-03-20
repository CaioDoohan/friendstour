$(document).ready(function(){
    $(".carhome").slick({
        infinite: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        dots:true, 
        arrows:false,
        autoplay: true,
        autoplaySpeed: 2000,
        fade: true,
        cssEase: 'linear',
    });

    $(".hm").slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots:false,
        autoplay: true,
        autoplaySpeed: 6000,
        adaptiveHeight: true,
        responsive: [
            {
              breakpoint: 1091,
              settings: {
                  arrows:false
              },
            },
            {
              breakpoint:688,
              settings:{
                arrows:false,
                slidesToShow: 1,
              }
            }
          ]
    });

    $(".menumob").click(function(){
        $(this).toggleClass("active");
        $(this).parent().find(".menu-top").toggleClass("open");
        var scroll = $(window).scrollTop();
        if ($(".menumob").hasClass("active")) {
            $(".menumob").addClass("scroll");
        } else {
            $(".menumob").removeClass("scroll");
        }      
    });

    $(".sell").click(function(){
        $("#form").show('slow');
        $(".fc").click(function(){
            $("#form").hide('slow');
        });
    });

    function animake(element){
        $(element).mouseover(function(){
            $(".fs").find('svg').addClass('make');
            $(".ts").addClass('fik');
        });
    
        $(element).mouseleave(function(){
            $(".fs").find('svg').removeClass('make');
            $(".ts").removeClass('fik');
        })
    }

    var width = $(window).width();
    console.log(width);
    if( width >= 985){
        animake($(".hv"));
    }else{
        return false;
    }
});




