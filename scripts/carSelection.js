// carSelection.js - Actualizado para nueva estructura
/*
 * Copyright (C) 2023 Moises Núñez
 * Este archivo es parte de The Last Kart.
 * The Last Kart está licenciado bajo la GNU Affero General Public License v3.0.
 */

export function showCarSelection() {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Mostrar pantalla de selección de coches
    const carSelectionScreen = document.getElementById('car-selection-screen');
    carSelectionScreen.classList.add('active');
    
    // Resetear selección previa
    document.querySelectorAll('.car-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Deshabilitar botón de confirmación hasta que se seleccione un coche
    const confirmButton = document.getElementById('confirm-car-button');
    if (confirmButton) {
        confirmButton.disabled = true;
    }
    
    // Opcional: resetear opacidad para transiciones suaves
    setTimeout(() => {
        carSelectionScreen.style.opacity = '1';
    }, 50);
}

// Función auxiliar para manejar la selección de coche (opcional)
export function handleCarSelection(selectedColor) {
    // Esta función puede ser llamada desde main.js
    // para mantener la lógica centralizada
    
    // Remover selección previa
    document.querySelectorAll('.car-option').forEach(option => {
        option.classList.remove('selected');
    });
    
    // Seleccionar nuevo coche
    const selectedOption = document.querySelector(`[data-color="${selectedColor}"]`);
    if (selectedOption) {
        selectedOption.classList.add('selected');
        
        // Habilitar botón de confirmación
        const confirmButton = document.getElementById('confirm-car-button');
        if (confirmButton) {
            confirmButton.disabled = false;
        }
        
        return true;
    }
    
    return false;
}
