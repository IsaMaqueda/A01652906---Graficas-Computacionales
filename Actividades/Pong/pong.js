
class barra
{
    constructor(x,y,width, height, speed)
    {
        this.x = x;
        this.y = y; 
        this.width = width;
        this.height = height;
        this.speed = speed;

    }

    moveUp() {
        this.y -= this.speed;
    }

    moveDown(){
        this.y += this.speed;
    }

    draw(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.fillRect(this.x,this.y, this.width,this.height);
    }

    update(up, down, left, right)
    {

    }

}

class pelota
{
    constructor(x,y,radio, speed=1)
    {
        this.x = x;
        this.y = y; 
        this.radio = radio;
        this.speed = speed;

        this.up = true;
        this.right = true;

    }


    draw(ctx)
    {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radio, 0 , Math.PI * 2);
        ctx.closePath();
        ctx.fill();
    }

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

function update(canvas, ctx, objects)
{
    requestAnimationFrame(() => update(canvas, ctx, objects));

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    objects.forEach(object => {
        object.draw(ctx);
        object.update(0, canvas.height, 0, canvas.width);
    });

}


function main()
{
    const canvas = document.getElementById("pongCanvas");
    const ctx = canvas.getContext("2d");

    let barraIzq = new barra(10, 120,20, 60);
    let barraDer = new barra(570,120,20,60);
    let bola = new pelota(canvas.width/2, canvas.height/2, 10);

    //barraIzq.draw(ctx);
    //barraDer.draw(ctx);

    let gameObjects = [];

    gameObjects.push(barraIzq, barraDer, bola);
    console.log(gameObjects);

    gameObjects.forEach(object => object.draw(ctx));

    update(canvas, ctx, gameObjects); 

}