// scripts/weather.js

/*

    Copyright (C) 2023 Moises Núñez
    Este archivo es parte de The Last Kart.
    The Last Kart está licenciado bajo la GNU Affero General Public License v3.0. */

export class Weather {
  constructor() {
    this.types = ['sun', 'rain', 'night', 'snow'];
    this.current = 'sun';
  }

  randomize() {
    this.current = this.types[Math.floor(Math.random() * this.types.length)];
  }

  applyTo(car) {
    if (this.current === 'rain') car.speed *= 0.8;
    if (this.current === 'snow') car.speed *= 0.7;
  }
}
