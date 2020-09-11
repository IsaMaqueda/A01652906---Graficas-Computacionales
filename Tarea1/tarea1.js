let mat4 = glMatrix.mat4;
let up = true;
let projectionMatrix;

let shaderProgram, shaderVertexPositionAttribute, shaderVertexColorAttribute, shaderProjectionMatrixUniform, shaderModelViewMatrixUniform;

let duration = 10000; // ms

// Attributes: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.
// Varyings: Used for passing data from the vertex shader to the fragment shader. Represent information for which the shader can output different value for each vertex.
let vertexShaderSource =    
    "    attribute vec3 vertexPos;\n" +
    "    attribute vec4 vertexColor;\n" +

    "    uniform mat4 modelViewMatrix;\n" +
    "    uniform mat4 projectionMatrix;\n" +

    "    varying vec4 vColor;\n" +

    "    void main(void) {\n" +
    "		// Return the transformed and projected vertex value\n" +
    "        gl_Position = projectionMatrix * modelViewMatrix * \n" +
    "            vec4(vertexPos, 0.68);\n" +
    "        // Output the vertexColor in vColor\n" +
    "        vColor = vertexColor * 0.8;\n" +
    "    }\n";

// precision lowp float
// This determines how much precision the GPU uses when calculating floats. The use of highp depends on the system.
// - highp for vertex positions,
// - mediump for texture coordinates,
// - lowp for colors.
let fragmentShaderSource = 
    "    precision lowp float;\n" +
    "    varying vec4 vColor;\n" +
    "    void main(void) {\n" +
    "    gl_FragColor = vColor;\n" +
    "}\n";

 //initialized the canvas
function initWebGL(canvas)
{
    let gl = null;
    let msg = "Your browser does not support WebGL, " +
        "or it is not enabled by default.";
    try 
    {
        gl = canvas.getContext("experimental-webgl");
    } 
    catch (e)
    {
        msg = "Error creating WebGL Context!: " + e.toString();
    }

    if (!gl)
    {
        alert(msg);
        throw new Error(msg);
    }

    return gl;        
 }

 //initialise the viewport
function initViewport(gl, canvas)
{
    gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas)
{
    // Create a project matrix with 45 degree field of view
    projectionMatrix = mat4.create();
    
    mat4.perspective(projectionMatrix, Math.PI / 4, canvas.width / canvas.height, 1, 100);
    mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

function createPiramid(gl,translation, rotationAxis){

    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    let verts = [

        //Bottom
        0, 0, 0.68, //0 =  point A
        0.64, 0, 0.21, //1 = point B
        0.39, 0, -.55, //2 = point C
        -0.39, 0, -.55, //3 = point D
        -0.64, 0, 0.21, //4 = point E
        

        // Face AB
        0, 2.0,  0, //5 = point P
        0, 0,  0.68, //6 = point A
        0.64, 0, 0.21, //7 = point B

        // Face BC
        0, 2.0,  0, //8 = point P
        0.64, 0, 0.21, //9 = point B
        0.39, 0, -.55, //10 = point C

        // Face CD
        0, 2.0,  0, //11 = point P
        0.39, 0, -.55, //12 = point C
        -0.39, 0, -.55, //13 = point D

        // Face DE
        0, 2.0,  0, //14 = point P
        -0.39, 0, -.55, //15 = point D
        -0.64, 0, 0.21, //16 = point E

        // Face EA
        0, 2.0,  0, //17 = point P
        -0.64, 0, 0.21, //18 = point E
        0, 0, 0.68, //19 = point A
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    let faceColors = [
        [0.2,  0.7,  0.6,  1.0],    //  bottom: green
        [0.7, 0.8,  1,  1.0],    //  face AB: sky blue
        [0.8,  0.7,  1.0,  1.0],    // face BC: light purple 
        [1.0,  0.5,  0.5,  1.0],    // face CD: salmon
        [1.0,  0.6,  0.0,  1.0],    // face DE: orange 
        [0.7,  0.4,  0.10,  1.0],    // face EA: maroon
    ];

    let vertexColors = [];

    //For each of the first 5 vertex, add the 1st color, its the bottom face 
    for (let j = 0; j < 5; j++)
    {
        vertexColors.push(...faceColors[0]);
    }

    //for each  of the other faces, push the color, it starts in j = 1, because the first color was added before
    // there are 6 colors, 
    for (let j = 1; j <6 ; j++){
        //each face has three vertex
        for (let i = 0; i < 3; i++)
        {
            vertexColors.push(...faceColors[j]);
        }
    }

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let piramidIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, piramidIndexBuffer);

    let piramidIndices = [
        0, 1, 4,      1, 2, 3,    1, 3, 4,   // Bottom: a pentagon consist of 3 triangles 
        5, 6, 7,    // Face AB
        8, 9, 10,   //Face BC
        11, 12, 13,  // Face CD
        14, 15, 16,  //Face DE
        17, 18, 19, // Face EA
        
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(piramidIndices), gl.STATIC_DRAW);
    
    let piramid = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:piramidIndexBuffer,
            vertSize:3, nVerts:20, colorSize:4, nColors: 24, nIndices:24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(piramid.modelViewMatrix, piramid.modelViewMatrix, translation);

    piramid.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return piramid;


}



function createDodecaedro(gl,translation, rotationAxis){

    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //used https://es.qwe.wiki/wiki/Regular_dodecahedron logic and formulas for the 20 vertex
    //20 different vertex, each pentagon has 5 diferent vertex 
    let verts = [

        //Face 1 = 16,2,6,18,17
        1.0,  1.0, -1.0, //0 = 2
        1.0, -1.0, -1.0, // 1= 6
        0.62,  0, -1.61, //2 = 16
        1.61, 0.62, 0, // 3 = 17
        1.61, -0.62, 0, //4 = 18

        //Face 2 = 8,16,12,15,6
        1.0, -1.0,  -1.0, // 5 = 6
        -1.0, -1.0,  -1.0, //6 = 8
        0, -1.61, -0.62, // 7= 12
        -0.62, 0, -1.61, // 8 = 15
        0.62, 0, -1.61, // 9 = 16

        //Face 3 = 5,6,11,12,18
        1.0, -1.0,  1.0,//10 = 5
        1.0, -1.0,  -1.0,//11 = 6
        0, -1.61, 0.62,//12 = 11
        0, -1.61, -0.62,//13 = 12
        +1.61, -0.62, 0,//14 = 18

        //Face 4 = 1,5,14,17,18
        1.0, 1.0,  1.0, //15 =1
        1.0, -1.0,  1.0, //16 =5
        0.62, 0, 1.61,//17= 14
        +1.61, +0.62, 0,//18 = 17
        +1.61, -0.62, 0,//19 =18

        //Face 5 = 1,2,9,10,17
        1.0, 1.0,  1.0,//20 = 1
        1.0, 1.0,  -1.0,//21 =2
        0, 1.61, 0.62,//22 = 9
        0, 1.61, -0.62,//23 = 10
        1.61, 0.62, 0,//24 = 17

        //Face 6 = 2,4,10,,15,16
        1.0, 1.0,  -1.0,//25 = 2
        -1.0, 1.0,  -1.0,//26 = 4
        0, 1.61, -0.62,// 27 = 10
        -0.62, 0, -1.61, // 28 = 15
        0.62, 0, -1.61, // 29 = 16

        //Face 7 = 3,7,13,19,20
        -1.0, 1.0,  1.0, // 30 = 3
        -1.0, -1.0,  1.0,// 31 = 7
        -0.62, 0, 1.61, // 32 = 13
        -1.61, +0.62, 0, // 33 = 19
        -1.61, -0.62, 0, //34 = 20

        //Face 8 = 4,8,15,19,20
        -1.0, 1.0,  -1.0,//35 = 4
        -1.0, -1.0,  -1.0,//36 = 8
        -0.62, 0, -1.61, // 37 = 15
        -1.61, +0.62, 0, // 38 = 19
        -1.61, -0.62, 0, //39 = 20

        //Face 9= 7,8,11,12,20
        -1.0, -1.0,  1.0,// 40 = 7
        -1.0, -1.0,  -1.0,//41 = 8
        0, -1.61, 0.62,//42 = 11
        0, -1.61, -0.62,//43 = 12
        -1.61, -0.62, 0, //44 = 20

        //Face 10 =  5,7,11,13,14
        1.0, -1.0,  1.0, //45 =5
        -1.0, -1.0,  1.0,// 46 = 7
        0, -1.61, 0.62,//47 = 11
        -0.62, 0, 1.61, // 48 = 13
        0.62, 0, 1.61,//49 = 14

        //Face 11 = 1,3,9,13,14
        1.0, 1.0,  1.0,//50 = 1
        -1.0, 1.0,  1.0, // 51 = 3
        0, 1.61, 0.62,//52 = 9
        -0.62, 0, 1.61, // 53 = 13
        0.62, 0, 1.61,//54 = 14

        //Face 12 = 3,4,9,10,19
        -1.0, 1.0,  1.0, // 55 = 3
        -1.0, 1.0,  -1.0,//36 = 4
        0, 1.61, 0.62,//57 = 9
        0, 1.61, -0.62,// 58 = 10
        -1.61, +0.62, 0, // 59 = 19

    ]

    

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    //used more than 3 colors R B G 
    let faceColors = [
        [1.0,  0.0,  0.0,  1.0],    //  face 1: red
        [0.0, 1.0,  0.0,  1.0],    //  face 2: green
        [0.0,  0.0,  1.0,  1.0],    // face 3: blue
        [1.0,  1.0,  0.0,  1.0],    // face 4: yellow
        [1.0,  0.0,  1.0,  1.0],    // face 5: purple
        [0.0,  1.0,  1.0,  1.0],    // face 6: cyan
        [0.5,  0.0,  0.0,  1.0],    // face 7: dark red
        [0.0,  0.5,  0.0,  1.0],    // face 8: dark green
        [0.0,  0.0,  0.5,  1.0],    // face 9: dark blue
        [0.5,  0.5,  0.0,  1.0],    // face 10: dark yellow
        [0.5,  0.0,  0.5,  1.0],    // face 11: dark purple
        [0.0,  0.5,  0.5,  1.0],    // face 12: dark cyan
    ];

    let vertexColors = [];

    faceColors.forEach(color =>{
        for (let j=0; j < 5; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let dodacaedroIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, dodacaedroIndexBuffer);

    //each pentagon is made of three triangles laced in one point
    let dodacaedroIndices = [
        0, 1, 2,      0, 1, 4,    0, 3, 4,   // Face 1
        5, 6, 7,      5, 6, 8,    5, 8, 9, // Face 2
        10, 11, 12,   10, 11, 14, 10, 12, 13, // Face 3
        15, 16, 17,   15, 16, 19, 15, 18, 19, // Face 4
        20, 22, 23,   20, 21, 23, 20, 21, 24, // Face 5
        25, 26, 27,   25, 26, 28, 25, 28, 29, // Face 6
        30, 31, 32,   30, 31, 34, 30, 33, 34, // Face 7
        35, 36, 37,   35, 36, 39, 35, 38, 39, // Face 8
        40, 42, 43,   40, 41, 43, 40, 41, 44, // Face 9
        45, 46, 47,   45, 46, 48, 45, 48, 49, // Face 10
        50, 51, 52,   50, 51, 53, 50, 53, 54, // Face 11
        55, 56, 58,   55, 57, 58, 55, 56, 59,  // Face 12
    ];
    //console.log(dodacaedroIndices.length);

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(dodacaedroIndices), gl.STATIC_DRAW);
    
    let dodacaedro = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:dodacaedroIndexBuffer,
            vertSize:3, nVerts:60, colorSize:4, nColors: 60, nIndices:108,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    //creates the object
    mat4.translate(dodacaedro.modelViewMatrix, dodacaedro.modelViewMatrix, translation);
    //changes the size of the object
    mat4.scale(dodacaedro.modelViewMatrix,dodacaedro.modelViewMatrix,[0.60,0.60,0.60]);

    dodacaedro.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;
    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
    };
    
    return dodacaedro;


}

function createOctaedro(gl,translation, rotationAxis){

    // Vertex Data
    let vertexBuffer;
    vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

    //the octagon has 6 diferent vert, 
    let verts = [

        //Face EAD :
        0, 1.5, 0, //0 Punto E
        1, 0, 1, // 1 Punto A
        -1, 0, 1, // 2 Punto D

        //Face EAC:
        0, 1.5, 0, //3 Punto E
        1, 0, 1, // 4 Punto A
        1, 0, -1, // 5 Punto C

        //Face EDB:
        0, 1.5, 0, //6 Punto E
        -1, 0, 1, // 7 Punto D
        -1, 0, -1, // 8 Punto B

        //Face EBC:
        0, 1.5, 0, // 9 Punto E
        -1, 0, -1, //10 Punto B
        1, 0, -1, // 11 Punto C

        //Face FAD :
        0, -1.5, 0, //12 Punto F
        1, 0, 1, // 13 Punto A
        -1, 0, 1, // 14 Punto D

        //Face FAC:
        0, -1.5, 0, //15 Punto E
        1, 0, 1, // 16 Punto A
        1, 0, -1, // 17 Punto C

        //Face FDB:
        0, -1.5, 0, //18 Punto E
        -1, 0, 1, // 19 Punto D
        -1, 0, -1, // 20 Punto B

        //Face FBC:
        0, -1.5, 0, //21 Punto E
        -1, 0, -1, // 22 Punto B
        1, 0, -1, // 23 Punto C       
    ]

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    let colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);


    let faceColors = [
        [0.20,  0.0,  0.0,  1.0],    //  Face EAD : red
        [0.0, 0.20,  0.0,  1.0],    //  Face EAC: green
        [0.0,  0.0,  0.20,  1.0],    // Face EDB: blue
        [0.20, .20,  0.0,  1.0],    // Face EBC: yellow
        [0.20,  0.0,  0.20,  1.0],    // Face FAD : purple
        [0.0,  0.20,  0.20,  1.0],    // Face FAC: cyan
        [0.75,  0.0,  0.0,  1.0],    // Face FDB: dark red
        [0.0,  0.75,  0.0,  1.0],    // Face FBC: dark green
    ];

    let vertexColors = [];

    //puts the color in each vertice 
    faceColors.forEach(color =>{
        for (let j=0; j < 3; j++)
            vertexColors.push(...color);
    });

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexColors), gl.STATIC_DRAW);

    // Index data (defines the triangles to be drawn).
    let octaedroIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, octaedroIndexBuffer);

    //each face is made of one triangle 
    let octaedroIndices = [
        0, 1, 2,    // Face EAD  
        3, 4, 5,    // Face EAC
        6, 7, 8,   // Face EDB
        9, 10, 11,  // Face EBC
        12, 13, 14,  //Face FAD 
        15, 16, 17, // Face EA
        18, 19, 20, // Face FDB
        21, 22, 23, // Face FBC
        
    ];

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(octaedroIndices), gl.STATIC_DRAW);
    
    //creates the object
    let octaedro = {
            buffer: vertexBuffer, colorBuffer:colorBuffer, indices:octaedroIndexBuffer,
            vertSize:3, nVerts:24, colorSize:4, nColors: 24, nIndices:24,
            primtype:gl.TRIANGLES, modelViewMatrix: mat4.create(), currentTime : Date.now()
        };

    mat4.translate(octaedro.modelViewMatrix, octaedro.modelViewMatrix, translation);
    mat4.scale(octaedro.modelViewMatrix,octaedro.modelViewMatrix,[0.50,0.50,0.50]);


    octaedro.update = function()
    {
        let now = Date.now();
        let deltat = now - this.currentTime;
        this.currentTime = now;
        let fract = deltat / duration;
        let angle = Math.PI * 2 * fract;

    
        // Rotates a mat4 by the given angle
        // mat4 out the receiving matrix
        // mat4 a the matrix to rotate
        // Number rad the angle to rotate the matrix by
        // vec3 axis the axis to rotate around
        mat4.rotate(this.modelViewMatrix, this.modelViewMatrix, angle, rotationAxis);
        console.log(this.modelViewMatrix);


        //gets the y element of the modelViewMatrix
        let y = this.modelViewMatrix[13];


        console.log(y);


        if(up){

            //moves the octacaedro up by 0.05 in y
            mat4.translate(octaedro.modelViewMatrix, octaedro.modelViewMatrix, [0,0.03,0]);
             //checks if it reached the top
            if (y >= 1.8)
            {
                //changes the condition to false 
                up = false;
            }
        }
        else{
            //moves the octacaedro down by 0.05 in y
            mat4.translate(octaedro.modelViewMatrix, octaedro.modelViewMatrix, [0,-0.03,0]);
            //checks if it reached the bottom
            if (y <= -1.8)
            {
                //changes the condition to true
                up = true;
            }
        }
    };
    
    return octaedro;


}

function createShader(gl, str, type)
{
    let shader;
    if (type == "fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (type == "vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}

function initShader(gl)
{
    // load and compile the fragment and vertex shader
    let fragmentShader = createShader(gl, fragmentShaderSource, "fragment");
    let vertexShader = createShader(gl, vertexShaderSource, "vertex");

    // link them together into a new program
    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    // get pointers to the shader params
    shaderVertexPositionAttribute = gl.getAttribLocation(shaderProgram, "vertexPos");
    gl.enableVertexAttribArray(shaderVertexPositionAttribute);

    shaderVertexColorAttribute = gl.getAttribLocation(shaderProgram, "vertexColor");
    gl.enableVertexAttribArray(shaderVertexColorAttribute);
    
    shaderProjectionMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    shaderModelViewMatrixUniform = gl.getUniformLocation(shaderProgram, "modelViewMatrix");

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }
}

function draw(gl, objs) 
{
    // clear the background (with black)
    gl.clearColor(0, 0, 0, 1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // set the shader to use
    gl.useProgram(shaderProgram);

    for(i = 0; i< objs.length; i++)
    {
        obj = objs[i];
        // connect up the shader parameters: vertex position, color and projection/model matrices
        // set up the buffers
        gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
        gl.vertexAttribPointer(shaderVertexPositionAttribute, obj.vertSize, gl.FLOAT, false, 0, 0);

        gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
        gl.vertexAttribPointer(shaderVertexColorAttribute, obj.colorSize, gl.FLOAT, false, 0, 0);
        
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

        gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
        gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, obj.modelViewMatrix);

        // Draw the object's primitives using indexed buffer information.
        // void gl.drawElements(mode, count, type, offset);
        // mode: A GLenum specifying the type primitive to render.
        // count: A GLsizei specifying the number of elements to be rendered.
        // type: A GLenum specifying the type of the values in the element array buffer.
        // offset: A GLintptr specifying an offset in the element array buffer.
        gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
    }
}

function run(gl, objs) 
{
    // The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser call a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.
    requestAnimationFrame(function() { run(gl, objs); });

    draw(gl, objs);

    for(i = 0; i<objs.length; i++)
        objs[i].update();
}