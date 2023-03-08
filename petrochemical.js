// declare some things
const speed = -2;
const WMOD = 1;
let numRests = 0;
let score_len;
let x = 0;
let sw = 2;
let half_w, half_h, quarter_h, nextPos1, nextPos2;
let ovals1 = [];
let ovals2 = [];
let t = 0;
let t2 = 1;

function setup() {
  frameRate(30);
  let parts = window.location.href.split("#");
  numRests = parseInt(parts[1]) / 2;
  w = windowWidth * WMOD;
  h = windowHeight * WMOD;
  half_w = w / 2;
  half_h = h / 2;
  quarter_h = h / 4;
  score_len = half_w;
  createCanvas(w, h);
  pixelDensity(1);
  // x = w * 0.5;
  x = 0;
  // set color for top vs bottom
  t = round(random(0, 1));
  if (t == 1) {
    t2 = 0;
  }

  voronoiCellStrokeWeight(sw);
  //Set Site Stroke Weight to 0 (get rid of the dots in each cell)
  voronoiSiteStrokeWeight(0);

  //Sets 1500 random sites with 10 minimum distance
  voronoiRndSites(7000, 1);

  //Compute voronoi diagram at screen dimensions
  voronoi(w * 16, h, false);

  // initial offset to stagger rests
  if (Math.random() < 0.5) {
    nextPos1 = score_len;
    nextPos2 = score_len + random(100, 200);
  } else {
    nextPos2 = score_len;
    nextPos1 = score_len + random(100, 200);
  }
  for (let i = 0; i <= numRests; ++i) {
    let modSides = numRests / 2 - i;
    if (i > numRests / 2) {
      modSides = i - numRests / 2;
    }
    let ow1 = random(50, 80);
    let ow2 = random(50, 80);
    let ols1 = random(50, 100);
    let ols2 = random(50, 100);
    // let sides1 = floor(random(12,12+modSides/2));
    // let sides2 = floor(random(12,12+modSides/2));
    let sides1 = round(random(12, 12 + modSides / 2));
    let sides2 = round(random(12, 12 + modSides / 2));
    ovals1[i] = new OvalRest(t2, ow1, ols1, nextPos1, 0, sides1);
    ovals2[i] = new OvalRest(t, ow2, ols2, nextPos2, h / 2, sides2);

    nextPos1 += ovals1[i].actualW + ols1;
    nextPos2 += ovals2[i].actualW + ols2;
    console.log(nextPos1, nextPos2);
  }
}

function drawVoronoiPatterns(x) {
  // background(150);
  //Draw diagram in coordinates 0, 0
  //Filled and without jitter

  // voronoiCellStroke(chooseTeam(1));
  voronoiDraw(x, 0, false, false, t);

  fill(0);

  for (let i = 0; i <= numRests; ++i) {
    ovals1[i].display();
    ovals2[i].display();
  }
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
  stroke(0, 0, 0, 255);
  line(0, 0, w, 0);
  line(0, h, w, h);
  if (score_len > 0) {
    line(score_len + 2, 0, score_len + 2, h);
  }
}

class OvalRest {
  constructor(team, ovalWidth, leftSpace, hPos, vPos, oSides) {
    this.team = team;
    this.ovalWidth = ovalWidth;
    this.leftSpace = leftSpace;
    // this.nextPos = ovalWidth + leftSpace;
    this.hPos = hPos;
    this.vPos = vPos;
    this.oSides = oSides;
    this.vects = [];
    this.yOff = 0;
    //create a vertex for each side in the loop
    let vx = 0;
    let vy = 0;
    this.vects[0] = createVector(vx, vy);
    let sCount = 0;
    let oHeight = 0;
    let maxW = 0;
    let minW = 0;
    for (let i = 1; i <= this.oSides; ++i) {
      //right top half x increase
      if (i == 1) {
        vx = this.vects[i - 1].x + random(15, this.ovalWidth);
        vy = this.vects[i - 1].y;
        this.vects[i] = createVector(vx, vy);
        ++sCount;
      }
      //right top half x,y increase
      else if (i > 1 && i < round(this.oSides * 0.25)) {
        vx = this.vects[i - 1].x + random(15, this.ovalWidth);
        vy = this.vects[i - 1].y + random(15, this.ovalWidth);
        this.vects[i] = createVector(vx, vy);
        ++sCount;
        maxW = vx;
      }
      //right bottom half x decreases y increases
      else if (i > round(this.oSides * 0.25) && i < round(this.oSides * 0.5)) {
        vx = this.vects[i - 1].x - random(10, this.ovalWidth);
        vy = this.vects[i - 1].y + random(15, this.ovalWidth);
        this.vects[i] = createVector(vx, vy);
        // console.log('r b h vects['+i+']'+this.vects[i]+' round'+round(this.oSides / 2));
        ++sCount;
      }
      //bottom x decreases y repeats
      else if (i == round(this.oSides * 0.5)) {
        vx = this.vects[i - 1].x - random(10, this.ovalWidth / 2);
        vy = this.vects[i - 1].y;
        this.vects[i] = createVector(vx, vy);
        this.yOff = (half_h - vy) / 2;
        oHeight = vy;
        // console.log('FLAT b h vects['+i+']'+this.vects[i]);
        ++sCount;
        minW = vx;
      }
      // bottom left x,y decrease
      else if (i > round(this.oSides * 0.5) && i < round(this.oSides * 0.75)) {
        vx = this.vects[i - 1].x - random(10, this.ovalWidth / 2);
        vy = this.vects[i - 1].y - random(15, this.ovalWidth);
        if (oHeight - vy <= 0 || vy <= 0) {
          vy = 0;
        } // truncate left side
        this.vects[i] = createVector(vx, vy);
        ++sCount;
      }
      // top left y decreases
      else if (i > round(this.oSides * 0.75)) {
        vx = this.vects[i - 1].x + random(10, this.ovalWidth / 2);
        vy = this.vects[i - 1].y - random(15, this.ovalWidth);
        if (oHeight - vy <= 0 || vy <= 0) {
          vy = 0;
        } // truncate left side height
        if (vx >= 0) {
          vx = 0;
        } // prevent crossovers
        this.vects[i] = createVector(vx, vy);
        ++sCount;
      } else {
        this.vects[i] = createVector(vx, vy);
        ++sCount;
      }
      this.actualW = abs(minW) + maxW;
    }
  }
  display() {
    // draw with stroke color and fill
    if (this.hPos < w*1.25 && this.hPos > -w*0.25) {
      stroke(chooseTeam(this.team));
      fill(0, 255);
      // ellipse(this.hPos + this.leftSpace, this.vPos, this.ovalWidth, half_h, this.oSides);
      // move it
      beginShape();
      for (let i = 0; i < this.oSides; ++i) {
        vertex(this.vects[i].x + this.hPos + this.leftSpace, this.vects[i].y + this.vPos + this.yOff);
      }
      endShape(CLOSE);
    }
    this.hPos += speed;
  }
}
