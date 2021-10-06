// declare some things
let speed = 0;
let score_len = 0;
const WMOD = 1;
let img;
let x = 0;
let alpha = 255;
let end = 0;

function preload() {
  img = loadImage('images/calahan_graphic_score_vectors.png');
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
  // fade it in
  if (frameCount < 86) {
      background(0,0,0,alpha);
      alpha -= 3;
  }
  x += speed;
}
