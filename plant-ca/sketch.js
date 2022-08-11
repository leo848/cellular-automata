let COLOR_CHANGE = 10;
let RANDOM_CHANCE = 0.85;
let CALC_PER_FRAME = 2;
const MOUSE_SCALE = 2;

let div;
let total = 0,
  done = 0;
let buttons = {
  start: null,
  stop:  null,
  save:  null,
};

let sliders = {
  colorChange: null,
  randomChance: null,
  calcsPerFrame: null,
}

let cells = [];

function setup() {
  createCanvas(300, 300);
  pixelDensity(1);
  colorMode(RGB, 1);

  total = width * height;
  for (let x = 0; x < width; x++) {
    cells[x] = [];
    for (let y = 0; y < height; y++) {
      cells[x][y] = new Cell(x, y);
    }
  }

  noLoop();

  div = createDiv().id("perc");
  buttons.start = createButton("Start")
    .class("btn btn-start")
    .mousePressed(() => {
      if (isLooping()) {
        noLoop();
        buttons.start.html("Weiter");
      } else {
        loop();
        buttons.start.html("Pause");
      }
    });
  buttons.stop = createButton("Zurücksetzen")
    .class("btn btn-stop")
    .mousePressed(() => {
      cells.forEach(cs => cs.forEach(cell => cell.state = CellState.Empty));
    });
  buttons.save = createButton("Speichern").class("btn btn-save").mousePressed(() => {
    saveCanvas("canvas.png");
  })
  
  sliders.colorChange = createSlider(0, 10, 5).class("slider").input(updateLabels);
  sliders.colorChange.label = createDiv("Farbveränderung pro Pixel: ").class("text")

  sliders.randomChance = createSlider(0, 1, 0.85, 0.025).class("slider").input(updateLabels);
  sliders.randomChance.label = createDiv("Chance der Ausbreitung: ").class("text")

  sliders.calcsPerFrame = createSlider(1, Math.sqrt(10), 1, 0.01).class("slider").input(updateLabels);
  sliders.calcsPerFrame.label = createDiv().class("text")
}

function draw() {
  done = 0;

  updateLabels();

  background(0.2);
  loadPixels();
  for (let i = 0; i < CALC_PER_FRAME; i++) {
    sCells = shuffle(cells);
    for (let x = 0; x < sCells.length; x++) {
      sCells[x] = shuffle(sCells[x]);
      for (let y = 0; y < sCells[x].length; y++) {
        sCells[x][y].update();
      }
    }
  }
  for (let x = 0; x < cells.length; x++) {
    for (let y = 0; y < cells[x].length; y++) {
      cells[x][y].draw();
    }
  }
  updatePixels();

  div.html(`${Math.floor((done / total) * 1000) / 10}%`);
}

function updateLabels() {
  COLOR_CHANGE = sliders.colorChange.value()**2 / 5;
  RANDOM_CHANCE = sliders.randomChance.value();
  CALC_PER_FRAME = Math.round(sliders.calcsPerFrame.value()**4);

  sliders.colorChange.label.html(`Farbveränderung pro Pixel: ${COLOR_CHANGE}`);
  sliders.randomChance.label.html(`Chance der Ausbreitung: ${RANDOM_CHANCE}`);
  sliders.calcsPerFrame.label.html(`Berechnungen pro Frame: ${CALC_PER_FRAME}`);
}

function mousePressed() {
  mouseMoved();
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > width) return;
  cells[Math.round(mouseX)][Math.round(mouseY)].fill();
}

function mouseMoved() {
  mouseX /= MOUSE_SCALE;
  mouseY /= MOUSE_SCALE;
}
