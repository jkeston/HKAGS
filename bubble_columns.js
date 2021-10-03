// declare some things
let speed = -.75;
let score_len = 0;
const WMOD = 1;
let img;
let x = 0;

function preload() {
  switch(rollDice(4)) {
    case 1:
      img = loadImage('images/voronoi_vectors.png');
      break;
    case 2:
      img = loadImage('images/voronoi_vectors_bw.png');
      break;
    case 3:
      img = loadImage('images/voronoi_vectors_flipped.png');
      break;
    case 4:
      img = loadImage('images/voronoi_vectors_flipped_bw.png');
      break;
  }
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
  image(img, x, 0);
  x += speed;
}
