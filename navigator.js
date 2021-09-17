// navigator.js
let url;
let filename;
let scenes;
let times;
let freeze;
let d;
let sInt;
let scene_id;
let scene_length;
// let loc;
// let parts;
// let cols = [
//     'rgba(255, 255, 255, 0.30)',
//     'rgba(128, 255, 255, 0.35)',
//     'rgba(64, 255, 255, 0.40)',
//     'rgba(0, 255, 128, 0.45)',
//     'rgba(255, 255, 0, 0.50)',
//     'rgba(255, 128, 64, 0.55)',
//     'rgba(255, 0, 0, 0.60)',
//     'rgba(255, 0, 0, 0.65)'
// ];
let cols = [
    'rgba(255, 255, 255, 0.30)',
    'rgba(64, 255, 255, 0.35)',
    'rgba(255, 64, 255, 0.40)',
    'rgba(255, 255, 255, 0.30)',
    'rgba(64, 255, 255, 0.35)',
    'rgba(255, 64, 255, 0.40)',
    'rgba(255, 0, 0, 0.60)',
    'rgba(255, 0, 0, 0.65)'
];
let lcols = cols.length - 1;

// hide the mouse when inactive for 2 seconds
$(function() {
    let timer;
    $(document).mousemove(function() {
        $('html').css({
            cursor: ''
        });
        timer = setTimeout(function() {
            $('html').css({
                cursor: 'none'
            });
        }, 2000)
    });
});

function keyPressed() {
    let goto;
    switch (keyCode) {
        case RIGHT_ARROW:
            let next = scene_id + 1;
            goto = next % scenes.length;
            // alert(filename+' '+goto);
            window.location = scenes[goto];
            break;
        case LEFT_ARROW:
            let prev = scene_id - 1;
            if (prev < 0) {
                prev = scenes.length - 1;
            }
            goto = prev % scenes.length;
            window.location = scenes[goto];
            break;
    }
}

function rollDice(sides, start) {
    if (isNaN(start)) {
        start = 1;
    }
    let result = Math.floor(Math.random() * sides) + start;
    // console.log('rollDice',sides,result);
    return result;
}

function chooseTeam(val, theme) {
    if (isNaN(theme)) {
        theme = 0;
    }
    let c;
    let th = [];
    th[0] = []
    th[1] = []
    th[2] = []

    // Theme 0 (default)
    th[0][0] = color(200, 200, 200, 128);
    th[1][0] = color(200, 0, 200, 128);
    th[2][0] = color(0, 255, 200, 128);

    // Theme 1 (Charcoal)
    th[0][1] = color(0, 128);
    th[1][1] = color(200, 0, 200, 63);
    th[2][1] = color(0, 255, 200, 63);

    // Theme 2 (chalk)
    th[0][2] = color(255, 255, 255, 255);
    th[1][2] = color(200, 0, 200, 255);
    th[2][2] = color(0, 255, 200, 255);

    switch (val % 3) {
        case 0:
            // cody = charcoal / chalk
            c = th[0][theme];
            break;
        case 1:
            // pete = purple
            c = th[1][theme];
            break;
        case 2:
            // john = jade
            c = th[2][theme];
            let r = red(c);
            break;
        default:
            c = color(255);
            break;
    }
    return c;
}

window.onload = function() {
    // another setup!
    url = window.location.pathname;
    filename = url.substring(url.lastIndexOf('/') + 1);
    // Adjust the list of scenes in sequence here
    /*
    1. Anchor|Not Quite| Pillows (7min) pseudo_anchor
    2. Intimate Perimeter A  (3.5min) pianissimo_textures
    3. The Way The Light Goes Down (7min) twilight_drones
    4. Intimate Perimeter B (3.5min) pianissimo_textures
    5. Generator|Pulse A (3.5 min) generator
    6. Full Volume | All Together (7 min) repeated_ramps
    7. Generator | Pulse B (3.5 min) generator
    8. Connecting (7 min) transmission_strands
    9. Full Volume \ Used as an ending (15 seconds) */
    scenes = [ 'pseudo_anchor.html', 'pianissimo_textures.html', 'twilight_drones.html', 'pianissimo_textures_2.html', 'generator.html', 'transmission_strands.html', 'generator_2.html', 'repeated_ramps.html' ];
    // times are in seconds
    times = [ 420, 210, 420, 210, 210, 420, 210, 450 ];
    freeze = [ 1, 0, 1, 1, 1, 1, 1, 1 ];
    scene_id = scenes.indexOf(filename);
    scene_length = times[scene_id];
    reStartTimer();
}

function startTimer(duration, display) {
    let timer = 0;
    let i = 0;
    sInt = setInterval(function() {
        minutes = parseInt(timer / 60);
        seconds = parseInt(timer - (minutes * 60));

        if (seconds == 0 && minutes > 0) {
            i < lcols ? ++i : i = 0;
            // console.log(i + '|' + cols[i]);
            $('#time').css('color', cols[i]);
        }
        if ( scene_length - timer <= 60 ) {
            $('#time').css('color', cols[7]); // set last minute to red
        }
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.html(minutes + "<sup>:</sup>" + seconds);
        // we're finished with this scene
        if (++timer > duration) {
            timer = duration;
            i = 0;
            clearInterval(sInt);
            // $('#time').css('color', cols[7]);
            // automatically go to the next scene if specified in hidden input tag
            if (freeze[scene_id] == 1) {
                noLoop();
            }
            if ($('#autonext').val() == 'true') {
                let next = scene_id + 1;
                let goto = next % scenes.length;
                // alert(filename+' '+goto);
                window.location = scenes[goto];
            }
        }
    }, 1000);
}

function reStartTimer() {
    d = parseInt($('#duration').val());
    if (d < 1 || isNaN(d)) {
        d = 7 * 60; // 7 minute default
    }
    if (scene_length > 0) {
      d = scene_length;
    }
    display = $('#time');
    clearInterval(sInt);
    $('#time').css('color', cols[0]);
    // console.log('d: ' + d);
    startTimer(d, display);
}

function shuffle(array) {
    let currentIndex = array.length,
        temporaryValue, randomIndex;
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}
