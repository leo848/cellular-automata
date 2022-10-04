const WIDTH = 600;
const HEIGHT = 400;

// Create a 2d array with the given width and height, filled with random values
function randomPipes(cols, rows) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (var j = 0; j < arr[i].length; j++) {
      arr[i][j] = Math.random();
    }
  }
  return arr;
}

const pipes = randomPipes(WIDTH, HEIGHT);

function setup() {
  createCanvas(WIDTH, HEIGHT);
  pixelDensity(1);
}

function draw() {
  background(0);

  loadPixels();

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var index = (x + y * width) * 4;
      setColor([pipes[x][y], pipes[x][y], pipes[x][y]], index);
    }
  }

  updatePixels();
}

function setColor(color, index) {
  pixels[index] = color[0] * 255;
  pixels[index + 1] = color[1] * 255;
  pixels[index + 2] = color[2] * 255;
  pixels[index + 3] = 255;
}
