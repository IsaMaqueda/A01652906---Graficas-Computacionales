/*Isabel Maqueda Rolon
A01652906
20/08/2020

*/

let size = 600;
 
function sierpinski(Ax,Ay,Bx,By,Cx,Cy,d,ctx) {
    if(d>0) {
        let pointAx = (Bx + Cx) / 2;
        let pointAy = (By + Cy) / 2;
 
        let pointBx = (Ax + Cx) / 2;
        let pointBy = (Ay + Cy) / 2;
 
        let pointCx = (Ax + Bx) / 2;
        let pointCy = (Ay + By) / 2;
 
        let d2 = d-1;
        sierpinski(Ax,Ay,pointBx,pointBy,pointCx,pointCy,d2,ctx);
        sierpinski(pointCx,pointCy,pointAx,pointAy,Bx,By,d2,ctx);
        sierpinski(pointBx,pointBy,pointAx,pointAy,Cx,Cy,d2,ctx);
    }
    else {
        ctx.moveTo(Ax,Ay);
        ctx.lineTo(Bx,By);
        ctx.lineTo(Cx,Cy);
        ctx.lineTo(Ax,Ay);
    }
}
 
 
function drawSierpinski(ctx, deep, width, height) {
    let midPointX = width/2;
    let midPointY = height/2;
 
 
    let ri = (size/6) * Math.sqrt(3);
    let ru = (size/3) * Math.sqrt(3);
 
    let pointAx = midPointX-(size/2);
    let pointAy = midPointY+ri;
 
    let pointBx = midPointX+(size/2);
    let pointBy = midPointY+ri;
 
    let pointCx = midPointX;
    let pointCy = midPointY-ru;
 
    sierpinski(pointAx,pointAy,pointBx,pointBy,pointCx,pointCy,deep,ctx);
}

function main()
{

    let canvas = document.getElementById("TriangleCanvas");
    const ctx = canvas.getContext("2d");



    document.getElementById("slider").oninput = function(event) {
        document.getElementById("sliderValue").innerHTML = "DEEP: " + event.target.value;

    };

    //let deep = event.target.vlaue;

    let deep = 4; 



    drawSierpinski(ctx, deep, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
}d