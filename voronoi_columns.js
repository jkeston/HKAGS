// declare some things
let speed = -1;
let score_len = 0;
const WMOD = 1;
let x = 0;
let sw = 1;
let half_w, half_h, quarter_h, nextPos1, nextPos2;
let ovals1 = [];
let ovals2 = [];
let mike = 0; let john = 1;

function preload() {
  switch(rollDice(4)) {
    case 1:
      img = loadImage('images/transparent_ovals.png');
      break;
    case 2:
      img = loadImage('images/transparent_ovals_bw.png');
      break;
    case 3:
      mike = 1; john = 0;
      img = loadImage('images/transparent_ovals_flipped.png');
      break;
    case 4:
      mike = 1; john = 0;
      img = loadImage('images/transparent_ovals_bw_flipped.png');
      break;
  }
}

function setup() {
    frameRate(30);
    w = windowWidth * WMOD;
    h = windowHeight * WMOD;
    half_w = w / 2;
    half_h = h / 2;
    quarter_h = h / 4;
    createCanvas(w, h);
    pixelDensity(1);
    x = half_w;
    score_len = x;

    voronoiCellStrokeWeight(sw);
    //Set Site Stroke Weight to 0 (get rid of the dots in each cell)
    voronoiSiteStrokeWeight(0);

    //Sets 1500 random sites with 10 minimum distance
    voronoiRndSites(3500, 1);

    //Compute voronoi diagram at screen dimensions
    voronoi(w * 8, h/2, false);

    // nextPos1 = half_w;
    // nextPos2 = half_w;
    // for (let i = 0; i <= 100; ++i) {
    //   let ow1 = random(80,200);
    //   let ow2 = random(80,200);
    //   let ols1 = random(40,140);
    //   let ols2 = random(40,140);
    //   ovals1[i] = new OvalRest(0,ow1,ols1,nextPos1,quarter_h);
    //   ovals2[i] = new OvalRest(1,ow2,ols2,nextPos2,h-quarter_h);
    //   nextPos1 += (ow1 + ols1);
    //   nextPos2 += (ow2 + ols2);
    // }

    img.resize(0,h);
}

function drawVoronoiPatterns(x) {
    // background(150);
    //Draw diagram in coordinates 0, 0
    //Filled and without jitter
    voronoiCellStroke(chooseTeam(john));
    voronoiDraw(x, 0, false, false);
    voronoiCellStroke(chooseTeam(mike));
    voronoiDraw(x, h/2, false, false);

    fill(0);

    // for (let i = 0; i <= 100; ++i) {
    //   ovals1[i].display();
    //   ovals2[i].display();
    // }
    // stroke(chooseTeam(0));
    // ellipse(x + w, quarter_h, 200, half_h);
}

function draw() {
    background(0);
    fill(chooseTeam(0));
    strokeWeight(0);
    // rect(0, 0, w, half_h);
    fill(chooseTeam(0));
    // rect(0, half_h, w, half_h);
    strokeWeight(sw);
    drawVoronoiPatterns(score_len);
    score_len += speed;

    strokeWeight(2);
    stroke(0,0,0,255);
    line(0,0,w,0);
    line(0,h,w,h);
    if (score_len < w) {
      line(0,0,0,h);
    }
    if (score_len < -10000) {
      line(w,0,w,h);
    }
    image(img, score_len, 0);
    // console.log(score_len);
    stroke(0,0,0,255);
    line(0,half_h,w,half_h);
}

class OvalRest {
    constructor(team,ovalWidth,leftSpace,hPos,vPos) {
      this.team = team;
      this.ovalWidth = ovalWidth;
      this.leftSpace = leftSpace;
      // this.nextPos = ovalWidth + leftSpace;
      this.hPos = hPos;
      this.vPos = vPos;
    }
    display() {
      // draw with stroke color and fill
      stroke(chooseTeam(this.team));
      ellipse(this.hPos + this.leftSpace, this.vPos, this.ovalWidth, half_h);
      // move it
      this.hPos += speed;
    }
}
