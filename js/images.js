var key = 'c3lhaGFsb21AbGl2ZS5jb206QzYwZVpoYTdvL205aUFqRnZXQ0t2UzNvSklqZ3REL2FEQ1BxVjBuQmUzOD0=';

var images = [
];

var animals = [
  { animal: 'cat', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' },
  { animal: 'dog', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' },
  { animal: 'horse', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' },
  { animal: 'rooster', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' },
  { animal: 'donkey', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' },
  { animal: 'goose', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' },
  { animal: 'bird', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' },
  { animal: 'butterfly', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' }
];

var SLIDE_TEMPLATE = '<div class="swiper-slide"><img /></div>';

function getAnimalImages(animal, cb) {
  var key = animal + '_' + (new Date()).getDate().toString();
  var value = window.localStorage.getItem(key);
  if (!value) {
    return getImages(animal, function(result) {
      window.localStorage.setItem(key, JSON.stringify(result));
      return cb(result);
    });
  }

  return cb(JSON.parse(value));
}

function getImages(animal, cb) {
  $.ajax({
    type : 'GET',
    url: 'https://api.datamarket.azure.com/Bing/Search/v1/Image?Query=%27' + animal + '%27&Adult=%27Strict%27&ImageFilters=%27Size%3ALarge%2BAspect%3AWide%27',
    dataType: 'json',
    headers: {
      'Authorization': 'Basic ' + key,
      'Accept': 'application/json'
    }
  }).done(cb);
}

function getRandomImage(json) {
  var results = json.d.results;
  var index = Math.floor(Math.random()*results.length);
  return results[index].MediaUrl;
}

function playmp3(url){
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', url);
    audioElement.load();
    audioElement.addEventListener("canplay", function() {
        audioElement.play();
    });
}

function prepareSlider() {
  var slider = $('.swiper1');
  var sliderWrapper = $('.swiper-wrapper');

  for (i=0; i<animals.length; i++) {
    var slide = $(SLIDE_TEMPLATE);
    (function(img, audioUrl) {
      getAnimalImages(animals[i].animal, function(json) {
        var imageSrc = getRandomImage(json);
        img.attr('src', imageSrc);
      });
      img.on('touchstart', function() {
        playmp3(audioUrl);
      });
    }(slide.find('img'), animals[i].sound));
    sliderWrapper.append(slide);
  }

  slider.swiper({
    pagination : '.pagination1'
  });
}

$(function(){
  prepareSlider();
})


