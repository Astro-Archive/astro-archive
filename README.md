# 🚀 ASTRO ARCHIVE // Orbital & Planetary Relics Simulator

[![NASA Space Apps Challenge 2026](https://img.shields.io/badge/NASA%20Space%20Apps-2026-blue.svg)](https://www.spaceappschallenge.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Three.js](https://img.shields.io/badge/3D-Three.js-black.svg)](https://threejs.org/)
[![React](https://img.shields.io/badge/Frontend-React%2018-61dafb.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/UI-Tailwind%20CSS-38bdf8.svg)](https://tailwindcss.com/)

> **"Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars"**  
> *A space exploration and educational 3D simulator designed for students, educators, and space enthusiasts worldwide to discover, pilot, and inspect humanity's historical footprint across the Solar System.*

---

## 🌌 Overview

**Astro Archive** bridges cutting-edge WebGL 3D simulation with authentic aerospace storytelling. Rather than treating lunar landers, rovers, and probes as discarded space debris, **Astro Archive** catalogs them as sacred **historical relics**—monuments to humanity's greatest scientific leaps.

Inspired by real-time orbital mechanics and sci-fi simulators like *Space Engine* and SpaceX's *ISS Docking Simulator*, cadets can freely pilot their spacecraft across a scaled Solar System, lock onto orbiting bodies, inspect 3D relics with authentic telemetry, and listen to historic mission transmissions.

---

## ✨ Key Features

- **☀️ Dynamic 3D Solar System:**
  - Real-time Keplerian orbital revolutions for all celestial bodies from the Sun to Pluto.
  - Earth's Moon in synchronous orbit, and the International Space Station (ISS) in Low Earth Orbit (LEO, 51.6° inclination).
  - High-resolution 2K NASA surface and atmospheric textures.
- **🛸 Spacecraft Flight HUD (Inspired by Space Engine):**
  - Technical sci-fi cockpit HUD featuring a pitch ladder, heading/yaw tape, velocity readouts, and targeting reticles.
  - Full pilot controls: keyboard (`W/A/S/D`, `R/F`, `Shift`), mouse-drag directional gimbal, and responsive on-screen touch controls for mobile devices.
- **📡 Interstellar Probes & Historical Relics:**
  - **Voyager 1 & Voyager 2:** 3D models with hyperbolic escape trajectories, golden plasma trails, and beacon rings.
  - **Apollo 11 Lunar Descent Stage:** The first human lunar outpost in the Sea of Tranquility.
  - **Ingenuity Mars Helicopter:** First powered atmospheric flight on another world.
  - **Opportunity & Perseverance Rovers:** Robotic explorers cataloging the history of water and life on Mars.
- **📊 Real Telemetry Matrix & Deep-Space Curiosities:**
  - Technical telemetry readouts (Power levels, temperatures, signal delay to Earth, atmospheric density).
  - Curated engineering trivia and scientific facts without patronizing simplifications.
- **🎙️ Historic Apollo Audio Archives:**
  - Authentic digitized transmissions from Mission Control (*"The Eagle has landed"*, *"One small step"*).
- **📱 Responsive & Sharp UI:**
  - Sharp, militaristic console aesthetic (`rounded-none`) built with Tailwind CSS, fully responsive across mobile phones, tablets, and desktop workstations.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **3D Graphics Engine** | Three.js (WebGL), GLTFLoader, OrbitControls |
| **UI & Application State** | React 18, Tailwind CSS, Lucide React Icons |
| **Build & Tooling** | Vite 6, PostCSS, Autoprefixer |
| **Audio** | HTML5 Web Audio API |

---

## 🪐 Space Agency & Open Data Used

This project relies on open public data and 3D assets provided by NASA and astronomical research communities:

1. **NASA 3D Resources:**
   - [Apollo 11 Lunar Module (LM-5)](https://nasa3d.arc.nasa.gov/)
   - [Mars 2020 Perseverance Rover & Ingenuity Helicopter](https://mars.nasa.gov/)
   - [Voyager Spacecraft](https://voyager.jpl.nasa.gov/)
   - [International Space Station (ISS)](https://www.nasa.gov/international-space-station/)
2. **NASA Planetary Textures:**
   - High-resolution planetary surface maps courtesy of NASA Jet Propulsion Laboratory (JPL) and [Solar System Scope](https://www.solarsystemscope.com/textures/).
3. **NASA Audio Archive:**
   - Apollo Program digitized mission control tapes and crew air-to-ground audio transcripts.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or higher
- npm 9.0 or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/LeoFraaan/astro-archive.git

# Enter project directory
cd astro-archive

# Install dependencies
npm install

# Start local development server
npm run dev
```

Open your browser at `http://localhost:5173` to launch the simulator.

### Production Build

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 👥 Team Eclipse

Developed with passion for **NASA Space Apps Challenge 2026**.

- **Event:** Universal Event
- **Challenge:** *Abandoned but not Forgotten: Storytelling about NASA's Discarded Equipment on the Moon and Mars*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
