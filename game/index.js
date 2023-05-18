


const canvas = document.querySelector("canvas");

const c = canvas.getContext('2d');


canvas.width = innerWidth;
canvas.height = innerHeight;



const gravity = 0.5;
let scrollOffSet = 0;

let attackLeft = document.getElementById("attack-left");
let attackRight = document.getElementById("attack-right");
let runRight = document.getElementById("run-right");
let runLeft = document.getElementById("run-left");
let idleRight = document.getElementById("idle-right");
let idleLeft = document.getElementById("idle-left");
let jumpRight = document.getElementById("jump-right");
let jumpLeft = document.getElementById("jump-left");

class ScoreBoard{

    constructor(){
        this.width = 200,
        this.height = 100,
        this.level = 1;
        this.playerHealth = 100;
        this.enemyHealth = 100;
    }

    draw(){
        c.font = "30px Arial";
        c.fillText("asdasds",0,0);
    }

}

class Player{
    constructor(){
        this.health = 100;
        this.speed = 10;
        this.position = {
            x : 100,
            y : 100
        }
        this.velocity = {
            x : 0,
            y: 0
        }
        this.width  = 200;
        this.height = 200;
        
        this.frames = 0;
        this.sprites = {
            stand : {
                right : idleRight,
                left : idleLeft,
                cropWidth: 48,
                part : 4
            },
            run : {
                right: runRight,
                left : runLeft,
                cropWidth: 48,
                part : 8
            },
            jump : {
                right : jumpRight,
                left : jumpLeft,
                cropWidth : 48,
                part : 1
            },
            atack : {
                right :attackRight,
                left : attackLeft,
                cropWidth : 48,
                part : 8
            }
        }
        
        this.currentSprite = this.sprites.stand.right;
        this.currentCropWidth = this.sprites.stand.cropWidth;
        this.currentPart = this.sprites.stand.part;
    }
    update(){
        this.frames++;
        if(this.currentSprite == this.sprites.atack.right || this.currentSprite == this.sprites.atack.left){
            if(this.frames >= this.currentPart * 6 ){
                this.frames = 0;
            }
        }else{
            if(this.frames >= this.currentPart * 4 ){
                this.frames = 0;
            }
        }
        this.draw();
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        // if(this.position.x + this.width + this.velocity.x <= canvas.width){
        //     this.velocity.x
        // }
        
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            this.velocity.y += gravity;

        }else{
            this.velocity.y = 0;
        }

        
        
    }
    draw() {
        c.drawImage(
            this.currentSprite,
            (this.currentSprite == this.sprites.atack.right || this.currentSprite == this.sprites.atack.left) ? this.currentCropWidth *  parseInt(this.frames / 6) : this.currentCropWidth *  parseInt(this.frames / 4),
            -2,
            this.currentCropWidth,
            this.currentCropWidth,
            this.position.x,
            this.position.y,
            this.width,
            this.height
        );
        //this.healthScore.draw();
        // c.fillStyle = 'red';
        // c.fillRect(this.position.x,
        //            this.position.y,
        //            this.width,
        //            this.height);
    }
}

class Platform{
    constructor({x,y,image}){
        this.position = {
            x,
            y
        }
        
        this.image = image;
        this.width = image.width;
        this.height = image.height;
    }

    draw() {
        // c.fillStyle = 'blue';
        // c.fillRect(
        //     this.position.x,
        //     this.position.y,
        //     this.width,
        //     this.height);
        
        c.drawImage(this.image,this.position.x,this.position.y);

    }
}


class Enemy{
    constructor({x,y}){
        this.position = {
            x,
            y
        }
        this.width = 100;
        this.height = 150;
    }

    draw() {
        c.fillStyle = 'blue';
        c.fillRect(
            this.position.x,
            this.position.y,
            this.width,
            this.height);
        
        

    }
}



let image = document.getElementById('platform');

//const platform = new Platform();
const platforms = [
    new Platform({x:-1,y:innerHeight - 110,image:image}),
    new Platform({x:image.width - 3,y:innerHeight - 110,image:image}),
    new Platform({x:(image.width * 2) - 3,y:innerHeight - 110,image:image}),
    new Platform({x:(image.width * 3) - 3,y:innerHeight - 220,image:image})
];
    
const scoreBoard = new ScoreBoard();
const player = new Player();

const enemy = new Enemy({x:300,y:620});

const keys = {
    right : {
        pressed : false
    },
    left : {
        pressed : false
    },
    up : {
        pressed : false
    },
    down : {
        pressed : false
    },
    keyboardQ : {
        pressed : false
    }
}



function animate(){
    
    
    requestAnimationFrame(animate);
    
    c.fillStyle = 'black';
    c.fillRect(0,0,canvas.width,canvas.height);
    
    
 

    platforms.forEach(platform => {
        platform.draw();
    })
    
    
    player.update();
    scoreBoard.draw();
    
    if(keys.right.pressed && player.position.x + player.width < 400){
        player.velocity.x = player.speed;
    } else if(keys.left.pressed && player.position.x > 100){
        player.velocity.x = - player.speed;
    } else{
        player.velocity.x = 0;
        if(keys.right.pressed){
            scrollOffSet += 5;
            platforms.forEach(platform => {
                platform.position.x -= 5;
            })
            enemy.position.x -= 5;
        }else if(keys.left.pressed){
            scrollOffSet -= 5;
            platforms.forEach(platform => {
                platform.position.x += 5;
            })
            enemy.position.x += 5;a
        } 
            
    } 
    //console.log(scrollOffSet);
    platforms.forEach(platform => {
        if(player.position.y + player.height <= platform.position.y 
            && player.position.y + player.height + player.velocity.y >= platform.position.y
            && player.position.x + player.width >= platform.position.x
            && player.position.x + player.width + player.velocity.x >= platform.position.x
            && platform.position.x + platform.width > player.position.x
            // && player.position.x + player.width >= 
            ){
            player.velocity.y = 0;
            }
    });
    
    
    

}


animate()

addEventListener('keydown',({key}) => {
    switch(key){
        case 'a':
            keys.left.pressed = true;
            keys.right.pressed = false;
            player.currentSprite = player.sprites.run.left;
            player.currentCropWidth = 48;
            player.currentPart = 8;
            break;
        case 'd':
            keys.left.pressed = false;
            keys.right.pressed = true;
            player.currentSprite = player.sprites.run.right;
            player.currentCropWidth = 48;
            player.currentPart = 8;
            // player.velocity.x = 5;
            break;
        case 's':
            console.log("down");
            //player.velocity.y += 15;
            break;
        case 'w':
            keys.up.pressed = true;
            if(player.position.y >= 570){
                if(player.currentSprite == player.sprites.stand.right || player.sprites.run.right == player.currentSprite){
                    player.currentSprite = player.sprites.jump.right;
                }else if(player.currentSprite == player.sprites.stand.left || player.sprites.run.left == player.currentSprite){
                    player.currentSprite = player.sprites.jump.left;
                }
                player.currentCropWidth = 48;
                player.currentPart = 1;
                player.velocity.y -= 15;
            }
            
            // if(keys.up.pressed && keys.right.pressed){
            //     player.currentSprite = player.sprites.jump.right;
            // }else if(keys.up.pressed && keys.left.pressed){
            //     player.currentSprite = player.sprites.jump.left;
            // }
            
            break;        
    }
})

addEventListener("mousedown",(e) => {
    player.currentCropWidth = 48;
    player.currentPart = 8;
    if(player.currentSprite == player.sprites.stand.right || player.currentSprite == player.sprites.run.right){
        player.currentSprite = player.sprites.atack.right;
    }
    if(player.currentSprite == player.sprites.stand.left || player.currentSprite == player.sprites.run.left){
        player.currentSprite = player.sprites.atack.left;
        
    }
});

addEventListener("mouseup",(e) => {
    player.currentCropWidth = 48;
    player.currentPart = 4;
    if(player.currentSprite == player.sprites.atack.right){
        player.currentSprite = player.sprites.stand.right;
    }

    if(player.currentSprite == player.sprites.atack.left){
        player.currentSprite = player.sprites.stand.left;
    }
})

addEventListener('keyup',({key}) => {
    switch(key){
        case 'a':
            keys.left.pressed = false;
            player.currentCropWidth = 48;
            if(keys.right.pressed){
                player.currentSprite = player.sprites.run.right;
                player.currentPart = 8;
            }else{
                player.currentSprite = player.sprites.stand.left;
                player.currentPart = 4;
            }
            break;
        case 'd':
            keys.right.pressed = false;
            player.currentCropWidth = 48;
            if(keys.left.pressed){
                player.currentSprite = player.sprites.run.left;
                player.currentPart = 8;
            }else{
                player.currentSprite = player.sprites.stand.right;
                player.currentPart = 4;
            }
            break;
        case 's':
            keys.down.pressed = false;
            console.log("down");
            break;
        case 'w':
            //keys.down.pressed = true;
            
            player.currentCropWidth = 48;
            if(keys.right.pressed){
                player.currentSprite = player.sprites.run.right;
                player.currentPart = 8;
            }else if(keys.left.pressed){
                player.currentSprite = player.sprites.run.left;
                player.currentPart = 8;
            }
            
            if(player.currentSprite == player.sprites.jump.left){
                player.currentSprite = player.sprites.stand.left;
            }
            if(player.currentSprite == player.sprites.jump.right){
                player.currentSprite = player.sprites.stand.right;
            }
            // player.currentCropWidth = 48;
            // player.currentPart = 1;
            break;        
    }
})





