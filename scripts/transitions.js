/*
    Copyright (C) 2023 Moises Núñez
    Este archivo es parte de The Last Kart.
    The Last Kart está licenciado bajo la GNU Affero General Public License v3.0. 
*/

export function fadeOut(element, callback) {
    element.style.opacity = '0';
    setTimeout(() => {
        element.classList.remove('active');
        if (callback) {
            setTimeout(callback, 500);
        }
    }, 500);
}

export function fadeIn(element) {
    element.style.opacity = '1';
    element.classList.add('active');
}
