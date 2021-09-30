const pi = Math.PI;
const halfPi = Math.PI / 2;
const twoPi = Math.PI * 2;
const WAVELENGTH_MIN = 0.0001;
const WAVELENGTH_MAX = 0.9;
const AMP_MAX = 1;
const AMP_MIN = -1;
const INC_MIN = 0.0002;
const INC_MAX = 0.002;

const waveforms = {
  TRI: "tri",
  SAW: "saw",
  SQUARE: "square",
  RANDOM: "random",
};

const players = [
  {
    index: 0,
    waveform: waveforms.TRI,
    wavelength: 1,
    amp: 0,
    scroll: 0,
    perlinX: Math.ceil(Math.random() * 100000),
    perlinInc: 0.0008,
    rgb: [217, 2, 125],
    ampShift: Math.ceil(Math.random() * 100000),
    incShift: Math.ceil(Math.random() * 100000),
    wavelengthShift: Math.ceil(Math.random() * 100000),
    waveformShift: Math.ceil(Math.random() * 100000),
  },
  {
    index: 1,
    waveform: waveforms.TRI,
    wavelength: 1,
    amp: 0,
    scroll: 0,
    perlinX: Math.ceil(Math.random() * 100000),
    perlinInc: 0.0006,
    rgb: [0, 175, 102],
    ampShift: Math.ceil(Math.random() * 120000),
    incShift: Math.ceil(Math.random() * 130000),
    wavelengthShift: Math.ceil(Math.random() * 140000),
    waveformShift: Math.ceil(Math.random() * 100000),
  },
];

let origin;

function setup() {
  createCanvas(windowWidth - 5, windowHeight - 5);
  const halfHeight = (windowHeight * 0.9) / 2;
  origin = { x: 0, y: halfHeight };
}

function drawTriSingleCycle(
  startX,
  quarterWidth,
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

function drawTri(wavelength, cycles, ampHeight) {
  const quarterWidth = (width / 4) * wavelength;
  const quarterWidth2 = quarterWidth * 2;
  const quarterWidth4 = quarterWidth * 4;

  for (let i = 0; i < cycles * 2; i++) {
    drawTriSingleCycle(
      i * wavelength * width,
      quarterWidth,
      quarterWidth2,
      quarterWidth4,
      ampHeight
    );
  }
}

function drawSaw(wavelength, cycles, ampHeight) {
  for (let i = 0; i < cycles * 2; i++) {
    drawSawSingleCycle(
      i * wavelength * width,
      wavelength * width,
      ampHeight
    );
  }
}

function drawSawSingleCycle(startX, cycleWidth, ampHeight) {
  line(
    startX,
    origin.y + ampHeight,
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

function drawSquare(wavelength, cycles, ampHeight) {
  for (let i = 0; i < cycles * 2; i++) {
    drawSquareSingleCycle(
      i * wavelength * width,
      wavelength * width,
      ampHeight
    );
  }
}

function drawSquareSingleCycle(startX, cycleWidth, ampHeight) {
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

const randomSlots = [...Array(20)].map((x) => Math.random() - 0.5);

function drawRandom(wavelength, cycles, ampHeight) {
  const cycleWidth = wavelength * width;
  const slotWidth = cycleWidth / randomSlots.length;
  let thisY = 0,
    prevY = origin.y;

  for (let i = 0; i < cycles * 2; i++) {
    const startX = i * cycleWidth;

    for (let slot = 0; slot < randomSlots.length; slot++) {
      thisY = origin.y + randomSlots[slot] * ampHeight;
      line(
        startX + slot * slotWidth,
        prevY,
        startX + slot * slotWidth,
        thisY
      );
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

function drawPlayer(player) {
  const { amp, wavelength, scroll, rgb } = player;

  const ampHeight = origin.y * amp;
  const cycles = Math.ceil(1 / wavelength);

  let newScroll = scroll + 0.2;
  if (newScroll >= wavelength * width) {
    newScroll = 0;
  }

  stroke(rgb[0], rgb[1], rgb[2]);
  strokeWeight(3);

  translate(-newScroll, 0);

  if (player.waveform === waveforms.TRI) {
    drawTri(wavelength, cycles, ampHeight);
  }

  if (player.waveform === waveforms.SAW) {
    drawSaw(wavelength, cycles, ampHeight);
  }

  if (player.waveform === waveforms.SQUARE) {
    drawSquare(wavelength, cycles, ampHeight);
  }

  if (player.waveform === waveforms.RANDOM) {
    drawRandom(wavelength, cycles, ampHeight);
  }

  // strokeWeight(1);
  // fill(rgb[0], rgb[1], rgb[2]);
  // textSize(20);
  // translate(newScroll, 0);
  // text(
  //   "wavelength " + player.wavelength,
  //   10,
  //   height - 30 * player.index - 30
  // );
  updatePlayer(player, newScroll);
}

function updatePlayer(player, newScroll) {
  player.scroll = newScroll;
  player.perlinX += player.perlinInc;

  player.wavelength = map(
    noise(player.perlinX + player.wavelengthShift),
    0,
    1,
    WAVELENGTH_MIN,
    WAVELENGTH_MAX
  );
  player.amp = map(
    noise(player.perlinX + player.ampShift),
    0,
    1,
    AMP_MIN,
    AMP_MAX
  );
  player.perlinInc = map(
    noise(player.perlinX + player.incShift),
    0,
    1,
    INC_MIN,
    INC_MAX
  );



  const waveformNoise = noise((player.perlinX + player.waveformShift)*0.5);

  player.waveform =
    waveformNoise > 0.75
      ? waveforms.TRI
      : waveformNoise > 0.5
      ? waveforms.SAW
      : waveformNoise > 0.25
      ? waveforms.SQUARE
      : waveforms.RANDOM;
}

function draw() {
  background(0);

  drawingContext.setLineDash([20, 10]);
  stroke(0, 255, 200);
  strokeWeight(1);
  line(origin.x, origin.y, width, origin.y);

  drawingContext.setLineDash([]);
  players.forEach((p) => drawPlayer(p));
}
