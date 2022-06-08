let cells = [];
let clickedCells = [];
let counter = 0;

let div;
let checkboxes = [];


const MOUSE_SCALE = 3.0;

let rule, calculatedRule

function setup() {
  createCanvas(300, 150);

  // frameRate(10);

  rule = round(random(0, 255));
  calculatedRule = ruleFromDecimal(rule);

  div = createDiv(`Rule ${rule}`).style("font-size", "30px").style("color", "white").mousePressed(() => div.html="");

  for (let i = 0; i < 8; i++) {
    checkboxes[i] = createCheckbox().class(`cb`).checked((rule & (1 << i)) > 0).input(() => {
      console.log("input on " + i + ", checked: ");
      if (checkboxes[i].checked()) {
        rule |= 1 << i;
      } else {
        rule &= ~(1 << i)
      }
    });
    createSpan(`${i.toString(2).padStart(3, "0")}<br>`)
  }

  total = width * height;
  for (let x = 0; x < width; x++) {
    cells[x] = [];
    for (let y = 0; y < height; y++) {
      cells[x][y] = 0;
    }
  }
  cells[round(width/2)][counter] = 1;
}

function draw() {
  counter++;
  if (counter >= height) counter = 1;

  div.html(`Rule ${rule}`)

  calculatedRule = ruleFromDecimal(rule);

  background(200);

  for (let x = 2; x < width - 2; x++) {
    if (!clickedCells.includes(x+counter*width))
    cells[x][counter] = applyRule(
      cells[x - 1][counter - 1],
      cells[x][counter - 1],
      cells[x + 1][counter - 1]
    );
  }

  loadPixels();
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      if (cells[x][y] == 0) {
        pgray(200, x, y);
      } else if (cells[x][y] == 1) pgray(20, x, y);
    }
    if (mouseX === x) {
      if (cells[x][0] === 0) pgray(170, x, 0);
      else if (cells[x][0] === 1) pgray(50, x, 0)
    }
  }
  updatePixels();

  stroke(128,255,0,100);
  strokeWeight(1);
  line(0, counter, width, counter);
}

function mousePressed() {
  mouseMoved();
  if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > width) return;
  cells[mouseX][0] = +!cells[mouseX][0];
}

function mouseMoved() {
  mouseX /= MOUSE_SCALE;
  mouseY /= MOUSE_SCALE;
  mouseX = Math.round(mouseX);
  mouseY = Math.round(mouseY);
}
function pgray(c, x, y) {
  pixels[(x + y * width) * 4 + 0] = c;
  pixels[(x + y * width) * 4 + 1] = c;
  pixels[(x + y * width) * 4 + 2] = c;
}

function ruleFromDecimal(dec) {
  let r = {}
  for (let i = 0; i < 8; i++) {
    r[i.toString(2).padStart(3, "0")] = Math.sign(dec & (1 << i));
  }
  return r;
}

function applyRule(c1, c2, c3) {
  const value = (c1 * 4 + c2 * 2 + c3)
  let returnValue;
  for (const key of Object.keys(calculatedRule)) {
    if (parseInt(key, 2) === value) {
      returnValue = +calculatedRule[key];
    }
  }
  return returnValue;
}
