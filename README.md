# Brick Breaker Neon

A modern, responsive, and feature-rich brick breaker game built with React. It features a neon-futuristic aesthetic, dynamic gameplay with various power-ups, and multiple game modes.

## Features

- **Sleek Neon UI:** A beautiful, glowing interface with an animated starfield background and a custom futuristic font.
- **Fully Responsive:** Playable on all devices, from mobile phones to desktops, with fluidly scaling UI and controls.
- **Multiple Game Modes:**
  - **Endless:** Progress through infinitely scaling levels.
  - **Marathon:** Complete 5 challenging levels to win.
  - **Speedrun:** Beat the game as fast as you can, with an on-screen timer.
- **Exciting Power-Ups:**
  - **Triple Ball (Multiball):** Splits the ball into three.
  - **Paddle Enlarge:** Increases the size of your paddle.
  - **Slow Motion:** Slows down the ball speed.
  - **Explosive Ball:** Destroys a cluster of bricks on impact.
  - **Extra Life:** Grants an additional life.
  - **God Mode:** The paddle automatically tracks the ball for a short period.
- **Dynamic Gameplay:**
  - **Moving Obstacles:** Unpredictable barriers that block the ball.
  - **Secret Bricks:** Hidden bricks that trigger a "Power-Up Shower" when destroyed.
- **Polished Experience:**
  - **Pause Menu:** Pause the game at any time with options to Resume, Restart, or Exit.
  - **Help Modal:** A detailed in-game guide explaining all features.
  - **In-Game Notifications:** On-screen alerts for power-ups and events.
  - **Sound Effects:** Audio feedback for all major game events.

## How to Play

- **Objective:** Break all the bricks on the screen to advance to the next level.
- **Controls:**
  - **Desktop:** Move the mouse left and right to control the paddle.
  - **Mobile:** Drag your finger across the screen to control the paddle.
- **Pause:** Press the `Esc` key or the "Pause" button.
- **Restart:** After a Game Over or Victory, press `Enter` or tap the screen to play again.

## Getting Started (For Developers)

To run this project locally:

1.  **Clone the repository:**
    ```sh
    git clone <https://github.com/Babs0022/brick-breaker-game>
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd brick-breaker-game
    ```
3.  **Install dependencies:**
    ```sh
    npm install
    ```
4.  **Start the development server:**
    ```sh
    npm start
    ```
    The game will be available at `http://localhost:3000`.

## Deployment

To create a production-ready build of the application, run the following command:

```sh
npm run build
```

This will create an optimized `build` folder containing the static files for your application. You can then deploy this folder to any static hosting service, such as Vercel, Netlify, or GitHub Pages.