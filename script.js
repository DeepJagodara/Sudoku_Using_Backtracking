// Initialize the game board
let board = Array(9).fill().map(() => Array(9).fill(0));
let initialBoard = Array(9).fill().map(() => Array(9).fill(0));
let solvedBoard = null;
let selectedNumber = null;
let selectedCell = null;
let errorCount = 0;

// Timer variables
let timerInterval = null;
let seconds = 0;
let isGamePaused = false;

// Function to highlight row and column
function highlightRowAndColumn(row, col) {
  // Remove previous highlights
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('highlighted');
    cell.classList.remove('selected');
  });

  // Get all cells
  const cells = document.querySelectorAll('.cell');

  // Highlight the selected cell
  cells[row * 9 + col].classList.add('selected');

  for (let i = 0; i < 9; i++) {
    cells[row * 9 + i].classList.add('highlighted'); // Highlight row
    cells[i * 9 + col].classList.add('highlighted'); // Highlight column
  }
}

// Create the game board UI
function createBoard() {
  const boardElement = document.getElementById('board');
  boardElement.innerHTML = '';

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      const cell = document.createElement('div');
      cell.className = 'cell';

      // Add event listeners for cell selection
      cell.addEventListener('click', (e) => {
        // Highlight row and column regardless of cell state
        highlightRowAndColumn(i, j);

        // Only proceed with number placement if the cell is not initial and doesn't have a correct number
        if (!e.target.classList.contains('initial') && board[i][j] !== solvedBoard[i][j]) {
          if (selectedNumber !== null) {
            // Check if the move is correct
            if (selectedNumber === solvedBoard[i][j]) {
              board[i][j] = selectedNumber;
              e.target.textContent = selectedNumber;
              e.target.classList.add('correct');

              // Check if the board is complete
              if (isBoardComplete()) {
                showCelebration();
              }
            } else {
              // Wrong move
              errorCount++;
              document.getElementById('errorCount').textContent = errorCount;

              // Check if max errors reached
              if (errorCount >= 3) {
                showGameOverModal();
                return;
              }

              // Temporarily show the wrong number
              e.target.textContent = selectedNumber;
              e.target.classList.add('wrong');

              // Remove the wrong number after a delay
              setTimeout(() => {
                e.target.textContent = '';
                e.target.classList.remove('wrong');
                board[i][j] = 0;
              }, 1000);
            }
          }
        }
      });

      boardElement.appendChild(cell);
    }
  }
}

// Timer functions
function startTimer(resetTime = true) {
  if (timerInterval) clearInterval(timerInterval);
  if (resetTime) seconds = 0;
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    seconds++;
    updateTimerDisplay();
  }, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  document.getElementById('timer').textContent =
    `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Initialize the game
function initGame() {
  createBoard();
  generatePuzzle();
  updateBoardUI();
  hideGameOverModal();
  hideCelebrationModal();
  startTimer();
}

// Check if the board is complete
function isBoardComplete() {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (board[i][j] !== solvedBoard[i][j]) {
        return false;
      }
    }
  }
  return true;
}

// Create confetti
function createConfetti() {
  const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
  const confettiCount = 100;
  const container = document.getElementById('confetti-container');
  container.innerHTML = '';

  for (let i = 0; i < confettiCount; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animation = `fall ${1 + Math.random() * 2}s linear forwards`;
    container.appendChild(confetti);
  }

  // Clean up confetti after animation
  setTimeout(() => {
    container.innerHTML = '';
  }, 3000);
}

// Show celebration
function showCelebration() {
  stopTimer();
  createConfetti();
  const modal = document.getElementById('celebrationModal');
  modal.classList.add('show');
}

// Hide celebration modal
function hideCelebrationModal() {
  const modal = document.getElementById('celebrationModal');
  modal.classList.remove('show');
}

// Show game over modal
function showGameOverModal() {
  stopTimer();
  const modal = document.getElementById('gameOverModal');
  modal.classList.add('show');
}

// Hide game over modal
function hideGameOverModal() {
  const modal = document.getElementById('gameOverModal');
  modal.classList.remove('show');
}

// Toggle pause state
function togglePause() {
  isGamePaused = !isGamePaused;
  const pauseButton = document.getElementById('pause');
  const pauseBars = pauseButton.querySelector('.pause-bars');
  const playTriangle = pauseButton.querySelector('.play-triangle');
  const cells = document.querySelectorAll('.cell');

  if (isGamePaused) {
    stopTimer();
    cells.forEach(cell => cell.classList.add('hidden'));
    pauseBars.style.display = 'none';
    playTriangle.style.display = 'block';
  } else {
    startTimer(false); // Don't reset the timer when resuming
    cells.forEach(cell => cell.classList.remove('hidden'));
    pauseBars.style.display = 'block';
    playTriangle.style.display = 'none';
  }
}

// Check if a number is valid in the given position
function isValid(num, pos, grid) {
  const [row, col] = pos;

  // Check row
  for (let i = 0; i < 9; i++) {
    if (grid[row][i] === num && i !== col) {
      return false;
    }
  }

  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i][col] === num && i !== row) {
      return false;
    }
  }

  // Check 3x3 box
  const boxRow = Math.floor(row / 3) * 3;
  const boxCol = Math.floor(col / 3) * 3;

  for (let i = boxRow; i < boxRow + 3; i++) {
    for (let j = boxCol; j < boxCol + 3; j++) {
      if (grid[i][j] === num && (i !== row || j !== col)) {
        return false;
      }
    }
  }

  return true;
}

// Find empty position in the grid
function findEmpty(grid) {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (grid[i][j] === 0) {
        return [i, j];
      }
    }
  }
  return null;
}

// Solve the Sudoku using backtracking algorithm
function solveSudoku(grid) {
  // If no empty cell found, we have a solution
  const empty = findEmpty(grid);
  if (!empty) {
    return grid; // Solution found
  }

  const [row, col] = empty;
  const state = grid;

  // Try candidates 1-9 for the empty cell
  for (let candidate = 1; candidate <= 9; candidate++) {
    if (isValid(candidate, [row, col], state)) {
      // Add candidate to state
      state[row][col] = candidate;

      // Recursively try to solve the rest
      const result = solveSudoku(state);

      // If solution found, return it
      if (result) {
        return result;
      }

      // Backtrack: remove candidate and try next
      state[row][col] = 0;
    }
  }

  // No solution found with any candidate
  return false;
}

// Generate a new puzzle
function generatePuzzle() {
  // Clear the board
  board = Array(9).fill().map(() => Array(9).fill(0));
  errorCount = 0;
  document.getElementById('errorCount').textContent = '0';

  // Generate a solved puzzle
  solveSudoku(board);

  // Save the solved state
  solvedBoard = board.map(row => [...row]);

  // Remove numbers to create the puzzle
  const cellsToRemove = 40; // Adjust difficulty by changing this number
  let count = 0;

  while (count < cellsToRemove) {
    const row = Math.floor(Math.random() * 9);
    const col = Math.floor(Math.random() * 9);

    if (board[row][col] !== 0) {
      board[row][col] = 0;
      count++;
    }
  }

  // Save initial state
  initialBoard = board.map(row => [...row]);
}

// Update the UI to reflect the current board state
function updateBoardUI() {
  const cells = document.querySelectorAll('.cell');
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const value = board[row][col];

    cell.textContent = value || '';
    cell.className = `cell ${initialBoard[row][col] !== 0 ? 'initial' : ''}`;
  });
}

// Event Listeners for buttons
document.getElementById('newGame').addEventListener('click', () => {
  generatePuzzle();
  updateBoardUI();
  startTimer();
});

document.getElementById('solve').addEventListener('click', async () => {
  // Stop the timer when solving
  stopTimer();

  // Disable all buttons during animation
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => button.disabled = true);

  // Get all empty or incorrect cells
  const cells = document.querySelectorAll('.cell');
  const cellsToFill = [];

  cells.forEach((cell, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    if (board[row][col] !== solvedBoard[row][col]) {
      cellsToFill.push({ cell, row, col });
    }
  });

  // Solve the board in memory
  const solvedResult = solveSudoku(board);
  if (solvedResult) {
    board = solvedResult;
  } else {
    console.error("No solution exists for this puzzle");
    return;
  }

  // Animate filling each cell
  for (let cellInfo of cellsToFill) {
    const { cell, row, col } = cellInfo;

    // Remove any existing classes
    cell.className = 'cell';

    // Add the solving animation class
    cell.classList.add('solving');

    // Update the cell with the solved value
    cell.textContent = board[row][col];

    // Wait for animation
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  // Re-enable buttons after animation
  buttons.forEach(button => button.disabled = false);

  // Show celebration after solve
  showCelebration();
});

document.getElementById('clear').addEventListener('click', () => {
  board = initialBoard.map(row => [...row]);
  updateBoardUI();
  // Reset pause state and icon
  if (isGamePaused) {
    isGamePaused = false;
    const pauseButton = document.getElementById('pause');
    const pauseBars = pauseButton.querySelector('.pause-bars');
    const playTriangle = pauseButton.querySelector('.play-triangle');
    pauseBars.style.display = 'block';
    playTriangle.style.display = 'none';
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('hidden'));
  }
  startTimer();
});

// Initialize number selector functionality
function initNumberSelector() {
  const numbers = document.querySelectorAll('.number');
  numbers.forEach(number => {
    number.addEventListener('click', (e) => {
      const newNumber = parseInt(e.target.dataset.number);

      if (selectedNumber === newNumber) {
        // If clicking the same number, deselect it
        selectedNumber = null;
        e.target.classList.remove('selected');
      } else {
        // Select the new number
        numbers.forEach(n => n.classList.remove('selected'));
        e.target.classList.add('selected');
        selectedNumber = newNumber;
      }
    });
  });
}

// Initialize game over modal buttons
function initGameOverModal() {
  document.getElementById('restartGame').addEventListener('click', () => {
    board = initialBoard.map(row => [...row]);
    errorCount = 0;
    document.getElementById('errorCount').textContent = errorCount;
    updateBoardUI();
    hideGameOverModal();
    startTimer();
  });

  document.getElementById('newGameAfterLoss').addEventListener('click', () => {
    generatePuzzle();
    updateBoardUI();
    hideGameOverModal();
    startTimer();
  });

  document.getElementById('newGameAfterWin').addEventListener('click', () => {
    generatePuzzle();
    updateBoardUI();
    hideCelebrationModal();
    startTimer();
  });
}

// Initialize pause functionality
function initPauseControls() {
  document.getElementById('pause').addEventListener('click', togglePause);
}

// Initialize the game when the page loads
window.onload = () => {
  initGame();
  initNumberSelector();
  initGameOverModal();
  initPauseControls();
};