import React, { Component } from 'react';
import Phaser from 'phaser';
import GameScene from './PhaserScene';

class PhaserGame extends Component {
  // Props to pass down game variables which will be updated via React states
  constructor(props) {
    super(props);
    // Starter state
    this.state = {
      gameWidth: 1280,
      gameHeight: 720,
      gameGravity: 150,
    };
  }

  componentDidMount() {
    this.initializeGame();
  }

  initializeGame = () => {
    if (this.game) {
      this.game.destroy(true);
    }
    // States passed into new Phaser class as constants
    const { gameWidth, gameHeight, gameGravity } = this.state;

    this.game = new Phaser.Game({
      // Phaser game config/defaults
      type: Phaser.WEBGL,
      parent: 'phaser-game-container',
      width: gameWidth,
      height: gameHeight,
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: gameGravity },
          debug: true,
        },
      },
      scene: [new GameScene(gameWidth, gameHeight, gameGravity)],
    });
  }

  componentWillUnmount() {
    if (this.game) {
      this.game.destroy(true);
    }
  }

  // func for updating game size, example: player can set the game resolution in settings
  updateGameSize = (newWidth, newHeight) => {
    this.setState({ gameWidth: newWidth, gameHeight: newHeight }, () => {
      this.initializeGame(); // reset game with new game size
    });
  }

  render() {
    return <div id="phaser-game-container"></div>;
  }
}

export default PhaserGame;
