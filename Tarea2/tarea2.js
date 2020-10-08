let renderer = null, 
scene = null, 
camera = null,
sphereGroup = null;
sun = null;
pivotSun = null //3D Object for the sun
controls = null;

let celestial = []; //Array for all the elements



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

    //animate the sun
    sun.rotation.y += (angle/4);

    //animate the sun pivot point so that all elements that have that as a pivot point rotate 
    pivotSun.rotation.y += (angle/4);

    //Animate all the elements in the scene
    celestial.forEach(element =>{

        //the rotation of the planets
        element.mesh.rotation.y += (angle);
        //the rotation of the moons
        element.pivot.rotation.y += (angle/2);

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

    //create the background texture
    let backgroundUrl = "imagenes/2k_stars_milky_way.jpg";
    let texture = new THREE.TextureLoader().load(backgroundUrl);

    // Set the background texture
    scene.background = texture;


    // Add  a camera so we can view the scene
    camera = new THREE.PerspectiveCamera( 45, canvas.width / canvas.height, 1, 4000 );
    camera.position.z = 110;
    camera.position.y = 2;
    scene.add(camera);

    // Add a directional light to show off the objects
    let light = new THREE.PointLight( 0xffffff, 1.25, 0);

    // Position the light out from the scene, pointing at the origin
    light.position.set(-.5, .2, 1);
    scene.add(light);

    // This light globally illuminates all objects in the scene equally.
    // Cannot cast shadows
    let ambientLight = new THREE.AmbientLight(0xffccaa, 0.5);
    scene.add(ambientLight);

    //orbit control
    controls = new THREE.OrbitControls( camera, renderer.domElement );


    //create solar system
    createSolarSystem();
}

//this function calls the functions to create the solar system
function createSolarSystem(){

    //this function creates the sun
    addSun();
    //this function creates the orbits
    cretaeOrbits();
    //this function creates the planet Mercury
    addMercury();
    //this function creates the planet Venus
    addVenus();
    //this function creates the planet Earth
    addEarth();
    //this function creates the planet Mars
    addMars();
    //this function creates the asteroid rings
    addAsteroid();
    //this function creates the planet jupiter
    addJupiter();
    //this function creates the planet Saturn
    addSaturn();
    //this function creates the planet Uranus
    addUranus();
    //this function creates the planet Neptune
    addNeptune();
    //this function creates the planet Pluto
    addPluto();
    

}

//this function creates the sun
function addSun(){

    //the texture url
    let textureUrl = "imagenes/sunmap.jpg";
    //cretaes the texture
    let texture = new THREE.TextureLoader().load(textureUrl);

    //A new material is created with the loaded texture
    // in a  basic material the light does not matter, as the light doen not interact with it 
    let material = new THREE.MeshBasicMaterial({ map: texture });

    //creates the sphere geometry
    let geometry = new THREE.SphereGeometry(4,32,32);

    //creates the mesh by adding the material and the geometry
    sun = new THREE.Mesh(geometry, material);

    //sets the sun as the center
    sun.position.set(0,0,0);

    //adds the sun to the scene
    scene.add(sun);

    //creates a pivot object for the sun 
    pivotSun = new THREE.Object3D();
    //sets the pivot at the center, same as the sun
    pivotSun.position.set(0,0,0);

    //adds the pivot element to the scene
    scene.add(pivotSun);
    
}

//creates the orbits of the planets, the position of the orbits are calculated by sight 
function cretaeOrbits()
{

    //an array that has the internal and external radios of the orbits
    let orbits = [{r1:6,r2:6.1},{r1:9,r2:9.1},{r1:12,r2:12.1},{r1:15,r2:15.1},{r1:18.5,r2:18.55},{r1:23,r2:23.1},{r1:28,r2:28.1},{r1:34,r2:34.1},{r1:41,r2:41.1},{r1:49,r2:49.1}];



    orbits.forEach(element => {
        //for each element of the orbit you create a material
        let material = new THREE.MeshPhongMaterial({color:"white", side: THREE.DoubleSide});

        //a ring geometry 
        let geometry = new THREE.RingGeometry(element.r1 , element.r2, 64 );

        //you rotate the ring so it is horizontal
        geometry.rotateX(-Math.PI * 0.5);
        //creates the mesh 
        orbit = new THREE.Mesh(geometry, material);
        //puts the ring at the center
        orbit.position.set(0,0,0);
        //adds the orbit to the scene 
        scene.add(orbit);

    })

}

function addMercury(){
    
    //the texture path
    let textureUrl = "imagenes/mercurymap.jpg";
    //the bump path
    let bumpUrl = "imagenes/mercurybump.jpg";

    //creates the texture and the bump as three js objects
    let texture = new THREE.TextureLoader().load(textureUrl);
    let bump = new THREE.TextureLoader().load(bumpUrl);

    //creates the material by joining the texture and the bump
    material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.04});

    //creates the geometry of the object
    let geometry = new THREE.SphereGeometry(0.5,32,32);

    //creates an object with the material, geometry and the sun pivot as the father
    let mercury = new Celestial(geometry, material, pivotSun);

    //adds the planet to the scene with the pivot object as the center
    mercury.addToScene(0,0,6);
    //pushes the object created to the array of elements
    celestial.push(mercury);
}


function addVenus(){
     //the texture path
     let textureUrl = "imagenes/venusmap.jpg";
     //the bump path
     let bumpUrl = "imagenes/venusbump.jpg";
 
     //creates the texture and the bump as three js objects
     let texture = new THREE.TextureLoader().load(textureUrl);
     let bump = new THREE.TextureLoader().load(bumpUrl);
 
     //creates the material by joining the texture and the bump
     material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.04});
 
     //creates the geometry of the object
     let geometry = new THREE.SphereGeometry(0.7,32,32);
 
     //creates an object with the material, geometry and the sun pivot as the father
     let venus = new Celestial(geometry, material, pivotSun);
 
     //adds the planet to the scene with the pivot object as the center
     venus.addToScene(9,0,0);
     //pushes the object created to the array of elements
     celestial.push(venus);
}
function addEarth(){

     //the texture path
    let textureUrl = "imagenes/earthmap1k.jpg";
    //the bump path
    let bumpUrl = "imagenes/earthbump1k.jpg";

    //the  normal path
    let normalUrl = "imagenes/2k_earth_normal_map.jpg";


    //creates the texture, the bump and the normal as three js objects
    let texture = new THREE.TextureLoader().load(textureUrl);
    let bump = new THREE.TextureLoader().load(bumpUrl);
    let normal =  new THREE.TextureLoader().load(normalUrl);

    //creates the material by joining the texture, the bump and the normal
    material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.04, normalMap: normal});

    //creates the geometry of the object
    let geometry = new THREE.SphereGeometry(1,32,32);

    //creates an object with the material, geometry and the sun pivot as the father
    let earth = new Celestial(geometry, material, pivotSun);

    //adds the planet to the scene with the pivot object as the center
    earth.addToScene(0,0,-12);
    //pushes the object created to the array of elements
    celestial.push(earth);


    addMoon(0.3,1.3,1,earth);
}

function addMars(){
     //the texture path
     let textureUrl = "imagenes/mars_1k_color.jpg";
     //the bump path
     let bumpUrl = "imagenes/marsbump1k.jpg";

 
     //creates the texture, the bump  as three js objects
     let texture = new THREE.TextureLoader().load(textureUrl);
     let bump = new THREE.TextureLoader().load(bumpUrl);
 
     //creates the material by joining the texture, the bump and the normal
     material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.04});
 
     //creates the geometry of the object
     let geometry = new THREE.SphereGeometry(1.3,32,32);
 
     //creates an object with the material, geometry and the sun pivot as the father
     let mars = new Celestial(geometry, material, pivotSun);
 
     //adds the planet to the scene with the pivot object as the center
     mars.addToScene(-15,0,0);
     //pushes the object created to the array of elements
     celestial.push(mars);
 
     //adds a moon to mars, with the size,x position, z position and the father object
     addMoon(0.3,2 , 0,mars);
     addMoon(0.3,0 , 2,mars);

}

function addAsteroid(){

     //the texture path
     let textureUrl = "imagenes/moonmap1k.jpg";
     //the bump path
     let bumpUrl = "imagenes/moonbump1k.jpg";

     //creates the texture and the bump as three js objects
     let texture = new THREE.TextureLoader().load(textureUrl);
     let bump = new THREE.TextureLoader().load(bumpUrl);

     //creates the material by joining the texture and the bump
     material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.04});

     //creates the geometry of the object
     let geometry = new THREE.SphereGeometry(0.1,32,32);


     for(let i = 0; i < 1000; i++){

        // to find a point in a circle you need the radious and the angle, for both we create a random number from 17.5 to 19.5 and 0 to 360
        let r = Math.random() * (19.5 - 17.5) + 17.5;
        let theta = Math.random() * 360; 

        //console.log(r,theta);

        //creates a random variable for the y 
        let y = Math.random() * (.5 - -.5) + -.5;

        //for the x and z position we use the following formula x = rsintheta and z = rcostheta
        let x = r * Math.sin(theta);
        let z = r * Math.cos(theta);
        
        //creates the object 
        let asteroid = new Celestial(geometry, material, pivotSun);
        //adds the planet to the scene with the pivot object as the center
        asteroid.addToScene(x,y,z);
        //pushes the object created to the array of elements
        celestial.push(asteroid);

     }

}


function addJupiter(){
     //the texture path
     let textureUrl = "imagenes/jupiter2_1k.jpg";

     //creates the texture  as three js objects
     let texture = new THREE.TextureLoader().load(textureUrl);
 
     //creates the material by joining the texture, the bump and the normal
     material = new THREE.MeshPhongMaterial({ map: texture});
 
     //creates the geometry of the object
     let geometry = new THREE.SphereGeometry(1.5,32,32);
 
     //creates an object with the material, geometry and the sun pivot as the father
     let jupiter = new Celestial(geometry, material, pivotSun);
 
     //adds the planet to the scene with the pivot object as the center
     jupiter.addToScene(0,0,23);
     //pushes the object created to the array of elements
     celestial.push(jupiter);
 


     let theta = 0;
     //according to math, to get a point in a circle you need the angle and the radious, the angle starts at 0 with the radious of 2.5
     for(let i = 0; i <= 12 ; i++)
     { 
        let x = 2.5 * Math.sin(theta);
        let z = 2.5 * Math.cos(theta);

        //creates the moon
        addMoon(0.3, x, z, jupiter);
        //changes the angle using radians 
        theta += .523;

     }
}



function addSaturn(){
    //the texture path
    let textureUrl = "imagenes/saturnmap.jpg";

    //creates the texture  as three js objects
    let texture = new THREE.TextureLoader().load(textureUrl);

    //creates the material by joining the texture, the bump and the normal
    material = new THREE.MeshPhongMaterial({ map: texture});

    //creates the geometry of the object
    let geometry = new THREE.SphereGeometry(1.8,32,32);

    //creates an object with the material, geometry and the sun pivot as the father
    let saturn = new Celestial(geometry, material, pivotSun);

    //adds the planet to the scene with the pivot object as the center
    saturn.addToScene(28,0,0);

    //pushes the object created to the array of elements
    celestial.push(saturn);

    //adds the ring arround saturn
    function addRingSaturn(){

        //the texture path
        let textureUrl = "imagenes/saturnringcolor.jpg";

        //creates the texture  as three js objects
        let texture = new THREE.TextureLoader().load(textureUrl);

        //for each element of the orbit you create a material
        let material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});

        //a ring geometry 
        let geometry = new THREE.RingGeometry(2.5,3, 64);

        //you rotate the ring so it is horizontal
        geometry.rotateX(-Math.PI * 0.5);
        //creates the mesh 
        let ring = new Celestial(geometry, material, saturn.pivot);
        //puts the ring at the center
        ring.addToScene(0,0,0);
        //adds the obect to the array
        celestial.push(ring);
        


    }

    
    addRingSaturn();

}

function addUranus(){
    //the texture path
    let textureUrl = "imagenes/uranusmap.jpg";

    //creates the texture  as three js objects
    let texture = new THREE.TextureLoader().load(textureUrl);

    //creates the material by joining the texture, the bump and the normal
    material = new THREE.MeshPhongMaterial({ map: texture});

    //creates the geometry of the object
    let geometry = new THREE.SphereGeometry(2,32,32);

    //creates an object with the material, geometry and the sun pivot as the father
    let uranus = new Celestial(geometry, material, pivotSun);

    //adds the planet to the scene with the pivot object as the center
    uranus.addToScene(0,0,-34);

    //pushes the object created to the array of elements
    celestial.push(uranus);

    //adds the ring arround saturn
    function addRingUranus(){

        //the texture path
        let textureUrl = "imagenes/uranusringcolour.jpg";

        //creates the texture  as three js objects
        let texture = new THREE.TextureLoader().load(textureUrl);

        //for each element of the orbit you create a material
        let material = new THREE.MeshPhongMaterial({map: texture, side: THREE.DoubleSide});

        //a ring geometry 
        let geometry = new THREE.RingGeometry(2.8,3.1, 64);

        //you rotate the ring so it is horizontal
        geometry.rotateX(-Math.PI * 0.5);
        //creates the mesh 
        let ring = new Celestial(geometry, material, uranus.pivot);
        //puts the ring at the center
        ring.addToScene(0,0,0);
        //adds the object to the array
        celestial.push(ring);
        


    }

    addRingUranus();

}

function addNeptune(){
     //the texture path
     let textureUrl = "imagenes/neptunemap.jpg";

     //creates the texture  as three js objects
     let texture = new THREE.TextureLoader().load(textureUrl);
 
     //creates the material by joining the texture, the bump and the normal
     material = new THREE.MeshPhongMaterial({ map: texture});
 
     //creates the geometry of the object
     let geometry = new THREE.SphereGeometry(2.2,32,32);
 
     //creates an object with the material, geometry and the sun pivot as the father
     let neptune = new Celestial(geometry, material, pivotSun);
 
     //adds the planet to the scene with the pivot object as the center
     neptune.addToScene(-41,0,0);
     //pushes the object created to the array of elements
     celestial.push(neptune);
 
//according to math, to get a point in a circle you need the angle and the radious, the angle starts at 0 with the radious of 3.5
    let theta = 0;
     for(let i = 0; i <= 15 ; i++)
     {
    
        let x = 3.5 * Math.sin(theta);
        let z = 3.5 * Math.cos(theta);

        //creates the moon
        addMoon(0.4, x, z, neptune);
        //modifies the angle using radians 
        theta += 0.418;

     }
}

function addPluto(){

         //the texture path
         let textureUrl = "imagenes/plutomap1k.jpg";
         // the bump path
         let bumpUrl = "imagenes/plutobump1k.jpg";

         //creates the texture  as three js objects
         let texture = new THREE.TextureLoader().load(textureUrl);
         let bump = new THREE.TextureLoader().load(bumpUrl);
     
         //creates the material by joining the texture, the bump and the normal
         material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.04});
     
         //creates the geometry of the object
         let geometry = new THREE.SphereGeometry(1,32,32);
     
         //creates an object with the material, geometry and the sun pivot as the father
         let pluto = new Celestial(geometry, material, pivotSun);
     
         //adds the planet to the scene with the pivot object as the center
         pluto.addToScene(0,0,49);
         //pushes the object created to the array of elements
         celestial.push(pluto);
     
        //according to math, to get a point in a circle you need the angle and the radious, the angle starts at 0 with the radious of 2.5
         let theta = 0;
    
         for(let i = 0; i <= 3 ; i++)
         {
            
            let x = 2 * Math.sin(theta);
            let z = 2 * Math.cos(theta);
            //adds the moon
            addMoon(0.1, x, z, pluto);
            //modifies the angle suing radians 
            theta += 30;
    
         }
    
}

//adds the moon, recieves as parameter the size, the x and z position and the father pivot
function addMoon(size, xPos, zPos, father){
    //the texture path
   let textureUrl = "imagenes/moonmap1k.jpg";
   //the bump path
   let bumpUrl = "imagenes/moonbump1k.jpg";

   //creates the texture and the bump as three js objects
   let texture = new THREE.TextureLoader().load(textureUrl);
   let bump = new THREE.TextureLoader().load(bumpUrl);

   //creates the material by joining the texture and the bump
   material = new THREE.MeshPhongMaterial({ map: texture, bumpMap: bump, bumpScale: 0.04});

   //creates the geometry of the object
   let geometry = new THREE.SphereGeometry(size,32,32);
   
   //creates an object with the material, geometry and the sun pivot as the father
   let moon = new Celestial(geometry, material, father.pivot);

   //adds the planet to the scene with the pivot object as the center
   moon.addToScene(xPos,0,zPos);
   //pushes the object created to the array of elements
   celestial.push(moon);
}


//the class sreates an object, each planet is an object, and each moon is another object with the planet as the parent
class Celestial{
    constructor(geometry, material, father){
        this.scene = scene;
        this.geometry = geometry;
        this.material = material;
        this.father = father;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.pivot = new THREE.Object3D();
        this.mesh.add(this.pivot);
    }

    //Function that adds this element to the scene
    addToScene(xPos, yPos, zPos){

        //The position is set according to the position of the planet 
        this.mesh.position.set(xPos,yPos,zPos);

        //The element is added to the scene. It is added to the father object
        this.father.add(this.mesh); 

        //The position for the pivot is set the same as the planet
        this.pivot.position.set(xPos,yPos,zPos);  

        this.father.add(this.pivot);
    }
}

