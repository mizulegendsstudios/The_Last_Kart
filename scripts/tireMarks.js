// tireMarks.js

/*
    Copyright (C) 2023 Moises Núñez
    Este archivo es parte de The Last Kart.
    The Last Kart está licenciado bajo la GNU Affero General Public License v3.0. 
*/


// Almacenar las marcas de neumáticos
const tireMarks = [];

// Clase para representar una marca de neumático
export class TireMark {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.createdAt = Date.now();
  }
}

// Función para añadir una marca de neumático
export function addTireMark(x, y) {
  tireMarks.push(new TireMark(x, y));
}

// Función para verificar y aplicar el efecto de las marcas de neumáticos
export function checkTireMarks(car) {
  const now = Date.now();
  tireMarks.forEach((mark, index) => {
    // Eliminar marcas que han existido por más de 5 segundos
    if (now - mark.createdAt > 5000) {
      tireMarks.splice(index, 1);
      return;
    }

    // Verificar si el coche está sobre una marca de neumático
    const distance = Math.sqrt((car.position.x - mark.x) ** 2 + (car.position.y - mark.y) ** 2);
    if (distance < 10) { // Umbral de distancia para pisar una marca
      car.speed *= 1.1; // Aumentar la velocidad en un 10%
      tireMarks.splice(index, 1); // Eliminar la marca después de pisarla
    }
  });
}

// Función para limpiar marcas antiguas
export function cleanupOldTireMarks() {
  const now = Date.now();
  for (let i = tireMarks.length - 1; i >= 0; i--) {
    if (now - tireMarks[i].createdAt > 5000) {
      tireMarks.splice(i, 1);
    }
  }
}
