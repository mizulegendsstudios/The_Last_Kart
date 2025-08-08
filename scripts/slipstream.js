// slipstream.js

// Función para verificar y aplicar el efecto de rebufo
export function applySlipstreamEffect(cars) {
  cars.forEach((car, index) => {
    cars.forEach((otherCar, otherIndex) => {
      if (index !== otherIndex) {
        // Calcular la distancia entre los dos coches
        const distance = Math.sqrt(
          (car.position.x - otherCar.position.x) ** 2 +
          (car.position.y - otherCar.position.y) ** 2
        );

        // Verificar si el coche está dentro del rango de rebufo
        if (distance < 50) {
          // Aplicar efecto de rebufo
          car.speed = Math.min(car.speed * 1.01, car.maxSpeed);
        }
      }
    });
  });
}
