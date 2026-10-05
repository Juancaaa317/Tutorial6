/* eslint-disable no-undef, no-unused-vars */

//DECLARACIONES

// Variable donde se almacena el lienzo de p5
let canvas;
// Variable que almacena el alto del lienzo
let canvasHeight;
// Variable que almacena el ancho del lienzo
let canvasWidth;

// URL de la imagen local (la del tutorial)
const URL_IMAGEN = "img/ASM - Tutorial 6 - Imagen.jpg";
// RETO 3: URL de una imagen de otra Web (debe permitir CORS, picsum lo permite)
// Captura de Big Buck Bunny (Frank, Rinky y Gimera) en Wikimedia Commons.
// © Blender Foundation | www.bigbuckbunny.org (licencia CC BY)
const URL_IMAGEN_WEB =
  "https://upload.wikimedia.org/wikipedia/commons/2/2b/Big.Buck.Bunny.-.Frank.Rinky.Gimera.png";

// Tamaño con el que se pinta cada imagen
const ANCHO_IMAGEN = 384;
const ALTO_IMAGEN = 579;
// RETO 2: espacio entre las dos imágenes
const SEPARACION = 20;
// RETO 1: píxeles que se mueve la imagen por cada pulsación
const PASO = 10;

// Imágenes originales (sin filtros)
let imagenConejo;
let imagenWeb;

// Imágenes que realmente se pintan (copias a las que se les aplica el filtro)
let imagenIzquierda;
let imagenDerecha;

// RETO 1: posición actual de la imagen (la pareja se mueve junta)
let posX = 0;
let posY = 0;

// FUNCIÓN DE PRECARGA DE LOS RECURSOS
function preload() {
  imagenConejo = loadImage(URL_IMAGEN);
  // Si la imagen de la Web falla, se usa la del conejo para que no se rompa
  imagenWeb = loadImage(URL_IMAGEN_WEB, undefined, function () {
    console.warn("No se pudo cargar la imagen de la Web, se usa la local");
    imagenWeb = imagenConejo;
  });
}

// FUNCIÓN DE CONFIGURACIÓN
function setup() {
  canvasHeight = windowHeight - 155;
  canvasWidth = windowWidth;
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas-container");
  // Al inicio se muestran las imágenes sin filtro
  imagenIzquierda = imagenConejo;
  imagenDerecha = imagenWeb;
  // Solo se redibuja cuando el usuario presiona una tecla
  noLoop();
}

// FUNCIÓN DONDE SE PROGRAMA LA FUNCIONALIDAD
function draw() {
  // Limpia el lienzo para que no queden "rastros" al mover las imágenes
  background(255);
  // RETO 2: dos imágenes, una al lado de la otra
  image(imagenIzquierda, posX, posY, ANCHO_IMAGEN, ALTO_IMAGEN);
  // El alto se calcula según la proporción de la imagen para no deformarla
  let altoDerecha = (imagenDerecha.height * ANCHO_IMAGEN) / imagenDerecha.width;
  image(
    imagenDerecha,
    posX + ANCHO_IMAGEN + SEPARACION,
    posY,
    ANCHO_IMAGEN,
    altoDerecha
  );
}

// Devuelve una copia de la imagen con el filtro indicado (0 a 7)
function aplicarFiltro(original, filtro) {
  // get() crea una copia; así el original nunca se modifica
  let copia = original.get();
  switch (filtro) {
    case 0:
      copia.filter(THRESHOLD);
      break;
    case 1:
      copia.filter(GRAY);
      break;
    case 2:
      copia.filter(OPAQUE);
      break;
    case 3:
      copia.filter(INVERT);
      break;
    case 4:
      copia.filter(POSTERIZE, 3);
      break;
    case 5:
      copia.filter(DILATE);
      break;
    case 6:
      copia.filter(BLUR, 3);
      break;
    default:
      copia.filter(ERODE, 3);
      break;
  }
  return copia;
}

// FUNCIÓN QUE SE LLAMA AL PRESIONAR UNA TECLA
// (keyPressed detecta las flechas; keyTyped no lo hace)
function keyPressed() {
  // RETO 1: mover con las flechas
  if (keyCode === LEFT_ARROW) {
    posX -= PASO;
  } else if (keyCode === RIGHT_ARROW) {
    posX += PASO;
  } else if (keyCode === UP_ARROW) {
    posY -= PASO;
  } else if (keyCode === DOWN_ARROW) {
    posY += PASO;
  }
  // RETO 4: filtro diferente para cada imagen al pulsar "f"
  else if (key === "f" || key === "F") {
    let filtroIzquierda = Math.floor(random(8));
    let filtroDerecha = Math.floor(random(8));
    // Se asegura de que los filtros sean distintos
    while (filtroDerecha === filtroIzquierda) {
      filtroDerecha = Math.floor(random(8));
    }
    imagenIzquierda = aplicarFiltro(imagenConejo, filtroIzquierda);
    imagenDerecha = aplicarFiltro(imagenWeb, filtroDerecha);
  } else {
    return; // otra tecla: no hace nada
  }
  redraw();
  // Evita que las flechas hagan scroll en la página
  return false;
}

// CAMBIA EL TAMAÑO DEL LIENZO SI LA VENTANA DEL NAVEGADOR WEB CAMBIA DE TAMAÑO
function windowResized() {
  canvasHeight = windowHeight - 155;
  canvasWidth = windowWidth;
  resizeCanvas(canvasWidth, canvasHeight);
  redraw();
}