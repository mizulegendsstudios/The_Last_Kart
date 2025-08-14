# The Last Kart 🏎️

![Version](https://img.shields.io/badge/version-0.4.0-blue.svg)
![License](https://img.shields.io/badge/license-AGPL--3.0-green.svg)
![Platform](https://img.shields.io/badge/platform-Web-orange.svg)

**Juego de carreras multijugador en HTML5 Canvas con vista top-down**

*The Last Kart* es un juego de carreras desarrollado con tecnología web moderna, featuring multijugador local y controles tanto de teclado como gamepad. Desarrollado por **Mizu Legends Studios**.

🎮 **[Jugar Ahora](https://mizulegendsstudios.github.io/The_Last_Kart/)**

---

## 📋 Índice

1. [🎯 Características](#-características)
2. [🎮 Cómo Jugar](#-cómo-jugar)
3. [🛠️ Tecnologías](#️-tecnologías)
4. [📁 Estructura del Proyecto](#-estructura-del-proyecto)
5. [🤖 IA y Herramientas](#-ia-y-herramientas)
6. [🚀 Instalación y Desarrollo](#-instalación-y-desarrollo)
7. [📝 Changelog](#-changelog)
8. [⚖️ Licencia](#️-licencia)
9. [🤝 Contribuir](#-contribuir)

---

## 🎯 Características

- **🏁 Multijugador local**: Hasta 2 jugadores simultáneos
- **🎮 Controles flexibles**: Teclado (WASD/Flechas) y gamepad
- **📊 HUD completo**: Velocímetro, contador de vueltas, checkpoints, FPS
- **🏎️ Física realista**: Sistema de deslizamiento y marcas de neumáticos
- **🌦️ Efectos climáticos**: Sistema de clima dinámico
- **⚡ Power-ups**: Sistema de potenciadores (en desarrollo)
- **🏆 Sistema de ranking**: Clasificación de jugadores
- **📱 Responsive**: Compatible con dispositivos móviles y desktop

---

## 🎮 Cómo Jugar

### Controles:
- **Jugador 1**: `W` `A` `S` `D` o Gamepad
- **Jugador 2**: Flechas direccionales `↑` `↓` `←` `→`
- **Reiniciar**: Tecla `R`

### Objetivo:
Completa 3 vueltas antes que tu oponente, pasando por todos los checkpoints del circuito.

---

## 🛠️ Tecnologías

- **Frontend**: HTML5, CSS3, JavaScript ES6+
- **Gráficos**: Canvas API
- **Deployment**: GitHub Pages
- **Versionado**: Git con Semantic Versioning 2.0.0
- **Arquitectura**: Modular (separación de responsabilidades)

---

## 📁 Estructura del Proyecto

```
The_Last_Kart/
├── index.html              # Archivo principal del juego
├── CORE                    # Documentación técnica y licencias
├── README.md              # Este archivo
├── LICENSE                # Licencia AGPL-3.0
├── scripts/               # Lógica del juego
│   ├── main.js           # Motor principal del juego
│   ├── input.js          # Sistema de controles
│   ├── cars.js           # Lógica de vehículos
│   ├── track.js          # Sistema de pistas
│   ├── carSelection.js   # Selección de vehículos
│   ├── menu.js           # Sistema de menús
│   ├── tireMarks.js      # Marcas de neumáticos
│   ├── slipstream.js     # Efectos aerodinámicos
│   ├── weather.js        # Sistema climático
│   ├── transitions.js    # Transiciones de pantalla
│   ├── ranking.js        # Sistema de puntuación
│   └── powerups.js       # Power-ups (en desarrollo)
├── style/                # Estilos CSS
├── assets/               # Recursos multimedia
│   ├── audio/           # Efectos de sonido
│   ├── images/          # Sprites y texturas
│   └── tracks/          # Datos de circuitos
```

---

## 🤖 IA y Herramientas

### Herramientas de IA utilizadas:

1. **📝 Narrativa y guion**:
   - **ChatGPT-4**: Diseño de historias y eventos del juego
   - Ejemplo: "Crea un guion de carreras futuristas con personajes cómicos"

2. **💻 Estructura técnica**:
   - **GitHub Copilot**: Sugerencias de código y arquitectura
   - **HTML**: Plantillas generadas con IA para canvas del juego
   - **CSS**: Estilos base para animaciones de carreras
   - **JavaScript**: Lógica de movimiento de vehículos

3. **🎨 Assets visuales**:
   - **DALL-E 3**: Diseño de circuitos y vehículos
   - Ejemplo: "Circuito de carreras cyberpunk con luces neon"

4. **🔊 Audio**:
   - **Synthesizer V**: Efectos de sonido y música

**Créditos**: Prompts diseñados por **Moisés Núñez**

---

## 🚀 Instalación y Desarrollo

### Para jugar:
Simplemente visita: **https://mizulegendsstudios.github.io/The_Last_Kart/**

### Para desarrollo local:
```bash
# Clonar repositorio
git clone https://github.com/mizulegendsstudios/The_Last_Kart.git
cd The_Last_Kart

# Servir localmente (Python)
python -m http.server 8000

# O con Node.js
npx serve .

# Abrir en navegador
# http://localhost:8000
```

### Estructura de archivos CSS/JS:
- **CSS**: Enlazado desde GitHub Pages para acceso público
- **JavaScript**: Módulos ES6 servidos desde GitHub Pages
- **Assets**: Almacenados localmente y sincronizados con Pages

---

## 📝 Changelog

### v0.4.0 (Actual)
- ✅ **HTML mejorado**: IDs únicos corregidos (`totalLaps` → `totalLapsP1/P2`)
- ✅ **Meta tags**: SEO, Open Graph, Twitter Cards agregados
- ✅ **Favicon**: Icono de carrito 🏎️ añadido
- ✅ **Controles separados**: `input.js` modularizado desde `main.js`
- ✅ **FPS mejorado**: Optimización del contador de frames
- ✅ **Posición inicial**: Corrección de spawn de vehículos

### Commits recientes:
- `888d1c5`: Correcciones HTML y meta tags
- `3402677`: Update input.js console log
- `cfbf6ae`: Update main.js Car start position
- `6efe1da`: Update main.js FPS

---

## ⚖️ Licencia

**GNU Affero General Public License v3.0 (AGPL-3.0)**

Copyright © 2023 **Moisés Núñez** - Mizu Legends Studios

Este proyecto es software libre bajo AGPL-3.0, lo que significa:
- ✅ Uso comercial permitido
- ✅ Modificación permitida
- ✅ Distribución permitida
- ⚠️ **Requisito**: Debe proporcionar código fuente completo
- ⚠️ **Requisito**: Mantener avisos de copyright y licencia

Ver archivo `LICENSE` para detalles completos.

---

## 🤝 Contribuir

### Para colaborar:
1. **Fork** el repositorio
2. Crear branch: `git checkout -b feature/nueva-funcionalidad`
3. **Commit**: `git commit -m "Add: nueva funcionalidad"`
4. **Push**: `git push origin feature/nueva-funcionalidad`
5. Crear **Pull Request**

### Requisitos:
- Mantener el archivo `CORE` en todas las distribuciones
- Proporcionar código fuente completo (AGPL-3.0)
- Mantener créditos a Moisés Núñez y herramientas de IA

---

## 📞 Contacto

**Mizu Legends Studios**
- 🌐 Website: [mizulegendsstudios.github.io](https://mizulegendsstudios.github.io)
- 🎮 Juego: [The Last Kart](https://mizulegendsstudios.github.io/The_Last_Kart/)
- 📧 Issues: [GitHub Issues](https://github.com/mizulegendsstudios/The_Last_Kart/issues)

---

**¡Disfruta las carreras! 🏁**
