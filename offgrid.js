const AMP_EASING = 0.03;
const WAVELENGTH_EASING = 0.03;
const SCROLL_RATE_EASING = 0.05;
const LINE_WIDTH_EASING = 0.02;
const MIN_RANDOM_EVENT_TICKS = 500;
const MAX_RANDOM_EVENT_TICKS = 1500;
const MIN_WAVELENGTH = 0.005;
const MAX_WAVELENGTH = 0.5; // half a screen width
const MIN_AMP = 0.1;
const MAX_AMP = 1;
const MIN_SCROLL_MULT = 2;
const MAX_SCROLL_MULT = 5;
const MIN_LINE_WIDTH = 0.5;
const MAX_LINE_WIDTH = 7;

let players;

const waveforms = {
  TRI: "tri",
  SAW: "saw",
  SQUARE: "square",
  RANDOM: "random",
};

function getRandomWaveform(exclude) {
  const r = Math.random();
  const next =
    r > 0.75
      ? waveforms.TRI
      : r > 0.5
      ? waveforms.SAW
      : r > 0.25
      ? waveforms.SQUARE
      : waveforms.RANDOM;

  if (next === exclude) {
    return getRandomWaveform(exclude);
  }

  return next;
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  const quarterHeight = height / 4;
  const player1Origin = { x: 0, y: quarterHeight };
  const player2Origin = { x: 0, y: quarterHeight * 3 };

  players = [
    new Player({ name: "red", rgb: [217, 2, 125], origin: player1Origin }),
    new Player({ name: "green", rgb: [0, 175, 102], origin: player2Origin }),
  ];
}

function update() {
  players.forEach((p) => p.update());
}

function draw() {
  update();
  background(0);

  players.forEach((p) => p.draw());
}

function drawTriSingleCycle(
  origin,
  startX,
  quarterWidth2,
  quarterWidth4,
  ampHeight
) {
  line(
    startX,
    origin.y + ampHeight,
    startX + quarterWidth2,
    origin.y - ampHeight
  );
  line(
    startX + quarterWidth2,
    origin.y - ampHeight,
    startX + quarterWidth4,
    origin.y + ampHeight
  );
}

function drawTri(origin, wavelength, cycles, ampHeight) {
  const quarterWidth = (width / 4) * wavelength;
  const quarterWidth2 = quarterWidth * 2;
  const quarterWidth4 = quarterWidth * 4;

  for (let i = 0; i < cycles * 2; i++) {
    drawTriSingleCycle(
      origin,
      i * wavelength * width,
      quarterWidth2,
      quarterWidth4,
      ampHeight
    );
  }
}

function drawSaw(origin, wavelength, cycles, ampHeight) {
  for (let i = 0; i < cycles * 2; i++) {
    drawSawSingleCycle(
      origin,
      i * wavelength * width,
      wavelength * width,
      ampHeight
    );
  }
}

function drawSawSingleCycle(origin, startX, cycleWidth, ampHeight) {
  line(startX, origin.y + ampHeight, startX + cycleWidth, origin.y - ampHeight);
  line(
    startX + cycleWidth,
    origin.y - ampHeight,
    startX + cycleWidth,
    origin.y + ampHeight
  );
}

function drawSquare(origin, wavelength, cycles, ampHeight) {
  for (let i = 0; i < cycles * 2; i++) {
    drawSquareSingleCycle(
      origin,
      i * wavelength * width,
      wavelength * width,
      ampHeight
    );
  }
}

function drawSquareSingleCycle(origin, startX, cycleWidth, ampHeight) {
  const halfCycleWidth = cycleWidth / 2;
  line(
    startX,
    origin.y + ampHeight,
    startX + halfCycleWidth,
    origin.y + ampHeight
  );
  line(
    startX + halfCycleWidth,
    origin.y + ampHeight,
    startX + halfCycleWidth,
    origin.y - ampHeight
  );
  line(
    startX + halfCycleWidth,
    origin.y - ampHeight,
    startX + cycleWidth,
    origin.y - ampHeight
  );
  line(
    startX + cycleWidth,
    origin.y - ampHeight,
    startX + cycleWidth,
    origin.y + ampHeight
  );
}

const randomSlots = [...Array(40)].map((x) => Math.random() - 0.5);

function drawRandom(origin, wavelength, cycles, ampHeight) {
  const cycleWidth = wavelength * width;
  const slotWidth = cycleWidth / randomSlots.length;
  let thisY = 0,
    prevY = origin.y;

  for (let i = 0; i < cycles * 2; i++) {
    const startX = i * cycleWidth;

    for (let slot = 0; slot < randomSlots.length; slot++) {
      thisY = origin.y + randomSlots[slot] * ampHeight;
      line(startX + slot * slotWidth, prevY, startX + slot * slotWidth, thisY);
      line(
        startX + slot * slotWidth,
        thisY,
        startX + slot * slotWidth + slotWidth,
        thisY
      );
      prevY = thisY;
    }
  }
}

function Player(options) {
  this.origin = options.origin;
  this.width = 2;
  this.targetWidth = this.width;
  this.rgb = options.rgb;
  this.waveform = waveforms.TRI;
  this.amp = random(MIN_AMP / 2, MAX_AMP / 2);
  this.wavelength = random(MAX_WAVELENGTH - 0.125, MAX_WAVELENGTH);
  this.transX = 0;
  this.ampHeight = 0;
  this.cycles = 0;
  this.ticks = 0;
  this.randomEventTick = random(MIN_RANDOM_EVENT_TICKS, MAX_RANDOM_EVENT_TICKS);
  this.targetAmp = this.amp;
  this.targetWavelength = this.wavelength;
  this.changingWaveform = false;
  this.changingWaveformTicks = 255;
  this.nextWaveform = this.waveform;
  this.scrollRate = map(
    this.wavelength,
    MIN_WAVELENGTH,
    MAX_WAVELENGTH,
    MAX_SCROLL_MULT,
    MIN_SCROLL_MULT
  );
  this.targetScrollRate = this.scrollRate;

  this.changeAmplitude = function () {
    console.log("changing amplitude");
    this.targetAmp = random(MIN_AMP, MAX_AMP);
  };

  this.changeWavelength = function () {
    console.log("changing wavelength");
    this.targetWavelength = random(MIN_WAVELENGTH, MAX_WAVELENGTH);
    this.targetScrollRate = map(
      this.wavelength,
      MIN_WAVELENGTH,
      MAX_WAVELENGTH,
      MIN_SCROLL_MULT,
      MAX_SCROLL_MULT
    );
  };

  this.changeWaveform = function () {
    console.log("changing waveform");
    this.nextWaveform = getRandomWaveform(this.waveform);
    this.changingWaveform = true;
    this.changingWaveformTicks = 255;
  };

  this.doRandomEvent = function () {
    const r = Math.random();
    if (r > 0.5) {
      this.changeAmplitude();
    } else if (r > 0.2) {
      this.changeWavelength();
    } else {
      this.changeWaveform();
    }

    // always change line width...
    this.targetWidth = random(MIN_LINE_WIDTH, MAX_LINE_WIDTH);
  };

  this.update = function () {
    this.ticks++;

    if (this.ticks >= this.randomEventTick) {
      this.doRandomEvent();
      this.ticks = 0;
      this.randomEventTick = random(
        MIN_RANDOM_EVENT_TICKS,
        MAX_RANDOM_EVENT_TICKS
      );
    }

    if (this.changingWaveform) {
      this.changingWaveformTicks--;
      if (this.changingWaveformTicks <= 0) {
        this.changingWaveform = false;
        this.waveform = this.nextWaveform;
        this.changingWaveformTicks = 255;
      }
    }

    const dAmp = this.targetAmp - this.amp;
    this.amp += dAmp * AMP_EASING;
    this.ampHeight = (height / 4) * this.amp;

    const dWavelength = this.targetWavelength - this.wavelength;
    this.wavelength += dWavelength * WAVELENGTH_EASING;
    this.cycles = Math.ceil(1 / this.wavelength);

    const dScrollRate = this.targetScrollRate - this.scrollRate;
    this.scrollRate += dScrollRate * SCROLL_RATE_EASING;

    if (!this.changingWaveform) {
      this.transX += this.scrollRate;
      if (this.transX >= this.wavelength * width) {
        this.transX = 0;
      }
    }

    const dWidth = this.targetWidth - this.width;
    this.width += dWidth * LINE_WIDTH_EASING;
  };

  this.draw = function () {
    // center line
    stroke(200, 200, 200, 70);
    strokeWeight(1);
    line(this.origin.x, this.origin.y, width, this.origin.y);

    stroke(this.rgb.concat(this.changingWaveformTicks));
    strokeWeight(this.width);
    translate(-this.transX, 0);

    if (this.waveform === waveforms.TRI) {
      drawTri(this.origin, this.wavelength, this.cycles, this.ampHeight);
    } else if (this.waveform === waveforms.SQUARE) {
      drawSquare(this.origin, this.wavelength, this.cycles, this.ampHeight);
    } else if (this.waveform === waveforms.SAW) {
      drawSaw(this.origin, this.wavelength, this.cycles, this.ampHeight);
    } else {
      drawRandom(this.origin, this.wavelength, this.cycles, this.ampHeight);
    }

    translate(this.transX, 0);
  };
}
