# Bomberman Game

## Project Overview

A high-performance, tile-based Bomberman game built entirely with vanilla JavaScript, HTML, and CSS. This project focuses on achieving consistent 60 FPS performance while implementing a custom tile engine and multiple game maps.

*  [demo:Bomberman](https://x/)

## 🎯 Core Objectives

### Performance Requirements
- **60 FPS minimum** at all times
- **Zero frame drops** during gameplay
- Proper implementation of `RequestAnimationFrame`
- Performance monitoring and measurement
- Optimized rendering with minimal but strategic use of layers

### Technical Constraints
- **No frameworks or canvas** - Pure JavaScript/DOM and HTML only
- Single-player game experience
- Custom game engine development
- Keyboard-only controls with smooth input handling

## 🎮 Game Features

### Core Gameplay
- Classic Bomberman mechanics and objectives
- Player movement and bomb placement
- Destructible walls
- Enemies
- Win/lose conditions

### User Interface
- **Pause Menu** with options:
  - Continue game
  - Restart game
- **Score Board** displaying:
  - **Timer/Countdown**: Game duration or time remaining
  - **Score**: Current points/XP
  - **Lives**: Remaining player lives

### Control System
- Smooth keyboard controls without key spamming
- Continuous action while key is held down
- Immediate response when key is released
- No jank or stuttering in player movement
