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
        cssEase: 'linear'
    });
    $(".carvg").slick({
        infinite: true,
        slidesToShow: 2,
        slidesToScroll: 1,
        dots:false,
        autoplay: true,
        autoplaySpeed: 6000,
        variableWidth: true,
    });
});