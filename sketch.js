let canvasHeight = 350;
let obsMaxHeight = 0.35 * canvasHeight;
let obsWidth = 25;
let gravity = 15;
let obstSpacing = 150;
var gameover = false;
let skysky;
let birdasset;
let birdmask;
let floorasset;
let pipeupasset;
let pipedownasset;
let planeupasset;
let planedownasset;
let planeleftasset;
let planerightasset;
let xDown=null;
let yDown=null;
let SwypeTick=0;
let yUp;
let xUp;
let P;
let Ascending=false;
let UsingArrows=false;

var nextTick=0;
var speedTick=0;
var dropTick=0;
var riseTick=0;

var bg;
var bird = {x: 400, y: 250, rad: 15, speed: 0, momentumx: 0, momentumy: 0, health: 100, offx: 0, injured: 0, dir: 0};



function preload() {
      skysky = loadImage('skybackground.bmp');
      birdasset = loadImage('bird.png');
      birdmask = loadImage('birdmask.png');
      floorasset = loadImage('floor.bmp');
      pipeupasset = loadImage('uppipe.png');
      pipedownasset = loadImage('downpipe.png');
      planeleftasset = loadImage('planeleft.bmp');
      planerightasset = loadimage('planeright.bmp');
      planeupasset = loadimage('planeup.bmp');
      planedownasset = loadimage('planedown.bmp');
      //birdasset.mask(birdmask);
      //image(birdasset,0,0);

      
  }

class Obstacle {
    
    constructor(x, height, ceiling) {
        this.x = x;
        this.height = height;
        this.ceiling = ceiling;
        this.color = color(25,255,25);
        this.tStamp = 0;
        this.tStamp2 = 0;
        this.tilted = false;
        this.willtilt = false;
        this.willmove = false;
        if(Math.random()>0.5){this.willtilt=true;}
        if(Math.random()>0.5){this.willmove=true;}       
        if(Math.random()>0.5) {
            this.speed = Math.round(Math.random()*30)-1; // from -40 to -21
        } else {
            this.speed = 0-Math.round(Math.random()*30)+1; //from +21 to +40
        }
        
    }

    isCollided(x,y) {
        let topLeft = {x: this.x, y: this.ceiling===true ? 0 : canvasHeight - this.height};
        let bottomRight = {x: topLeft.x + obsWidth, y: topLeft.y + this.height};
        if (x < bottomRight.x && x > topLeft.x 
            && y > topLeft.y && y < bottomRight.y) {
            this.color = color(255,0,0);
            return true;
        }
        return false;
    }

    draw() {
        //if( typeof( bStamp.crap) == "undefined" ) {bStamp.crap = Date.now();}

        fill(this.color);
        if (this.ceiling === true) {
            rect(this.x - bird.x, 0, obsWidth, this.height);
            image(pipedownasset, this.x - bird.x, 0, obsWidth, this.height);

            if(Date.now() > this.tStamp){
                if(this.willtilt){
                    this.height++;
                    if(this.height>canvasHeight)this.height=0;

                }
                if(this.willmove)this.x+=this.speed; 
                this.tStamp = Date.now() + 50;
            }
        } else {

            if(Date.now() > this.tStamp2){
                if(this.willtilt){
                    this.height++;
                    if(this.height>canvasHeight)this.height=0;
                 
                }                
                if(this.willmove)this.x+=this.speed; 
                this.tStamp2 = Date.now() + 50; //back here
            }
            rect(this.x - bird.x, canvasHeight - this.height, obsWidth, this.height);
            image(pipeupasset,this.x-bird.x,canvasHeight-this.height, obsWidth, this.height);
        }
    }
};

class Plane {
    constructor(x, height, ceiling) {
        this.x = x;
        this.y = 200;
        this.height = height;
        this.Active= ceiling;
        this.color = color(25,255,25);
        this.dead = false;
        
    }

    isCollided(x,y) {
        let topLeft = {x: this.x, y: this.ceiling===true ? 0 : canvasHeight - this.height};
        let bottomRight = {x: topLeft.x + obsWidth, y: topLeft.y + this.height};
        if (x < bottomRight.x && x > topLeft.x 
            && y > topLeft.y && y < bottomRight.y) {
            this.color = color(255,0,0);
            return true;
        }
        return false;
    }

    draw() {
        fill(this.color);
        if (this.dead===false) {
            //rect(this.x - bird.x, 0, obsWidth, this.height);
            image(planeleftasset, this.x - bird.x, this.y, obsWidth, 20);
        } else {
           // rect(this.x - bird.x, canvasHeight - this.height, obsWidth, this.height);
          //  image(plaedownasset,this.x-bird.x,canvasHeight-this.height, obsWidth, this.height);
        }
    }
};


class Background {
    constructor() {
        
        this.obsts = [];
        this.Planes = [];
        this.lastObstX = 0;
        this.lastPlaneX = 0;
        for (var i = 0; i < 10; i++) {
            this.genObst();
            this.genPlane();
        }
    }

    genObst() {
        this.obsts.push(new Obstacle(this.lastObstX, random()*obsMaxHeight, true));
        this.obsts.push(new Obstacle(this.lastObstX, random()*obsMaxHeight, false));
        this.lastObstX += obstSpacing;
    }

    genPlane() {
        this.Planes.push(new Plane(this.lastPlaneX, random()*obsMaxHeight, true));
        this.lastPlaneX += obstSpacing;
    }
    

    draw() {


        if(!gameover) {
        //skysky.addEventListener('input',updateValue);
        background(0);
        var scrollX = (bird.x/4) % (skysky.width/2);
        var gscrollX = (bird.x/3    ) % (floorasset.width/2);
        image(skysky,    0,                  0,       900, canvasHeight, scrollX, 0, skysky.width/2, skysky.height); 
        image(floorasset,0, canvasHeight-50, 900, 50, gscrollX, 0, floorasset.width/2);
       // if(MouseEvent.keyPressed){bird.health=0;}
       //image(floorasset,0,0,40,40);

        //var ScrollX =  bird.x-900;
        //    image(skysky, 0, 0, 800, canvasHeight, 100/ScrollX, 0, 100, 0, 0);
        this.obsts.forEach(obs => {
            obs.draw()
        })
        

        this.Planes.forEach(pln => {
            pln.draw()
        })
        
        for (var n = 0; n < 10; n++) {
             if(this.obsts[n].x > bird.x+ 1400){
                 this.obsts[n].x = bird.x-200;
                // this.obsts[n].speed = 0;
                 /*
                 var hold=obsts[0];
                 obsts[0]=obsts[n];
                 obsts[n]=hold;
                 this.obsts.shift();
                 this.genObst();*/
             }
             else if(this.obsts[n].x < bird.x-900){
                 this.obsts[n].x = bird.x+900;
             }
             
        }
       
        if (this.obsts[0].x < bird.x - 450   ) {
           // this.obsts.shift();
           // this.genObst();
        }

        if (this.Planes[0].x < bird.x - 450) {
           // this.Planes.shift();
            //this.genPlane();
        }    
    
        redraw()
    }
    else { drawgameover(); }

    }
};
function drawgameover() {

    background(0);
    fill(0,0,0);
    rect(0,0,500,500);

    
    redraw();
}

function updateValue(e) {
    
  bird.health = 100;
}

function setup() {

    canvasHeight=350;
    let P = createCanvas(900, canvasHeight);
    bg = new Background();


    
    
}

//function keyReleased() {
//    if (keyCode === UP_ARROW) {
//        bird.y -= 80;
//        redraw();
//    }
//}
function GameOver() {
    document.write("Game restarting in: <label id='counter'>10</label> Seconds.");
    document.write("<\hr>")
    gameover=true;
    nextTick = Date.now() + 5000;
}
function keyPressed() {
      if (keyIsDown(UP_ARROW)) {
       // bird.y -= 80;
        redraw();

    }
}


function mousePressed(e) {
    //if(!bird.injured)bird.y-=80;
 
  redraw();

}
function getTouches(evt) {
    return evt.touches ||             // browser API
           evt.originalEvent.touches; // jQuery
  } 
  
function touchStarted(e) {

  //  if(e.touches.length > 1){e.preventDefault();return;}
    if(gameover){

        window.location.reload();
        gameover=false;
        return;
    }
    const firstTouch = getTouches(e)[0];                                      
    xDown = firstTouch.clientX;                                      
    yDown = firstTouch.clientY;      

   // bird.health = 70;
   if(!bird.injured){Ascending=true;}else{Ascending=false;}
   if(bird.offx<0)bird.offx++;
   // bird.y-=80;
    redraw();


}

function onTouch(evt)  {
    switch (evt.type) {
        case "touchStarted": 
    //    bird.health = 50;
         // type = "mousedown";
         // touch = evt.changedTouches[0];
         redraw();
          break;
        case "touchMoved":
            
          //  e.changedTouches[0].x
          
         //   bird.health+=10;
            gameover=true;
            break;
          type = "mousemove";
          touch = evt.changedTouches[0];
          break;
        case "touchend":   
       // bird.health = 1115;     
          type = "mouseup";
          touch = evt.changedTouches[0];
          break;
      }
      redraw();

}
function touchMove(e) {

  //  bird.health+=10;

    bird.y+=10;
    redraw();
}
function touchMoved(e) {

    e.preventDefault();

    if ( ! xDown || ! yDown ) {

        return;
    }

    var xUp = e.touches[0].clientX;                                    
    var yUp = e.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;
                                                                         
    if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
        if ( xDiff > 0 ) {
            if(!bird.offx){
              bird.speed+= 1.5;
              bird.dir=1;
            }else { bird.speed++;  if(bird.offx>0){bird.offx=0;speed+=2;} }
            
            nextTick= Date.now()+50;
        } else {
            bird.speed-=1.5;
            dir=-1;
        
            nextTick= Date.now()+50;
        }                       
    } else {
        if ( yDiff > 0 ) {
            /* down swipe */ 
        } else { 
            /* up swipe */
        }                                                                 
    }
    /* reset values */
    xDown = null;
    yDown = null;                                  

   // bird.health+=10;

    
    redraw();
}
function touchEnded(e) {
   // gameover=true;
   //bird.health = 100;
   Ascending=false;
   bird.dir=0;
   redraw();
}




function drawBird() {

    fill(color(0,0,0));
    noStroke();

    //birdasset.mask(birdmask);
    image(birdasset,450+bird.offx,bird.y);   
        //circle(450, bird.y, bird.rad);

    if( (!Ascending||bird.injured) && (bird.y < canvasHeight-75||gameover)) { 
        if(Date.now() > riseTick){
          bird.y += gravity+(bird.momentumy/2); 
          bird.momentumy+= 0.5;
          riseTick = Date.now() + 20;
        }
     }
    else    if(Ascending&&!bird.injured&&bird.y>25)
    {
         if(Date.now() >= riseTick) {
          if(bird.offx<0){bird.offx+=10;bird.speed+=0.75;} 
          bird.y-=12;
          bird.momentumy=0;
          riseTick = Date.now() + 50;
        }
    }
    if(bird.y >= canvasHeight-85) { bird.injured = 0; }
    bird.x += bird.speed;


    
}

function checkCollision() {
    for(var i = 0; i < bg.obsts.length; i++) {
        if (bg.obsts[i].isCollided(bird.x + (450+bird.offx), bird.y))
            return true;
    };
    return false;
}

// function gameOver() {
//     print("Game Over");
// }

function draw() {

    var ctx = (P);
    //bg.canvas.width  = 400;
    //ctx.canvas.height = 400;

    if(!bird.injured){
    if ( (keyIsDown(UP_ARROW)||Ascending) && bird.y > 25 && Date.now() >= nextTick) {
       if(keyIsDown(UP_ARROW)) UsingArrows=true;
       // bird.y -= 20;
       Ascending=true;
        nextTick= Date.now()+0;
        redraw();
    }
    if(UsingArrows&&!keyIsDown(UP_ARROW))Ascending=false;
    if(keyIsDown(LEFT_ARROW) && Date.now() >= nextTick)
    {
          bird.speed--;
          nextTick= Date.now()+100;
    }
    if(keyIsDown(RIGHT_ARROW) && Date.now() >= nextTick)
    {
        if(!checkCollision()) {
          bird.speed++;
          if(bird.offx > 0) {

          nextTick= Date.now()+100;
          }
          else { if(!checkCollision()) bird.offx = bird.offx + bird.speed; }
        }
    }
  }
    if (gameover === false) {
    bg.draw();
    drawBird();

  
    var w = (bird.health*200)/100 - 2; 
    //draw health
    fill(color(0,0,0));
    rect(0,0,200,20);
    fill(color(255,0,0));
    rect(1,1,w,18);   
    //skyasset.draw();
    if (checkCollision()){
        bird.health = bird.health - 20;
        bird.offx = -100;
        bird.speed = -1;
        bird.injured = 1;
        if(bird.health < 10)GameOver();
    }
     }
     else {
         background(50);
         document.getElementById('counter').innerText =  (nextTick-Date.now())/1000;
         document.write("YOU SUCK ");
         if(Date.now() >= nextTick){ 
            noLoop();
           window.location.reload();
          
         }
     }
    
}
