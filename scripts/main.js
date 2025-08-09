/*
 * Copyright (C) 2023 Moises Núñez
 * Este archivo es parte de The Last Kart.
 * The Last Kart está licenciado bajo la GNU Affero General Public License v3.0.
 */

import { showMenu } from 'https://mizulegendsstudios.github.io/The_Last_Kart/scripts/menu.js';
import { showCarSelection } from 'https://mizulegendsstudios.github.io/The_Last_Kart/scripts//carSelection.js';
import { fadeIn, fadeOut } from 'https://mizulegendsstudios.github.io/The_Last_Kart/scripts//transitions.js';
import { Car, updateCars } from 'https://mizulegendsstudios.github.io/The_Last_Kart/scripts//cars.js';

class GameEngine {
    constructor() {
        // Estado del juego
        this.gameState = 'menu'; // 'menu', 'carSelection', 'game'
        this.selectedCarColor = null;
        this.isRunning = false;
        this.isPaused = false;
        
        // Canvas y contexto (solo inicializar si existe)
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
        
        // Variables de rendimiento
        this.lastTime = 0;
        this.fps = 0;
        this.frameCount = 0;
        this.lastFpsUpdate = 0;
        
        // Variables del juego
        this.score = 0;
        this.currentLap = 1;
        this.totalLaps = 3;
        this.playerCar = null;
        this.cars = [];
        
        // Referencias DOM
        this.elements = {
            score: document.getElementById('score'),
            lap: document.getElementById('lap'),
            speed: document.getElementById('speed'),
            fps: document.getElementById('fps')
        };
        
        // Input handling
        this.keys = {};
        
        // Inicializar
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        if (this.canvas) {
            this.setupCanvas();
        }
        
        // Mostrar menú inicial (usando tu función existente)
        showMenu();
    }
    
    setupCanvas() {
        // Configuración del canvas
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
    }
    
    setupEventListeners() {
        // Botones del menú - manteniendo tu estructura exacta
        document.getElementById('start-button')?.addEventListener('click', () => {
            if (this.selectedCarColor) {
                this.startGame();
            } else {
                this.showCarSelectionScreen();
            }
        });

        document.getElementById('car-select-button')?.addEventListener('click', () => {
            this.showCarSelectionScreen();
        });

        document.getElementById('options-button')?.addEventListener('click', () => {
            alert('Opciones - Próximamente disponible');
        });
        
        // Car selection - mejorado para trabajar con tu estructura
        document.querySelectorAll('.car-option').forEach(option => {
            option.addEventListener('click', (e) => {
                this.selectCar(e.currentTarget.dataset.color);
            });
        });
        
        document.getElementById('confirm-car-button')?.addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('back-to-menu-button')?.addEventListener('click', () => {
            this.showMenuScreen();
        });
        
        // Game controls
        document.getElementById('pause-button')?.addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('reset-button')?.addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('menu-button')?.addEventListener('click', () => {
            this.showMenuScreen();
        });
        
        // Keyboard controls
        document.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
            this.handleKeyDown(e);
        });
        
        document.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Responsive
        window.addEventListener('resize', () => this.handleResize());
    }
    
    // Screen Management - usando tu sistema de transiciones
    showMenuScreen() {
        this.gameState = 'menu';
        this.isRunning = false;
        
        const currentScreen = document.querySelector('.screen.active');
        if (currentScreen) {
            fadeOut(currentScreen, () => {
                showMenu();
            });
        } else {
            showMenu();
        }
    }
    
    showCarSelectionScreen() {
        this.gameState = 'carSelection';
        
        const currentScreen = document.querySelector('.screen.active');
        fadeOut(currentScreen, () => {
            showCarSelection();
        });
    }
    
    showGameScreen() {
        this.gameState = 'game';
        
        const currentScreen = document.querySelector('.screen.active');
        const gameScreen = document.getElementById('game-screen');
        
        fadeOut(currentScreen, () => {
            // Mostrar pantalla de juego
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            gameScreen.classList.add('active');
            fadeIn(gameScreen);
        });
    }
    
    // Car Selection - compatible con tu data-color
    selectCar(color) {
        // Remover selección previa
        document.querySelectorAll('.car-option').forEach(option => {
            option.classList.remove('selected');
        });
        
        // Seleccionar nuevo coche
        const selectedOption = document.querySelector(`[data-color="${color}"]`);
        if (selectedOption) {
            selectedOption.classList.add('selected');
            this.selectedCarColor = color;
            document.getElementById('confirm-car-button').disabled = false;
        }
    }
    
    // Game Initialization
    startGame() {
        if (!this.selectedCarColor) {
            alert('Por favor, selecciona un coche primero');
            return;
        }
        
        this.showGameScreen();
        setTimeout(() => {
            this.initializeGame();
            this.start();
        }, 600); // Esperar a que termine la transición
    }
    
    initializeGame() {
        if (!this.canvas || !this.ctx) {
            console.error('Canvas no encontrado');
            return;
        }
        
        this.score = 0;
        this.currentLap = 1;
        
        // Configuración de colores para coches
        const carColors = {
            red: '#ff4444',
            blue: '#4444ff', 
            green: '#44ff44',
            yellow: '#ffff44'
        };
        
        const carConfigs = {
            red: { maxSpeed: 8, turnSpeed: 0.04 },
            blue: { maxSpeed: 6, turnSpeed: 0.05 },
            green: { maxSpeed: 4, turnSpeed: 0.07 },
            yellow: { maxSpeed: 5, turnSpeed: 0.06 }
        };
        
        // Crear coche del jugador
        const config = carConfigs[this.selectedCarColor];
        const color = carColors[this.selectedCarColor];
        
        this.playerCar = new Car(100, 300, color, this.selectedCarColor);
        this.playerCar.maxSpeed = config.maxSpeed;
        this.playerCar.turnSpeed = config.turnSpeed;
        
        // Crear coches IA
        this.cars = [this.playerCar];
        const aiColors = Object.keys(carColors).filter(c => c !== this.selectedCarColor);
        
        for (let i = 0; i < 3; i++) {
            const aiColor = aiColors[i % aiColors.length];
            const aiCar = new Car(
                50 + i * 30,
                350 + i * 40,
                carColors[aiColor],
                'ai'
            );
            this.cars.push(aiCar);
        }
        
        this.updateUI();
    }
    
    // Game Loop
    start() {
        if (!this.isRunning && this.canvas) {
            this.isRunning = true;
            this.isPaused = false;
            this.lastTime = performance.now();
            this.gameLoop();
        }
    }
    
    pause() {
        this.isPaused = true;
    }
    
    resume() {
        this.isPaused = false;
        this.lastTime = performance.now();
        this.gameLoop();
    }
    
    togglePause() {
        if (this.isPaused) {
            this.resume();
        } else {
            this.pause();
        }
    }
    
    resetGame() {
        this.isRunning = false;
        this.isPaused = false;
        if (this.selectedCarColor) {
            this.initializeGame();
            this.start();
        }
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning || this.isPaused || this.gameState !== 'game') {
            return;
        }
        
        const deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // Update FPS
        this.updateFPSCounter(currentTime);
        
        // Update game
        this.update(deltaTime);
        
        // Render
        this.render();
        
        // Continue loop
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        if (!this.playerCar || !this.canvas) return;
        
        // Handle player input
        this.handlePlayerInput();
        
        // Update all cars usando tu sistema existente
        updateCars(this.cars, this.ctx);
        
        // Update AI cars (simple AI)
        this.updateAICars();
        
        // Update game state
        this.updateGameState(deltaTime);
        
        // Update UI
        this.updateUI();
    }
    
    handlePlayerInput() {
        if (!this.playerCar) return;
        
        if (this.keys['ArrowUp'] || this.keys['KeyW']) {
            this.playerCar.accelerate();
        }
        if (this.keys['ArrowDown'] || this.keys['KeyS']) {
            this.playerCar.decelerate();
        }
        if (this.keys['ArrowLeft'] || this.keys['KeyA']) {
            this.playerCar.turnLeft();
        }
        if (this.keys['ArrowRight'] || this.keys['KeyD']) {
            this.playerCar.turnRight();
        }
    }
    
    updateAICars() {
        this.cars.forEach((car, index) => {
            if (index === 0) return; // Skip player car
            
            // Simple AI: move forward and turn randomly
            car.accelerate();
            if (Math.random() < 0.02) {
                if (Math.random() < 0.5) {
                    car.turnLeft();
                } else {
                    car.turnRight();
                }
            }
        });
    }
    
    updateGameState(deltaTime) {
        // Update score
        this.score += deltaTime * 0.01;
        
        // Simple lap detection could be added here
    }
    
    render() {
        if (!this.canvas || !this.ctx || this.gameState !== 'game') return;
        
        // Clear canvas
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw track
        this.drawTrack();
        
        // Cars are drawn in updateCars()
        
        // Draw UI overlays
        this.drawGameUI();
    }
    
    drawTrack() {
        if (!this.ctx || !this.canvas) return;
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const outerRadius = Math.min(centerX, centerY) - 50;
        const innerRadius = outerRadius - 100;
        
        // Track surface
        this.ctx.fillStyle = '#333';
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        this.ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2, true);
        this.ctx.fill();
        
        // Track boundaries
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 3;
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
        this.ctx.stroke();
        
        // Start/finish line
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 5;
        this.ctx.beginPath();
        this.ctx.moveTo(centerX, centerY - outerRadius);
        this.ctx.lineTo(centerX, centerY - innerRadius);
        this.ctx.stroke();
    }
    
    drawGameUI() {
        if (!this.ctx || !this.canvas) return;
        
        if (this.isPaused) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = '48px Arial';
            this.ctx.fillText('PAUSA', this.canvas.width / 2, this.canvas.height / 2);
            
            this.ctx.font = '24px Arial';
            this.ctx.fillText('Presiona ESC para continuar', 
                this.canvas.width / 2, this.canvas.height / 2 + 60);
        }
    }
    
    // Utility methods
    updateFPSCounter(currentTime) {
        this.frameCount++;
        if (currentTime - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round(this.frameCount * 1000 / (currentTime - this.lastFpsUpdate));
            this.frameCount = 0;
            this.lastFpsUpdate = currentTime;
        }
    }
    
    updateUI() {
        if (this.elements.score) this.elements.score.textContent = Math.floor(this.score);
        if (this.elements.lap) this.elements.lap.textContent = `${this.currentLap}/${this.totalLaps}`;
        if (this.elements.fps) this.elements.fps.textContent = this.fps;
        
        if (this.elements.speed && this.playerCar) {
            const kmh = Math.round(this.playerCar.speed * 20);
            this.elements.speed.textContent = kmh;
        }
    }
    
    handleKeyDown(e) {
        switch(e.code) {
            case 'Escape':
                if (this.gameState === 'game') {
                    this.togglePause();
                }
                break;
            case 'KeyM':
                if (this.gameState === 'game') {
                    this.showMenuScreen();
                }
                break;
            case 'KeyR':
                if (this.gameState === 'game') {
                    this.resetGame();
                }
                break;
        }
    }
    
    handleResize() {
        // Handle responsive canvas if needed
        // Tu CSS ya maneja el aspecto visual
    }
}

// Initialize game when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameEngine = new GameEngine();
});

export default GameEngine;
