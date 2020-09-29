let renderer = null, 
scene = null, 
camera = null,
sphereGroup = null;


let objects = []; //Array for all the objects created in the scene
let elements = []; //Array for all the elements
let lastElement = null; //Last element created
let pivotElements = null //3D Object for all the elements

let duration = 5000; // ms
let currentTime = Date.now();

//Function that animates all the current elements and satellites in the scene
function animate() 
{
    let now = Date.now();
    let deltat = now - currentTime;
    currentTime = now;
    let fract = deltat / duration;
    let angle = Math.PI * 2 * fract;

    //Animate all the elements in the scene
    elements.forEach(element=>{

        element.mesh.rotation.y += angle;

        element.pivot.rotation.y += (angle/2);

        element.satellites.forEach(satellite=>{
            satellite.mesh.rotation.y += angle;
        });
    });

}

//Function that renders the scene and updates the animation
function run() 
{
    requestAnimationFrame(function() { run(); });
    
    // Render the scene
    renderer.render( scene, camera );

    // Rotation of the elements and satellites
    animate();
}


function createScene(canvas)
{
    // Create the Three.js renderer and attach it to our canvas
    renderer = new THREE.WebGLRenderer( { canvas: canvas, antialias: true } );

    // Set the viewport size
    renderer.setSize(canvas.width, canvas.height);

    // Create a new Three.js scene
    scene = new THREE.Scene();

    // Set the background color 
    scene.background = new THREE.Color( 0.2, 0.2, 0.2 );

    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 10;
    scene.add(camera);

    // Add a directional light to show off the objects
    let light = new THREE.DirectionalLight( 0xffffff, 1.0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    light.target.position.set(0,-2,0);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
    scene.add(ambientLight);
}


/* First Button */
//Function that creates a new element in the scene when the user clicks the "Add Element" button
function addElement()
{

    //The texture is loaded locally
    let textureUrl = "../images/ash_uvgrid01.jpg";
    let texture = new THREE.TextureLoader().load(textureUrl);

    //A nex material is created with the loaded texture
    let material = new THREE.MeshPhongMaterial({ map: texture });

    let geometry = null;

    //A random number from 0 to 3 is generated
    geometryNum = Math.floor(Math.random() * 4);
    
    //The geometry is selected according to the random number
    switch(geometryNum){
        case 0:
            // Create a cube geometry
            geometry = new THREE.CubeGeometry(1.25, 1.25, 1.25);
            break;
        case 1:
            // Create an octahedron geometry
            geometry = new THREE.OctahedronBufferGeometry(1, 0);
            break;
        case 2:
            // Create a torus geometry
            geometry = new THREE.TorusGeometry( 0.6, 0.3, 16, 100 );
            break;
        case 3:
            // Create a cylinder geometry
            geometry = new THREE.CylinderGeometry( 0.7, 0.7, 1.25, 32 );
            break;

    }

    //A new element object is created with the geometry and material
    let element = new Element(geometry, material, scene);

    //The element is added to the scene
    element.addElementToScene();

    //The element is added to the arrays of objects and elements
    objects.push(element);
    elements.push(element);

    //The current element is assigned as last element
    lastElement = element;
}


/* Second Button */
//Function that creates a new satellite for the last element when the user clicks the "Add Element" button
function addSatellite()
{

    //The texture is loaded locally
    let textureUrl = "../images/ash_uvgrid01.jpg";
    let texture = new THREE.TextureLoader().load(textureUrl);

    //A nex material is created with the loaded texture
    let material = new THREE.MeshPhongMaterial({ map: texture });

    let geometry = null;

    //A random number from 0 to 3 is generated
    geometryNum = Math.floor(Math.random() * 4);
    
    //The geometry is selected according to the random number
    switch(geometryNum){
        case 0:
            // Create a cube geometry
            geometry = new THREE.CubeGeometry(0.6, 0.6, 0.6);
            break;
        case 1:
            // Create an octahedron geometry
            geometry = new THREE.OctahedronBufferGeometry(0.5, 0);
            break;
        case 2:
            // Create a torus geometry
            geometry = new THREE.TorusGeometry( 0.3, 0.15, 16, 100 );
            break;
        case 3:
            // Create a cylinder geometry
            geometry = new THREE.CylinderGeometry( 0.35, 0.35, 0.6, 32 );
            break;

    }

    //A new satellite object is created with the geometry and material
    let satellite = new Satellite(geometry, material, lastElement);

    //The element is added to the scene
    satellite.addSatelliteToScene();

    //The element is added to the array of objects
    objects.push(satellite);

    //The satellite is assigned as a satellite of the last element
    lastElement.satellites.push(satellite);
}


/* Third Button */
//Function that resets and clears the scene when the user clicks the "Reset" button
function resetScene(){

    //All the objects are removed from the scene
    objects.forEach(object=>{
        scene.remove (object.mesh);
    })

    //All the objects in the array are deleted
    objects.length = 0;

}


class Element{

    constructor(geometry, material, scene){
        this.geometry = geometry;
        this.material = material;
        this.scene = scene;
        //this.isFather = isFather;
        this.satellites = [];
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.pivot = new THREE.Object3D();
        this.mesh.add(this.pivot);
    }

    addElementToScene(){
        
        //The 'x' and 'y' position of the element are generated randomly
        let xPos = Math.random() * 9 - 4;
        let yPos = Math.random() * 7 - 3;

        //The position is set according to the random values
        this.mesh.position.set(xPos,yPos,0);

        //The element is added to the scene
        this.scene.add(this.mesh);
        
        
    }
}

class Satellite{

    constructor(geometry, material, father){
        this.geometry = geometry;
        this.material = material;
        this.father = father;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    addSatelliteToScene(){

        if(this.father==null)
            return
        
        //The distance of the satellite from the father object is randomly calculated
        let distance = Math.random() * 1 + 1.5;

        //The world coordinates of the father object are cloned in a vector 3
        let worldCoordinates = this.father.mesh.position.clone();

        //The world x coordinate is incremented by the distance
        //This is so the satellite always spawns to the right of the father object
        worldCoordinates.x += distance;

        //The world coordinates are transformed to local coordinates according to the father's pivot
        let localCoordinates = this.father.pivot.worldToLocal(worldCoordinates)

        //The position of the satellite is set
        this.mesh.position.set(localCoordinates.x, localCoordinates.y, localCoordinates.z);

        //The satellite is added to the father's pivot object
        this.father.pivot.add(this.mesh);
    }    
}