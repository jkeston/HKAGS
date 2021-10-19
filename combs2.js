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

const VIEW_ALL = false;

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

  const p0LastX =
    players[0].scoreEvents[players[0].scoreEvents.length - 1].endX;
  const p1LastX =
    players[1].scoreEvents[players[1].scoreEvents.length - 1].endX;

  if (VIEW_ALL) {
    xScale = (width / p0LastX) * 0.95;
    yScale = xScale;
  }

  const p0Width = p0LastX * xScale;
  const p1Width = p1LastX * xScale;

  // speed = score_len/(times[scene_id] * 30);
  scrollSpeed = VIEW_ALL ? 0 : -Math.max(p0Width, p1Width) / (420 * 30) / 2;
  transX = VIEW_ALL ? 0 : width * 0.75;

  background(0);
}

function update() {
  transX += scrollSpeed;
}

function draw() {
  update();

  background(0);
  translate(transX, 50);
  players.forEach((player) => player.draw(xScale, yScale));
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

function getWeightFromSpread(spread) {
  return map(spread, 0, 1, 1, 15);
}

function Player(options) {
  const { rgb } = options;
  this.rgb = rgb;
  this.scoreEvents = makeScoreEvents();

  this.draw = function (xScale, yScale) {
    noFill();
    stroke(this.rgb);


    const yScaleFactor = yScale * 0.5;

    for (let p = 0; p < POINTS_PER_PLAYER; p++) {
      const spreadScaleFactor = SPREAD_SCALE * p
      for (let i = 1; i < this.scoreEvents.length; i++) {
        const previousEvent = this.scoreEvents[i - 1];
        const scoreEvent = this.scoreEvents[i];
        const prevSpread =
          spreadScaleFactor * previousEvent.endSpread * yScaleFactor;
        const startSpread =
          spreadScaleFactor * scoreEvent.startSpread * yScaleFactor;
        const endSpread =
          spreadScaleFactor * scoreEvent.endSpread * yScaleFactor;

        strokeWeight(getWeightFromSpread(previousEvent.endSpread));
        line(
          previousEvent.endX * xScale,
          previousEvent.endY * yScale + prevSpread,
          scoreEvent.startX * xScale,
          scoreEvent.startY * yScale + startSpread
        );

        if (!scoreEvent.isRest) {
          gradientLine(
            scoreEvent.startX * xScale,
            scoreEvent.startY * yScale + startSpread,
            scoreEvent.endX * xScale,
            scoreEvent.endY * yScale + endSpread,
            getWeightFromSpread(previousEvent.endSpread),
            getWeightFromSpread(scoreEvent.endSpread),
            30
          );
        }
      }
    }
  };
}

function gradientLine(
  start_x,
  start_y,
  end_x,
  end_y,
  start_weight,
  end_weight,
  segments
) {
  let prev_loc_x = start_x;
  let prev_loc_y = start_y;
  for (let i = 1; i <= segments; i++) {
    let cur_loc_x = lerp(start_x, end_x, i / segments);
    let cur_loc_y = lerp(start_y, end_y, i / segments);
    push();
    strokeWeight(lerp(start_weight, end_weight, i / segments));
    line(prev_loc_x, prev_loc_y, cur_loc_x, cur_loc_y);
    pop();
    prev_loc_x = cur_loc_x;
    prev_loc_y = cur_loc_y;
  }
}
