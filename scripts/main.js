import { showMenu } from './menu.js';
import { showCarSelection } from './carSelection.js';
import { fadeIn, fadeOut } from './transitions.js';

document.addEventListener('DOMContentLoaded', () => {
    showMenu();
});

document.getElementById('start-button').addEventListener('click', () => {
    alert('Inicio del juego');
});

document.getElementById('car-select-button').addEventListener('click', () => {
    fadeOut(document.getElementById('menu-screen'), () => {
        showCarSelection();
    });
});

document.getElementById('options-button').addEventListener('click', () => {
    alert('Opciones');
});
