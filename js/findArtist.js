var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results'),
    bioTemplateSource = document.getElementById('bio-template').innerHTML,
    bioTemplate = Handlebars.compile(bioTemplateSource),
    bioPlaceholder = document.getElementById('bio'),
    imgTemplateSource = document.getElementById('img-template').innerHTML,
    imgTemplate = Handlebars.compile(imgTemplateSource),
    imgPlaceholder = document.getElementById('slideshow'),
    videoTemplateSource = document.getElementById('video-template').innerHTML,
    videoTemplate = Handlebars.compile(videoTemplateSource),
    videoPlaceholder = document.getElementById('video');
    similarTemplateSource = document.getElementById('similar-template').innerHTML,
    similarTemplate = Handlebars.compile(similarTemplateSource),
    similarPlaceholder = document.getElementById('similar');

Handlebars.registerHelper('bio', function(text) {
    text = text.replace(/(\[\d\])/g, "");
    text = text.replace(/Sorry, your browser either has JavaScript disabled or does not have any supported player.,/g, "");
    text = text.replace(/You can download the clip or download a player to play the clip in your browser./g, "");
    var subject = text;
    var regex = /(?:\r?\n){2}([^\r\n]+)|(?:^|\r?\n)([^\r\n]+)/g;
    var replace = subject.replace(regex, function(match, p1, p2) {
        return '\n<p>' + ((p1===undefined)? p2 : '<b>' + p1 + '</b>' ) + '</p>';
    });
    return replace.trim();
});

Handlebars.registerHelper("embedVideo", function(url) {
    if(url.indexOf('dailymotion') > -1){
        if(url.indexOf('embed') > -1){
            videoPlaceholder.innerHTML += '<iframe width="580" height="269" class="iframe" src=' + url + 'frameborder="0" allowfullscreen></iframe>';
        }else{
            $.ajax({
                dataType: 'jsonp',
                url: 'http://www.dailymotion.com/services/oembed?url='+ url,
                success: function (response) {
                    response.html = response.html.slice(0, 8) + " class='iframe' " + response.html.slice(8);
                    videoPlaceholder.innerHTML += response.html;
                }
            });
        }
    }else if(url.indexOf('youtube') > -1){
        url = 'http://www.youtube.com/embed/' + url.substring(url.indexOf("=")+1,url.lastIndexOf("&"));
        videoPlaceholder.innerHTML += '<iframe width="580" height="269" class="iframe" src=' + url + 'frameborder="0" allowfullscreen></iframe>';
    }
});

var searchAlbums = function (query) {
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: 'artist:' + query,
            type: 'album'
        },
        success: function (response) {
            resultsPlaceholder.innerHTML = template(response);
        }
    });
};

function clean(text){
      text.toLowerCase();
      text = text.replace(/ /g, '+');
      text = text.replace(/&/, 'and');
      text = text.replace(/[áàäâå]/g, 'a');
      text = text.replace(/[éèëê]/g, 'e');
      text = text.replace(/[íìïî]/g, 'i');
      text = text.replace(/[óòöô]/g, 'o');
      text = text.replace(/[úùüû]/g, 'u');
      text = text.replace(/[ýÿ]/g, 'y');
      text = text.replace(/[ñ]/g, 'n');
      text = text.replace(/[ç]/g, 'c');
      return text;
   }

var searchImg = function (artist) {
    artist = clean(artist);
    $.ajax({
        url: 'https://developer.echonest.com/api/v4/artist/images?api_key=F8ZEW1YL4XQ9BEB2P&name='+ artist +'&format=json&start=0',
        success: function (response) {
            var images = response.response.images;
            for (var i = 0; i < images.length; i++) {
                if (images[i].url.indexOf('myspace') > -1) {
                    var imageIndex = images.indexOf(images[i]);
                    delete images[imageIndex];
                };
            }
            
            imgPlaceholder.innerHTML = imgTemplate(response);
        }   
    });
};

var searchVideo = function (artist) {
    artist = clean(artist);
    $.ajax({
        url: 'https://developer.echonest.com/api/v4/artist/video?api_key=F8ZEW1YL4XQ9BEB2P&name='+ artist +'&format=json&start=0',
        success: function (response) {
            videoPlaceholder.innerHTML = videoTemplate(response);
        }   
    });
};

var searchSimilar = function (artist) {
    artist = clean(artist);
    $.ajax({
        url: 'http://developer.echonest.com/api/v4/artist/similar?api_key=F8ZEW1YL4XQ9BEB2P&name=' + artist +'&format=json&start=0',
        success: function (response) {
            similarPlaceholder.innerHTML = similarTemplate(response);
        }   
    });
};

var searchBio = function (name) {
    name = name.replace(/ /g,"+");
    name = name.replace(/&/g,"and");
    $.ajax({
        url: 'https://developer.echonest.com/api/v4/artist/biographies?api_key=F8ZEW1YL4XQ9BEB2P&name='+ name +'&format=json&start=0&license=cc-by-sa',
        success: function (response) {
            bioPlaceholder.innerHTML = bioTemplate(response);
        }   
    });
};

document.getElementById('similarIcon').addEventListener('click', function (e) {
    e.preventDefault();
    searchSimilar(document.getElementById('query').value);
}, false);

function searchSimilarArtist(name) {
    $('#videoIcon').css("display","inline");
    $('#similarIcon').css("display","inline");
    searchBio(name);
    searchAlbums(name);
    searchImg(name);
    searchVideo(name);
    searchSimilar(name);
    showDisplay("artist");
    parent.$.fancybox.close();
}

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    $('#videoIcon').css("display","inline");
    $('#artistIcon').css("display","inline");
    $('#similarIcon').css("display","inline");
    searchBio(document.getElementById('query').value);
    searchAlbums(document.getElementById('query').value);
    searchImg(document.getElementById('query').value);
    searchVideo(document.getElementById('query').value);
}, false);
