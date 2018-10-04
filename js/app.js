const x_grid_max = 5;
const y_grid_max = 6;
const x_border = 505;
const y_border = 495;
function get_grid_coordinates(grid_x, grid_y){
    const y_shift = 50;
    let x_unit = x_border / x_grid_max * (grid_x - 1);
    let y_unit = y_border / y_grid_max * (y_grid_max - 1 - grid_y);
    return [x_unit, y_unit + y_shift]
}

const spawn_points = [3, 4, 5];
const speed = [];
let speed_iter = 200;
while (speed_iter < 600){
    speed.push(speed_iter);
    speed_iter += 50;
}
let get_random_speed = () => speed[Math.floor(Math.random() * speed.length)];

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
    constructor(grid_x = 3, grid_y = 1) {
        this.grid_x = grid_x;
        this.grid_y = grid_y;
        [this.x, this.y] = get_grid_coordinates(grid_x, grid_y);
        this.sprite = 'images/char-boy.png';

        this.width = 50;
        this.height = 50;
    }

    update(){
        [this.x, this.y] = get_grid_coordinates(this.grid_x, this.grid_y);
    };

    render () {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };

    reset(){
        this.grid_x = 3;
        this.grid_y = 1;
        [this.x, this.y] = get_grid_coordinates(this.grid_x, this.grid_y);
    }

    shift_boundary_check(type = 'grid_x', value){
        if (type === 'grid_x'){
            let new_value = this.grid_x + value;
            if (new_value > 0 && new_value < x_grid_max + 1){
                this.grid_x += value;
            }
        }else{
            let new_value = this.grid_y + value;
            if (new_value > 0 && new_value < y_grid_max + 1){
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

player = new Player();
allEnemies = [];

for (let i = 0; i < 6; i++) {
    let enemy = new Enemy();
    allEnemies.push(enemy);
}

document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
