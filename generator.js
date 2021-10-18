// declare some things
let cx; // canvas position
let sroll = 2;
let opacity = 3;
let wait = 0;
let team = 0;
let generator = [];
let avg_sroll = 0;
const WMOD = 1;

function setup() {
    team = rollDice(2) - 1;
    frameRate(60);
    w = windowWidth * WMOD;
    h = windowHeight * WMOD;
    // hPos = w/2;
    vPos = h / 2;
    createCanvas(w, h);
    cx = w;
    pixelDensity(1);
    generator[0] = new Generator(random(h), 0, 0, random(h));
    generator[1] = new Generator(random(h), 1, 0, random(h));
    generator[0].setSegmentLength();
    generator[1].setSegmentLength();
    fade_in_duration = 2;
}

function makeSegments() {
    if (wait == 0) {
        background(0, opacity);
        if (opacity > 3) {
            opacity *= 0.99;
        }
        stroke(255);
        // shift the canvas
        if (frameCount % generator[0].sroll == 0) {
            // if (true) {
            generator[0].drawGenerator();
        }
        if (frameCount % generator[1].sroll == 0) {
            generator[1].drawGenerator();
        }
        avg_sroll = round((generator[0].sroll + generator[1].sroll) * 0.5);
        if (timer > 30 && timer < times[scene_id] - 30) {
            if (frameCount % avg_sroll && rollDice(500) == 350) {
                // if (false) {
                opacity = 16;
                background(255, 128);
                strokeWeight(3);
                stroke(0);
                line(w * .25, h / 2, w * .75, h / 2);
                fill(0);
                rect(w / 2 - 25, h / 2 - 25, 60, 25);
                wait = floor(random(50, 500));
            }
        }
    } else {
        --wait;
    }
}

function draw() {
    // generator[0].setSegmentLength();
    // generator[1].setSegmentLength();
    makeSegments();
}

class Generator {
    constructor(y_offset, team, hPos, vPos) {
        this.y_offset = y_offset;
        this.team = team;
        this.hPos = hPos;
        this.vPos = vPos;
        this.segLen = 0;
        this.sroll = 0;
        this.proll = 0;
    }
    drawGenerator() {
        let m = 0;
        let rolling = true;
        let roll;
        strokeWeight(this.sroll);
        while (rolling) {
            roll = rollDice(3);
            if (roll == 1) {
                // draw horizontal line forward
                stroke(chooseTeam(this.team));
                line(this.hPos, this.vPos, this.hPos + this.segLen, this.vPos);
                this.hPos += this.segLen;
                if (this.hPos >= w) {
                    this.hPos = 0;
                    this.vPos = floor(random(h));
                    this.setSegmentLength();
                }
                // console.log('horizontal '+hPos+' v '+vPos+' cx '+cx);
                rolling = false;
                this.proll = roll;
            }
            if (roll == 2 && this.proll != 3 && this.vPos - this.segLen > 0) {
                m = -this.segLen;
                // draw vertical line up
                stroke(chooseTeam(this.team));
                line(this.hPos, this.vPos, this.hPos, this.vPos + m);
                this.vPos += m;
                if (this.vPos < 0) {
                    this.vPos = 0;
                }
                rolling = false;
                this.proll = roll;
            }
            if (roll == 3 && this.proll != 2 && this.vPos + this.segLen < h) {
                // draw vertical line down
                m = this.segLen;
                // draw vertical line up
                stroke(chooseTeam(this.team));
                line(this.hPos, this.vPos, this.hPos, this.vPos + m);
                this.vPos += m;
                if (this.vPos > h) {
                    this.vPos = h;
                }
                rolling = false;
                this.proll = roll;
            }
        }
    }
    setSegmentLength() {
        this.sroll = rollDice(6);
        this.segLen = this.sroll * 10;
        // strokeWeight(this.sroll);
        // console.log('segment roll '+sroll);
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
