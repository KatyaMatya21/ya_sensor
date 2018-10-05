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
    prevPosition: {
      x: event.x,
      y: event.y
    },
    currentPosition: {
      x: 0,
      y: 0
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
  console.log(pointerArray[index].currentPosition.x);
  console.log(pointerArray[index].currentPosition.y);

  if (pointerArray.length.length > 1) {

    // pinch
    document.querySelector('body').style.background = 'red';


    // rotate
    document.querySelector('body').style.background = 'blue';

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
