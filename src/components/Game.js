import React, { useState, useEffect, useCallback, useRef } from 'react';
import Paddle from './Paddle';
import Ball from './Ball';
import Bricks from './Bricks';
import HUD from './HUD';
import PowerUp from './PowerUp';
import Obstacle from './Obstacle';
import Notification from './Notification';
import PauseMenu from './PauseMenu';
import { playBrickHitSound, playPaddleHitSound, playPowerUpSound, playGameOverSound, playLevelUpSound } from './Sound';
import '../Game.css';

const BASE_GAME_WIDTH = 800;
const BASE_GAME_HEIGHT = 600;

const POWER_UP_TYPES = ['MULTIBALL', 'PADDLE_ENLARGE', 'SLOW_MOTION', 'EXPLOSIVE_BALL', 'EXTRA_LIFE', 'GOD_MODE'];

const Game = ({ mode, onQuit }) => {
  const [scale, setScale] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [timer, setTimer] = useState(0);

  const [paddlePosition, setPaddlePosition] = useState({ x: BASE_GAME_WIDTH / 2 });
  const [paddleWidth, setPaddleWidth] = useState(100);
  const [balls, setBalls] = useState([{ position: { x: BASE_GAME_WIDTH / 2, y: BASE_GAME_HEIGHT - 50 }, velocity: { x: 4, y: -4 }, isExplosive: false }]);
  const [powerUps, setPowerUps] = useState([]);
  const [godMode, setGodMode] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [obstacles, setObstacles] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const [bricks, setBricks] = useState([]);
  const gameContainerRef = useRef(null);
  const animationFrameId = useRef(null);
  const lastTime = useRef(null);

  const maxLevel = mode === 'MARATHON' ? 5 : Infinity;

  const addNotification = useCallback((message) => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 3000);
  }, []);

  const generateBricks = useCallback((level) => {
    const newBricks = [];
    const rows = 5 + level;
    const cols = 10;
    const brickWidth = BASE_GAME_WIDTH / cols;
    const brickHeight = (BASE_GAME_HEIGHT / 3) / rows;
    const secretBrickIndex = Math.floor(Math.random() * rows * cols);
    let brickIndex = 0;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        newBricks.push({
          id: `${i}-${j}`,
          position: { x: j * brickWidth, y: i * brickHeight + 50 },
          health: 1,
          color: `hsl(${(i * j * 10 * level) % 360}, 100%, 50%)`,
          width: brickWidth,
          height: brickHeight,
          isSecret: brickIndex === secretBrickIndex,
        });
        brickIndex++;
      }
    }
    setBricks(newBricks);
  }, []);

  const generateObstacles = useCallback((level) => {
    if (level > 1) {
      const newObstacles = [];
      for (let i = 0; i < level - 1; i++) {
        newObstacles.push({
          id: i + 1,
          position: { x: 100 + i * 200, y: 200 + i * 100 },
          width: 100,
          height: 20,
          velocity: { x: 2 * (i % 2 === 0 ? 1 : -1), y: 0 },
        });
      }
      setObstacles(newObstacles);
    } else {
      setObstacles([]);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (gameContainerRef.current) {
        const scale = gameContainerRef.current.clientWidth / BASE_GAME_WIDTH;
        setScale(scale);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    generateBricks(level);
    generateObstacles(level);
  }, [level, generateBricks, generateObstacles]);

  const resetGame = useCallback(() => {
    setGameOver(false);
    setGameWon(false);
    setScore(0);
    setLives(3);
    setLevel(1);
    setTimer(0);
    setPaddlePosition({ x: BASE_GAME_WIDTH / 2 });
    setPaddleWidth(100);
    setBalls([{ position: { x: BASE_GAME_WIDTH / 2, y: BASE_GAME_HEIGHT - 50 }, velocity: { x: 4, y: -4 }, isExplosive: false }]);
    setPowerUps([]);
    setGodMode(false);
  }, []);

  const handlePause = () => setIsPaused(true);
  const handleResume = () => {
    setIsPaused(false);
    lastTime.current = performance.now();
  };
  const handleRestart = () => {
    resetGame();
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' && (gameOver || gameWon)) resetGame();
      if (e.key === 'Escape') setIsPaused((prev) => !prev);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, gameWon, resetGame]);

  useEffect(() => {
    const movePaddle = (clientX) => {
      if (!godMode && gameContainerRef.current) {
        const rect = gameContainerRef.current.getBoundingClientRect();
        const newX = (clientX - rect.left) / scale;
        if (newX - (paddleWidth / 2) >= 0 && newX + (paddleWidth / 2) <= BASE_GAME_WIDTH) {
          setPaddlePosition({ x: newX });
        }
      }
    };

    const handleMouseMove = (e) => movePaddle(e.clientX);
    const handleTouchMove = (e) => movePaddle(e.touches[0].clientX);

    const gameContainer = gameContainerRef.current;
    if (gameContainer) {
      gameContainer.addEventListener('mousemove', handleMouseMove);
      gameContainer.addEventListener('touchmove', handleTouchMove);
    }
    return () => {
      if (gameContainer) {
        gameContainer.removeEventListener('mousemove', handleMouseMove);
        gameContainer.removeEventListener('touchmove', handleTouchMove);
      }
    };
  }, [godMode, paddleWidth, scale]);

  const gameLoop = useCallback((timestamp) => {
    if (!lastTime.current) lastTime.current = timestamp;
    const deltaTime = timestamp - lastTime.current;
    lastTime.current = timestamp;

    if (isPaused || gameOver || gameWon) {
      cancelAnimationFrame(animationFrameId.current);
      return;
    }

    // God Mode Paddle Movement
    if (godMode) {
      const primaryBall = balls[0];
      if (primaryBall) {
        const newX = primaryBall.position.x;
        if (newX - (paddleWidth / 2) >= 0 && newX + (paddleWidth / 2) <= BASE_GAME_WIDTH) {
          setPaddlePosition({ x: newX });
        }
      }
    }

    // Timer
    if (mode === 'SPEEDRUN') {
      setTimer((prev) => prev + deltaTime);
    }

    // Level Progression
    if (bricks.length === 0) {
      if (level + 1 > maxLevel) {
        setGameWon(true);
      } else {
        playLevelUpSound();
        setLevel((prev) => prev + 1);
        setBalls([{ position: { x: BASE_GAME_WIDTH / 2, y: BASE_GAME_HEIGHT - 50 }, velocity: { x: 4, y: -4 }, isExplosive: false }]);
        setPaddlePosition({ x: BASE_GAME_WIDTH / 2 });
      }
    }

    // Update obstacles
    setObstacles((prevObstacles) =>
      prevObstacles.map((obstacle) => {
        let newPos = {
          x: obstacle.position.x + obstacle.velocity.x,
          y: obstacle.position.y,
        };
        let newVel = { ...obstacle.velocity };

        if (newPos.x <= 0 || newPos.x >= BASE_GAME_WIDTH - obstacle.width) {
          newVel.x = -newVel.x;
        }

        return { ...obstacle, position: newPos, velocity: newVel };
      })
    );

    // Update balls
    setBalls((prevBalls) =>
      prevBalls.map((ball) => {
        let newPos = {
          x: ball.position.x + ball.velocity.x,
          y: ball.position.y + ball.velocity.y,
        };
        let newVel = { ...ball.velocity };
        let isExplosive = ball.isExplosive;

        // Wall Collision
        if (newPos.x <= 0 || newPos.x >= BASE_GAME_WIDTH - 10 * 2) {
          newVel.x = -newVel.x;
        }
        if (newPos.y <= 0) {
          newVel.y = -newVel.y;
        }

        // Paddle Collision
        if (
          newPos.y >= BASE_GAME_HEIGHT - 30 - 10 * 2 &&
          newPos.x >= paddlePosition.x - paddleWidth / 2 &&
          newPos.x <= paddlePosition.x + paddleWidth / 2
        ) {
          playPaddleHitSound();
          newVel.y = -newVel.y;
        }

        // Obstacle Collision
        obstacles.forEach((obstacle) => {
          if (
            newPos.x > obstacle.position.x &&
            newPos.x < obstacle.position.x + obstacle.width &&
            newPos.y > obstacle.position.y &&
            newPos.y < obstacle.position.y + obstacle.height
          ) {
            newVel.y = -newVel.y;
          }
        });

        // Brick Collision
        bricks.forEach((brick) => {
          if (
            newPos.x > brick.position.x &&
            newPos.x < brick.position.x + brick.width &&
            newPos.y > brick.position.y &&
            newPos.y < brick.position.y + brick.height
          ) {
            playBrickHitSound();
            newVel.y = -newVel.y;
            setBricks((prev) => prev.filter((b) => b.id !== brick.id));
            setScore((prev) => prev + 10);
            setZoom(true);
            setTimeout(() => setZoom(false), 100);

            if (brick.isSecret) {
              addNotification('Power-Up Shower!');
              for (let i = 0; i < 10; i++) {
                const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
                setPowerUps((prev) => [...prev, { id: Date.now() + i, position: { x: Math.random() * BASE_GAME_WIDTH, y: 0 }, type, isFromShower: true }]);
              }
            }

            if (isExplosive) {
              const explosionRadius = 100;
              setBricks((prevBricks) =>
                prevBricks.filter((b) => {
                  const distance = Math.sqrt(Math.pow(b.position.x - brick.position.x, 2) + Math.pow(b.position.y - brick.position.y, 2));
                  if (distance < explosionRadius) {
                    setScore((prev) => prev + 10);
                    return false;
                  }
                  return true;
                })
              );
              isExplosive = false;
            }

            if (Math.random() < 0.2) {
              const type = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
              setPowerUps((prev) => [...prev, { id: Date.now(), position: brick.position, type }]);
            }
          }
        });

        return { position: newPos, velocity: newVel, isExplosive };
      })
    );

    // Update power-ups
    setPowerUps((prev) =>
      prev.map((p) => ({ ...p, position: { ...p.position, y: p.position.y + 2 } })).filter((p) => p.position.y < BASE_GAME_HEIGHT)
    );

    // Power-up collection
    powerUps.forEach((powerUp) => {
      if (
        powerUp.position.y >= BASE_GAME_HEIGHT - 30 &&
        powerUp.position.x >= paddlePosition.x - paddleWidth / 2 &&
        powerUp.position.x <= paddlePosition.x + paddleWidth / 2
      ) {
        playPowerUpSound();
        if (!powerUp.isFromShower) {
          addNotification(`${powerUp.type.replace('_', ' ')}!`);
        }
        switch (powerUp.type) {
          case 'MULTIBALL':
            setBalls((prev) => [
              ...prev,
              { position: { ...paddlePosition, y: BASE_GAME_HEIGHT - 50 }, velocity: { x: -4, y: -4 }, isExplosive: false },
              { position: { ...paddlePosition, y: BASE_GAME_HEIGHT - 50 }, velocity: { x: 4, y: -4 }, isExplosive: false },
            ]);
            break;
          case 'PADDLE_ENLARGE':
            setPaddleWidth((prev) => Math.min(prev + 50, 300));
            break;
          case 'SLOW_MOTION':
            setBalls((prev) => prev.map((b) => ({ ...b, velocity: { x: b.velocity.x * 0.5, y: b.velocity.y * 0.5 } })));
            break;
          case 'EXPLOSIVE_BALL':
            setBalls((prev) => prev.map((b) => ({ ...b, isExplosive: true })));
            break;
          case 'EXTRA_LIFE':
            setLives((prev) => prev + 1);
            break;
          case 'GOD_MODE':
            setGodMode(true);
            setTimeout(() => setGodMode(false), 10000);
            break;
          default:
            break;
        }
        setPowerUps((prev) => prev.filter((p) => p.id !== powerUp.id));
      }
    });

    // Bottom Wall Collision
    setBalls((prevBalls) => {
      const remainingBalls = prevBalls.filter((ball) => ball.position.y < BASE_GAME_HEIGHT - 10 * 2);
      if (remainingBalls.length < prevBalls.length && remainingBalls.length === 0) {
        setLives((prev) => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            playGameOverSound();
            setGameOver(true);
          }
          return newLives;
        });
        if (lives > 1) {
          return [{ position: { x: BASE_GAME_WIDTH / 2, y: BASE_GAME_HEIGHT - 50 }, velocity: { x: 4, y: -4 }, isExplosive: false }];
        }
      }
      return remainingBalls;
    });

    animationFrameId.current = requestAnimationFrame(gameLoop);
  }, [bricks, isPaused, gameOver, gameWon, lives, paddlePosition, paddleWidth, powerUps, obstacles, level, maxLevel, mode, addNotification, godMode, balls]);

  useEffect(() => {
    if (!isPaused) {
      animationFrameId.current = requestAnimationFrame(gameLoop);
    }
    return () => cancelAnimationFrame(animationFrameId.current);
  }, [isPaused, gameLoop]);

  return (
    <div ref={gameContainerRef} className={`game-container ${zoom ? 'zoom' : ''}`}>
      {isPaused && <PauseMenu onResume={handleResume} onRestart={handleRestart} onExit={onQuit} />}
      {gameOver ? (
        <div className="game-over" onClick={resetGame}><h2>Game Over</h2><p>Tap to Restart</p></div>
      ) : gameWon ? (
        <div className="game-won" onClick={resetGame}><h2>You Won!</h2><p>Tap to Restart</p></div>
      ) : (
        <>
          <HUD score={score} lives={lives} level={level} timer={timer} mode={mode} onQuit={onQuit} onPause={handlePause} />
          <Paddle paddlePosition={{ x: (paddlePosition.x - paddleWidth / 2) * scale }} paddleWidth={paddleWidth * scale} isGodMode={godMode} />
          {balls.map((ball, index) => (
            <Ball key={index} ballPosition={{x: ball.position.x * scale, y: ball.position.y * scale}} isExplosive={ball.isExplosive} />
          ))}
          <Bricks bricks={bricks} scale={scale} />
          {obstacles.map((obstacle) => (
            <Obstacle key={obstacle.id} position={{x: obstacle.position.x * scale, y: obstacle.position.y * scale}} width={obstacle.width * scale} height={obstacle.height * scale} />
          ))}
          {powerUps.map((powerUp) => (
            <PowerUp key={powerUp.id} position={{x: powerUp.position.x * scale, y: powerUp.position.y * scale}} type={powerUp.type} />
          ))}
          <div className="notification-container">
            {notifications.map((n) => (<Notification key={n.id} message={n.message} />))}
          </div>
        </>
      )}
    </div>
  );
};

export default Game;
