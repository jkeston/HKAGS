// declare some things
let speed = 0;
let score_len = 0;
let img;
let x = 0;
let end = 0;
const WMOD = 1;

function preload() {
  switch(rollDice(4)) {
    case 1:
      img = loadImage('images/calahan_graphic_score_vectors.png');
      break;
    case 2:
      img = loadImage('images/calahan_graphic_score_vectors_bw.png');
      break;
    case 3:
      img = loadImage('images/calahan_graphic_score_vectors_2.png');
      break;
    case 4:
      img = loadImage('images/calahan_graphic_score_vectors_2_bw.png');
      break;
  }
}

function setup() {
  frameRate(30);
  pixelDensity(1);
  w = windowWidth * WMOD;
  h = windowHeight * WMOD;
  createCanvas(w, h);
  x = w * 0.5;
  img.resize(0,h);
  score_len = img.width;
  speed = -((score_len)/(times[scene_id] * 30));
  // console.log("times[5]: "+times[scene_id]+" pixel density: "+pixelDensity()+" img.width: "+img.width+" speed: "+speed);
  end = score_len - w;
}

function windowResized() {
  w = windowWidth * WMOD;
  h = windowHeight * WMOD;
  resizeCanvas(w, h);
}

function draw() {
  background(0);
  image(img, x, 0);
  x += speed;
}
