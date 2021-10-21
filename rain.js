// declare some things
let cx; // canvas position
let speed = -2;
let score_len = 0;
let sroll = 1;
let opacity = 3;
let lineCount = 0;
let rainTeam = [];
let half_time = 0;
let wait =  0;
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
    fill(0);
    background(0, opacity);
    noFill();
    // Slow down thicker lines (segLen)
    if (frameCount % Math.ceil(rainTeam[0].segLen * 0.25) == 0) {
        rainTeam[0].display();
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
        this.rest = false;
        this.restLen = 0;
    }
    newRainStreak() {
        let nextNoise = h;
        half_time = times[scene_id]/2;
        wait =  half_time - 5;
        // chance of noise increases with lineCount
        // First five will not have noise
        // if (rollDice(lineCount) > 5) {
            // randomize noise starting height
            // nextNoise = random(h * 0.125, h);
        // }
        // Or... Chance of noise arcs with duration
        // More frequent in middle of piece than BOP or EOP
        let chance = abs(half_time-timer);
        let lchance = abs(half_time-chance);
        let nroll = rollDice(chance);
        if ( chance <= wait && nroll < lchance ) {
            nextNoise = random(h * 0.125, h);
        }
        // Roll for chance of a rest
        // Less frequent in middle of piece than BOP or EOP
        let rroll = rollDice(lchance+5);
        let rroll2 = rollDice(lchance+5);
        // rolling twice to double the chances of rests
        if ( rroll <= 5 || rroll2 <= 5 ) {
          this.rest = true;
          this.restLen = random(200,h);
        }
        else {
          this.rest = false;
        }
        // console.log("NOISE: chance "+chance+" wait "+wait+" lchance "+lchance+" nroll "+nroll);
        // console.log("REST: lchance "+lchance+" rroll(lchance+5) "+rroll+" this.rest "+this.rest);
        return [rollDice(12), nextNoise, random(w)];
    }
    display() {
        this.rolling = true;
        if (this.rest && this.restLen > 0) {
          if (frameCount % 4 == 0) {
            strokeWeight(this.vals[0] * 0.5);
            stroke(chooseTeam(this.team));
            ellipse(this.hPos, this.vPos, this.restLen, this.restLen);
            this.restLen -= (this.vals[0]+5);
          }
        }
        else {
          this.rest = false;
          this.restLen = 0;
        }
        while (this.rolling && this.rest == false) {
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
                // console.log("lineCount: "+lineCount+" this.sroll: "+this.sroll);
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

function windowResized() {
    w = windowWidth * WMOD;
    h = windowHeight * WMOD;
    resizeCanvas(w, h);
}
