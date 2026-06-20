# Premium Ludo Championship

A modern, web-based Ludo game built with Vanilla JavaScript, HTML5, and CSS3. The game features a stunning user interface with glassmorphism design, dynamic animations, and fully functional game logic for up to 4 players.

## Features

- **Modern UI & Aesthetics:**
  - Premium glassmorphism design for control panels.
  - Dynamic animated background with slow-moving gradients.
  - "Poppins" typography for a clean and sleek look.
  - High-quality icons using FontAwesome.
- **Dynamic Game Board:**
  - The 15x15 grid board is generated dynamically using JavaScript.
  - Safe zones are marked with stars to protect tokens.
  - Home paths and victory center are properly colored and styled.
- **Complete Game Logic:**
  - Turn-based gameplay for Red, Green, Yellow, and Blue players.
  - 3D-like animated dice rolling.
  - Valid moves calculation (requires rolling a 6 to bring a token out).
  - Capturing opponent tokens sends them back to their base.
  - Capturing an opponent grants access to the home path.
  - Automatic turn switching when no valid moves are available.
- **Responsive Layout:**
  - Adapts to smaller screens and mobile devices for a seamless experience.
  - Token stacking (multiple tokens on the same cell) is handled elegantly with absolute positioning and scaling.

## Installation & Usage

1. **Clone or Download the Repository:**
   Download the project files to your local machine.

2. **Open the Game:**
   Simply open the `index.html` file in any modern web browser. No local server is required.

## Project Structure

- `index.html`: The main entry point containing the game structure and UI elements.
- `css/style.css`: Contains all the styling, including the glassmorphism effects, animations, board layout, and responsive media queries.
- `js/game.js`: Contains the core game logic, including board initialization, dice rolling, token movement, capturing rules, and turn management.

## Game Rules implemented

1. **Starting the Game:** A player must roll a 6 to move a token out of the base and onto the starting square.
2. **Movement:** Tokens move around the board clockwise according to the dice roll.
3. **Safe Zones:** There are 8 safe zones on the board (marked with a star). Tokens on these squares cannot be captured by opponents.
4. **Capturing:** If a player's token lands on a square occupied by an opponent's token, the opponent's token is captured and sent back to its base.
5. **Home Path:** A player must capture at least one opponent token to enter their home path.
6. **Winning:** The goal is to move all four tokens into the center home area.

## Future Enhancements
- Add sound effects for dice rolls, token movements, and capturing.
- Implement win condition logic and a victory screen when all 4 tokens reach home.
- Support for playing against a computer (AI).
