var key = 'c3lhaGFsb21AbGl2ZS5jb206QzYwZVpoYTdvL205aUFqRnZXQ0t2UzNvSklqZ3REL2FEQ1BxVjBuQmUzOD0=';

var images = [
];

var animals = [
  { animal: 'cat', sound: 'http://sounds.simplythebest.net/files/MP3/cat_1.mp3' },
  { animal: 'dog', sound: 'http://sounds.simplythebest.net/files/MP3/dog_bark_1.mp3' },
  { animal: 'horse', sound: 'http://sounds.simplythebest.net/files/MP3/horse_neigh.mp3' },
  { animal: 'rooster', sound: 'http://soundbible.com/mp3/Rooster-SoundBible.com-1114473528.mp3', attr: '<a href="http://soundbible.com/1510-Rooster.html">Rooster</a> - Attribution 3.0 | Recorded by Mike Koenig' },
  { animal: 'donkey', sound: 'http://www.freesound.org/data/previews/16/16933_37876-lq.mp3', attr: '<a href="http://www.freesound.org/people/acclivity/sounds/16933/">Donkey</a> - CC (non commercial) | Recorded by acclivity' },
  { animal: 'mallard duck', sound: 'http://soundbible.com/mp3/mallard_duck_quacking-Mike_Koenig-1781775990.mp3', attr: '<a href="http://soundbible.com/1862-Mallard-Duck-Quacking.html">Mallard Duck</a> - Attribution 3.0 | Mike Koenig' },
  { animal: 'bird', sound: 'http://soundbible.com/mp3/Best Cardinal Bird-SoundBible.com-1171415022.mp3', attr: '<a href="http://soundbible.com/1515-Best-Cardinal-Bird.html">Cardinal Bird</a> - Attribution 3.0 | Recorded by PsychoBird' },
  { animal: 'butterfly', sound: 'http://soundbible.com/mp3/Butterfly-SoundBible.com-1530156556.mp3', attr:'<a href="http://soundbible.com/1322-Butterfly.html">Butterfly</a> - Attribution 3.0 | Recorded by Mike Koenig' },
  { animal: 'cow', sound: 'http://soundbible.com/mp3/Single Cow-SoundBible.com-2051754137.mp3', attr:'<a href="http://soundbible.com/1572-Single-Cow.html">Cow</a> - Attribution 3.0 | Recorded by BuffBill84' }
];



var ATTRIBUTION_TEMPLATE = '<div class="attr"><small>{0}</small></div>';
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

function loadSounds() {
  animals.forEach(function(animal) {
    if (animal.sound) {
      var audioElement = document.createElement('audio');
      audioElement.setAttribute('src', animal.sound);
      audioElement.setAttribute("preload","auto");
      document.body.appendChild(audioElement);
      animal.audio = audioElement;
    }
  });  
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

function playmp3(audio) {
  if (audio) {
    if (audio.readyState >= 3) {
      audio.play();
    }
    else {
      audio.load();
      $.one('canplay', function() {
        audio.play();
      });
    }
  }
}

function prepareSlider() {
  var slider = $('.swiper1');
  var sliderWrapper = $('.swiper-wrapper');

  for (i=0; i<animals.length; i++) {
    var slide = $(SLIDE_TEMPLATE);
    (function(img, audio) {
      getAnimalImages(animals[i].animal, function(json) {
        var imageSrc = getRandomImage(json);
        img.attr('src', imageSrc);
      });
      img.on('click', function() {
        playmp3(audio);
      });
    }(slide.find('img'), animals[i].audio));
    if (animals[i].attr) {
      var attr = ATTRIBUTION_TEMPLATE.replace('{0}', animals[i].attr);
      slide.append(attr);
    }
    sliderWrapper.append(slide);
  }

  slider.swiper({
    pagination : '.pagination1'
  });
}

$(function(){
  loadSounds();
  prepareSlider();
})


