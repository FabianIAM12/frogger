/* Basic game constants */
const x_grid_max = 5;
const y_grid_max = 6;
const x_border = 505;
const y_border = 495;
const time_range = 30;
let timer = null;
let has_listener = false;
let game_paused = true;

/* Function for simple grid system */
function get_grid_coordinates(grid_x, grid_y){
    const y_shift = 50;
    let x_unit = x_border / x_grid_max * (grid_x - 1);
    let y_unit = y_border / y_grid_max * (y_grid_max - 1 - grid_y);
    return [x_unit, y_unit + y_shift]
}

/* spawn and speed measures */
const spawn_points = [3, 4, 5];
const speed = [];
let speed_iter = 200;
while (speed_iter < 600){
    speed.push(speed_iter);
    speed_iter += 50;
}
let get_random_speed = () => speed[Math.floor(Math.random() * speed.length)];

/* Enemy & Player Class */
class Enemy{
    constructor() {
        this.grid_x = 1;
        this.grid_y = spawn_points[Math.floor(Math.random() * spawn_points.length)];

        [this.x, this.y] = get_grid_coordinates(this.grid_x, this.grid_y);
        this.sprite = 'images/enemy-bug.png';
        this.speed = get_random_speed();

        this.width = 50;
        this.height = 50;
    }

    update(dt){
        if (this.x < y_border) {
            this.x = this.x + this.speed * dt;
        }else{
            this.grid_x = 0;
            this.grid_y = spawn_points[Math.floor(Math.random() * spawn_points.length)];
            [this.x, this.y] = get_grid_coordinates(this.grid_x, this.grid_y);
            this.speed = get_random_speed();
        }
    };

    render () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}

class Player{
    constructor(grid_x = 3, grid_y = 1, sprite='images/char-boy.png') {
        this.grid_x = grid_x;
        this.grid_y = grid_y;
        [this.x, this.y] = get_grid_coordinates(grid_x, grid_y);
        this.sprite = sprite;

        this.width = 50;
        this.height = 50;
    }

    score_point(){
        document.getElementById("score").innerHTML = parseInt(document.getElementById("score").innerText) + 1;

        this.grid_x = 3;
        this.grid_y = 1;

        /* increase level of bad enemies */
        let enemy = new Enemy();
        allEnemies.push(enemy);
    }

    update(){
        if (game_paused === false){
            [this.x, this.y] = get_grid_coordinates(this.grid_x, this.grid_y);
            if (this.grid_y === 6){
                this.score_point();
            }
        }
    };

    render () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    reset(){
        this.grid_x = 3;
        this.grid_y = 1;
    }

    shift_boundary_check(type = 'grid_x', value){
        if (type === 'grid_x'){
            let new_value = this.grid_x + value;
            let can_move = true;

            /* check collision to obstacles */
            allObstacles.forEach(function(obstacle) {
                if (new_value === obstacle.grid_x && player.grid_y === obstacle.grid_y){
                    can_move = false;
                }
            });

            /* check grid and move */
            if (new_value > 0 && new_value < x_grid_max + 1 && can_move === true){
                this.grid_x += value;
            }
        }else{
            let new_value = this.grid_y + value;
            let can_move = true;

            /* check collision to obstacles */
            allObstacles.forEach(function(obstacle) {
                if (new_value === obstacle.grid_y && player.grid_x === obstacle.grid_x){
                    can_move = false;
                }
            });

            /* check grid and move */
            if (new_value > 0 && new_value < y_grid_max + 1 && can_move === true){
                this.grid_y += value;
            }
        }
    }

    handleInput (key){
        if (key === 'left'){
            this.shift_boundary_check('grid_x', -1);
        }else if (key === 'up'){
            this.shift_boundary_check('grid_y', 1);
        }else if (key === 'right'){
            this.shift_boundary_check('grid_x', 1);
        }else if (key === 'down'){
            this.shift_boundary_check('grid_y', -1);
        }
    };
}

class Obstacle{
    constructor() {
        this.grid_x = Math.floor(Math.random()*5) + 1;
        this.grid_y = Math.floor(Math.random()*6) + 1;

        /* well, thats wrong for player spawn point */
        if (this.grid_x === 3){
            if (Math.floor(Math.random()) === 0) {
                this.grid_x -= 1;
            }else{
                this.grid_x += 1;
            }
        }

        [this.x, this.y] = get_grid_coordinates(this.grid_x, this.grid_y);

        this.sprite = 'images/Rock.png';
    }

    render () {
        if (game_paused === false){
            ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        }
    };
}

/* basic start function */
function start_game(){
    clearInterval(timer);
    timer = setInterval(myTimer, 1000);

    if (has_listener === false) {
        document.addEventListener('keyup', function (e) {
            var allowedKeys = {
                37: 'left',
                38: 'up',
                39: 'right',
                40: 'down'
            };
            player.handleInput(allowedKeys[e.keyCode]);
        });
        has_listener = true;
    }

    return timer;
}

/* initial function for moving elements */
function init_game(){
    document.getElementById("timer").innerHTML = time_range;
    document.getElementById("score").innerHTML = '0';

    player = new Player();
    allEnemies = [];
    allObstacles = [];

    for (let i = 0; i < 1; i++) {
        let enemy = new Enemy();
        allEnemies.push(enemy);
    }

    const number_of_obstacles = Math.floor(Math.random()*3) + 1;
    for (let i = 0; i < number_of_obstacles; i++) {
        let obstacle = new Obstacle();
        allObstacles.push(obstacle);
    }
}
init_game();

/* modal at the start of the game */
class Modal {
    constructor(overlay) {
        this.overlay = overlay;
        const closeButton = overlay.querySelector('.button-close');
        closeButton.addEventListener('click', this.close.bind(this));
        overlay.addEventListener('click', e => {
            if (e.srcElement.id === this.overlay.id) {
                this.close();
            }
        });
    }
    fill_in_score_content(){
        document.getElementById("score-board").innerHTML = '<h1 class="celebration">Congratulations!</h1>' +
        '<p>You made ' + parseInt(document.getElementById("score").innerText) + ' points!</p>'
    }

    handleInput(key){
        let images = document.getElementsByTagName("img");
        let pos = 0;

        for (let i = 0; i < images.length; i++) {
            if(images[i].id === 'selected'){
                pos = i;
            }
        }
        if (key === 'right') {
            images[pos].removeAttribute("id");
            if(pos + 1 === images.length) pos = -1;
            images[pos + 1].setAttribute("id", "selected");
        }else if(key === 'left'){
            images[pos].removeAttribute("id");
            if(pos - 1 < 0) pos = 5;
            images[pos - 1].setAttribute("id", "selected");
        }else if(key ==='enter'){
            init_game();
            let splitt_src = document.getElementById("selected").src.split("/");
            player.sprite = splitt_src[splitt_src.length - 2] + '/' + splitt_src[splitt_src.length - 1];
            this.close();
            start_game();
        }
    }
    open() {
        this.overlay.classList.remove('is-hidden');
        game_paused = true;
    }
    close() {
        this.overlay.classList.add('is-hidden');
        game_paused = false;
    }
}
const modal = new Modal(document.querySelector('.modal-overlay'));
window.openModal = modal.open.bind(modal);
window.openModal();

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        39: 'right',
        13: 'enter'
    };
    modal.handleInput(allowedKeys[e.keyCode]);
});

/* timer */
function myTimer() {
    let seconds = parseInt(document.getElementById("timer").textContent);
    if (seconds === 0){
        modal.fill_in_score_content();
        modal.open();
        clearInterval(timer);
    }else{
        document.getElementById("timer").innerHTML = seconds - 1;
    }
}
