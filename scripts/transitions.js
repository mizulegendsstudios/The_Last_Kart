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
