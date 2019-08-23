/*! device.js 0.2.7 */
(function(){var a,b,c,d,e,f,g,h,i,j;b=window.device,a={},window.device=a,d=window.document.documentElement,j=window.navigator.userAgent.toLowerCase(),a.ios=function(){return a.iphone()||a.ipod()||a.ipad()},a.iphone=function(){return!a.windows()&&e("iphone")},a.ipod=function(){return e("ipod")},a.ipad=function(){return e("ipad")},a.android=function(){return!a.windows()&&e("android")},a.androidPhone=function(){return a.android()&&e("mobile")},a.androidTablet=function(){return a.android()&&!e("mobile")},a.blackberry=function(){return e("blackberry")||e("bb10")||e("rim")},a.blackberryPhone=function(){return a.blackberry()&&!e("tablet")},a.blackberryTablet=function(){return a.blackberry()&&e("tablet")},a.windows=function(){return e("windows")},a.windowsPhone=function(){return a.windows()&&e("phone")},a.windowsTablet=function(){return a.windows()&&e("touch")&&!a.windowsPhone()},a.fxos=function(){return(e("(mobile;")||e("(tablet;"))&&e("; rv:")},a.fxosPhone=function(){return a.fxos()&&e("mobile")},a.fxosTablet=function(){return a.fxos()&&e("tablet")},a.meego=function(){return e("meego")},a.cordova=function(){return window.cordova&&"file:"===location.protocol},a.nodeWebkit=function(){return"object"==typeof window.process},a.mobile=function(){return a.androidPhone()||a.iphone()||a.ipod()||a.windowsPhone()||a.blackberryPhone()||a.fxosPhone()||a.meego()},a.tablet=function(){return a.ipad()||a.androidTablet()||a.blackberryTablet()||a.windowsTablet()||a.fxosTablet()},a.desktop=function(){return!a.tablet()&&!a.mobile()},a.television=function(){var a;for(television=["googletv","viera","smarttv","internet.tv","netcast","nettv","appletv","boxee","kylo","roku","dlnadoc","roku","pov_tv","hbbtv","ce-html"],a=0;a<television.length;){if(e(television[a]))return!0;a++}return!1},a.portrait=function(){return window.innerHeight/window.innerWidth>1},a.landscape=function(){return window.innerHeight/window.innerWidth<1},a.noConflict=function(){return window.device=b,this},e=function(a){return-1!==j.indexOf(a)},g=function(a){var b;return b=new RegExp(a,"i"),d.className.match(b)},c=function(a){var b=null;g(a)||(b=d.className.replace(/^\s+|\s+$/g,""),d.className=b+" "+a)},i=function(a){g(a)&&(d.className=d.className.replace(" "+a,""))},a.ios()?a.ipad()?c("ios ipad tablet"):a.iphone()?c("ios iphone mobile"):a.ipod()&&c("ios ipod mobile"):a.android()?c(a.androidTablet()?"android tablet":"android mobile"):a.blackberry()?c(a.blackberryTablet()?"blackberry tablet":"blackberry mobile"):a.windows()?c(a.windowsTablet()?"windows tablet":a.windowsPhone()?"windows mobile":"desktop"):a.fxos()?c(a.fxosTablet()?"fxos tablet":"fxos mobile"):a.meego()?c("meego mobile"):a.nodeWebkit()?c("node-webkit"):a.television()?c("television"):a.desktop()&&c("desktop"),a.cordova()&&c("cordova"),f=function(){a.landscape()?(i("portrait"),c("landscape")):(i("landscape"),c("portrait"))},h=Object.prototype.hasOwnProperty.call(window,"onorientationchange")?"orientationchange":"resize",window.addEventListener?window.addEventListener(h,f,!1):window.attachEvent?window.attachEvent(h,f):window[h]=f,f(),"function"==typeof define&&"object"==typeof define.amd&&define.amd?define(function(){return a}):"undefined"!=typeof module&&module.exports?module.exports=a:window.device=a}).call(this);
/*
* jQuery.appear
* https://github.com/bas2k/jquery.appear/
* http://code.google.com/p/jquery-appear/
* http://bas2k.ru/
*
* Copyright (c) 2009 Michael Hixson
* Copyright (c) 2012-2014 Alexander Brovikov
* Licensed under the MIT license (http://www.opensource.org/licenses/mit-license.php)
*/
(function($){$.fn.appear=function(fn,options){var settings=$.extend({data:undefined,one:true,accX:0,accY:0},options);return this.each(function(){var t=$(this);t.appeared=false;if(!fn){t.trigger('appear',settings.data);return;}
                                                                                                                                                 var w=$(window);var check=function(){if(!t.is(':visible')){t.appeared=false;return;}
	var a=w.scrollLeft();var b=w.scrollTop();var o=t.offset();var x=o.left;var y=o.top;var ax=settings.accX;var ay=settings.accY;var th=t.height();var wh=w.height();var tw=t.width();var ww=w.width();if(y+th+ay>=b&&y<=b+wh+ay&&x+tw+ax>=a&&x<=a+ww+ax){if(!t.appeared)t.trigger('appear',settings.data);}else{t.appeared=false;}};var modifiedFn=function(){t.appeared=true;if(settings.one){w.unbind('scroll',check);var i=$.inArray(check,$.fn.appear.checks);if(i>=0)$.fn.appear.checks.splice(i,1);}
	fn.apply(this,arguments);};if(settings.one)t.one('appear',settings.data,modifiedFn);else t.bind('appear',settings.data,modifiedFn);w.scroll(check);$.fn.appear.checks.push(check);(check)();});};$.extend($.fn.appear,{checks:[],timeout:null,checkAll:function(){var length=$.fn.appear.checks.length;if(length>0)while(length--)($.fn.appear.checks[length])();},run:function(){if($.fn.appear.timeout)clearTimeout($.fn.appear.timeout);$.fn.appear.timeout=setTimeout($.fn.appear.checkAll,20);}});$.each(['append','prepend','after','before','attr','removeAttr','addClass','removeClass','toggleClass','remove','css','show','hide'],function(i,n){var old=$.fn[n];if(old){$.fn[n]=function(){var r=old.apply(this,arguments);$.fn.appear.run();return r;}}});})(jQuery);

function anchor(a){var top = document.getElementById(a).offsetTop; window.scrollTo(0, top); }


// JavaScript Document 1.0.0
(function($) {
  "use strict";

  var counter = 0,
      c = 0,
      i = setInterval(function(){
        $(".loading-page .counter h1").html(c);
        $(".loading-page .counter hr").css("width", c + "%");

        $(".counter").addClass('active');
        counter++; c++;

        if ( (counter == 101) && $(window).load() ) {
          clearInterval(i);
          $("body").addClass('loaded');
          setTimeout(function(){
            $("body").addClass('loading-ready');
          }, 400);
          //On-Scroll Animations
          $('.animated').appear(function() {
            $(this).each(function(){ 
              $(this).css('visibility','visible');
              $(this).addClass($(this).data('fx'));
            });
          },{accY: -129});

          setTimeout(function(){
            $('.loading-page').remove();
          }, 1000);
        }
      }, 50);
      
  //On-Scroll Animations
  $(window).load(function() {
    if ( $(window).width() > 1023 ) {
      $('iframe').contents().find('body').css('border-radius','12px');
      $('iframe').contents().find('body').attr("device-size", 'standard');
    }
  });

  function setCookie(cname,cvalue,exdays) {var d = new Date();d.setTime(d.getTime() + (exdays*24*60*60*1000));var expires = "expires=" + d.toGMTString();document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";}
  function getCookie(cname) {var name = cname,decodedCookie = decodeURIComponent(document.cookie),ca = decodedCookie.split(';');for(var i = 0; i < ca.length; i++) {var c = ca[i];while (c.charAt(0) == ' ') {c = c.substring(1);}if (c.indexOf(name) == 0) {return c.substring(name.length, c.length);}}return "";}
  function checkCookie() {
    var user=getCookie("dsclmr");
    if (user != "") {
      //se diverso da vuoto e quindi anche 1 allora il disclaimer viene tolto (utente tornato)
      $('.disclaimer').remove();
    } else {
      //se diverso da vuoto e quindi anche 1 e NULL allora il disclaimer viene inserito e tolto solo al click (utente nuovo)
      $('.understand-button button, .fixed-menu button.close').on('click', function() {
        $('.disclaimer').remove();
        user = '1'
        if (user != "" && user != null) {
          setCookie("dsclmr", user, 30);
        }
      });
    }
  }
  checkCookie();

  $('.button-settings-container button').on('click', function() {
    $('.fixed-menu-disclaimer').removeClass('close');
    $('.fixed-menu-disclaimer').addClass('open');
    $('.overlay').addClass('active');
  });


  $('.fixed-menu button.close, .overlay').on('click', function() {

    if( !$('.wrapper-dropdown').hasClass('active') ) {
      $('.fixed-menu-disclaimer').addClass('close');
      $('.fixed-menu-disclaimer').removeClass('open');
      $('.overlay').removeClass('active');
    } else {
      $('.wrapper-dropdown').addClass('close');
      setTimeout(function(){
        $('.wrapper-dropdown').addClass('serranda');
      }, 450);
      setTimeout(function(){
        $('.wrapper-dropdown').removeClass('active');
        $('.wrapper-dropdown').removeClass('close');
        $('.wrapper-dropdown').removeClass('serranda');

        $('.fixed-menu-disclaimer').addClass('close');
        $('.fixed-menu-disclaimer').removeClass('open');
        $('.overlay').removeClass('active');
      }, 750);
    }

  });

  $('#devices-nav ul li').on('click', function() {
    var deviceSize = $(this).attr('class');
    /*$('.device-width').attr("device-size", deviceSize);*/
    $('.musicapp-preview body').attr("device-size", deviceSize);

    $('#devices-nav ul li').removeAttr('device-active','active');
    $(this).attr('device-active','active');

    $('.wrapper-dropdown').addClass('close');
    setTimeout(function(){
      $('.wrapper-dropdown').addClass('serranda');
    }, 450);
    setTimeout(function(){
      $('.wrapper-dropdown').removeClass('active');
      $('.wrapper-dropdown').removeClass('close');
      $('.wrapper-dropdown').removeClass('serranda');

      $('.fixed-menu-disclaimer').addClass('close');
      $('.fixed-menu-disclaimer').removeClass('open');
      $('.overlay').removeClass('active');
    }, 750);

    switch (deviceSize) {
      case 'standard':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','12px');}, 300);
        break;
      case 'iphoneSE':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','0');}, 300);
        $('.iphone-device').attr('src','prw-src/images/iphone-frames/iphoneSE.png')
        break;
      case 'iphone8':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','0');}, 300);
        $('.iphone-device').attr('src','prw-src/images/iphone-frames/iphone8.png')
        break;
      case 'iphone8Plus':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','0');}, 300);
        $('.iphone-device').attr('src','prw-src/images/iphone-frames/iphone8Plus.png')
        break;
      case 'iphoneX':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','38px');}, 300);
        $('.iphone-device').attr('src','prw-src/images/iphone-frames/iphonex.png')
    }
  });

  $('#example-nav ul li').on('click', function() {
    var checkExample = $(this).attr('class'),
        deviceSize = $('.musicapp-preview body').attr('device-size'),
        deviceExample;
    switch (checkExample) {
      case 'example-1':
        deviceExample = 'pages/index.html'
        break;
      case 'example-2':
        deviceExample = 'pages/home-2.html'
        break;
      case 'example-3':
        deviceExample = 'pages/home-3.html'
        break;
      case 'example-4':
        deviceExample = 'pages/home-4.html'
    }

    switch (deviceSize) {
      case 'standard':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','12px');}, 1000);
        break;
      case 'iphoneSE':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','0');}, 1000);
        break;
      case 'iphone8':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','0');}, 1000);
        break;
      case 'iphone8Plus':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','0');}, 1000);
        break;
      case 'iphoneX':
        setTimeout( function(){$('iframe').contents().find('body').css('border-radius','38px');}, 1000);
    }

    $('.iframe-browse').attr("src", deviceExample);

    $('#example-nav ul li').removeAttr('device-active','active');
    $(this).attr('device-active','active');

    $('.wrapper-dropdown').addClass('close');
    setTimeout(function(){
      $('.wrapper-dropdown').addClass('serranda');
    }, 450);
    setTimeout(function(){
      $('.wrapper-dropdown').removeClass('active');
      $('.wrapper-dropdown').removeClass('close');
      $('.wrapper-dropdown').removeClass('serranda');

      $('.fixed-menu-disclaimer').addClass('close');
      $('.fixed-menu-disclaimer').removeClass('open');
      $('.overlay').removeClass('active');
    }, 750);
  });

  $('#colors-nav ul li').on('click', function() {
    var themeColor = $(this).attr('class');
    $('iframe').contents().find('body').attr("theme-color", themeColor);
    $('.musicapp-preview body').attr("theme-color", themeColor);

    $('#colors-nav ul li').removeAttr('device-active','active');
    $(this).attr('device-active','active');

    $('.wrapper-dropdown').addClass('close');
    setTimeout(function(){
      $('.wrapper-dropdown').addClass('serranda');
    }, 450);
    setTimeout(function(){
      $('.wrapper-dropdown').removeClass('active');
      $('.wrapper-dropdown').removeClass('close');
      $('.wrapper-dropdown').removeClass('serranda');

      $('.fixed-menu-disclaimer').addClass('close');
      $('.fixed-menu-disclaimer').removeClass('open');
      $('.overlay').removeClass('active');
    }, 750);
  });


  function DropDown(el) {this.dd = el;this.placeholder = this.dd.children('span');this.opts = this.dd.find('ul.dropdown > li a');this.val = '';this.index = -1;this.initEvents();}
  DropDown.prototype = {initEvents : function() {var obj = this;obj.dd.on('click', function(){if ($(this).hasClass('active')) {$(this).addClass('close');setTimeout(function(){obj.dd.addClass('serranda');}, 450);setTimeout(function(){obj.dd.removeClass('active');obj.dd.removeClass('close');obj.dd.removeClass('serranda');}, 750);} else {$(this).addClass('active');}return false;});
                                                 obj.opts.on('click',function(){var opt = $(this);obj.val = opt.text();obj.index = opt.index();obj.placeholder.text(obj.val);});},getValue : function() {return this.val;},getIndex : function() {return this.index;}}

  $(function() {
    var optionsDevices = new DropDown( $('#devices-nav') ),
        optionsStyle = new DropDown( $('#example-nav') ),
        optionsColors = new DropDown( $('#colors-nav') );

    $(document).click(function() {
      // all dropdowns
      $('.wrapper-dropdown').addClass('close');
      setTimeout(function(){
        $('.wrapper-dropdown').addClass('serranda');
      }, 450);
      setTimeout(function(){
        $('.wrapper-dropdown').removeClass('active');
        $('.wrapper-dropdown').removeClass('close');
        $('.wrapper-dropdown').removeClass('serranda');
      }, 750);
    });
  });

})(jQuery); //end document