const serviceUuid = "19b10010-e8f2-537e-4f6c-d104768a1214";
const characteristicsUUID = {
 button1:"19b10011-e8f2-537e-4f6c-d104768a1214",
}

let buttonOneCharacteristic;
let buttonTwoCharacteristic;
let myBLE;
let buttonValueOne;
let buttonValueTwo;

let width=1000;
let height =600;

let hp =10;
let playerHp= 10;
let maxHp=10;
let maxPlayerHp=10;
let timeStart;
let timeToHit=1000;
let foundCharacteristics=false;

let images=[];
let currentimage=2;
let gameOver=false;

function preload(){
  images.push(loadImage('src/assets/tyson-hit-left.png'));
  images.push(loadImage('src/assets/tyson-hit-right.png'));
  images.push(loadImage('src/assets/tyson-idle.png'));
  images.push(loadImage('src/assets/tyson-punch.png'));
}

function setup() {
  myBLE = new p5ble();
  createCanvas(width, height);
  background("#FFF");
  const connectButton = createButton('Connect and Start Notifications')
  connectButton.mousePressed(connectAndStartNotify);
  setupUI();
  timeStart=millis();
}

function setupUI(){
  document.querySelector('#timePerHit').oninput = function TimePerHit() {
    timeToHit=this.value;
  };
  document.querySelector('#playerHP').oninput = function TimePerHit() {
    maxPlayerHp=this.value;
  };
  document.querySelector('#tysonHP').oninput = function TimePerHit() {
    maxHp=this.value;
  };
  document.querySelector('#Reset').onclick = function Fire() {
    playerHp=maxPlayerHp;
    hp=maxHp;
    gameOver=false;
    timeStart=millis();
  }

}

function connectAndStartNotify() {
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function gotCharacteristics(error, characteristics){ 
 if (error) console.log('error: ', error);
 for(let i = 0; i < characteristics.length;i++){
   if(characteristics[i].uuid == characteristicsUUID.button1){
      buttonOneCharacteristic = characteristics[i];
      myBLE.startNotifications(buttonOneCharacteristic, handleButtonOne);
      foundCharacteristics=true;
      timeStart=millis();
   }else{
     console.log("nothing");
   }
 }
}
function handleButtonOne(data) {
 console.log('ButtonOne: ', data);
 buttonValueOne = Number(data);
  if(buttonValueOne==1){
    currentimage=0
    if(hp>=1){
      hp--;
    }
  }
  else if(buttonValueOne==2){
    currentimage=1;
    if(hp>=1){
      hp--;
    }

  }
  else if(buttonValueOne==0){
    currentimage=2;
  }
  buttonValueOne=0;

}

function draw() {

  if(millis()-timeStart>timeToHit&& foundCharacteristics&&!gameOver){
    timeStart=millis();
    image
    playerHp--;
    currentimage=3;
  }

  noStroke();
  image(images[currentimage], 0, 0, width,height );
  //mac//player//////////////
  let c = color(0, 255, 0);
  fill(c);
  rect(30, height-40, (playerHp*10), 20);
  textSize(20);
  fill(50);
  text(playerHp, 30, height-40, 1000, 80);
  //tyson////////////////////
  c = color(255, 0, 0);
  fill(c);
  rect(675, height-40, (hp*10), 20);

  textSize(20);
  fill(50);
  text(hp, 675, height-40, 1000, 80);

  if(playerHp<=0){
    c = color(255, 255, 255);
    textSize(64);
    fill(c);
    text("Game Over Player Lost", 200, 300, 1000, 80);
    gameOver=true;
    return
  }
  if(hp<=0){
    c = color(255, 255, 255);
    textSize(64);
    fill(c);
    text("Game Over Tyson Lost", 200, 300, 1000, 80);
    gameOver=true;
    return;
  }



  textSize(32);
  let s = ((millis()-timeStart)/1000).toFixed(2)+"sec :"+(timeToHit/1000).toFixed(2)+"sec";
  fill(50);
  text(s, 375, 560, 1000, 80);
}