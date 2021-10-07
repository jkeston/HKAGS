const PLAYER_1_RGB = [217, 2, 125];
const PLAYER_2_RGB = [2, 217, 125];

const MAX_LENGTH = 40; // very magic number, do not change
const POINTS_PER_PLAYER = 5;

// how long it takes for the combs to transition
// to new height/spread
const MIN_EVENT_TRANSITION_TIME = 0.1;
const MAX_EVENT_TRANSITION_TIME = 0.6;

// how often events occur
const MIN_TIME_BETWEEN_EVENTS = 1;
const MAX_TIME_BETWEEN_EVENTS = 3.5;

// how spread out the lines can be
// larger number means a larger spread
const SPREAD_SCALE = 0.2;

// how unlikely rests are
// lower number === more rests
const REST_PROBABILITY = 0.8;

// how long the rests are
const MIN_REST_TIME = 0.75;
const MAX_REST_TIME = 3;

let players, xScale, yScale, transX, scrollSpeed;

function setup() {
  createCanvas(windowWidth, windowHeight);

  players = [
    new Player({
      rgb: PLAYER_1_RGB,
    }),
    new Player({
      rgb: PLAYER_2_RGB,
    }),
  ];

  yScale = height * 0.7;
  xScale = yScale;

  const p0Width = players[0].scoreEvents[players[0].scoreEvents.length - 1].endX * xScale;
  const p1Width = players[1].scoreEvents[players[1].scoreEvents.length - 1].endX * xScale;

  // speed = score_len/(times[scene_id] * 30);
  scrollSpeed = -(Math.max(p0Width, p1Width)) / (420 * 30) / 2;
  transX = width * 0.75;

  background(0);
}

function update() {
  transX += scrollSpeed;
}

function draw() {
  update();

  background(0);
  translate(transX, 50);
  players.forEach(player => player.draw(xScale, yScale))
}

function makeScoreEvents(events) {
  if (!events) {
    // make first event
    return makeScoreEvents([
      { endX: 0, endY: Math.random(), endSpread: random(0, 0.25) },
    ]);
  }

  const lastEvent = events[events.length - 1];

  // exit condition
  if (lastEvent.endX > MAX_LENGTH) {
    return events;
  }

  const startX =
    lastEvent.endX + random(MIN_TIME_BETWEEN_EVENTS, MAX_TIME_BETWEEN_EVENTS);

  const isRest = Math.random() > REST_PROBABILITY;
  const startY = lastEvent.endY;
  const startSpread = lastEvent.endSpread;
  const endX = isRest
    ? startX + random(MIN_REST_TIME, MAX_REST_TIME)
    : startX + random(MIN_EVENT_TRANSITION_TIME, MAX_EVENT_TRANSITION_TIME);
  const endY = random(0, 1);
  const endSpread = random(0, 1);

  const newEvents = events.concat({
    startX,
    startY,
    startSpread,
    endX,
    endY,
    endSpread,
    isRest,
  });
  return makeScoreEvents(newEvents);
}

function Player(options) {
  const { rgb } = options;
  this.rgb = rgb;
  this.scoreEvents = makeScoreEvents();

  this.draw = function (xScale, yScale) {
    noFill();
    stroke(this.rgb);

    for (let i = 1; i < this.scoreEvents.length; i++) {
      const previousEvent = this.scoreEvents[i - 1];
      const scoreEvent = this.scoreEvents[i];

      for (let p = 0; p < POINTS_PER_PLAYER; p++) {
        const prevSpread =
          SPREAD_SCALE * p * previousEvent.endSpread * yScale * 0.5;
        const startSpread =
          SPREAD_SCALE * p * scoreEvent.startSpread * yScale * 0.5;
        const endSpread =
          SPREAD_SCALE * p * scoreEvent.endSpread * yScale * 0.5;

        strokeWeight(map(previousEvent.endSpread, 0, 1, 2, 10));
        line(
          previousEvent.endX * xScale,
          previousEvent.endY * yScale + prevSpread,
          scoreEvent.startX * xScale,
          scoreEvent.startY * yScale + startSpread
        );

        if (!scoreEvent.isRest) {
          strokeWeight(map(scoreEvent.endSpread, 0, 1, 2, 10));
          line(
            scoreEvent.startX * xScale,
            scoreEvent.startY * yScale + startSpread,
            scoreEvent.endX * xScale,
            scoreEvent.endY * yScale + endSpread
          );
        }
      }
    }
  };
}
