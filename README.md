I am Vitthal Dubey
21BAI10142, VIT Bhopal


# Multiplayer Web-Based Game

## Overview
This project is a multiplayer web-based game where two players control characters on a 5x5 grid. The game allows players to make moves, capture opponent's characters, and win by eliminating all of the opponent's characters.

## Features
- **Two Player Support**: Connects two players via WebSocket.
- **Real-Time Updates**: Reflects moves and game state in real-time.
- **Character Movements**: Includes different movement rules for various character types.
- **Game End Detection**: Detects when a player has won by capturing all opponent's characters.

## Technologies
- **Backend**: Node.js, WebSocket
- **Frontend**: HTML, CSS, JavaScript
- **Styling**: CSS Grid for layout

## Getting Started
    For now, please open two tabs of the same localhost and the game can be properly played on the second localhost.
### Prerequisites
- Node.js and npm installed

### Installation
1. Clone the repository:
    ```bash
    git clone 
    ```
2. Install the dependencies:
    ```bash
    npm install
    ```

### Running the Project
1. Start the server:
    ```bash
    node server.js
    ```
2. Open two browser tabs or windows and navigate to `http://localhost:3000`. One tab will be assigned as Player1 and the other as Player2.

### Usage
- Click on a character to select it.
- Click on a valid move location to make a move.
- The game will automatically update for both players in real-time.

### Contributing
1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/your-feature
    ```
3. Make your changes and commit:
    ```bash
    git add .
    git commit -m "Add your message"
    ```
4. Push to your fork:
    ```bash
    git push origin feature/your-feature
    ```
5. Create a Pull Request.

### License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact
For any questions or feedback, please contact:
- **Your Name**: [your-email@example.com](mailto:your-email@example.com)

## Acknowledgements
- Inspiration for game mechanics and design.
- Libraries and tools used in the project.
