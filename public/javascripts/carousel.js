$(document).ready(function() {


	/* Function for initializing slider, carousel
     *
     */

    $('#new-carousel').slick({
        centerMode: true,
        infinite: true,
        centerPadding: '40px',
        slidesToShow: 3,
        focusOnSelect:true,
        responsive: [
          {
            breakpoint: 800,
            settings: {
              centerMode: true,
              centerPadding: '60px',
              slidesToShow: 1
            }
          },
          {
            breakpoint: 480,
            settings: {
              centerMode: true,
              centerPadding: '60px',
              slidesToShow: 1
            }
          }
        ]
    })


    /* Carousel section map interaction
     */

    $(document).on('click', "#first-map-button", function(){
        $('#first-clickable-map').hide();
        $('#second-clickable-map').show();
    });

    $(document).on('click', "#second-map-button", function(){
        $('#second-clickable-map').hide();
        $('#new-carousel').css({
            "visibility":'visible',
        });
    });



})