/*
    Copyright (C) 2023 Moises Núñez
    Este archivo es parte de The Last Kart.
    The Last Kart está licenciado bajo la GNU Affero General Public License v3.0.
*/

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
