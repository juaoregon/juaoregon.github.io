var templateSource = document.getElementById('results-template').innerHTML,
    template = Handlebars.compile(templateSource),
    resultsPlaceholder = document.getElementById('results'),
    bioTemplateSource = document.getElementById('bio-template').innerHTML,
    bioTemplate = Handlebars.compile(bioTemplateSource),
    bioPlaceholder = document.getElementById('bio'),
    imgTemplateSource = document.getElementById('img-template').innerHTML,
    imgTemplate = Handlebars.compile(imgTemplateSource),
    imgPlaceholder = document.getElementById('slideshow');

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

function limpiar(text){
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
    artist = limpiar(artist);
    $.ajax({
        url: 'https://developer.echonest.com/api/v4/artist/images?api_key=F8ZEW1YL4XQ9BEB2P&name='+ artist +'&format=json&start=0',
        success: function (response) {
            imgPlaceholder.innerHTML = imgTemplate(response);
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

document.getElementById('search-form').addEventListener('submit', function (e) {
    e.preventDefault();
    searchBio(document.getElementById('query').value);
    searchAlbums(document.getElementById('query').value);
    searchImg(document.getElementById('query').value);
}, false);
