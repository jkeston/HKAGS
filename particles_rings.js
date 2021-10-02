const WMOD = 1;
const POSITION_INTENSITY_MAGNITUDE = 1;
const ROTATION_INTENSITY_MAGNITUDE = 0.1;
const GRAVITY = 0.3;
const player1Rgb = [217, 2, 125];
const player2Rgb = [0, 175, 102];
const MIN_SUSTAIN_TIME = 100;
const MAX_SUSTAIN_TIME = 1000;
const PARTICLE_STROKE_WEIGHT = 2;
const MIN_FADE_TIME = 200;
const MAX_FADE_TIME = 800;
const MIN_NUM_PARTICLES = 5;
const MAX_NUM_PARTICLES = 50;
const MIN_PARTICLE_WIDTH = 20;
const MAX_PARTICLE_WIDTH = 100;
const PARTICLE_HEIGHT = 20;
const RING_FORM_START_SIZE = 2000;
const MIN_RING_SIZE = 75;
const MAX_RING_SIZE = 150;
const RING_FORM_TIME = 30;
const MIN_RING_SUSTAIN_TIME = 200;
const MAX_RING_SUSTAIN_TIME = 500;
const RING_FADE_TIME = 100;
const RING_STROKE_WEIGHT = 2;
const RING_MAX_STROKE_WEIGHT = 70;
const MIN_TICKS_UNTIL_NEXT_RING = 300;
const MAX_TICKS_UNTIL_NEXT_RING = 800;

let particleEvents, ringEvents, players;

function setup() {
  const w = windowWidth * WMOD;
  const h = windowHeight * WMOD;
  createCanvas(w, h);
  background(0);
  particleEvents = [];
  ringEvents = [];
  players = [
    {
      rgb: player1Rgb,
      name: '1',
      ticksUntilNextRing: random(
        MIN_TICKS_UNTIL_NEXT_RING,
        MAX_TICKS_UNTIL_NEXT_RING
      ),
    },
    {
      rgb: player2Rgb,
      name: '2',
      ticksUntilNextRing: random(
        MIN_TICKS_UNTIL_NEXT_RING,
        MAX_TICKS_UNTIL_NEXT_RING
      ),
    },
  ];
}

function update() {
  players.forEach((player) => {
    if (
      !particleEvents.find((p) => p.player.name === player.name) &&
      Math.random() > 0.01
    ) {
      particleEvents.push(
        new ParticleEvent({
          x: random(width * 0.25, width * 0.75),
          y: random(100, height / 2),
          formTime: 100,
          sustainTime: Math.floor(random(MIN_SUSTAIN_TIME, MAX_SUSTAIN_TIME)),
          fadeTime: Math.floor(random(MIN_FADE_TIME, MAX_FADE_TIME)),
          numParticles: Math.floor(
            random(MIN_NUM_PARTICLES, MAX_NUM_PARTICLES)
          ),
          rgb: player.rgb,
          width: random(width * 0.01, width * 0.75),
          player,
        }).init()
      );
    }

    player.ticksUntilNextRing--;

    if (
      !ringEvents.find((p) => p.player.name === player.name) 
      && player.ticksUntilNextRing < 0
    ) {
      ringEvents.push(
        new RingEvent({
          x: random(300, width - 300),
          y: random(300, height - 300),
          player,
          sustainTime: 100,
          rgb: player.rgb,
          size: random(MIN_RING_SIZE, MAX_RING_SIZE),
          formTime: RING_FORM_TIME,
        })
      );
    }
  });

  ringEvents.forEach((r) => r.update());
  particleEvents.forEach((pe) => pe.update());

  const deadParticleEvents = particleEvents.filter(
    (pe) => pe.state === states.DONE
  );
  deadParticleEvents.forEach((deadEvent) => {
    const i = particleEvents.indexOf(deadEvent);
    particleEvents.splice(i, 1);
  });

  const deadRingEvents = ringEvents.filter((pe) => pe.state === states.DONE);
  deadRingEvents.forEach((deadEvent) => {
    const player = players.find(p => p.name === deadEvent.player.name);
    player.ticksUntilNextRing = random(
      MIN_TICKS_UNTIL_NEXT_RING,
      MAX_TICKS_UNTIL_NEXT_RING
    );
    const i = ringEvents.indexOf(deadEvent);
    ringEvents.splice(i, 1);
  });
}

function draw() {
  update();
  background(0);
  ringEvents.forEach((r) => r.draw());
  particleEvents.forEach((pe) => pe.draw());
}

const states = {
  FORMING: 1,
  SUSTAINING: 2,
  FADING: 3,
  DONE: 4,
};

function RingEvent(options) {
  this.state = states.FORMING;
  this.rgb = options.rgb;
  this.formTime = options.formTime;
  this.formTimeLeft = this.formTime;
  this.sustainTime = options.sustainTime;
  this.sustainTimeLeft = this.sustainTime;
  this.fadeTimeLeft = RING_FADE_TIME;
  this.x = options.x;
  this.y = options.y;
  this.size = options.size;
  this.currentSize = RING_FORM_START_SIZE;
  this.currentStroke = this.RING_STROKE_WEIGHT;
  this.player = options.player;
  this.fadeTimePercent = 1;
  this.alpha = 255;

  this.updateState = function () {
    if (this.state === states.FORMING) {
      this.formTimeLeft--;
      if (this.formTimeLeft === 0) {
        this.state = states.SUSTAINING;
      }
      return;
    }

    if (this.state === states.SUSTAINING) {
      this.sustainTimeLeft--;
      if (this.sustainTimeLeft === 0) {
        this.state = states.FADING;
        this.currentStroke = RING_STROKE_WEIGHT;
      }
      return;
    }

    if (this.state === states.FADING) {
      this.fadeTimeLeft--;
      if (this.fadeTimeLeft === 0) {
        this.state = states.DONE;
      }
      return;
    }
  };

  this.update = function () {
    this.updateState();

    if (this.state === states.FORMING) {
      const percent = this.formTimeLeft / this.formTime;
      this.currentSize = RING_FORM_START_SIZE * percent + this.size;
      this.currentStroke = RING_STROKE_WEIGHT;
    }

    if (this.state === states.SUSTAINING) {
      const percent = this.sustainTimeLeft / this.sustainTime;
      this.currentStroke =
        RING_MAX_STROKE_WEIGHT -
        RING_MAX_STROKE_WEIGHT * percent +
        RING_STROKE_WEIGHT;
    }

    if (this.state === states.FADING) {
      const percent = this.fadeTimeLeft / RING_FADE_TIME;
      this.currentSize = RING_FORM_START_SIZE - RING_FORM_START_SIZE * percent;
      this.currentStroke = RING_MAX_STROKE_WEIGHT * percent;
      this.alpha = 255 * percent;
    }
  };

  this.draw = function () {
    noFill();
    stroke(this.rgb.concat(this.alpha));
    strokeWeight(this.currentStroke);
    ellipse(this.x, this.y, this.currentSize);
  };
}

function ParticleEvent(options) {
  this.state = states.FORMING;
  this.rgb = options.rgb;
  this.formTime = options.formTime;
  this.sustainTime = options.sustainTime;
  this.fadeTime = options.fadeTime;
  this.formTimeLeft = this.formTime;
  this.sustainTimeLeft = this.sustainTime;
  this.fadeTimeLeft = this.fadeTime;
  this.width = options.width;
  this.numParticles = options.numParticles;
  this.x = options.x;
  this.y = options.y;
  this.player = options.player;
  this.hasParticlesInView = true;

  this.particles = [];

  this.createParticles = function () {
    let newParticles = [];
    for (let i = 0; i < this.numParticles; i++) {
      const particleX = random(
        Math.max(0, this.x - this.width / 2),
        Math.min(this.x + this.width / 2, width)
      );
      const particleY = this.y;
      const intensity = Math.random();
      newParticles.push(
        new Particle({
          rgb: this.rgb,
          x: particleX,
          y: particleY,
          state: states.FORMING,
          intensity,
          width: random(MIN_PARTICLE_WIDTH, MAX_PARTICLE_WIDTH),
          height: PARTICLE_HEIGHT,
        })
      );
    }

    return newParticles;
  };

  this.updateState = function () {
    if (this.state === states.FORMING) {
      this.formTimeLeft--;
      if (this.formTimeLeft === 0) {
        this.state = states.SUSTAINING;
      }
      return;
    }

    if (this.state === states.SUSTAINING) {
      this.sustainTimeLeft--;
      if (this.sustainTimeLeft === 0) {
        this.state = states.FADING;
        this.particles.forEach((p) => p.scatter());
      }
      return;
    }

    if (this.state === states.FADING) {
      this.fadeTimeLeft--;
      if (this.fadeTimeLeft === 0) {
        this.state = states.DONE;
      }
      return;
    }

    const aliveParticle = this.particles.find((p) => p.y < height);
    if (!aliveParticle) {
      this.hasParticlesInView = false;
    }
  };

  this.update = function () {
    this.updateState();

    if (this.hasParticlesInView) {
      this.particles.forEach((p) => {
        p.state = this.state;
        if (p.state === states.FORMING) {
          p.formTimePercent = this.formTimeLeft / this.formTime;
        }
        p.update();
      });
    }
  };

  this.draw = function () {
    if (this.hasParticlesInView) {
      this.particles.forEach((p) => p.draw());


      // if (this.state === states.FORMING || this.state === states.SUSTAINING){
        strokeWeight(1);
        stroke(this.rgb.concat(150));
        for (let i = 0; i < this.particles.length -2; i++ ){

          line(this.particles[i].x, this.particles[i].y, this.particles[i+1].x, this.particles[i+1].y)
        }
      // }

    }
  };

  this.init = function () {
    this.particles = this.createParticles();

    return this;
  };
}

function Particle(options) {
  this.rgb = options.rgb;
  this.x = options.x;
  this.y = options.y;
  this.width = options.width;
  this.height = options.height;
  this.state = options.state;
  this.formTimePercent = 1.0;
  this.intensity = options.intensity;
  this.rot = 0;
  this.vector = { x: 0, y: 0 };

  this.scatter = function () {
    this.vector.x = random(-2, 2);
    this.vector.y = random(0, -10);
  };

  this.update = function () {
    if (this.state === states.DONE) {
      return;
    }

    if (this.state === states.FORMING || this.state === states.SUSTAINING) {
      this.x += random(
        -this.intensity * POSITION_INTENSITY_MAGNITUDE,
        this.intensity * POSITION_INTENSITY_MAGNITUDE
      );
      this.y += random(
        -this.intensity * POSITION_INTENSITY_MAGNITUDE,
        this.intensity * POSITION_INTENSITY_MAGNITUDE
      );
      this.rot += random(
        -this.intensity * ROTATION_INTENSITY_MAGNITUDE,
        this.intensity * ROTATION_INTENSITY_MAGNITUDE
      );
    }

    if (this.state === states.FADING) {
      this.vector.y += GRAVITY;
    }

    this.x += this.vector.x;
    this.y += this.vector.y;
  };

  this.draw = function () {
    noFill();
    strokeWeight(PARTICLE_STROKE_WEIGHT);
    if (this.state === states.FORMING) {
      stroke(this.rgb.concat(255 - this.formTimePercent * 255));
    } else {
      stroke(this.rgb);
    }

    rectMode(CENTER);
    translate(this.x, this.y);
    rotate(this.rot);
    rect(0, 0, this.width, this.height);
    rotate(-this.rot);
    translate(-this.x, -this.y);
  };
}
