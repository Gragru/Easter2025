const GAME_MAP_OLD = [
    "         EeEDdDCcCBbBAaA          ",
    "X                                 ",
    "X                                X",
    "X                         A      X",
    "X                         a      X",
    "X                         A      X",
    "X                         B      X",
    "X                         b      X",
    "X                         B      X",
    "X                         C      X",
    "X    ?        X           c      X",
    "X                         C      X",
    "X                         D      X",
    "X                         d      X",
    "X                         D      X",
    "X                         E      X",
    "X                         e      X",
    "X                         E      X",
    "X                                X",
    "X                                X",
    "X       EeEDdDCcCBbBAaA          X",
    "X                                X",
    "X                                X",
    "X                                X",
    "X                                X",
    "X                                X",
    "X                                X",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
];






const GAME_MAP = [
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    "X                                X",
    "X   ?                            X",
    "XAAABBBCCC   EEE  AAABBBCCC   EEEX",
    "X        C   C B  B       C   C  X",
    "X        C   ADD  B       A   A  X",
    "X        D        B   B   A   A  X",
    "X        D        C   B          X",           
    "X        DDDDDDDDDD   B          X",
    "XDDDDDDDDD            BeeEEEEEEEEX",
    "X                                X",
    "X                                X",
    "XAAAAA  AAA  AAA  AAAA  AAA  AAAAX",
    "X    A  A B  B C  C  D  D E  E   X",
    "X    A  A B  B C  C  D  D E  E   X",
    "X    A  A B  B C  C  D  D E  E   X",
    "X    AAAA B  B CCCC  DDDD E  E   X",
    "X         B  BBBBBBBEEEEEEE  E   X",
    "X         B                  E   X",
    "X         B                  E   X",
    "X         BBBBBBBBB  EEEEEEEEE   X",
    "X                 B  E           X",
    "X       BBBBBBBBBBB  E           X",
    "X       C            E           X",
    "X       C            E           X",
    "X       C   EEEEEEEEEE           X",
    "X       C * D                    X",
    "X       CFFFD                    X",
    "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
   
];











const GRID_SIZE = 150;
const PERSONAL_SPACE = 50;
const RUN_SPEED = -25;
const WALK_SPEED = -10;
const TURN_SPEED = 0.02;
const MOUSE_SENSITIVITY = 0.00001;
const CAM_X = 100;
const CAM_Y = -75;
const CAM_Z = 100;
const SKYCOLOR = "SkyBlue";
const BLOCK_HEIGHT = 200;
const RENDER_DISTANCE = 3000;


let wallTexture;
let walls = [];
let player;
let enemies = [];
let defaultwallTexture;

function getRandomLetter() {
    const letters = ['A', 'B', 'C', 'D', 'E'];
    return letters[Math.floor(Math.random() * letters.length
    )];
}


function preload() {

    defaultwallTexture = loadImage("walldefault.jpg");
    wallTextures = [loadImage("wall1.jpg"), loadImage("wall2.jpg"), loadImage("wall3.jpg"), loadImage("wall4.jpg"), loadImage("wall5.jpg"), loadImage("walldefault.jpg")];
    //console.log(wallTextures);
    entranceTextures = [loadImage("wall1e.jpg"), loadImage("wall2e.jpg"), loadImage("wall3e.jpg"), loadImage("wall4e.jpg"), loadImage("wall5e.jpg")];
    //console.log(entranceTextures);
}

function setup() {

    this.direction = -1;

    createCanvas(1600, 800, WEBGL);
    cursor(CROSS);

    // Create game layout
    for (let z = 0; z < GAME_MAP.length; z++) {
        for (let x = 0; x < GAME_MAP[z].length; x++) {
            let tile = GAME_MAP[z][x];
            let worldX = (x - GAME_MAP[z].length / 2) * GRID_SIZE;
            let worldZ = (z - GAME_MAP.length / 2) * GRID_SIZE;
            switch (tile) {
                case "?":
                    player = new Player(worldX, worldZ);
                    break;
                case "*":
                    enemies.push(new Enemy(worldX, worldZ));
                    break;
                case " ":
                    break
                case "X":
                    
                    //tile = getRandomLetter();
                    var height = 1 + Math.floor(Math.random() * 4);
                    walls.push(new Wall(worldX, worldZ, GRID_SIZE, BLOCK_HEIGHT, GRID_SIZE, tile, height));
                    break;
                default:
                    var height = 1 + Math.floor(Math.random() * 4);
                    walls.push(new Wall(worldX, worldZ, GRID_SIZE, BLOCK_HEIGHT, GRID_SIZE, tile, height));
                    break;
            }
        }
    }
}

function draw() {

    //console.log(this.direction)
    background(SKYCOLOR);

    // Basic lighting
    ambientLight(150);
    directionalLight(180, 180, 180, 0, 0, -1);

    // Draw interior
    drawFloor();
    walls.forEach((wall) => wall.display());

    // Draw player and enemies
    // player.turnTowardsMouse();
    player.moveForward();
    player.moveBackward()
    player.moveTurning();
    player.updateCamera();

    enemies.forEach((enemy) => enemy.display());
}

class Player {
    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.direction = -1.5; // direction the player is facing
        this.isMovingForward = false;
        this.isMovingBackward = false;
        this.isRunning = false;
        this.isTurning = false;
        this.turnDirection = "";

    }

    moveForward() {
        if (!this.isMovingForward) {
            return;
        }
        let speed = this.isRunning ? RUN_SPEED : WALK_SPEED;
        let newX = this.x + Math.sin(this.direction) * speed;
        let newZ = this.z + Math.cos(this.direction) * speed;
        if (!this.checkCollision(newX, newZ)) {
            this.x = newX;
            this.z = newZ;
            //console.log(this.x, this.z);
            // this.info();
        }
    }

    moveBackward() {
        if (!this.isMovingBackwards) {
            return;
        }
        let speed = this.isRunning ? RUN_SPEED : WALK_SPEED;
        let newX = this.x - Math.sin(this.direction) * speed;
        let newZ = this.z - Math.cos(this.direction) * speed;
        if (!this.checkCollision(newX, newZ)) {
            this.x = newX;
            this.z = newZ;
        }
    }

    info()
    {
        console.log("X: " + this.x + " Z: " + this.z + " Direction: " + this.direction);
    }

    moveTurning() {
        if (!this.isTurning) {
            return;
        }
        if (this.turnDirection === "left") {
            this.direction += TURN_SPEED;
        } else {
            this.direction -= TURN_SPEED;
        }
        //console.log(this.direction)
    }

    checkCollision(newX, newZ) {
        for (let wall of walls) {
            if (
                newX > wall.x - (wall.w / 2 + PERSONAL_SPACE) &&
                newX < wall.x + (wall.w / 2 + PERSONAL_SPACE) &&
                newZ > wall.z - (wall.d / 2 + PERSONAL_SPACE) &&
                newZ < wall.z + (wall.d / 2 + PERSONAL_SPACE)
            ) 
            {
                console.log("Collision detected!: " + wall.tile);
                if(wall.tile == "F")
                {
                    window.location.href = "goal.html"
                }
                if(wall.tile.charCodeAt(0)  < 128 && wall.tile.charCodeAt(0) > 94)
                {
                    return false;
                }
                else 
                {
                    return true;
                }
            }

        }
        return false;
    }

    turnTowardsMouse() {
        if (mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) {
            return;
        }

        // Only turn if mouse is on edge of canvas.
        const noTurnZoneStart = (width * 2) / 5;
        const noTurnZoneEnd = (width * 3) / 5;
        if (mouseX < noTurnZoneStart || mouseX > noTurnZoneEnd) {
            let mouseDelta = mouseX - width / 2;
            this.direction -= mouseDelta * MOUSE_SENSITIVITY;
        }
    }

    updateCamera() {
        let camX = this.x + Math.sin(this.direction) * CAM_X;
        let camZ = this.z + Math.cos(this.direction) * CAM_Z;
        let lookX = this.x - Math.sin(this.direction);
        let lookZ = this.z - Math.cos(this.direction);
        camera(camX, CAM_Y, camZ, lookX, CAM_Y, lookZ, 0, 1, 0);
    }
}

function keyPressed() {
    switch (keyCode) {
        case BACKSPACE:
            setup();
            break;
        case UP_ARROW:
            player.isMovingForward = true;
            break;
        case DOWN_ARROW:
            player.isMovingBackwards = true;
            break;
        case SHIFT:
            player.isRunning = true;
            break;
        case LEFT_ARROW:
            player.isTurning = true;
            player.turnDirection = "left";
            break;
        case RIGHT_ARROW:
            player.isTurning = true;
            player.turnDirection = "right";
            break;
    }
}

function keyReleased() {
    switch (keyCode) {
        case UP_ARROW:
            player.isMovingForward = false;
            break;
        case DOWN_ARROW:
            player.isMovingBackwards = false;
            break;
        case SHIFT:
            player.isRunning = false;
            break;
        case LEFT_ARROW:
            player.isTurning = false;
            break;
        case RIGHT_ARROW:
            player.isTurning = false;
            break;
    }
}

function distance(x1, z1, x2, z2) {
    const deltaX = x2 - x1;
    const deltaZ = z2 - z1;
    return Math.sqrt(deltaX ** 2 + deltaZ ** 2);
}

class Wall {
    constructor(x, z, w, h, d, tile, height) {
        this.x = x;
        this.z = z;
        this.w = w;
        this.h = h;
        this.d = d;
        this.tile = tile;
        this.height = height;
    }

    display() {
       
        
        //console.log(distance(this.x, this.z, player.x, player.z));

        let dist = distance(this.x, this.z, player.x, player.z)
        if (dist < RENDER_DISTANCE) {

        var y = -this.h / 2

        for (var i = 0; i < this.height; i++) {

           
            push();
            translate(this.x, -this.h * i - (this.h / 2), this.z);
            this.uvs = [0.25, 0.25, 0.75, 0.25, 0.25, 0.75, 0.75, 0.75];
            let decimal = this.tile.charCodeAt(0) - 65;
            //console.log(this.tile, decimal);

            textureMode(IMAGE);

            // console.log("X", this.tile);
            if (this.tile == "X") {
                //console.log("X", decimal);
                texture(defaultwallTexture);
            }
            else 
            {


                if (i === 0) {
                    if (decimal > 31) {
                        //console.log("Dörr", decimal - 32);
                        texture(entranceTextures[decimal - 32]);
                    }
                    else {
                        //console.log("Vägg", decimal);
                        texture(wallTextures[decimal]);
                    }
                }
                else {
                    if (decimal > 31) {
                        decimal = decimal - 32;
                        texture(wallTextures[decimal]);
                    }
                    //console.log("Vägg2", decimal);
                    texture(wallTextures[decimal]);
                }



            }

            // beginShape();
            // vertex(-30, -30, 0, 0);
            // vertex(30, -30, 1, 0);
            // vertex(30, 30, 1, 1);
            // vertex(-30, 30, 0, 1);
            // endShape();

            // rotate(frameCount * 0.01);

            box(this.w, this.h, this.d);
            pop();
        }
        }
    }
}

function drawFloor() {
    push();
    noStroke();
    // fill("gray");
    translate(0, 0, 0);
    rotateX(HALF_PI);
    plane(width * 20, height * 20);
    texture(wallTextures[0]);
    pop();
}

class Enemy {
    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.r = 50;
    }

    display() {
        push();
        noStroke();
        translate(this.x, -this.r, this.z);
        fill("yellow");
        sphere(this.r);
        pop();
    }
}
