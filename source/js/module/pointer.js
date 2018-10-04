var imageContainer = document.querySelector('.module__picture');
var image = document.querySelector('.module__image');

var imageWindow = imageContainer.offsetWidth;
var imageWidth = image.offsetWidth;

image.style.left = '0px';

var currentGesture = null;
var fingers = [];

var moveToStartPosition = function() {
  imageWindow = imageContainer.offsetWidth;
  image.style.left = '0px';
  fingers = [];
  currentGesture = null;
};

window.addEventListener('resize', function() {
  moveToStartPosition();
});

imageContainer.addEventListener('pointerdown', function (event) {
  fingers.push(event.pointerId);

  imageContainer.setPointerCapture(event.pointerId);

  currentGesture = {
    startX: event.x
  };
});

imageContainer.addEventListener('pointermove', function (event) {
  if (!currentGesture) {
    return
  }

  if (fingers.length > 1) {

    // pinch
    document.querySelector('body').style.background = 'red';

    // rotate
    document.querySelector('body').style.background = 'blue';

  } else {

    // move
    var startX = currentGesture.startX;
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
    currentGesture.startX = x;

  }
});

imageContainer.addEventListener('pointerup', function (event) {
  currentGesture = null;

  fingers.splice(fingers.indexOf(event.pointerId), 1);
});

imageContainer.addEventListener('pointercancel', moveToStartPosition);
