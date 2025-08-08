// cars.js

/**
 * Clase Car que representa un coche en un juego.
 */
export class Car {
  /**
   * Crea una instancia de Car.
   * @param {number} x - La posición inicial en el eje x.
   * @param {number} y - La posición inicial en el eje y.
   * @param {string} color - El color del coche.
   * @param {string} model - El modelo del coche.
   */
  constructor(x, y, color, model) {
    this.position = { x, y };
    this.speed = 0;
    this.maxSpeed = 5;
    this.color = color;
    this.model = model;
    this.direction = 0; // Dirección en radianes
    this.turnSpeed = 0.05; // Velocidad de giro
    this.turningInertia = 0; // Inercia al girar
    this.canvasWidth = 800; // Ancho del canvas
    this.canvasHeight = 600; // Alto del canvas
  }

  /**
   * Acelera el coche.
   */
  accelerate() {
    this.speed = Math.min(this.speed + 0.1, this.maxSpeed);
  }

  /**
   * Desacelera el coche.
   */
  decelerate() {
    this.speed = Math.max(this.speed - 0.1, 0);
  }

  /**
   * Gira el coche a la izquierda.
   */
  turnLeft() {
    this.direction -= this.turnSpeed;
    this.turningInertia = -0.1;
  }

  /**
   * Gira el coche a la derecha.
   */
  turnRight() {
    this.direction += this.turnSpeed;
    this.turningInertia = 0.1;
  }

  /**
   * Actualiza la posición del coche basado en su velocidad y dirección.
   */
  updatePosition() {
    // Aplicar inercia al giro
    this.direction += this.turningInertia;
    this.turningInertia *= 0.9; // Reducir la inercia gradualmente

    // Calcular el cambio en x e y basado en la dirección y velocidad
    this.position.x += Math.cos(this.direction) * this.speed;
    this.position.y += Math.sin(this.direction) * this.speed;

    // Colisión básica con los bordes del canvas
    if (this.position.x < 0) {
      this.position.x = 0;
      this.speed = 0;
    }
    if (this.position.x > this.canvasWidth) {
      this.position.x = this.canvasWidth;
      this.speed = 0;
    }
    if (this.position.y < 0) {
      this.position.y = 0;
      this.speed = 0;
    }
    if (this.position.y > this.canvasHeight) {
      this.position.y = this.canvasHeight;
      this.speed = 0;
    }
  }

  /**
   * Dibuja el coche en el contexto del canvas.
   * @param {CanvasRenderingContext2D} ctx - El contexto de renderizado del canvas.
   */
  draw(ctx) {
    ctx.save();
    ctx.translate(this.position.x, this.position.y);
    ctx.rotate(this.direction);
    ctx.fillStyle = this.color;
    ctx.fillRect(-16, -8, 32, 16); // Dibuja un rectángulo simple para representar el coche
    ctx.restore();
  }
}
