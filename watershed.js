const LOCATION_JITTER_MIN = 0; // randomness applied to point locations
const LOCATION_JITTER_MAX = 30;
const SPEED_MULT_MIN = 0.00001; // min update speed. lower number means less divergence
const SPEED_MULT_MAX = 0.01; // max update speed. higher number means more divergence
const MIN_DENSITY = 10; // min number of lines on a player's drawing
const MAX_DENSITY = 60; // max number of lines on a player's drawing
const MIN_RESET_TIME = 500; // min ticks before a player's drawing resets
const MAX_RESET_TIME = 1000; // max ticks before a player's drawing resets
const LINE_WEIGHT = 1;
const PRE_RESET_DIMMING_AMOUNT = 4; // how much to dim out old drawing as reset draws near
const RESET_DIMMING_AMOUNT = 75; // final opacity to overlay on drawing upon reset

let players;

function setup() {

  createCanvas(windowWidth, windowHeight);
  background(0);
  angleMode(DEGREES);
  noiseDetail(1);

  players = [
    new Player({
      width: windowWidth / 2,
      colors: [0, 175, 102],
      name: "green",
    }),
    new Player({
      width: windowWidth / 2,
      colors: [217, 2, 125],
      name: "red",
      offset: 1038127,
    }),
  ];

  players.forEach((p) => p.reset());
}

function draw() {
  players.forEach((p, i) => {
    translate((i * width) / 2, 0);
    p.draw();
  });
}

function Player(options) {
  this.ticks = 0;
  this.width = options.width;
  this.density = 10;
  this.colors = options.colors;
  this.mult = 0;
  this.resetTick = null;
  this.offset = options.offset || 0;
  this.jitter = 0;

  this.points = [];

  this.reset = function () {
    this.ticks = 0;
    this.resetTick = random(MIN_RESET_TIME, MAX_RESET_TIME);
    this.mult = random(SPEED_MULT_MIN, SPEED_MULT_MAX);
    this.density = random(MIN_DENSITY, MAX_DENSITY);
    this.offset = random(-10000, 10000);
    this.jitter = random(LOCATION_JITTER_MIN, LOCATION_JITTER_MAX);

    this.space = this.width / this.density;

    this.points = [];

    for (let x = 0; x < this.width; x += this.space) {
      for (let y = 0; y < innerHeight; y += this.space) {
        let p = createVector(
          x + random(-this.jitter, this.jitter),
          y + random(-this.jitter, this.jitter)
        );
        this.points.push(p);
      }
    }
  };

  this.draw = function () {
    this.ticks++;
    const tickDiff = this.resetTick - this.ticks;

    if (tickDiff <= 255) {
      fill(0, 0, 0, PRE_RESET_DIMMING_AMOUNT);
      rect(0, 0, this.width, height);
    }

    if (this.ticks >= this.resetTick) {
      fill(20, 20, 20, RESET_DIMMING_AMOUNT);
      rect(0, 0, this.width, height);
      this.reset();
    }

    noStroke();

    for (let i = 0; i < this.points.length; i++) {
      fill(this.colors.concat(map(tickDiff, 0, MAX_RESET_TIME, 0, 255)));

      let angle = map(
        noise(
          this.points[i].x * this.mult + this.offset,
          this.points[i].y * this.mult + this.offset
        ),
        0,
        1,
        0,
        720
      );

      this.points[i].add(createVector(cos(angle), sin(angle)));

      ellipse(this.points[i].x, this.points[i].y, LINE_WEIGHT);
    }
  };
}
