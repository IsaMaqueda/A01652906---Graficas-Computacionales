/*Isabel Maqueda Rolon
A01652906
17/08/20
*/

let keysDown = {
    'q':false,
    'a':false,
    'o':false,
    'l':false,
};

class barra
{
    //contructor of bar
    constructor(x,y,width, height, keyup, keydown, speed)
    {
        this.x = x;
        this.y = y; 
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.keyup = keyup;
        this.keydown = keydown;

    }

    //how the bar moves up
    moveUp() {
        this.y -= this.speed;
    }

    //controls the movement of the bar down
    moveDown(){
        this.y += this.speed;
    }

    //draws the bar 
    draw(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x,this.y, this.width,this.height);
    }

    // update on each movement
    update()
    {
        if(keysDown[this.keyup])
            this.moveUp();
        
        if(keysDown[this.keydown])
            this.moveDown();
    }

}

// controller of the ball
class pelota
{
    //constructor
    constructor(x,y,radio, speed=1)
    {
        this.x = x;
        this.y = y; 
        this.radio = radio;
        this.speed = speed;

        this.up = true;
        this.right = true;

    }

    //draws the ball
    draw(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radio, 0 , Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }
    //controls the movement of the ball
    update(up, down, left, right)
    {
        if(this.up)
            this.y -= this.speed;
        else
            this.y += this.speed;

        if(this.right)
            this.x += this.speed;
        else
            this.x -= this.speed;

        if((this.y - this.radio) <= up)
            this.up = false;

        if((this.y + this.radio) >= down)
            this.up = true;

        if((this.x + this.radio) >= right)
            this.right = false;

        if((this.x - this.radio) <= left)
            this.right = true; 
    }
}

//the animation frame of the game, is the update that calls the other updates 
function update(canvas, ctx, barras, bola)
{    
    requestAnimationFrame(()=>update(canvas, ctx, barras, bola));    
    ctx.clearRect(0,0, canvas.width, canvas.height);

    barras.forEach(bola =>{        
        bola.draw(ctx);        
        bola.update();    
    });    
    bola.update(0, canvas.height, 0, canvas.width);

}

//main function 
function main()
{
    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");

    let barraIzq = new barra(10, 120,20, 60,'q','a');
    let barraDer = new barra(570,120,20,60,'o','l');
    let bola = new pelota(canvas.width/2, canvas.height/2, 10);

    let barras = [];    
    barras.push(barraIzq, barraDer, bola);    

    document.addEventListener("keydown", event => keysDown[event.key] = true);
    document.addEventListener("keyup" , event => keysDown[event.key] = false);

    update(canvas, ctx, barras, bola);

}