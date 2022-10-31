let ground;
let avatar;
let obstacle;

let isGameOver = false;
let hasGameBegun = false; 
let score = 0;
let arcadeFont;

let minDistanceBetweenBarriers = 100;
let nextSpawnDistance;
let isInvincible = false;

function preload() {
  arcadeFont = loadFont('arcadefont.ttf');
}

function setup() {
  createCanvas(600, 400);
  textFont(arcadeFont); 
  ground = new Ground();
  
  resetGame();
  
  // stop game loop until space bar hit to begin
  noLoop(); 
}

function resetGame(){
  score = 0;
  isGameOver = false; 
  
  avatar = new Avatar(ground.y);
  obstacles = [new Obstacle(width, ground.y)];
  loop();
}

function draw() {
  background(220);
  
  // draw obstacles with random gap
  if(obstacles.length <= 0 || width - obstacles[obstacles.length - 1].x >= nextSpawnDistance){
    obstacles.push(new Obstacle(width, ground.y)); 
    nextSpawnDistance = random(minDistanceBetweenObstacles, width * 1.2);
  }
  
  // loop through all the barriers and update them
  for(let i = obstacles.length - 1; i >= 0; i--){
    obstacles[i].update();
    obstacles[i].draw();
    
    //if we hit the barrier, end game
    if(isInvincible != true && obstacles[i].checkIfCollision(avatar)){
      isGameOver = true;
      noLoop(); // game is over, stop game loop
    }
    
    if(obstacles[i].hasScoredYet == false && obstacles[i].getRight() < avatar.x){
      obstacles[i].hasScoredYet = true;
      score++;
    }
    
    // remove barriers that have gone off the screen
    if(obstacles[i].getRight() < 0){
      obstacles.splice(i, 1); 
    }
  }
  
  avatar.update(ground.y);  
  ground.draw();
  avatar.draw();
  drawScore();
}

function drawScore() {

  fill(0);
  textAlign(LEFT);
  textSize(15);
  text('Score:' + score, 10, 20);

  if (isGameOver) {

    // dark overlay
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    // draw game over text
    textAlign(CENTER);
    textSize(35);
    fill(255);
    text('GAME OVER!', width / 2, height / 3);
    
    textSize(12);
    text('Press SPACE BAR to play again.', width / 2, height / 2);
  }else if(hasGameBegun == false){
    // if we're here, then the game has yet to begin for the first time
    
    // dark overlay
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    // draw game over text
    textAlign(CENTER);
    textSize(15);
    fill(255);
    text('Press SPACE BAR to play!', width / 2, height / 3);
  }
 
}


function keyPressed(){
  if (key == ' ' && avatar.isOnGround()){ // spacebar 
    avatar.jump();
  } 
  
  // check for special states (game over or if game hasn't begun)
  if (isGameOver == true && key == ' ') {
    resetGame();
  }else if(hasGameBegun == false && key == ' '){
    hasGameBegun = true;
    loop();
  }
}

class Ground extends Shape{
  constructor(){
    let yGround = height * 0.8;
    let groundHeight = ceil(height - yGround);
    super(0, yGround, width, groundHeight);
    this.fillColor = color(128); 
  }
  
  draw(){
    push();
    noStroke();
    fill(this.fillColor);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

class Obstacle extends Shape{
  constructor(x, yGround){
    let obstacleWidth = random(10, 30);
    let obstacleHeight = random(10, 40);
    let y = yGround - obstacleHeight;
    super(x, y, obstacleWidth, obstacleHeight);
    this.fillColor = color(128); 
    this.speed = 6;
    this.hasScoredYet = false;
  }
  
  checkIfCollision(shape){
    return this.overlaps(shape);
  }
  
  update(){
    this.x -= this.speed; 
  }
  
  draw(){
    push();
    noStroke();
    fill(this.fillColor);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}

class Avatar extends Shape{
  constructor(yGround){
    let avatarHeight = 20;
    super(64, yGround - avatarHeight, 10, 20);
    this.fillColor = color(70); 
    this.gravity = 0.9;
    this.jumpStrength = 15;
    this.yVelocity = 0;
    this.yGround = yGround;
  }
  
  jump(){
    this.yVelocity += -this.jumpStrength;   
  }
  
  isOnGround(){
    return this.y == this.yGround - this.height;
  }

  update() {
    this.yVelocity += this.gravity;
    this.yVelocity *= 0.9; // some air resistance
    this.y += this.yVelocity;
    
    if (this.y + this.height > this.yGround) {
      // hit the ground
      this.y = this.yGround - this.height;
      this.yVelocity = 0;
    }
  }
  
  draw(){
    push();
    noStroke();
    fill(this.fillColor);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}