// $(window).load(function() {

	var $window = $(window);
	$window.on('scroll', check_if_in_view);
	$window.on('scroll resize', check_if_in_view);
	$window.trigger('scroll');

	$("<style type='text/css'> .animation-element{ opacity: 0; -moz-transition: all .8s ease-out;		-webkit-transition: all .8s ease-out;		-o-transition: all .8s ease-out;		transition: all .8s ease-out;		-moz-transform: translate3d(0px, 200px, 0px);		-webkit-transform: translate3d(0px, 200px, 0px);		-o-transform: translate(0px, 200px);		-ms-transform: translate(0px, 200px);		transform: translate3d(0px, 200, 0px);		-webkit-backface-visibility: hidden;		-moz-backface-visibility: hidden;		backface-visibility: hidden;} .in-view{     opacity: 1;	-moz-transform: translate3d(0px, 0px, 0px);		-webkit-transform: translate3d(0px, 0px, 0px);		-o-transform: translate(0px, 0px);		-ms-transform: translate(0px, 0px);		transform: translate3d(0px, 0px, 0px);} </style>").appendTo("head");


	function check_if_in_view() {
	  var window_height = $window.height();
	  // console.log("window height", window_height);
	  var window_top_position = $window.scrollTop();
	  // console.log("window top", window_top_position);
	  var window_bottom_position = (window_top_position + window_height);

	  $('.animation-element').each(function(){
	    var $element = $(this);
	    // console.log($element);
	    var element_height = $element.outerHeight(true);
	    // console.log(element_height);
	    var element_top_position = $element.position().top;
	    var element_bottom_position = (element_top_position + element_height);
	    // console.log("top", element_top_position, window_top_position);
	    // console.log("bottom", element_bottom_position, window_bottom_position);

	    //check to see if this current container is within viewport
	    if ((element_bottom_position > window_top_position) &&
	        (element_top_position < window_bottom_position)) {
	      $element.addClass('in-view');
		  // console.log("adding");
	    } else {
	      $element.removeClass('in-view');
	      // console.log("removing");
	    }
	  });
	}
// });