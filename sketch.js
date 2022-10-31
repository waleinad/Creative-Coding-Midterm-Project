//a mini-game inspired by some of my favourite runaway games
//This sketch includes p5.play library:
//https://p5play.org/
//several related tutorials:
//@jonfroehlich http://makeabilitylab.io/
//https://www.youtube.com/watch?v=4Ud3oX-cKxc&t=72s

let GameFont;
let player;
let obstacle;
let ground;
let nextGap;
let score = 0;
let minGap = 200;
let GameOver = false;
let GameOn = false; 
let success = false;


function preload() {
  GameFont = loadFont('JungleAdventurer.ttf');
  bread = loadImage('breadisrunning.gif');
}


function setup() {
  createCanvas(600, 400);
  textFont(GameFont); 
  ground = new Ground();
  
  resetGame();
  
  // stop game loop until space bar hit to begin
  noLoop(); 
}


function draw() {
  background(228,230,221);
  
  // draw obstacles with random gap
  if(obstacles.length <= 0 || width - obstacles[obstacles.length - 1].x >= nextGap){
    obstacles.push(new Obstacle(width, ground.y)); 
    nextGap = random(minGap, width * 1.2);
  }
  
  // loop through all the barriers and update them
  for(let i = obstacles.length - 1; i >= 0; i--){
    obstacles[i].update();
    obstacles[i].draw();
    
    //if we hit the barrier, end game
    if(success != true && obstacles[i].checkIfCollision(player)){
      GameOver = true;
      noLoop(); // game is over, stop game loop
    }
    
    if(obstacles[i].hasScoredYet == false && obstacles[i].getRight() < player.x){
      obstacles[i].hasScoredYet = true;
      score++;
    }
    
    // remove barriers that have gone off the screen
    if(obstacles[i].getRight() < 0){
      obstacles.splice(i, 1); 
    }
  }
  
  player.update(ground.y);  
  ground.draw();
  player.draw();
  drawScore();
}


function resetGame(){
  score = 0;
  GameOver = false; 
  
  player = new Player(ground.y);
  obstacles = [new Obstacle(width, ground.y)];
  loop();
}


function drawScore() {

  fill(0);
  textAlign(RIGHT);
  textSize(25);
  text('Score:' + score, 560, 50);

  if (GameOver) {

    // dark overlay
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    // draw game over text
    textAlign(CENTER);
    textSize(40);
    fill(255);
    text('GAME OVER...', width / 2, height / 1.8);
    
    textSize(20);
    text('Press SPACE BAR to run again!', width / 2, height / 1.4);
  }else if(GameOn == false){
    // if we're here, then the game has yet to begin for the first time
    
    // dark overlay
    fill(0, 0, 0, 100);
    rect(0, 0, width, height);

    // 
    textAlign(CENTER);
    textSize(25);
    fill(255);
    text('Now you are a piece of bread...', width / 2, height / 3);
    text('Press SPACE BAR to run away!', width / 2, height / 1.2);
  }
}


function keyPressed(){
  if (key == ' ' && player.isOnGround()){ // spacebar 
    player.jump();
  } 
  
  // check for special states (game over or if game hasn't begun)
  if (GameOver == true && key == ' ') {
    resetGame();
  }else if(GameOn == false && key == ' '){
    GameOn = true;
    loop();
  }
}


//define 3 classes from shape.js: Obstacle, Avatar, Ground
class Obstacle extends Shape{
  constructor(x, yGround){
    let obstacleWidth = random(10, 30);
    let obstacleHeight = random(10, 40);
    let y = yGround - obstacleHeight;
    super(x, y, obstacleWidth, obstacleHeight);
    this.color = color(random(255), random(255), random(255)); 
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
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}


class Player extends Shape{
  constructor(yGround){
    let playerHeight = 20;
    super(64, yGround - playerHeight, 80, 66);
    this.color = color(0); 
    this.gravity = 0.5;
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
    this.yVelocity *= 0.94; // some air resistance
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
    fill(this.color);
//    rect(this.x, this.y, this.width, this.height);
    image(bread, this.x, this.y, this.width, this.height)
    pop();
  }
}


class Ground extends Shape{
  constructor(){
    let yGround = height * 0.65;
    let groundHeight = ceil(height - yGround);
    super(0, yGround, width, groundHeight);
    this.color = color(255,238,173); 
  }
  
  draw(){
    push();
    noStroke();
    fill(this.color);
    rect(this.x, this.y, this.width, this.height);
    pop();
  }
}