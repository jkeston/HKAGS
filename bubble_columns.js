// declare some things
let speed = -.75;
let score_len = 0;
let img;
let x = 0;
let end = 0;
const WMOD = 1;

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

  score_len = img.width;
  end = score_len - w;
  speed = -((score_len)/(times[scene_id] * 30));
  // console.log("times["+scene_id+"]: "+times[scene_id]+" pixel density: "+pixelDensity()+" img.width: "+img.width+" speed: "+speed);
  fade_in_duration = 10;
  fade_out_duration = 10;
}

function windowResized() {
  w = windowWidth * WMOD;
  h = windowHeight * WMOD;
  resizeCanvas(w, h);
}

function draw() {
  // prevent image smudge
  if (abs(x) > end) {
    background(0);
  }
  image(img, x, 0);
  // fade it in
  x += speed;
}
