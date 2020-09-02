
let keysDown = {
    "w":false,
    "s":false,
    "o":false,
    "l":false
};

//Players class
class barra{

    constructor(x, y, width, height, keyUp, keyDown, speed=4){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.keyUp = keyUp;
        this.keyDown = keyDown;
    }

    moveUp(topBorder){
        if(this.y>topBorder)
            this.y -= this.speed;
    }

    moveDown(downBorder){
        if((this.y+this.height)<downBorder)
            this.y += this.speed;
    }

    draw(context){
        context.fillStyle = 'white';
        context.fillRect(this.x, this.y, this.width, this.height);
    }

    update(canvas){
        if(keysDown[this.keyUp])
            this.moveUp(0)
        if(keysDown[this.keyDown])
            this.moveDown(canvas.height)
    }

}

//Ball class
class pelota{

    constructor(x, y, radio, speed=1){
        this.x = x;
        this.y = y;
        this.radio = radio;
        this.speed = speed;

        this.up = true;
        this.right = true;
    }

    draw(context){
        context.fillStyle = 'white';
        context.beginPath();
        context.arc(this.x, this.y, this.radio, 0, Math.PI * 2);
        context.closePath();
        context.fill();
    }

    update(up, down, left, right, barras){

        if(this.up)
            this.y -= this.speed;
        else
            this.y += this.speed;
        
        if(this.right)
            this.x += this.speed;
        else
            this.x -= this.speed;
        
        //If the ball hits the top border
        if( (this.y-this.radio) <= up)
            this.up = false;
        //If the ball hits the bottom border
        if( (this.y + this.radio) >= down)
            this.up = true;
        
        //If the ball hits the right border
        if( (this.x + this.radio) >= right)
            this.right = false;   
        //If the ball hits the left border
        if( (this.x - this.radio) <= left)
            this.right = true;
        
        //If the ball is on the x position of the left bar, lower than the top border of the bar and higher than the bottom border of the bar, it means the ball has collided with the bar
        if( (this.x - this.radio) <= (barras[0].x + (barras[0].width)) && ((this.y + this.radio) >= barras[0].y) && ((this.y + this.radio) <= (barras[0].y + barras[0].height)))
            this.right=true;

        //Same conditional as the previous one, but for the right bar
        if( ((this.x + this.radio) >= barras[1].x) && ((this.y + this.radio) >= barras[1].y ) && ((this.y + this.radio) <= (barras[1].y + barras[1].height)) )
            this.right=false;
    }
}

//General update function
function update(canvas, context, barras, bola){
    
    requestAnimationFrame(()=>update(canvas, context, barras, bola));

    //The canvas is cleared
    context.clearRect(0, 0, canvas.width, canvas.height);

    //The players are drawn
    barras.forEach(barra =>{
        barra.update(canvas);
        barra.draw(context);
    })

    //The ball is drawn
    bola.update(0, canvas.height, 0, canvas.width, barras);
    bola.draw(context);
}

function keyEvents(){

    document.addEventListener("keyup", event=>{
        keysDown[event.key] = false;
    });
       
    document.addEventListener("keydown", event=>{
        keysDown[event.key] = true;
    }); 
} 

//Main function that gets called from the html
function main(){

    const canvas = document.getElementById("pongCanvas");
    canvas.width = 600;
    canvas.height = 300;

    const context = canvas.getContext("2d");

    let barraIzq = new barra(10, 120, 20, 60, "w", "s");
    let barraDer = new barra(570, 120, 20, 60, "o", "l");

    let bola = new pelota(canvas.width/2, canvas.height/2, 10);

    let barras = [];

    barras.push(barraIzq, barraDer);
    
    keyEvents();

    update(canvas, context, barras, bola);
}