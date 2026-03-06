import assert from "node:assert/strict";
import test from "node:test";

import { placeFood, stepGame, toCellKey } from "../lib/snake-game.mjs";

function buildState(overrides = {}) {
  return {
    gridSize: 6,
    snake: [
      { x: 2, y: 2 },
      { x: 1, y: 2 },
      { x: 0, y: 2 },
    ],
    direction: "RIGHT",
    queuedDirection: "RIGHT",
    food: { x: 5, y: 5 },
    score: 0,
    status: "running",
    reason: null,
    ...overrides,
  };
}

test("stepGame moves the snake forward on each tick", () => {
  const nextState = stepGame(buildState());

  assert.deepEqual(nextState.snake, [
    { x: 3, y: 2 },
    { x: 2, y: 2 },
    { x: 1, y: 2 },
  ]);
  assert.equal(nextState.score, 0);
  assert.equal(nextState.status, "running");
});

test("stepGame grows the snake and increments the score when food is eaten", () => {
  const nextState = stepGame(
    buildState({
      snake: [
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
      food: { x: 2, y: 1 },
    }),
    () => 0,
  );

  assert.deepEqual(nextState.snake, [
    { x: 2, y: 1 },
    { x: 1, y: 1 },
    { x: 0, y: 1 },
  ]);
  assert.equal(nextState.score, 1);
  assert.deepEqual(nextState.food, { x: 0, y: 0 });
});

test("stepGame ends the game when the snake hits a wall", () => {
  const nextState = stepGame(
    buildState({
      gridSize: 3,
      snake: [
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 0, y: 1 },
      ],
    }),
  );

  assert.equal(nextState.status, "gameover");
  assert.equal(nextState.reason, "wall");
});

test("stepGame ends the game when the snake runs into itself", () => {
  const nextState = stepGame(
    buildState({
      snake: [
        { x: 2, y: 2 },
        { x: 2, y: 1 },
        { x: 1, y: 1 },
        { x: 1, y: 2 },
        { x: 1, y: 3 },
      ],
      direction: "LEFT",
      queuedDirection: "LEFT",
    }),
  );

  assert.equal(nextState.status, "gameover");
  assert.equal(nextState.reason, "self");
});

test("placeFood only returns empty cells", () => {
  const snake = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 1 },
    { x: 2, y: 1 },
    { x: 0, y: 2 },
    { x: 1, y: 2 },
  ];
  const food = placeFood(snake, () => 0.4, 3);

  assert.deepEqual(food, { x: 2, y: 2 });
  assert.equal(snake.some((segment) => toCellKey(segment) === toCellKey(food)), false);
});

test("stepGame marks the board as cleared when no food slots remain", () => {
  const nextState = stepGame(
    buildState({
      gridSize: 2,
      snake: [
        { x: 0, y: 0 },
        { x: 0, y: 1 },
        { x: 1, y: 1 },
      ],
      food: { x: 1, y: 0 },
    }),
  );

  assert.equal(nextState.status, "gameover");
  assert.equal(nextState.reason, "cleared");
  assert.equal(nextState.score, 1);
  assert.equal(nextState.food, null);
});
