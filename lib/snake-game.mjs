export const GRID_SIZE = 12;
export const TICK_MS = 140;
export const INITIAL_DIRECTION = "RIGHT";

export const DIRECTION_VECTORS = {
  UP: { x: 0, y: -1 },
  DOWN: { x: 0, y: 1 },
  LEFT: { x: -1, y: 0 },
  RIGHT: { x: 1, y: 0 },
};

export const OPPOSITE_DIRECTIONS = {
  UP: "DOWN",
  DOWN: "UP",
  LEFT: "RIGHT",
  RIGHT: "LEFT",
};

export const INITIAL_SNAKE = [
  { x: 5, y: 6 },
  { x: 4, y: 6 },
  { x: 3, y: 6 },
];

export function toCellKey(cell) {
  return `${cell.x},${cell.y}`;
}

export function cellsEqual(a, b) {
  return a.x === b.x && a.y === b.y;
}

export function getNextHead(head, direction) {
  const vector = DIRECTION_VECTORS[direction];
  if (!vector) {
    return head;
  }

  return {
    x: head.x + vector.x,
    y: head.y + vector.y,
  };
}

export function placeFood(snake, randomFn = Math.random, gridSize = GRID_SIZE) {
  const occupied = new Set(snake.map(toCellKey));
  const openCells = [];

  for (let y = 0; y < gridSize; y += 1) {
    for (let x = 0; x < gridSize; x += 1) {
      const cell = { x, y };
      if (!occupied.has(toCellKey(cell))) {
        openCells.push(cell);
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.min(openCells.length - 1, Math.floor(randomFn() * openCells.length));
  return openCells[index];
}

export function createInitialState(randomFn = Math.random, overrides = {}) {
  const gridSize = overrides.gridSize ?? GRID_SIZE;
  const snake = overrides.snake ?? INITIAL_SNAKE;
  const direction = overrides.direction ?? INITIAL_DIRECTION;
  const food = overrides.food ?? placeFood(snake, randomFn, gridSize);

  return {
    gridSize,
    snake,
    direction,
    queuedDirection: direction,
    food,
    score: overrides.score ?? 0,
    status: overrides.status ?? "running",
    reason: overrides.reason ?? null,
  };
}

export function restartGame(randomFn = Math.random, overrides = {}) {
  return createInitialState(randomFn, overrides);
}

export function setDirection(state, nextDirection) {
  if (!DIRECTION_VECTORS[nextDirection]) {
    return state;
  }

  if (state.snake.length > 1 && OPPOSITE_DIRECTIONS[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    queuedDirection: nextDirection,
  };
}

export function pauseGame(state) {
  if (state.status !== "running") {
    return state;
  }

  return {
    ...state,
    status: "paused",
  };
}

export function resumeGame(state) {
  if (state.status !== "paused") {
    return state;
  }

  return {
    ...state,
    status: "running",
  };
}

export function togglePause(state) {
  if (state.status === "gameover") {
    return state;
  }

  return state.status === "paused" ? resumeGame(state) : pauseGame(state);
}

export function getDirectionFromKey(key) {
  const normalizedKey = key.toLowerCase();

  switch (normalizedKey) {
    case "arrowup":
    case "w":
      return "UP";
    case "arrowdown":
    case "s":
      return "DOWN";
    case "arrowleft":
    case "a":
      return "LEFT";
    case "arrowright":
    case "d":
      return "RIGHT";
    default:
      return null;
  }
}

export function stepGame(state, randomFn = Math.random) {
  if (state.status !== "running") {
    return state;
  }

  const direction = state.queuedDirection;
  const nextHead = getNextHead(state.snake[0], direction);
  const hitsWall =
    nextHead.x < 0 ||
    nextHead.y < 0 ||
    nextHead.x >= state.gridSize ||
    nextHead.y >= state.gridSize;

  if (hitsWall) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      status: "gameover",
      reason: "wall",
    };
  }

  const willGrow = Boolean(state.food) && cellsEqual(nextHead, state.food);
  const collisionBody = willGrow ? state.snake : state.snake.slice(0, -1);
  const hitsSelf = collisionBody.some((segment) => cellsEqual(segment, nextHead));

  if (hitsSelf) {
    return {
      ...state,
      direction,
      queuedDirection: direction,
      status: "gameover",
      reason: "self",
    };
  }

  const nextSnake = [nextHead, ...state.snake];
  if (!willGrow) {
    nextSnake.pop();
  }

  if (willGrow) {
    const nextFood = placeFood(nextSnake, randomFn, state.gridSize);

    return {
      ...state,
      snake: nextSnake,
      direction,
      queuedDirection: direction,
      food: nextFood,
      score: state.score + 1,
      status: nextFood ? "running" : "gameover",
      reason: nextFood ? null : "cleared",
    };
  }

  return {
    ...state,
    snake: nextSnake,
    direction,
    queuedDirection: direction,
    reason: null,
  };
}
