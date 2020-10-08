# Graficas Computacionales Tarea 2
## Isabel Maqueda Rolon 
  ## A01652906

  ## Instrucciones 
Utilizando ThreeJS dibuja lo siguiente:

* Crea 8 planetas (y plutón), con sus respectivas lunas, el sun, y el cinturón de asteroides. 
* Los astros se pueden crear como esferas.
* Los planetas y lunas tienen que tener su propia rotación.
* Las lunas tienen que rotar al rededor de los planetas, y los planetas tienen que rotar al rededor del sol.
* Dibuja las orbitas de cada planeta
* Cada elemento tiene que tener su propio materia, con texturas, normales, y bump maps (de existir).
* Investiga cómo funciona el orbit controller de three.js e integralo en la escena.


## Celestial Bodies 
Se creo una clase llamada Celestial bodies, que recibe la geometria, el material y el pivot padre en el constructor, de ahi se crea un mesh y un pivot del objeto. La clase tiene una funcion llamada addToScene que recibe las coordenadas x,y,z del objeto y lo pone en la escena. 

## Orbitas
Para las orbitas se uso un RingGeometry, que es parte de ThreeJs, en donde se se lio un color y el radio inicial y final para poder crear las orbitas. El centro usado fue el punto pivot del sol.

## Lunas
Para las lunas se creo una funcion que recive el tamaño, las posiciones x y z respecto al padre y el objeto padre. De ahi se crea el material y la geometria para poder mandar llamar a la clase de Celestial Bodies pasando como el objeto padre al planeta al que pertence. 

## Asteroides
Para los asteroides se saco un rango en donde pudieran estar los asteroides, usando la formula para sacar un punto en la circunferencia de un circulo.