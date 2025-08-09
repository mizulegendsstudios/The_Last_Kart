/*<!--

        Copyright (C) 2025 Moises Núñez

        Este archivo es parte de The Last Kart.

        The Last Kart está licenciado bajo la GNU Affero General Public License v3.0.

    -->*/
// input.js

export const keys = {};

window.addEventListener('keydown', e => {
  keys[e.key.toLowerCase()] = true;
});

window.addEventListener('keyup', e => {
  keys[e.key.toLowerCase()] = false;
});

export function getKeyboardInput() {
  return {
    player1: {
      up: keys['w'] || false,
      down: keys['s'] || false,
      left: keys['a'] || false,
      right: keys['d'] || false,
      brake: keys[' '] || false,
    },
    player2: {
      up: keys['arrowup'] || false,
      down: keys['arrowdown'] || false,
      left: keys['arrowleft'] || false,
      right: keys['arrowright'] || false,
      brake: false,
    }
  };
}

let gamepadIndex = null;

window.addEventListener("gamepadconnected", (e) => {
  gamepadIndex = e.gamepad.index;
});

window.addEventListener("gamepaddisconnected", (e) => {
  if (gamepadIndex === e.gamepad.index) gamepadIndex = null;
});

export function getGamepadInput(){
  if(gamepadIndex === null) return null;
  const gp = navigator.getGamepads()[gamepadIndex];
  if(!gp) return null;
  const threshold = 0.2;
  return {
    up: gp.axes[1] < -threshold,
    down: gp.axes[1] > threshold,
    left: gp.axes[0] < -threshold,
    right: gp.axes[0] > threshold,
    brake: gp.buttons[0].pressed
  };
}
