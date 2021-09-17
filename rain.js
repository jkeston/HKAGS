// declare some things
let cx; // canvas position
let speed = -2;
let score_len = 0;
let segLen = 2;
let genCount = 0;
let hPos = 0;
let vPos = 0;
let proll;
let sroll = 1;
let opacity = 3;
let wait = 0;
let sNoise = 0;
let lineCount = 0;
let vals = [];
let redone = [255,255,255];
let n_redone = [255,255,255];
let depth = 0;
const WMOD = 1;

function setup() {
    frameRate(60);
    w = windowWidth * WMOD;
    h = windowHeight * WMOD;
    hPos = random(w);
    // hPos = w/2;
    createCanvas(w, h);
    sNoise = h;
    cx = w;
    pixelDensity(1);
    setSegmentLength();
    ++lineCount;
}

function draw() {
    if (wait == 0) {
        background(0, opacity);
        if (opacity > 3) {
            opacity *= 0.99;
        }
        // Slow down thicker lines (segLen)
        if (frameCount % Math.ceil(segLen * 0.25) == 0) {
            drawGenerator(1, 0);
        }
    } else {
        --wait;
        if (wait == 0) {
            strokeWeight(sroll);
        }
    }
}

function setSegmentLength() {
    let nextNoise = h;
    // chance of noise increases with lineCount
    // First five will not have noise
    if (rollDice(lineCount) > 5) {
        // randomize noise starting height
        nextNoise = random(h * 0.125, h);
    }
    n_redone = [255,255,255];
    if (rollDice(16) == 1) {
        n_redone =  [255,0,0];
    }
    return [rollDice(12), nextNoise, random(w), n_redone];
}

function drawGenerator(spd, y_offset) {
    ++genCount;
    let m = 0;
    let rolling = true;
    let roll;

    // draw horizontal line downward
    while (rolling) {
        if (vPos == 0) {
            vals = setSegmentLength();
        }
        let noise = 0;
        if (vPos > sNoise) {
        // if (true) {
            depth = vPos - sNoise;
            // depth++;
            noise = round(random(depth * -0.025, depth * 0.025));
            console.log("noise: "+noise+" depth: "+depth);
        }
        // draw pre stroke
        strokeWeight(vals[0]);
        stroke(n_redone);
        line(vals[2], 0, vals[2], vals[0]);

        // draw current stroke
        strokeWeight(sroll);
        stroke(redone);
        line(hPos, vPos, hPos + noise, vPos + segLen);

        // lower the line and add noise
        vPos += segLen;
        hPos += noise;

        // if the line is done
        if (vPos >= h) {
            // setSegmentLength();
            sroll = vals[0];
            segLen = vals[0];
            sNoise = vals[1];
            hPos = vals[2];
            redone = vals[3];
            ++lineCount;
            vPos = 0;
            depth = 0;
        }
        rolling = false;
        proll = roll;
    }
}

function rollDice(sides) {
    let result = Math.floor(Math.random() * sides) + 1;
    return result;
}

function windowResized() {
    w = windowWidth * WMOD;
    h = windowHeight * WMOD;
    resizeCanvas(w, h);
}
