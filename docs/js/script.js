var buttonMenu = document.querySelector('.js-menu-button');
var menu = document.querySelector('.header-menu');

buttonMenu.addEventListener('click', function () {
  menu.classList.toggle('header-menu--opened');
});

var grid = document.querySelector('.grid');

var template = document.querySelector('#moduleTemplate');

var moduleTemplate = template.content.querySelector('.module');
var modulePicture = template.content.querySelector('.module__picture');
var moduleDetails = template.content.querySelector('.module__cam-details');

var data;

var xhr = new XMLHttpRequest();
xhr.open('GET', 'events.json', false);
xhr.send();
if (xhr.status != 200) {
  alert( xhr.status + ': ' + xhr.statusText );
} else {
  data = JSON.parse(xhr.responseText);
}

var events = data.events;

function createElementFromHTML(htmlString) {
  var div = document.createElement('div');
  div.innerHTML = htmlString.trim();
  return div.firstChild;
}

function parseTemplate(template, variables) {
  var result = template.outerHTML;
  Object.keys(variables).forEach(function (key) {
    if (variables[key] === null) {
      variables[key] = '';
    }
    result = result.replace('{{ ' + key + ' }}', variables[key]);
  });
  return createElementFromHTML(result);
}

for (var i = 0; i < events.length; i++) {

  var module = moduleTemplate.cloneNode(true);
  module = parseTemplate(moduleTemplate, events[i]);

  if (events[i].description === '') {
    module.querySelector('.module__message').classList.add('module__message--disabled');
  }

  if ('data' in events[i]) {

    if (events[i].icon === 'cam') {
      var picture = modulePicture.cloneNode(true);
      var details = moduleDetails.cloneNode(true);
      module.querySelector('.module__message').appendChild(picture);
      module.querySelector('.module__message').appendChild(details);
    }

  }

  grid.appendChild(module);
}

var imageContainer = document.querySelector('.module__picture');
var image = document.querySelector('.module__image');
var imageIndicator = document.querySelector('.module__indicator');
var imageScale = document.querySelector('.module__scale strong');
var imageBrightness = document.querySelector('.module__light strong');

var imageWindow = imageContainer.offsetWidth;
var imageWidth = image.offsetWidth;
var imageIndicatorWidth = imageIndicator.offsetWidth;

var pointerArray = [];
var distancePrev = 0;
var currentScale = 1;

image.style.left = '0px';
imageIndicator.style.left = '0px';

image.style.transform = "scale(" + currentScale + ")";

imageScale.innerHTML = 100 + '%';
imageBrightness.innerHTML = 100 + '%';

var moveToStartPosition = function() {
  imageWindow = imageContainer.offsetWidth;
  imageWidth = image.offsetWidth;
  imageIndicatorWidth = imageIndicator.offsetWidth;

  image.style.left = '0px';
  imageIndicator.style.left = '0px';

  image.style.transform = "scale(" + 1 + ")";

  imageBrightness.innerHTML = '100%';
  imageScale.innerHTML = '100%';
};


window.addEventListener('resize', function() {
  moveToStartPosition();
});


imageContainer.addEventListener('pointerdown', function (event) {
  imageContainer.setPointerCapture(event.pointerId);

  pointerArray.push({
    id: event.pointerId,
    startPosition: {
      x: event.x,
      y: event.y
    },
    prevPosition: {
      x: event.x,
      y: event.y
    },
    currentPosition: {
      x: event.x,
      y: event.y
    }
  });
});


imageContainer.addEventListener('pointermove', function (event) {
  if (pointerArray.length === 0) {
    return
  }

  var index = null;

  for (var i = 0; i < pointerArray.length; i++) {
    if (pointerArray[i].id === event.pointerId) {
      index = i;
      break;
    }
  }

  pointerArray[index].currentPosition.x = event.x;
  pointerArray[index].currentPosition.y = event.y;

  if (pointerArray.length > 1) {

    var startPositionX1 = pointerArray[0].startPosition.x;
    var startPositionY1 = pointerArray[0].startPosition.y;
    var startPositionX2 = pointerArray[1].startPosition.x;
    var startPositionY2 = pointerArray[1].startPosition.y;

    var currentPositionX1 = pointerArray[0].currentPosition.x;
    var currentPositionY1 = pointerArray[0].currentPosition.y;
    var currentPositionX2 = pointerArray[1].currentPosition.x;
    var currentPositionY2 = pointerArray[1].currentPosition.y;

    // pinch
    var distance = Math.sqrt(Math.pow((currentPositionX2 - currentPositionX1), 2) + Math.pow((currentPositionY2 - currentPositionY1), 2));

    if (distancePrev) {

      var scale = 0.02;

      if (distance > distancePrev) {
        currentScale += scale;
      } else {
        currentScale -= scale;
        if (currentScale <= 1) {
          currentScale = 1;
        }
      }

      image.style.transform = "scale(" + currentScale + ")";
      imageScale.innerHTML = Math.ceil(currentScale * 100) + '%';
    }

    distancePrev = distance;

    // rotate
    var startAngle = Math.atan2(startPositionY1 - startPositionY2, startPositionX1 - startPositionX2);
    var currentAngle = Math.atan2(currentPositionY1 - currentPositionY2, currentPositionX1 - currentPositionX2);
    var angleChange = (currentAngle - startAngle) * 180 / Math.PI;

    if (angleChange < 0) {
      angleChange += 360;
    }

    var brightness = 100 - (angleChange / 360 * 100);

    image.style.filter = 'brightness(' + brightness + '%)';
    imageBrightness.innerHTML = Math.ceil(brightness) + '%';

  } else {

    // move
    var startX = pointerArray[index].prevPosition.x;
    var x = event.x;
    var dx = x - startX;

    var left = image.style.left.replace('px', '') * 1;
    var leftIndicator = imageIndicator.style.left.replace('px', '') * 1;

    var dleft = (imageWindow - imageIndicatorWidth) / (imageWidth - imageWindow);

    dx > 0 ? left += Math.abs(dx) : left -= Math.abs(dx);
    dx > 0 ? leftIndicator -= Math.abs(dx) * dleft : leftIndicator += Math.abs(dx) * dleft;

    if (left > 0) {
      left = 0;
      leftIndicator = 0;
    }

    if (left < imageWindow - imageWidth) {
      left = imageWindow - imageWidth;
      leftIndicator = imageWindow - imageIndicatorWidth;
    }

    image.style.left = left + 'px';
    pointerArray[index].prevPosition.x = x;

    imageIndicator.style.left = leftIndicator + 'px';
  }
});


imageContainer.addEventListener('pointerup', function (event) {
  var index = null;

  for (var i = 0; i < pointerArray.length; i++) {
    if (pointerArray[i].id === event.pointerId) {
      index = i;
    }
  }

  pointerArray.splice(pointerArray[index], 1);
});


imageContainer.addEventListener('pointercancel', moveToStartPosition);

