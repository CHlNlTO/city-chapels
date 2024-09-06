new Swiper('.card-wrapper', {
    loop: true,
    spaceBetween: 30,
  
    // Pagination bullet
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      dynamicBullets: true,
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },

    // Responsive Breakpoints
    breakpoints: {
        0: {
            slidesPerView: 1
        },
        768: {
            slidesPerView: 2
        },        
        1024: {
            slidesPerView: 3
        },
    }
  });


  $(document).ready(function(){
    $(window).scroll(function(){
        // Stick Navbar on scroll
        if(this.scrollY > 20){
            $('.navbar').addClass("Sticky");
        }
        else{
            $('.navbar').removeClass("Sticky");
        }
    })
    // toggle menu
    $('.menu-btn').click(function(){
        $('.navbar .menu').toggleClass("active");
        $('.menu-btn i').toggleClass("active");
    })
})