// declare some things
let speed = -3;
let score_len = 0;
const WMOD = 1;
let img;
let x = 0;

function preload() {
  img = loadImage('images/calahan_graphic_score_expanded.png');
}

function setup() {
  frameRate(30);
  w = windowWidth * WMOD;
  h = windowHeight * WMOD;
  createCanvas(w, h);
  pixelDensity(1);
  x = w * 0.5;
  img.resize(0,h);
  // console.log(pixelDensity());
}

function windowResized() {
  w = windowWidth * WMOD;
  h = windowHeight * WMOD;
  resizeCanvas(w, h);
}

function draw() {
  background(0);
  strokeWeight(3);
  stroke(255);
  image(img, x, 0);
  x += speed;
}
