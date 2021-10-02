const WMOD = 1;

let players, tie;

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

function setup() {
  const w = windowWidth * WMOD;
  const h = windowHeight * WMOD;
  createCanvas(w, h);

  players = [
    new Player({
      name: "red",
      colorValues: [127, 17, 125],
      theta: 0,
      radius: 200,
      velocity: 0.01,
    }),
    new Player({
      name: "green",
      colorValues: [17, 127, 17],
      theta: 10,
      radius: 122,
      velocity: 0.008,
    }),
  ];

  tie = new Tie(players);
}

function update() {
  players.forEach((player) => player.update());
}

function draw() {
  update();
  background(20);

  // Translate the origin point to the center of the screen
  translate(width / 2, height / 2);
  players.forEach((player) => player.drawHistory());
  tie.draw();
  players.forEach((player) => player.draw());
}

function Tie(players) {
  this.degrade = 0.97;
  this.interval = 7;
  this.players = players;
  this.history = [];
  this.ticks = 0;
  this.maxHistory = 40;

  this.draw = function () {

    this.ticks++;

    if (this.ticks % this.interval === 0){
      this.history.push({
        x1: players[0].x, y1: players[0].y,
        x2: players[1].x, y2: players[1].y,
        alpha: 150
      })
    }

    if (this.history.length > this.maxHistory){
      this.history.shift();
    }

    strokeWeight(3);

    this.history.forEach(item => {
      item.alpha *= this.degrade;
      stroke([60, 60, 60, item.alpha]);
      line(item.x1, item.y1, item.x2, item.y2);
    })

    stroke([60, 60, 60, 150]);
    line(players[0].x, players[0].y, players[1].x, players[1].y);
  };
}

function Player(options) {
  const velocityEasing = 0.01;
  const maxHistory = 70;
  const {
    name,
    colorValues,
    theta,
    radius,
    size,
    weight,
    velocity,
  } = options;

  this.name = name;
  this.ticks = 0;
  this.velocityChangeTicks = 0;
  this.history = [];
  this.colorValues = colorValues || [127, 17, 125];
  this.theta = theta || 0;
  this.radius = radius || 200;
  this.size = size || 70;
  this.weight = weight || 3;
  this.velocity = velocity || 0.01;
  this.nextVelocity = this.velocity;
  this.x = 0;
  this.y = 0;
  this.ticksUntilVelocityChange = getRandomIntInclusive(300, 600);
  this.historyDegrade = 0.995;
  this.historyInterval = 8;

  this.update = function () {
    this.ticks++;
    this.velocityChangeTicks++;
   
    this.history.forEach((item) => {
      item.alpha = item.alpha * this.historyDegrade;
    });

    if (this.ticks % this.historyInterval === 0) {
      this.history.push({ x: this.x, y: this.y, alpha: 255 });
      if (this.history.length > maxHistory) {
        this.history.shift();
      }
    }

    if (this.velocityChangeTicks >= this.ticksUntilVelocityChange) {
      this.velocityChangeTicks = 0;
      this.nextVelocity = getRandomArbitrary(0.000001, 0.05);
      this.historyDegrade = map(this.nextVelocity, 0.000001, 0.05, 0.997, 0.92);
      this.historyInterval = Math.floor(map(this.nextVelocity, 0.000001, 0.05, 10,3))
      this.ticksUntilVelocityChange = getRandomIntInclusive(300,600);
    }

    const dV = this.nextVelocity - this.velocity;
    this.velocity += dV * velocityEasing;

    // Convert polar to cartesian
    this.x = this.radius * cos(this.theta);
    this.y = this.radius * sin(this.theta);
    this.theta += this.velocity;
  };

  this.draw = function () {
    // Draw the ellipse at the cartesian coordinate
    ellipseMode(CENTER);
    fill(20);
    stroke(this.colorValues);
    strokeWeight(this.weight);
    ellipse(this.x, this.y, this.size, this.size);
  };

  this.drawHistory = function () {
    ellipseMode(CENTER);
    fill(20);
    stroke(this.colorValues);
    strokeWeight(this.weight);
    this.history.forEach((item) => {
      stroke(this.colorValues.concat(item.alpha));
      ellipse(item.x, item.y, this.size, this.size);
    });
  };
}
