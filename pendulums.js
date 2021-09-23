const WMOD = 1;
const gravity = 0.4; // arbitrary
const radiusChangeSpeed = 4;
const damping = 0.998; // higher value means it doesn't slow down as much
const maxAtRestAngle = 0.05;
const maxAtRestAcceleration = 0.0000005;
const minRandomPush = 0.01; // softest push strength
const maxRandomPush = 0.03; // hardest push strength
const minRadius = 700;
const maxRadius = 800;
const minAngle = Math.PI / 2;
const maxAngle = Math.PI / 4;
const minRandomEventInterval = 200;
const maxRandomEventInterval = 1000;
const ballRadius = 80.0;
const atRestPushProbability = 0.05;

let w, h, players;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

function createPlayer(name, color, radius, angle) {
  return new Pendulum(name, createVector(width / 2, 0), color, radius, angle);
}

function randomRadius() {
  return Math.floor(getRandom(minRadius, maxRadius));
}

function randomAngle() {
  return getRandom(minAngle, maxAngle) * Math.random() > 0.5 ? -1 : 1;
}

function setup() {
  w = windowWidth * WMOD;
  h = windowHeight * WMOD;
  createCanvas(w, h);
  players = [
    createPlayer("green", color(2, 217, 125), randomRadius(), randomAngle()),
    createPlayer("red", color(217, 2, 125), randomRadius(), randomAngle()),
  ];
}

function draw() {
  background(20);

  stroke(30);
  line(w/2, 0, w/2, h);

  players.forEach((player, i) => {
    player.go();

    // fill(player.color);
    // textSize(16);
    // text('angle: ' + player.angle, 10, h - 50 - i * 50);
  });

}

function Pendulum(name, origin, color, radius, angle) {

  // Fill all variables
  this.name = name;
  this.origin = origin.copy();
  this.position = createVector();
  this.r = radius;
  this.desiredR = this.r;
  this.angle = angle;
  this.color = color;
  this.atRest = false;

  this.aVelocity = 0.0;
  this.aAcceleration = 0.0;
  this.ballr = ballRadius; // Arbitrary ball radius
  // this.ticks = 0;
  // this.randomEventTick = getRandomIntInclusive(
  //   minRandomEventInterval,
  //   maxRandomEventInterval
  // );

  this.isAtRest = function () {
    return (
      Math.abs(this.angle) < maxAtRestAngle &&
      Math.abs(this.aAcceleration) < maxAtRestAcceleration
    );
  };

  this.doRandomEvent = function () {
    console.log("RANDOM EVENT");
    this.desiredR = randomRadius();
    this.aVelocity +=
      getRandom(minRandomPush, maxRandomPush) * (this.aVelocity > 0 ? 1 : -1);

  };

  this.go = function () {
    this.update();
    this.display();
  };

  this.checkRandomEvent = function () {
    if (this.atRest && Math.random() < atRestPushProbability) {
      this.doRandomEvent();
    }
  };

  // Function to update position
  this.update = function () {
    this.atRest = this.isAtRest();

    this.checkRandomEvent();

    const dr = this.desiredR - this.r;

    if (Math.abs(dr) > radiusChangeSpeed) {
      this.r += dr > 0 ? radiusChangeSpeed : -radiusChangeSpeed;
    } else if (this.r != this.desiredR) {
      this.r = this.desiredR;
    }

    this.aAcceleration = ((-1 * gravity) / this.r) * sin(this.angle); // Calculate acceleration (see: http://www.myphysicslab.com/pendulum1.html)
    this.aVelocity += this.aAcceleration; // Increment velocity
    this.aVelocity *= damping; // Arbitrary damping
    this.angle += this.aVelocity; // Increment angle
  };

  this.display = function () {
    this.position.set(this.r * sin(this.angle), this.r * cos(this.angle), 0); // Polar to cartesian conversion
    this.position.add(this.origin); // Make sure the position is relative to the pendulum's origin

    stroke(100);
    strokeWeight(2);
    // Draw the arm
    line(this.origin.x, this.origin.y, this.position.x, this.position.y);
    ellipseMode(CENTER);

    // if (this.atRest){
    //   stroke(200);
    //   strokeWeight(6);
    // }
    fill(this.color);
    // Draw the ball
    ellipse(this.position.x, this.position.y, this.ballr, this.ballr);
  };
}
