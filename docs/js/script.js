var buttonMenu = document.querySelector('.js-menu-button');
var menu = document.querySelector('.header-menu');

buttonMenu.addEventListener('click', function () {
  menu.classList.toggle('header-menu--opened');
});

var grid = document.querySelector('.grid');

var template = document.querySelector('#moduleTemplate');

var moduleTemplate = template.content.querySelector('.module');
var modulePicture = template.content.querySelector('.module__picture');

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
      module.querySelector('.module__message').appendChild(picture);
    }

  }

  grid.appendChild(module);
}

var imageContainer = document.querySelector('.module__picture');
var image = document.querySelector('.module__image');

var imageWindow = imageContainer.offsetWidth;
var imageWidth = image.offsetWidth;

image.style.left = '0px';

var pointerArray = [];

var moveToStartPosition = function() {
  imageWindow = imageContainer.offsetWidth;
  image.style.left = '0px';
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

  console.log("down");
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

  var startPositionX = pointerArray[index].startPosition.x;
  var startPositionY = pointerArray[index].startPosition.y;
  var currentPositionX = pointerArray[index].currentPosition.x;
  var currentPositionY = pointerArray[index].currentPosition.y;

  console.log("move");

  if (pointerArray.length.length > 1) {

    document.querySelector('body').style.background = 'red';

    var distanse = Math.sqrt(Math.pow(currentPositionX - startPositionX) - Math.pow(currentPositionY - startPositionY));

    document.querySelector('.debug').textContent = distanse;

  } else {

    // move
    var startX = pointerArray[index].prevPosition.x;
    var x = event.x;
    var dx = x - startX;
    var left = image.style.left.replace('px', '') * 1;

    dx > 0 ? left += Math.abs(dx) : left -= Math.abs(dx);

    if (left > 0) {
      left = 0;
    }

    if (left < imageWindow - imageWidth) {
      left = imageWindow - imageWidth;
    }

    image.style.left = left + 'px';
    pointerArray[index].prevPosition.x = x;
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

  console.log("up");
});

imageContainer.addEventListener('pointercancel', moveToStartPosition);

