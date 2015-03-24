<link rel="stylesheet" type="text/css" href="./main.css"/>
<link rel="shortcut icon" href="Images/Icons/info-icon.png" />
<link rel="stylesheet" href="./fancybox/source/jquery.fancybox.css" type="text/css" media="screen" />
<div id="title" class="titulo">
	<a id="infoIcon" href="#info" class="fancybox">
		<img src="Images/Icons/info-icon.png" width="33" height="33">
	</a>
	<h1>
		<a id="index" href="./index.php">
			Welcome to Wikify
		</a>
	</h1>
</div>
<div id="subtitle" class="subtitulo">
	We have combined the power of Wikipedia&reg and Last.fm&reg <br>
	with the musical diversity of Spotify&reg to create a tool to <br>
	search, learn, listen and enjoy
</div>
<div style="display:none;">
	<div id="info" style="font-family: Montserrat;">
		Wikify&reg works with the Spotify&reg Desktop App. You can download it by clicking this icon
		<a href="https://www.spotify.com/download" target="_blank">
			<img src="Images/Icons/step1.png" width="50" height="50" style="vertical-align: middle; padding-left: 5px;">
		</a>
		<br>
		<br>
		For the application to work properly, you must choose one of the artists that the search form suggests you.
		<br>
		Otherwise the application will not give good results.
		<br>
		<br>
		For help and support using Wikify&reg, please contact us by email by clicking 
		<a href="mailto:juaoregon@gmail.com?Subject=Wikify%20support" target="_blank" style="color: #000000 !important;"><b>here</b></a>.
		<br>
		<br>
		Wikify&reg developed by <img src="Images/Icons/ORERO.png" width="100" height="20" style="padding-left:2px;">&reg. All rights reserved.
		<br>
		v1.0.1 released on May 2015.
		<br>
		<br>
		<img src="Images/Icons/spotify-logo.png" style="float:left;" width="100" height="30">
		<img src="Images/Icons/echoNest2.png" style="float:right;">
	</div>
</div>
<br>
<form id="search-form">
    <input type="text" id="query" value="" class="form-control" placeholder="  Search..." onfocus="this.placeholder = ''"></input>
</form>
<div id="results">
</div>
<div id="bio">
</div>
<div id="slideshow">
</div>
<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.1.min.js"></script>
<script type="text/javascript" src="http://code.jquery.com/ui/1.11.1/jquery-ui.min.js"></script>
<script type="text/javascript" src="./fancybox/source/jquery.fancybox.pack.js"></script>
<script id="bio-template" type="text/x-handlebars-template">

	<h1>
		<div id="bioTitle">
			Bio
		</div>
		<div id='bioIcons'>
		{{#each_with_sort response.biographies 'site'}}
			{{#if @first}}
				<a href="javascript: show('bioText{{site}}');" id="bioSource{{site}}" class="bioSelected" title="{{site}}" onclick="selectSource('{{site}}')">
					<img id="bioSourceImg{{site}}" src="Images/Icons/{{site}}.png" width="33" height="33">
				</a>
			{{else}}
				<a href="javascript: show('bioText{{site}}');" id="bioSource{{site}}" class="bioNotSelected" title="{{site}}" onclick="selectSource('{{site}}')">
					<img id="bioSourceImg{{site}}" src="Images/Icons/{{site}}.png" width="33" height="33">
				</a>
			{{/if}}
		{{/each_with_sort}}
		</div>
	</h1>
	{{#each response.biographies}}
		{{#if @first}}
				<div id="bioText{{site}}" class="bioText" style="display:block">
					<img id="blank" src="Images/Icons/blank.png" width="300" height="200">
					<p>{{{bio text}}}</p>
				</div>
		{{else}}
			{{#if text}}
				<div id="bioText{{site}}" class="bioText" style="display:none">
					<img id="blank" src="Images/Icons/blank.png" width="300" height="200">
					<p>{{{bio text}}}</p>
				</div>
			{{/if}}
		{{/if}}
	{{else}}
		<div id="noBio">
			No bio available for this artist
		</div>
	{{/each}}

</script>
<script type="text/javascript">

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
	});
	$(function() {
		setInterval( "slideSwitch()", 5000 );
	});

</script>
<script id="img-template" type="text/x-handlebars-template">

	{{#each response.images}}
		{{#if @first}}
			<img id="artistImage{{@index}}" alt="" src="{{url}}" width="300" height="200" class="active">
		{{else}}
			<img id="artistImage{{@index}}" alt="" src="{{url}}" width="300" height="200">
		{{/if}}
	{{/each}}

</script>
<script id="results-template" type="text/x-handlebars-template">

	<h1>
		Albums
	</h1>
    {{#each albums.items}}
    	<iframe src="https://embed.spotify.com/?uri={{uri}}" width="300" height="380" frameborder="0" allowtransparency="true"></iframe>
    {{else}}
		<div id="noAlbums" class="noAlbums">
			No albums available for this artist
		</div>
	{{/each}}

</script>
<script type="text/javascript" src="http://cdnjs.cloudflare.com/ajax/libs/handlebars.js/2.0.0-alpha.1/handlebars.min.js"></script>
<script type="text/javascript" src="findArtist.js"></script>