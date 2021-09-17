// declare some things
let cx; // canvas position
let speed = -2;
let score_len = 0;
let segLen = 20;
let genCount = 0;
let hPos = 0;
let vPos = 0;
let proll;
let sroll = 2;
let opacity = 3;
let wait = 0;
const WMOD = 1;

function setup() {
	frameRate(60);
	w = windowWidth * WMOD;
	h = windowHeight * WMOD;
	// hPos = w/2;
	vPos = h / 2;
	createCanvas(w, h);
	cx = w;
	// for (let i = 0; i < numGenerators; ++i) {
	// 	addGenerator(i);
	// }
	pixelDensity(1);
	setSegmentLength();
	// noCursor();
	// console.log(pixelDensity());
}

function draw() {
	if (wait == 0) {
		background(0, opacity);
		if (opacity > 3) {
			opacity *= 0.99;
		}
		stroke(255);
		// shift the canvas
		if (frameCount % sroll == 0) {
		// if (true) {
			drawGenerator(1, 0);
			// cx += speed;
			// translate(cx, 0);
			if (rollDice(500) == 350) {
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
		if (wait == 0) {
			strokeWeight(sroll);
		}
	}
}

function setSegmentLength() {
	sroll = rollDice(6);
	segLen = sroll * 10;
	strokeWeight(sroll);
	console.log('segment roll '+sroll);
}

function drawGenerator(spd, y_offset) {
	++genCount;
	let m = 0;
	let rolling = true;
	let roll;
	while (rolling) {
		roll = rollDice(3);
		if (roll == 1) {
			// draw horizontal line forward
			line(hPos, vPos, hPos + segLen, vPos);
			hPos += segLen;
			if (hPos >= w) {
				hPos = 0;
				vPos = floor(random(h));
				setSegmentLength();
			}
			// console.log('horizontal '+hPos+' v '+vPos+' cx '+cx);
			rolling = false;
			proll = roll;
		}
		if (roll == 2 && proll != 3 && vPos-segLen > 0) {
			m = -segLen;
			// draw vertical line up
			line(hPos, vPos, hPos, vPos + m);
			vPos += m;
			if (vPos < 0) {
				vPos = 0;
			}
			rolling = false;
			proll = roll;
		}
		if (roll == 3 && proll != 2 && vPos+segLen < h) {
			// draw vertical line down
			m = segLen;
			// draw vertical line up
			line(hPos, vPos, hPos, vPos + m);
			vPos += m;
			if (vPos > h) {
				vPos = h;
			}
			rolling = false;
			proll = roll;
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
