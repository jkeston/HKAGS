const WMOD = 1;
const ROWS = 20;
const COLS = 20;
const TILE_SIZE = 50;
const PADDING = 5;
const NOISE_STEP_INC = 0.05;
const NOISE_SCALE = 0.05;
const TWO_PI = Math.PI * 2;

let w, h, tiles;

function setup() {
  w = windowWidth * WMOD;
  h = windowHeight * WMOD;
  createCanvas(w, h);

  tiles = Array.apply(null, Array(COLS)).map(function (col, i) {
    let colRows = Array.apply(null, Array(ROWS)).map(function (row, r) {
      return new Tile({
        colors: [217, 2, 125],
        col: i,
        row: r,
        size: TILE_SIZE,
        padding: PADDING,
      });
    });
    return colRows;
  });
}

function draw() {
  background(10);
  translate(TILE_SIZE, TILE_SIZE);

  for (let col = 0; col < COLS; col++) {
    for (let row = 0; row < ROWS; row++) {
      const tile = tiles[col][row];
      tile.update();
      tile.draw();
    }
  }
}

function Tile(options) {
  this.colors = options.colors; // 217, 2, 125, or 0, 175, 102
  this.x = options.col * options.size;
  this.y = options.row * options.size;
  this.size = options.size; // - options.padding;
  this.centerX = this.x + this.size / 2;
  this.centerY = this.y + this.size / 2;
  this.row = options.row;
  this.col = options.col;
  this.noiseX = 0;
  this.noiseY = 0;
  this.noiseVal = 0;
  this.endX = 0;
  this.endY = 0;
  this.theta = 0;

  this.update = function () {
    this.noiseX += NOISE_STEP_INC;
    this.noiseY += NOISE_STEP_INC;
    this.noiseVal = noise(
      (this.noiseX + this.col) * NOISE_SCALE,
      (this.noiseY + this.row) * NOISE_SCALE
    );
    this.theta = TWO_PI * this.noiseVal;

    // Convert polar to cartesian
    this.endX = this.size * cos(this.theta);
    this.endY = this.size * sin(this.theta);
  };

  this.draw = function () {
    // noStroke()
    stroke(this.colors.concat(this.noiseVal * 255));
    strokeWeight(2);
    line (this.centerX, this.centerY, this.centerX + this.endX, this.centerY + this.endY);
    // fill(this.colors.concat(this.noiseVal * 255));
    // rect(this.x, this.y, this.size , this.size );
  };
}
