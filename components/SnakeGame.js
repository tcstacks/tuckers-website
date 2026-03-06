"use client";

import { useEffect, useState } from "react";
import {
  TICK_MS,
  createInitialState,
  getDirectionFromKey,
  restartGame,
  resumeGame,
  setDirection,
  stepGame,
  toCellKey,
  togglePause,
} from "../lib/snake-game.mjs";

const CONTROL_BUTTONS = [
  { direction: "UP", label: "Up", className: "snake-control-up" },
  { direction: "LEFT", label: "Left", className: "snake-control-left" },
  { direction: "DOWN", label: "Down", className: "snake-control-down" },
  { direction: "RIGHT", label: "Right", className: "snake-control-right" },
];

function getStatusText(game) {
  if (game.status === "paused") {
    return "Paused";
  }

  if (game.status === "gameover") {
    if (game.reason === "cleared") {
      return "Board cleared";
    }

    if (game.reason === "self") {
      return "Game over: self collision";
    }

    return "Game over: wall collision";
  }

  return "Running";
}

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  if (target.isContentEditable || target.closest('[contenteditable="true"]')) {
    return true;
  }

  return /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

export default function SnakeGame() {
  const [game, setGame] = useState(() => createInitialState());

  useEffect(() => {
    if (game.status !== "running") {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setGame((currentGame) => stepGame(currentGame));
    }, TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [game.status]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (isTypingTarget(event.target)) {
        return;
      }

      const nextDirection = getDirectionFromKey(event.key);
      if (nextDirection) {
        event.preventDefault();
        setGame((currentGame) => {
          if (currentGame.status === "gameover") {
            return currentGame;
          }

          const directedGame = setDirection(currentGame, nextDirection);
          return directedGame.status === "paused" ? resumeGame(directedGame) : directedGame;
        });
        return;
      }

      if (event.code === "Space" || event.key.toLowerCase() === "p") {
        event.preventDefault();
        setGame((currentGame) => togglePause(currentGame));
        return;
      }

      if (event.key.toLowerCase() === "r") {
        event.preventDefault();
        setGame(() => restartGame());
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  const handleDirection = (nextDirection) => {
    setGame((currentGame) => {
      if (currentGame.status === "gameover") {
        return currentGame;
      }

      const directedGame = setDirection(currentGame, nextDirection);
      return directedGame.status === "paused" ? resumeGame(directedGame) : directedGame;
    });
  };

  const handleRestart = () => {
    setGame(() => restartGame());
  };

  const snakeCells = new Set(game.snake.map(toCellKey));
  const headKey = toCellKey(game.snake[0]);
  const foodKey = game.food ? toCellKey(game.food) : null;
  const boardCells = [];

  for (let y = 0; y < game.gridSize; y += 1) {
    for (let x = 0; x < game.gridSize; x += 1) {
      const key = `${x},${y}`;
      const classNames = ["snake-cell"];

      if (snakeCells.has(key)) {
        classNames.push("snake-cell-snake");
      }

      if (key === headKey) {
        classNames.push("snake-cell-head");
      }

      if (key === foodKey) {
        classNames.push("snake-cell-food");
      }

      boardCells.push(<div className={classNames.join(" ")} key={key} />);
    }
  }

  return (
    <section className="snake-card" aria-labelledby="snake-title">
      <div className="snake-header">
        <div>
          <div className="side-contact-title" id="snake-title">
            Snake
          </div>
          <p className="snake-note">Classic loop: move, grow, avoid walls, avoid yourself.</p>
        </div>
        <button className="snake-action-button" type="button" onClick={handleRestart}>
          Restart
        </button>
      </div>

      <div className="snake-stats" aria-live="polite">
        <div className="snake-stat">
          <span className="snake-stat-label">Score</span>
          <strong>{game.score}</strong>
        </div>
        <div className="snake-stat">
          <span className="snake-stat-label">State</span>
          <strong>{getStatusText(game)}</strong>
        </div>
      </div>

      <div
        aria-label={`Snake board. ${getStatusText(game)}. Score ${game.score}.`}
        className="snake-board"
        role="img"
        style={{ gridTemplateColumns: `repeat(${game.gridSize}, minmax(0, 1fr))` }}
      >
        {boardCells}
      </div>

      <div className="snake-actions">
        <button className="snake-action-button" type="button" onClick={() => setGame(togglePause)}>
          {game.status === "paused" ? "Resume" : "Pause"}
        </button>
        <span className="snake-help">Arrows/WASD to move, Space or P to pause, R to restart.</span>
      </div>

      <div className="snake-controls" aria-label="On-screen snake controls">
        {CONTROL_BUTTONS.map((control) => (
          <button
            className={`snake-control-button ${control.className}`}
            key={control.direction}
            type="button"
            onClick={() => handleDirection(control.direction)}
          >
            {control.label}
          </button>
        ))}
      </div>
    </section>
  );
}
