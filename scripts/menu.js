// menu.js - Actualizado para nueva estructura
/*
 * Copyright (C) 2023 Moises Núñez
 * Este archivo es parte de The Last Kart.
 * The Last Kart está licenciado bajo la GNU Affero General Public License v3.0.
 */

export function showMenu() {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar pantalla de menú
    const menuScreen = document.getElementById('menu-screen');
    menuScreen.classList.add('active');
    
    // Opcional: resetear opacidad para transiciones suaves
    setTimeout(() => {
        menuScreen.style.opacity = '1';
    }, 50);
}
