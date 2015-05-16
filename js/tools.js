$(function() {
	$("#query").autocomplete({
    	source: function(request, response) {
        	$.get("http://ws.spotify.com/search/1/artist.json", {
           		q: request.term + "*"
        	}, function(data) {
            	response($.map(data.artists, function(item) {
               		return {label: item.name, artist: item};
            	}));
        	});
    	}
	});

	setInterval( "slideSwitch()", 5000 );
});

function selectSource(sourceName) {
	var lastFM = document.getElementById("bioSourcelast.fm");
	var wikipedia = document.getElementById("bioSourcewikipedia");
	var amazon = document.getElementById("bioSourceamazon");
	if (sourceName == "wikipedia") {
		if (lastFM) lastFM.className = "bioNotSelected";
		if (wikipedia) wikipedia.className = "bioSelected";
		if (amazon) amazon.className = "bioNotSelected";
	}else if (sourceName == "last.fm"){
		if (lastFM) lastFM.className = "bioSelected";
		if (wikipedia) wikipedia.className = "bioNotSelected";
		if (amazon) amazon.className = "bioNotSelected";
	}else{
		if (amazon) amazon.className = "bioSelected";
		if (lastFM) lastFM.className = "bioNotSelected";
		if (wikipedia) wikipedia.className = "bioNotSelected";
	};
}

function hideAll(){
	var lastFM = document.getElementById("bioTextlast.fm");
	var wikipedia = document.getElementById("bioTextwikipedia");
	var amazon = document.getElementById("bioTextamazon");
    if (lastFM) lastFM.style.display="none";
    if (wikipedia) wikipedia.style.display="none";
    if (amazon) amazon.style.display="none";
}

function show(elementId) {
	var element = document.getElementById(elementId);
	hideAll();
	if (element) element.style.display="block";
}

function slideSwitch() {
	var $active = $('#slideshow IMG.active');
	if ( $active.length == 0 ) $active = $('#slideshow IMG:last');
	var $next =  $active.next().length ? $active.next()
		: $('#slideshow IMG:first');

	$active.addClass('last-active');
    
	$next.css({opacity: 0.0})
	.addClass('active')
	.animate({opacity: 1.0}, 1000, function() {
		$active.removeClass('active last-active');
	});
}

$(document).ready(function() {
	$("a#infoIcon").fancybox();
	$("a#videoIcon").fancybox({
		'autoSize': false,
    	'width': "auto",
		'height': "auto",
	    'transitionIn': 'none',
	    'transitionOut': 'none',
	    'changeSpeed': 100,
	    'changeFade': 100,
	    'opacity': 'true',
	});
	$("a#similarIcon").fancybox();
	$(".iframe").fancybox();

	$("#top").click(function(){
		$("html,body").animate({scrollTop:0}, "slow");
		return false;
	});
	$(window).scroll(function(){
		if ($(this).scrollTop() > 300) {
			$(".scrollToTop").fadeIn();
		}else{
			$(".scrollToTop").fadeOut();
		};
	});
});