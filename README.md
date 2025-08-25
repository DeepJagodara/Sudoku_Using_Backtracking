# Sudoku Game

A modern, interactive Sudoku game built with HTML, CSS, and JavaScript. This implementation features a clean user interface, game controls, and a backtracking algorithm for puzzle generation and solving.

![Sudoku Game Screenshot]

## Features

- 🎮 Interactive game board with intuitive controls
- 🎯 Number selector for easy input
- ⏱️ Real-time timer
- ⚠️ Error tracking (limited to 3 mistakes)
- ⏸️ Pause/Resume functionality
- 🔄 Multiple game controls:
  - New Game - Start a fresh puzzle
  - Solve - Automatically solve the current puzzle
  - Clear - Reset the current puzzle
- 🎉 Victory celebration with confetti animation
- 📱 Responsive design for mobile and desktop
- 🧩 Automatic puzzle generation using backtracking algorithm

## How to Play

1. Click on any empty cell on the board
2. Select a number (1-9) from the number selector
3. The game will indicate if your move is correct or incorrect
4. Complete the puzzle by filling all cells correctly
5. You have a maximum of 3 allowed mistakes

### Rules

- Each row must contain numbers 1-9 without repetition
- Each column must contain numbers 1-9 without repetition
- Each 3x3 box must contain numbers 1-9 without repetition
- Pre-filled numbers cannot be modified

## Game Controls

- **New Game**: Generates a new puzzle
- **Solve**: Automatically solves the current puzzle with animation
- **Clear**: Resets the current puzzle to its initial state
- **Pause**: Temporarily hides the puzzle and stops the timer

## Setup

1. Clone the repository:
```bash
git clone [repository-url]
```

2. Navigate to the project directory:
```bash
cd sudoku-using-backtracking
```

3. Open `index.html` in your web browser to start playing

## Technical Implementation

The game is built using:
- HTML5 for structure
- CSS3 for styling and animations
- Vanilla JavaScript for game logic and interactions

Key technical features:
- Backtracking algorithm for puzzle generation and solving
- CSS Grid for board layout
- CSS animations for visual feedback
- Responsive design using media queries

## Browser Support

The game works best in modern browsers:
- Chrome (recommended)
- Firefox
- Safari
- Edge

## License

This project is open source and available under the MIT License.

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

---

Enjoy playing! 🎮
