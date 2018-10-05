var imageContainer = document.querySelector('.module__picture');
var image = document.querySelector('.module__image');

var imageWindow = imageContainer.offsetWidth;
var imageWidth = image.offsetWidth;

image.style.left = '0px';

var pointerArray = [];
var distancePrev = 0;

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

  console.log("move");

  if (pointerArray.length > 1) {

    var currentPositionX1 = pointerArray[0].currentPosition.x;
    var currentPositionY1 = pointerArray[0].currentPosition.y;
    var currentPositionX2 = pointerArray[1].currentPosition.x;
    var currentPositionY2 = pointerArray[1].currentPosition.y;

    var distance = Math.sqrt(Math.pow(currentPositionX2 - currentPositionX1) + Math.pow(currentPositionY2 - currentPositionY1));

    if (distancePrev) {

      if (distance > distancePrev) {
        document.querySelector('body').style.background = 'red';
      } else {
        document.querySelector('body').style.background = 'blue';
      }

    }

    var distancePrev = distance;

    document.querySelector('.debug').innerHTML = distancePrev;

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
