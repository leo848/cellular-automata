const WIDTH = 400;
const HEIGHT = 300;

// Create a 2d array with the given width and height, filled with random values
function randomPipes(cols, rows, empty = true) {
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++) {
    arr[i] = new Array(rows);
    for (var j = 0; j < arr[i].length; j++) {
      arr[i][j] = empty ? Math.random() : 0;
    }
  }
  return arr;
}

const pipes = randomPipes(WIDTH, HEIGHT);

let slider;
let modeSelect;

function setup() {
  createCanvas(WIDTH, HEIGHT);
  pixelDensity(1);

  slider = createSlider(0, 1, 0.5, 0.001);
  slider.elt.style.width = "400px";
  slider.changed(paint);

  createDiv();

  let bMinusLarge = createButton("---");
  let bMinus = createButton("--");
  let bMinusSmall = createButton("-");
  let bPlusSmall = createButton("+");
  let bPlus = createButton("++");
  let bPlusLarge = createButton("+++");

  bMinusLarge.mousePressed(buttonMod(-0.1));
  bMinus.mousePressed(buttonMod(-0.01));
  bMinusSmall.mousePressed(buttonMod(-0.001));
  bPlusSmall.mousePressed(buttonMod(0.001));
  bPlus.mousePressed(buttonMod(0.01));
  bPlusLarge.mousePressed(buttonMod(0.1));

  createDiv();

  modeSelect = createSelect();
  modeSelect.option("percolation map");
  modeSelect.option("delta from threshold");
  modeSelect.changed(paint);
}

function buttonMod(val) {
  return () => {
    slider.value(slider.value() + val);
    paint();
  }
}

function draw() {
  background(0);
  paint();
  noLoop();
}

function paint() {
  loadPixels();
  
  switch (modeSelect.value()) {
    case "percolation map":
      paint();
      break;
    case "delta from threshold":
      paintDelta();
      break;
  }

  updatePixels();
}

function paintFlow() {
  const map = colorMap();

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      var index = (x + y * WIDTH) * 4;
      const color = map[x][y];
      setColor(color, index);
    }
  }
}

function paintDelta() {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      var index = (x + y * WIDTH) * 4;
      const signedDelta = pipes[x][y] - slider.value();
      const [green, delta] = [signedDelta > 0, Math.abs(signedDelta)];
      const color = green ? [0, delta, 0] : [delta, 0, 0];

      setColor(color, index);
    }
  }
}

function colorMap() {
  const p = slider.value();

  const colorMap = randomPipes(WIDTH, HEIGHT, false);

  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const random = sfc32(...cyrb128(x + "," + y));
      const randomColor = [random(), random(), random()];

      const callStack = [[x, y]];

      while (callStack.length > 0) {
        const [x, y] = callStack.pop();
        callStack.push(...recursiveColor(randomColor, colorMap, x, y, p));
      }

      if (colorMap[x][y] == 0) {
        colorMap[x][y] = randomColor;
      }
    }
  }

  return colorMap;
}

function recursiveColor(color, colorMap, x, y, p) {
  if (x < 0 || x >= WIDTH || y < 0 || y >= HEIGHT) return [];
  if (colorMap[x][y] != 0) return [];
  if (pipes[x][y] > p) return [];
  
  colorMap[x][y] = color;

  return [
    [x+1, y],
    [x-1, y],
    [x, y+1],
    [x, y-1],
  ];
}

function setColor(color, index) {
  if (!color) throw new Error("color is undefined");
  if (!Array.isArray(color) || color.length != 3) throw new Error("color is not an array of length 3");
  pixels[index] = color[0] * 255;
  pixels[index + 1] = color[1] * 255;
  pixels[index + 2] = color[2] * 255;
  pixels[index + 3] = 255;
}





// https://stackoverflow.com/questions/521295/seeding-the-random-number-generator-in-javascript
function cyrb128(str) {
    let h1 = 1779033703, h2 = 3144134277,
        h3 = 1013904242, h4 = 2773480762;
    for (let i = 0, k; i < str.length; i++) {
        k = str.charCodeAt(i);
        h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
        h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
        h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
        h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
    }
    h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
    h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
    h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
    h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
    return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
}

function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
}
