// declare some things
let cx; // canvas position
let speed = -2;
let score_len = 0;
let sroll = 1;
let opacity = 3;
let lineCount = 0;
let rainTeam = [];
const WMOD = 1;

function setup() {
    frameRate(60);
    w = windowWidth * WMOD;
    h = windowHeight * WMOD;
    createCanvas(w, h);
    cx = w;
    pixelDensity(1);

    rainTeam[0] = new RainStreak(0);
    rainTeam[1] = new RainStreak(1);
}

function draw() {
    background(0, opacity);
    if (opacity > 3) {
        opacity *= 0.99;
    }
    // Slow down thicker lines (segLen)
    // console.log(" Math.ceil(rainTeam[0].segLen * 0.25): "+Math.ceil(rainTeam[0].segLen * 0.25));
    if (frameCount % Math.ceil(rainTeam[0].segLen * 0.25) == 0) {
        rainTeam[0].display();
        // console.log("rainTeam[0].vPos: "+rainTeam[0].vPos+" rainTeam[0].rolling: "+rainTeam[0].rolling);
    }
    if (frameCount % Math.ceil(rainTeam[1].segLen * 0.25) == 0) {
        rainTeam[1].display();
    }
}

class RainStreak {
    constructor(team) {
        let s = rollDice(12);
        this.team = team;
        this.m = 0;
        this.rolling = true;
        this.vPos = 0;
        this.hPos = random(w);
        this.vals = [];
        this.noise = 0;
        this.sNoise = 0;
        this.depth = 0;
        this.sroll = s;
        this.segLen = s;
        this.sNoise = h;
    }
    newRainStreak() {
        let nextNoise = h;

        // chance of noise increases with lineCount
        // First five will not have noise
        if (rollDice(lineCount) > 5) {
            // randomize noise starting height
            nextNoise = random(h * 0.125, h);
        }
        return [rollDice(12), nextNoise, random(w)];
    }
    display() {
        this.rolling = true;
        while (this.rolling) {
            if (this.vPos == 0) {
                this.vals = this.newRainStreak();
            }
            this.noise = 0;
            if (this.vPos > this.sNoise) {
                this.depth = this.vPos - this.sNoise;
                this.noise = round(random(this.depth * -0.025, this.depth * 0.025));
                // console.log("noise: "+this.noise+" depth: "+this.depth);
            }
            // draw pre stroke
            strokeWeight(this.vals[0]);
            stroke(chooseTeam(this.team));
            line(this.vals[2], 0, this.vals[2], this.vals[0]);

            // draw current stroke
            strokeWeight(this.sroll);
            stroke(chooseTeam(this.team));
            line(this.hPos, this.vPos, this.hPos + this.noise, this.vPos + this.segLen);

            // lower the line and add noise
            this.vPos += this.segLen;
            this.hPos += this.noise;
            // console.log("this.vPos: "+this.vPos+ " this.segLen: "+this.segLen+" h: "+h);
            // if the line is done
            if (this.vPos >= h) {
                console.log("lineCount: "+lineCount+" this.sroll: "+this.sroll);
                this.sroll = this.vals[0];
                this.segLen = this.vals[0];
                this.sNoise = this.vals[1];
                this.hPos = this.vals[2];
                this.vPos = 0;
                this.depth = 0;
                ++lineCount;
            }
            this.rolling = false;
        }
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
