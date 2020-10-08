# Graficas Computacionales Tarea 1
## Isabel Maqueda Rolon 
  ## A01652906

  ## Instrucciones 
Utilizando WebGL dibuja lo siguiente:

* Una pirámide pentagonal en 3D. La pirámide tiene que rotar al rededor del eje [0.1, 1.0, 0.2].
* Un dodecaedro (Enlaces a un sitio externo.). Tiene que rotar al rededor de [-0.4, 1.0, 0.1].
* Un octaedro (Enlaces a un sitio externo.). Tiene que rotar al rededor del eje [0, 1, 0], y tiene que estarse moviendo de arriba a abajo en la escena: se mueve hacia arriba hasta que llega al límite del canvas, y después se mueve hacia abajo hasta que llegue a la parte inferior del canvas, y se repite.

## Pirámide Pentagonal

Para la piramide pentagonal lo primero que se hace es el pentagono. Usango las siguientes paginas y formulas se saco las coordenadas del pentagono. Para hacerla piramide solo se elige un punto para hacer la altura. La pirámide esta hecha de 3 triangulos para el pentagono, y cada lado de la piramide es un triangulo más.
### Recursos:
* https://mathworld.wolfram.com/RegularPentagon.html
*  https://math.stackexchange.com/questions/1990504/how-to-find-the-coordinates-of-the-vertices-of-a-pentagon-centered-at-the-origin
* https://www.wolframalpha.com/ 


## Dodecaedro
Para el dodecaedro se saco la informacion de los vertices y puntos con sus coordenadas de la siguiente pagina: 
https://es.qwe.wiki/wiki/Regular_dodecahedron 

## Octaedro
Para el octaedro se separo la figura, que separada son dos piramides opuestas en el plano de y. Para eso se saco un cuadrado que este sobre el plano xz con longitud de 1. Y luego se saco las dos puntas opuestas en y. Cada piramide esta hecha de 4 caras, dando el total de caras en 8. 

## Librerias Usadas
Usamos MAT4 y JQUERY

## Recurso adicional

Para ayudar con la escala de colores en RGB se uso la siguiente plantilla: https://tug.org/pracjourn/2007-4/walden/color.pdf