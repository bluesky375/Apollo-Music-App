// JavaScript Document 1.0.0
(function($) {
  'use strict';

  // get the next sibling that matches the selector
  // only processes the first item in the passed in jQuery object
  // designed to return a jQuery object containing 0 or 1 DOM elements
  jQuery.fn.findNext = function(selector) {
    return this.eq(0)
      .nextAll(selector)
      .eq(0);
  };

  jQuery.fn.findPrev = function(selector) {
    return this.eq(0)
      .prevAll(selector)
      .eq(0);
  };

  var osofvisitor = navigator.platform.toLowerCase();
  if (osofvisitor.indexOf('mac') > -1) {
    $('html').addClass('mac');
  } else {
    $('html').addClass('windows');
  }

  var themeColor = $('body').attr('theme-color'),
    deviceSize = $('body').attr('device-size'),
    deviceStyle = $('body').attr('device-style');

  //*** Control Panel ***//
  //**
  themeColor = $('body').attr('theme-color', 'rose'); // red, purple, blue, green, yellow, rose
  //**
  //*** Control Panel ***//

  function initialise() {
    bbflyOpacity();
    bbflyAppSwiper();

    onVideosPage();
    onLibraryPage();

    onMusicPlayerOpening();
    onPlaylistOpening();
    onAlbumOpening();
    onArtistOpening();
    onChartsOpening();
    onOptionsOpening();
    onPurchaseOpening();
    onCardSelectionOpening();
    onVideoOpening();
    playPauseButtonAnimation();
  } // end initStuff()

  function onVideosPage() {
    $('#tab-t0-1').on('click', function(e) {
      setTimeout(() => {
        bbflyAppSwiper();
        bbflyLikeContainer();
        onVideoOpening();
      }, 500);
    });
  } // end onVideosPage

  function onLibraryPage() {
    $('#tab-t0-2').on('click', function(e) {
      setTimeout(() => {
        bbflyAppSwiper();
        bbflyLikeContainer();
        onMusicPlayerOpening();
        onPlaylistOpening();
        onAlbumOpening();
        onArtistOpening();
        bbflyFollowButton();
        showHeaderOnScrollDown();
      }, 500);
    });
  } // end onLibraryPage

  function onMusicPlayerOpening() {
    $('.music-player-song').on('click', function(e) {
      setTimeout(() => {
        onOptionsOpening();

        bbflyLikeContainer();
        playPauseButtonAnimation();
        heartLikeAnimation();
        expandMusicPlayerList();
        bbflyVolumePlayer();
      }, 500);
    });
  } // end onMusicPlayerOpening

  function onPlaylistOpening() {
    $('.playlist-button').on('click', function(e) {
      onMusicPlayerOpening();

      bbflyOpacity();
      showHeaderOnScrollDown();
      bbflyFollowButton();
      bbflyLikeContainer();
      heartLikeAnimation();
    });
  } // end onPlaylistOpening

  function onAlbumOpening() {
    $('.album-details-page').on('click', function(e) {
      setTimeout(() => {
        onMusicPlayerOpening();
        onPurchaseOpening();

        bbflyLikeContainer();
        playPauseButtonAnimation();
        heartLikeAnimation();
        showHeaderOnScrollDown();
      }, 500);
    });
  } // end onAlbumOpening

  function onArtistOpening() {
    $('.artist-details-page').on('click', function(e) {
      setTimeout(() => {
        onMusicPlayerOpening();
        onAlbumOpening();

        bbflyLikeContainer();
        bbflyFollowButton();
        showHeaderOnScrollDown();
        bbflyAppSwiper();
      }, 500);
    });
  } // end onArtistOpening

  function onChartsOpening() {
    $('.chart-details-page').on('click', function(e) {
      setTimeout(() => {
        onMusicPlayerOpening();
        bbflyFollowButton();
        showHeaderOnScrollDown();
      }, 500);
    });
  } // end onChartsOpening

  function onOptionsOpening() {
    $('.options-page').on('click', function(e) {
      setTimeout(() => {
        onAlbumOpening();
        onArtistOpening();
      }, 500);
    });
  } // end onOptionsOpening

  function onPurchaseOpening() {
    $('.purchase-page').on('click', function(e) {
      setTimeout(() => {
        onCardSelectionOpening();
      }, 500);
    });
  } // end onPurchaseWindowOpening

  function onCardSelectionOpening() {
    $('.card-selection-page').on('click', function(e) {
      setTimeout(() => {
        bbflyAppSwiper();
      }, 500);
    });
  } // end onPurchaseWindowOpening

  function onVideoOpening() {
    $('.video-details-page').on('click', function(e) {
      setTimeout(() => {
        bbflyLikeContainer();
      }, 500);
    });
  } // end onVideoOpening

  function showHeaderOnScrollDown() {
    $('.special-scroll .scrollable-content').scroll(function() {
      var specialScrollBarHeight = $(
        '.special-scroll .headers[header-type="back"]'
      ).height();

      if ($('.special-scroll .special-scroll-tab').hasClass('active')) {
        $('#status-bar').removeClass('ios-topnavbar-bg');
        if ($(this).scrollTop() > specialScrollBarHeight + 1) {
          $('.special-scroll').addClass('special-scrolling');

          if ($(this).scrollTop() > specialScrollBarHeight + 160) {
            $('.special-scroll').addClass('header-show');
          } else {
            $('.special-scroll').removeClass('header-show');
          }
        } else {
          $('.special-scroll').removeClass('special-scrolling');
        }
      }
    });
  } // end showHeaderOnScrollDown

  function randomNumberFromRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  } // end randomNumberFromRange()

  function playPauseButtonAnimation() {
    var muted = true;

    $('.player-command .playPause, button.play')
      .off('click')
      .on('click', function(e) {
        e.preventDefault();

        var button = $(this);

        if (!muted) {
          $('.play').removeClass('active');
          muted = true;
        } else {
          $('.play').addClass('active');
          muted = false;
        }
      });
  } // playPauseButtonAnimation

  function heartLikeAnimation() {
    $('.player-command .heart').on('click', function() {
      $(this).toggleClass('active');
    });
  } // heartLikeAnimation

  function expandMusicPlayerList() {
    $('.player-command .list .icon').on('click', function() {
      $(
        '.player-audio-min, .album-cover-blur, .container-album-cover, .up-next-option, .player-audio-min.big .scrubber-command.scrubber-options'
      ).toggleClass('active');
      $(
        '.player-audio-min, .album-cover-blur, .container-album-cover, .up-next-option, .player-audio-min.big .scrubber-command.scrubber-options'
      ).addClass('close');
      setTimeout(function() {
        $('.home-indicator-container').toggleClass('only');
        $(
          '.player-audio-min, .album-cover-blur, .container-album-cover, .up-next-option, .player-audio-min.big .scrubber-command.scrubber-options'
        ).removeClass('close');
      }, 300);
      $(this).toggleClass('active');
    });
  } // expandMusicPlayerList

  function bbflyOpacity() {
    $('.scrollable-content').animate({ opacity: '1' }, 1000);
  } // end bbflyOpacity()

  function bbflyLikeContainer() {
    $('.like-container')
      .off('click')
      .on('click', function() {
        var heartIcon = $(this).find('.heart-icon');

        if (heartIcon.hasClass('active')) {
          heartIcon.removeClass('active');
        } else {
          heartIcon.addClass('active');
        }
      });
  } // end bbflyLikeContainer()

  function bbflyFollowButton() {
    $('button.following').on('click', function() {
      if ($(this).hasClass('active')) {
        $(this).removeClass('active');
        $(this).text('follow');
      } else {
        $(this).addClass('active');
        $(this).text('following');
      }
    });
  } // end bbflyFollowButton()

  function bbflyAppSwiper() {
    //var myApp = new Framework7();
    var bbflyMixedSwiper1 = myApp.swiper('.mixed-swiper', {
      width: 626, //294px width
      spaceBetween: 22,
      slidesPerView: 2,
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 537 //251px width
        }
      }
    });

    var bbflyMixedSwiper2 = myApp.swiper('.mixed-swiper-2', {
      width: 359, //343px width
      spaceBetween: 22,
      slidesPerView: 1,
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 308 //292px width
        },
        360: {
          width: 345 //329px width
        }
      }
    });

    var bbflyMixedSwiper3 = myApp.swiper('.mixed-swiper-3', {
      width: 359, //343px width
      spaceBetween: 22,
      slidesPerView: 1,
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 308 //292px width
        },
        360: {
          width: 345 //329px width
        }
      }
    });

    function colorChange() {
      if ($('.demo-container img').length > 0) {
        var myImage = $('.demo-container img');
      } else if ($('.mixed-swiper-3').length > 0) {
        var myImage = $(
          '.mixed-swiper-3.swiper-container:first-of-type .swiper-slide-active img'
        );
      } else if ($('.mixed-swiper-2').length > 0) {
        var myImage = $(
          '.mixed-swiper-2.swiper-container:first-of-type .swiper-slide-active img'
        );
      } else {
        var myImage = $(
          '.mixed-swiper.swiper-container:first-of-type .swiper-slide-active img'
        );
      }

      if ($('.dominant-color').length > 0) {
        try {
          var colorThief = new ColorThief();

          // Grabs 8 swatch color palette from image and sets quality to 5 (0 =slow, 10=default/fast)
          var cp = colorThief.getColor(myImage[0]);
          $('.dominant-color').css(
            'background-color',
            'rgb(' + cp[0] + ',' + cp[1] + ',' + cp[2] + ')'
          );
        } catch (error) {}
      }
    }
    if ($('.mixed-swiper').length > 0) {
      bbflyMixedSwiper1.on('slideChangeEnd', function() {
        colorChange();
      });
      $(this)
        .find('.swiper-container:first-of-type .img-inner-wrapper')
        .imagesLoaded(function() {
          colorChange();
        });
    }
    if ($('.mixed-swiper-2').length > 0) {
      bbflyMixedSwiper2.on('slideChangeEnd', function() {
        colorChange();
      });
      $(this)
        .find('.swiper-container:first-of-type .img-inner-wrapper')
        .imagesLoaded(function() {
          colorChange();
        });
    }
    if ($('.mixed-swiper-3').length > 0) {
      bbflyMixedSwiper3.on('slideChangeEnd', function() {
        colorChange();
      });
      $(this)
        .find('.swiper-container:first-of-type .img-inner-wrapper')
        .imagesLoaded(function() {
          colorChange();
        });
    }

    var bbflymySwiper2 = myApp.swiper('.playlist-swiper', {
      width: 465, //135px width
      spaceBetween: 22,
      slidesPerView: 3,
      freeMode: true,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 405 //115px width
        }
      }
    });

    var bbflymySwiperMultiRow = myApp.swiper('.multi-row-swiper', {
      width: 465, //135px width
      spaceBetween: 22,
      slidesPerView: 3,
      slidesPerColumn: 2,
      freeMode: true,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 402 //115px width
        }
      }
    });

    var bbflyAdCards = myApp.swiper('.ad-cards-swiper', {
      width: 438, //200px width
      spaceBetween: 22,
      slidesPerView: 2,
      loopedSlides: 8,
      loop: true,
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 376 //169px width
        }
      }
    });

    var bbflymySwiper4 = myApp.swiper('.video-swiper-container', {
      width: 476, //216px width
      spaceBetween: 28,
      slidesPerView: 2,
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 537 //251px width
        }
      }
    });

    var bbflymySwiper5 = myApp.swiper('.mood-swiper', {
      width: 184, //168px width
      spaceBetween: 19,
      loopedSlides: 7,
      initialSlide: 3,
      loop: true,
      centeredSlides: true,
      freeMode: true,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 159 //143px width
        }
      }
    });

    var bbflymySwiper6 = myApp.swiper('.favourite-artist-swiper', {
      width: 244, //62px width
      spaceBetween: 21,
      slidesPerView: 3,
      freeMode: true,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 208, //53px width
          spaceBetween: 18
        }
      }
    });

    var bbflymySwiper7 = myApp.swiper('.user-playlist-mini-thumb', {
      width: 180, //130px
      spaceBetween: 15,
      slidesPerView: 1,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 153 //130px width
        }
      }
    });

    var bbflymySwiper8 = myApp.swiper('.video-playlist-swiper', {
      width: 237, //251px width - "740" = 233
      spaceBetween: 22,
      loopedSlides: 2,
      loop: true
    });

    var bbflymySwiper9 = myApp.swiper('.videos-mini-thumb', {
      width: 114, //98px
      spaceBetween: 9,
      slidesPerView: 1,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        360: {
          width: 113 //98px width
        },
        320: {
          width: 97 //112px width
        }
      }
    });

    var bbflymySwiper10 = myApp.swiper('.cards-swiper', {
      width: 644, //305px width
      spaceBetween: 18,
      slidesPerView: 2,
      freeMode: false,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true,
      // Responsive breakpoints
      breakpoints: {
        // when window width is <= 320px
        320: {
          width: 537 //251px width
        }
      }
    });

    var bbflymySwiper11 = myApp.swiper('.emoji-swiper', {
      width: 23, //26px
      breakpoints: {
        // when window width is <= 320px
        360: {
          width: 20 //251px width
        },
        320: {
          width: 21 //251px width
        }
      }
    });

    var bbflymySwiper12 = myApp.swiper('.gif-swiper', {
      width: 172, //172px
      spaceBetween: 15,
      slidesPerView: 1
    });

    var bbflyIsotopeSwiper = myApp.swiper('.isotope-grid', {
      slidesPerView: 'auto',
      freeMode: true,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true
    });

    var bbflyIsotopeSwiper2 = myApp.swiper('.isotope-grid-2', {
      slidesPerView: 'auto',
      freeMode: true,
      freeModeMomentum: true,
      freeModeMomentumBounce: true,
      freeModeMomentumRatio: '1',
      freeModeMomentumVelocityRatio: '0.7',
      freeModeMomentumBounceRatio: '1',
      mousewheelControl: true,
      mousewheelReleaseOnEdges: true,
      mousewheelForceToAxis: true,
      mousewheelInvert: true
    });

    // change is-checked class on buttons
    $('.isotope-grid-filters').each(function(i, buttonGroup) {
      var $buttonGroup = $(buttonGroup);
      $buttonGroup.on('click', 'li', function() {
        $buttonGroup.find('.filter').removeClass('active');
        $(this).addClass('active');
      });
    });

    $('.isotope-grid-filters').on('click', 'li', function() {
      $('.isotope-grid .item-container').isotope({
        filter: $(this).attr('data-filter')
      });
    });

    $('.isotope-grid .item-container').isotope({
      itemSelector: '.grid__item',
      layoutMode: 'packery',
      transitionDuration: '.4s',
      stagger: 65,
      packery: {
        gutter: 8,
        horizontal: true
      }
    });

    $('.isotope-grid-2 .item-container').isotope({
      itemSelector: '.grid__item',
      layoutMode: 'packery',
      transitionDuration: '.4s',
      stagger: 65,
      packery: {
        gutter: 12,
        horizontal: true
      }
    });

    $('.emoji-swiper .item-container').isotope({
      itemSelector: '.your-emoji',
      layoutMode: 'packery',
      transitionDuration: '.4s',
      stagger: 65,
      packery: {
        gutter: 12,
        horizontal: true
      }
    });

    $(window).resize(function(e) {
      $('.isotope-grid-1 .item-container').isotope('layout');
      $('.isotope-grid-2 .item-container').isotope('layout');
    });

    $('.emoji-list-searchbar input').keyup(function(e) {
      $('.emoji-swiper .item-container').isotope('layout');
    });
  } // end bbflyAppSwiper()

  function bbflyVolumePlayer() {
    // HANDLER
    $('.volume').slider({
      min: 0,
      max: 100,
      value: 50,
      range: 'min',
      animate: false,
      slide: function(event, ui) {
        // setVolume(ui.value / 100);
      }
    });

    $('.audio-icon').on('click', function(e) {
      $('.volume-content').addClass('active');
    });

    function setVolume(myVolume) {
      var myMedia = document.getElementsByClassName('the-song');
      myMedia.volume = myVolume;
    }

    // VOLUME BAR
    // volume bar event
    var volumeDrag = false;

    var updateVolume = function(a, vol) {
      var volume = $('.volume');
      var percentage = 0;

      // If only volume have specificed then direct update volume
      if (vol) {
        percentage = vol * 100;
      } else {
        var position = a - volume.offset().left;
        percentage = (100 * position) / volume.width();
      }

      if (percentage > 100) {
        percentage = 100;
      }

      if (percentage < 0) {
        percentage = 0;
      }

      // Update volume bar and video volume
      var dVolumne = percentage / 100;

      $('.volumeBar').css('width', percentage + '%');

      // Change sound icon based on volume
      if (dVolumne == 0) {
        $('.sound')
          .removeClass('sound2')
          .addClass('muted');
      } else if (dVolumne > 0.5) {
        $('.sound')
          .removeClass('muted')
          .addClass('sound2');
      } else {
        $('.sound')
          .removeClass('muted')
          .removeClass('sound2');
      }
    };

    $('.volume').on('touchStart mousedown', function(e) {
      volumeDrag = true;
      $('.sound').removeClass('muted');
      /*updateVolume(e.pageX);*/
    });

    $(document).on('touchEnd mouseup', function(e) {
      if (volumeDrag) {
        volumeDrag = false;
        updateVolume(e.pageX);
        $('.volume-content').removeClass('active');
      }
    });

    $(document).on('mousemove', function(e) {
      if (volumeDrag) {
        updateVolume(e.pageX);
      }
    });
  } // end bbflyVolumePlayer()

  // Inizialize Functions
  initialise();
})(jQuery); //end document
