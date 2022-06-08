class CellState {
  static Empty = 0;
  static Planned = 1;
  static Plant = 2;
}

class Cell {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.state = CellState.Empty;
    this.color = null;
  }

  plantNeighbours() {
    return [
      createVector(this.pos.x + 1, this.pos.y),
      createVector(this.pos.x, this.pos.y + 1),
      createVector(this.pos.x, this.pos.y - 1),
      createVector(this.pos.x - 1, this.pos.y),
    ].map(pos => (cells[pos.x] || {})[pos.y]).filter(cell => !!cell);
  }

  update() {
    if (this.state === CellState.Empty) return;
    if (this.state === CellState.Planned) {
      this.state = CellState.Plant;
      return;
    }
      if (random() > RANDOM_CHANCE) return;
    // if (this.updateFrame && this.updateFrame !== frameCount) return;

    const neighbours = this.plantNeighbours();
    if (!neighbours.some(cell => cell.state === CellState.Empty)) return;

    neighbours.forEach((cell) => {
      if (cell.state === CellState.Plant) return;
      cell.state = CellState.Planned;
      // cell.updateFrame = frameCount + 1;
      cell.color = [
        this.color[0] + random(-COLOR_CHANGE, COLOR_CHANGE),
        this.color[1] + random(-COLOR_CHANGE, COLOR_CHANGE),
        this.color[2] + random(-COLOR_CHANGE, COLOR_CHANGE)
      ];
    });
  }

  draw() {
    if (this.state === CellState.Empty) return;
    done++;
    pixels[(this.pos.x + this.pos.y*width)*4 + 0] = this.color[0]
    pixels[(this.pos.x + this.pos.y*width)*4 + 1] = this.color[1]
    pixels[(this.pos.x + this.pos.y*width)*4 + 2] = this.color[2]
  }

  fill() {
    this.state = CellState.Plant;
    this.color = eval(prompt("Color:"))
  }
}
