//setup...
const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

const mouse = {
    x: undefined,
    y: undefined
}
//Color array...
let colorsArr = [
   "#E76268",
   "#DC6E84",
   "#D8EAB8",
   "#6ADDB3",
   "#4DD2B4",
   "#00AAC8"
];

//event listener for resize...
window.addEventListener('resize', () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});

var weight = 1;
var friction = 0.92;
var par = [];
let cArr = [];

function getDist(x1, y1, x2, y2){
    let xDist = x1 - x2;
    let yDist = y1 - y2;
    
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}
//circle object...
class Circle {
    constructor(x, y, color, radius, sy, sx) {
        this.x = x;
        this.y = y;
        this.velocity = {
             sx: sx,
             sy: sy
       };
        
        this.radius = radius;
        this.color = color;
        
    }

    draw() {
        c.save()
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;

        c.shadowColor = this.color;
        c.shadowBlur = 75;

        c.fill();
        c.closePath();
        c.restore();
    }

    gravity() {
        if (this.y + this.radius + this.velocity.sy > canvas.height) {
            this.velocity.sy = -this.velocity.sy * friction;
            for (var x = 0; x < 22; x++) {
                var dx = (Math.random() - 0.5) * 15;
                var dy = (Math.random() - 0.5) * 15;
                par.push(new Particle(this.x, canvas.height - 15, this.color, 2, dy, dx));
            }
            this.radius -= 7;
        } else {
            this.velocity.sy += weight;
        }
        
        if (this.x + this.radius + this.velocity.sx >= canvas.width || this.x - this.radius <= 0) {
            this.velocity.sx = -this.velocity.sx;
        }

        this.y += this.velocity.sy;
        this.x += this.velocity.sx;
    }
    
    coll(cArr){
         for(var a = 0; a < cArr.length; a++){
              if(this == cArr[a]) continue;
              if(getDist(this.x, this.y, cArr[a].x, cArr[a].y) - this.radius * 2 < 0){
              	     this.radius -= 0.6;
                       for (var x = 0; x < 2; x++) {
                              var dx = (Math.random() - 0.5) * 15;
                              var dy = (Math.random() - 0.5) * 15;
                              par.push(new Particle(this.x, this.y, this.color, 1.7, dy, dx));
                          }
               }
              
        }
    }
}
//Particle object...
class Particle {
    constructor(x, y, color, radius, sy, sx) {
        this.x = x;
        this.y = y;
        this.sy = sy;
        this.sx = sx;
        this.radius = radius;
        this.color = color;
    }

    draw() {
        c.save()
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;

        c.shadowColor = this.color;
        c.shadowBlur = 6;

        c.fill();
        c.closePath();
        c.restore();
    }

    gravity() {
        if (this.y + this.radius + this.sy > canvas.height) {
            this.sy = -this.sy * friction;
        } else {
            this.sy += weight - 0.75;
        }

        this.y += this.sy;
        this.x += this.sx;
        this.radius -= 0.08;

    }
}



// Implementation
var sx = (Math.random() - 0.5) * 15;
var sy = Math.random() * 25;
var rad = (Math.random() + 1) * 30;
var color1 = colorsArr[Math.floor(Math.random() * colorsArr.length)];
var color2 = colorsArr[Math.floor(Math.random() * colorsArr.length)];
var color3 = colorsArr[Math.floor(Math.random() * colorsArr.length)];
var color4 = colorsArr[Math.floor(Math.random() * colorsArr.length)];
//extra circles...(don't make fun of me because of the I didn't use a for loop...
var gS = cArr.push(new Circle(200, 50, color1, rad, sy, sx));
var gS1 = cArr.push(new Circle(400, 80, color3, rad, sy, sx));
var gS2 = cArr.push(new Circle(50, 150, color2, rad, sy, sx));
var gS3 = cArr.push(new Circle(130, 300, color4, rad, sy, sx));

// Animation Loop
function animate() {
    requestAnimationFrame(animate);
    
    c.save();
    c.fillStyle = "rgba(0, 0, 30, 0.36)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    c.restore();
    
    c.fillStyle = "white";
    c.font = "40px Cu";
    c.fillText("Click To Spawn", canvas.width/2 - 220, 45);
    
    cArr.forEach((circle, i) => {
        circle.draw();
        circle.gravity();
        circle.coll(cArr);

        if (circle.radius <= 0) {
            cArr.splice(i, 1);
        }
      
    })

    par.forEach((prt, x) => {
        prt.draw();
        prt.gravity();

        if (prt.radius <= 0) {
            par.splice(x, 1);
        }

    })

}

animate();
//Click event for spawning circles...
window.addEventListener('click', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
    var colors = colorsArr[Math.floor(Math.random() * colorsArr.length)];
    for (var i = 0; i < 1; i++) {
        sx = (Math.random() - 0.5) * 15;
        sy = Math.random() * 25;
        rad = (Math.random() + 1) * 30;
        colors = colorsArr[Math.floor(Math.random() * colorsArr.length)];
        cArr.push(new Circle(mouse.x, mouse.y, colors, rad, sy, sx));
    }

});


