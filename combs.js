const WMOD = 1;
const xSpeed = 5;

let sceneX,
  combs,
  frameCount = 0;

function setup() {
  const w = windowWidth * WMOD;
  const h = windowHeight * WMOD;
  createCanvas(w, h);

  sceneX = 0;

  combs = [
    {
      index: 0,
      lineCount: 5,
      currentSpread: 20,
      color: color('rgba(217, 2, 125, 0.6)'),
      points: [{ x: w / 2, y: h  * 0.25, spread: 20 }],
      targetY: h / 2,
    },
    {
      index: 0,
      lineCount: 5,
      currentSpread: 20,
      color: color('rgba(2, 217, 125, 0.6)'),
      points: [{ x: w / 2, y: h * 0.75, spread: 20 }],
      targetY: h / 2,
    },
  ];
}

const easing = 0.05;
const yChangeSpeed = 5;
const spreadChangeSpeed = 0.5;
const probabilityOfChange = 0.01;
const positionToSpreadChangeRatio = 0.5;
const spreadMax = 100;
const maxPoints = 250;

function update() {
  frameCount++;
  sceneX += xSpeed;

  combs.forEach((comb) => {
    if (Math.random() < probabilityOfChange) {
      if (Math.random() > positionToSpreadChangeRatio){
        comb.targetY = Math.random() * (height - spreadMax*5 - 10) + 10;
      } else{
        comb.currentSpread = Math.random() * 100;

      }
    }

    const lastPoint = comb.points[comb.points.length - 1];

    let dy = comb.targetY - lastPoint.y;
    let y =
      dy === 0 || Math.abs(dy) <= yChangeSpeed
        ? lastPoint.y
        : dy > 0
        ? lastPoint.y + yChangeSpeed
        : lastPoint.y - yChangeSpeed;

    let dSpread = comb.currentSpread - lastPoint.spread;
    let spread =
      dSpread === 0 || Math.abs(dSpread) <= spreadChangeSpeed
        ? lastPoint.spread
        : dSpread > 0
        ? lastPoint.spread + spreadChangeSpeed
        : lastPoint.spread - spreadChangeSpeed;

    const x = lastPoint.x + xSpeed;
    comb.points.push({ x, y, spread });

    if (comb.points.length > maxPoints) {
      comb.points.shift();
    }
  });
}

function draw() {
  update();
  background(20);

  translate(-sceneX, 0);

  combs.forEach((comb) => {
    const { points } = comb;
    stroke(comb.color);
    for (let l = 0; l < comb.lineCount; l++) {
      //   translate(0, comb.spread * l);
      for (let i = 1; i < points.length; i++) {
        strokeWeight(points[i].spread / 5)
        line(
          points[i - 1].x,
          points[i - 1].y + l * points[i - 1].spread,
          points[i].x,
          points[i].y + l * points[i].spread
        );
      }
      //   translate(0, -comb.spread * l);
    }
  });
}
